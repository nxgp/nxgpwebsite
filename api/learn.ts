/**
 * Nx Assistant — automated learning pass.
 *
 * Reads recent conversations, extracts ANONYMIZED patterns (questions the
 * assistant handled badly, recurring objections, framings that worked), then
 * runs a second AI pass that VERIFIES each insight against the assistant's
 * actual knowledge base:
 *
 *   - grounded, low-stakes insights auto-promote straight into
 *     `assistant_memory` (live within ~60s) — no human in the loop
 *   - insights asserting facts NOT in the knowledge base, or touching
 *     compliance/legal/pricing, are HELD as `pending` instead of going live
 *   - a Slack digest reports both lists after every run
 *
 * Why the verifier exists: in testing the extractor invented "we maintain
 * SOC 2 Type II certification" — a claim nobody supplied. Auto-promoting
 * unverified facts would let the assistant assert false compliance claims
 * to prospects. The verifier keeps learning fully automated while blocking
 * exactly that class of failure.
 *
 * No visitor identity is ever stored: transcripts are scrubbed before the
 * model sees them, and insights are scrubbed again on write.
 *
 * POST /api/learn   header: x-learn-secret: $LEARN_SECRET
 * Run it from cron (e.g. Vercel Cron, daily/weekly) or by hand.
 */

import { SYSTEM_PROMPT } from './_knowledge'

export const config = { runtime: 'edge' }

const MODEL = process.env.LEARN_MODEL || 'claude-haiku-4-5-20251001'
const ANTHROPIC_BASE_URL =
  process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com'
// One batch = everything fetched gets mined (no per-conversation cap — an
// earlier draft capped conversations but still advanced the high-water mark
// past the dropped ones, silently excluding them from learning forever).
// 300 msgs x 800 chars ≈ 60k tokens: safely inside model context.
const MAX_MESSAGES = 300
const MAX_MSG_CHARS = 800

type Row = { conversation_id: string; role: string; content: string; created_at: string }

const EXTRACT_TOOL = {
  name: 'record_insights',
  description: 'Record anonymized, reusable insights from website chat transcripts.',
  input_schema: {
    type: 'object' as const,
    properties: {
      insights: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            kind: {
              type: 'string',
              enum: ['gap', 'faq', 'objection', 'positioning'],
              description:
                "'gap' = assistant could not answer well; 'faq' = question asked repeatedly; 'objection' = hesitation to address; 'positioning' = framing that resonated",
            },
            observation: {
              type: 'string',
              description: 'What was noticed, anonymized. No names, emails, or company names.',
            },
            suggested_prompt: {
              type: 'string',
              description: 'The visitor-side question or objection, generalized',
            },
            suggested_response: {
              type: 'string',
              description: 'A better answer the assistant should give next time (2-3 sentences)',
            },
          },
          required: ['kind', 'observation'],
        },
      },
    },
    required: ['insights'],
  },
}

const EXTRACT_PROMPT = `You are improving the AI sales assistant on nxgp.io (Nx Growth Partners — an embedded technology partner building AI agents, custom software, healthcare systems, RAG knowledge bases and business systems architecture).

You are given anonymized transcripts of real visitor conversations. Identify patterns that would make the assistant better at converting visitors into qualified leads.

Look for:
- gap: the visitor asked something the assistant answered vaguely, wrongly, or deflected
- faq: a question multiple visitors ask
- objection: hesitation or doubt the assistant should handle better
- positioning: a framing that clearly landed well

ABSOLUTE RULES:
- NEVER include a person's name, email address, phone number, or company name in any field. Generalize: "a healthcare provider", "an enterprise buyer".
- Never record anything specific to one visitor's project that would identify them.
- Only record patterns that would genuinely help future conversations. Quality over quantity — if there is nothing useful, return an empty list.
- Suggested responses must follow assistant rules: concise, no delivery timelines, no pricing, no invented facts.

Return at most 8 insights.`

const VERIFY_TOOL = {
  name: 'verify_insights',
  description: 'Verdict for each candidate insight, in the same order they were given.',
  input_schema: {
    type: 'object' as const,
    properties: {
      verdicts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            grounded: {
              type: 'boolean',
              description:
                'true ONLY if every factual claim in the suggested response is supported by the knowledge base or the transcripts',
            },
            high_stakes: {
              type: 'boolean',
              description:
                'true if the response asserts anything about certifications, compliance (SOC 2, HIPAA...), legal terms, security guarantees, pricing, or named clients',
            },
            reason: { type: 'string', description: 'one short sentence' },
          },
          required: ['grounded', 'high_stakes'],
        },
      },
    },
    required: ['verdicts'],
  },
}

const VERIFY_PROMPT = `You are a strict fact-checker for an AI sales assistant's learning pipeline. You are given (1) the assistant's authoritative knowledge base and (2) candidate insights mined from conversations.

For each candidate, judge:
- grounded: is EVERY factual claim in its suggested response supported by the knowledge base or plainly evident from ordinary business reasoning? Claims of certifications, integrations, clients, metrics or capabilities that do not appear in the knowledge base are NOT grounded — even if they sound plausible. When in doubt, grounded=false.
- high_stakes: does it assert anything about certifications, regulatory compliance, legal terms, security guarantees, pricing, or named clients?

Judge every candidate, in order.`

function sb(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  return url && key ? { url, key } : null
}

/** Strip contact details before transcripts ever reach the model. */
function anonymize(s: string): string {
  return s
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
    .replace(/\+?\d[\d\s().-]{8,}\d/g, '[phone]')
    .slice(0, MAX_MSG_CHARS)
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const secret = process.env.LEARN_SECRET
  if (!secret || req.headers.get('x-learn-secret') !== secret) {
    return json({ error: 'unauthorized' }, 401)
  }
  const c = sb()
  if (!c) return json({ error: 'supabase not configured' }, 503)
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'no api key' }, 503)

  try {
    // 1. only mine messages newer than the last run
    const lastRun = await fetch(
      `${c.url}/rest/v1/learning_runs?select=through_message_id,ran_at&order=id.desc&limit=1`,
      { headers: sbHeaders(c) },
    ).then((r) => r.json())
    const since: number = lastRun?.[0]?.through_message_id ?? 0

    // Overlap guard: two concurrent runs (cron + manual) would read the same
    // high-water mark and double-mine the window into duplicate insights.
    // A run takes ~10-30s, so refuse if another finished under a minute ago;
    // ?force=1 overrides for intentional back-to-back batches.
    const lastRanAt = lastRun?.[0]?.ran_at ? Date.parse(lastRun[0].ran_at) : 0
    const force = new URL(req.url).searchParams.get('force') === '1'
    if (!force && Date.now() - lastRanAt < 60_000) {
      return json(
        { error: 'a learning pass ran less than a minute ago; retry shortly or pass ?force=1' },
        429,
      )
    }

    const rows: Row[] = await fetch(
      `${c.url}/rest/v1/messages?select=id,conversation_id,role,content,created_at` +
        `&id=gt.${since}&order=id.asc&limit=${MAX_MESSAGES}`,
      { headers: sbHeaders(c) },
    ).then((r) => r.json())

    if (!Array.isArray(rows) || rows.length === 0) {
      return json({ ok: true, scanned: 0, insights: 0, note: 'no new messages' }, 200)
    }
    const maxId = Math.max(...rows.map((r: any) => r.id))

    // 2. group into transcripts
    const byConv = new Map<string, Row[]>()
    for (const r of rows) {
      const list = byConv.get(r.conversation_id) ?? []
      list.push(r)
      byConv.set(r.conversation_id, list)
    }
    const transcripts = [...byConv.entries()]
      .map(([, msgs], i) =>
        `--- conversation ${i + 1} ---\n` +
        msgs.map((m) => `${m.role}: ${anonymize(m.content)}`).join('\n'),
      )
      .join('\n\n')

    // 3. extract insights
    const ar = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        system: EXTRACT_PROMPT,
        tools: [EXTRACT_TOOL],
        tool_choice: { type: 'tool', name: 'record_insights' },
        messages: [{ role: 'user', content: transcripts }],
      }),
    })
    const aj = await ar.json()
    if (!ar.ok) return json({ error: 'anthropic', detail: aj?.error?.message }, 502)

    const toolUse = (aj.content || []).find((b: any) => b.type === 'tool_use')
    const insights = (toolUse?.input?.insights ?? []) as Array<Record<string, string>>

    // 4. verify each insight against the knowledge base before anything
    // goes live — the automated replacement for a human approval step.
    let verdicts: Array<{ grounded: boolean; high_stakes: boolean; reason?: string }> = []
    if (insights.length > 0) {
      const vr = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1500,
          system: VERIFY_PROMPT,
          tools: [VERIFY_TOOL],
          tool_choice: { type: 'tool', name: 'verify_insights' },
          messages: [
            {
              role: 'user',
              content:
                `KNOWLEDGE BASE:\n${SYSTEM_PROMPT}\n\nCANDIDATE INSIGHTS:\n` +
                insights
                  .map((i, n) => `${n + 1}. [${i.kind}] ${i.suggested_prompt ?? i.observation}\n   response: ${i.suggested_response ?? '(none)'}`)
                  .join('\n'),
            },
          ],
        }),
      })
      const vj = await vr.json()
      if (!vr.ok) return json({ error: 'verifier', detail: vj?.error?.message }, 502)
      const vUse = (vj.content || []).find((b: any) => b.type === 'tool_use')
      verdicts = vUse?.input?.verdicts ?? []
    }

    // an insight goes live only if the verifier grounded it AND it is not
    // high-stakes; everything else is held (visible in Slack + the table)
    const promotable = (n: number) => {
      const v = verdicts[n]
      const i = insights[n]
      return !!v && v.grounded && !v.high_stakes && !!i.suggested_response
    }

    // 5. store insights with their outcome. If this insert fails we must NOT
    // advance the high-water mark or the batch is silently lost.
    let stored: Array<{ id: number }> = []
    if (insights.length > 0) {
      const ins = await fetch(`${c.url}/rest/v1/conversation_insights`, {
        method: 'POST',
        headers: {
          ...sbHeaders(c),
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(
          insights.map((i, n) => ({
            kind: i.kind,
            observation: anonymize(i.observation ?? ''),
            suggested_prompt: i.suggested_prompt ? anonymize(i.suggested_prompt) : null,
            suggested_response: i.suggested_response ? anonymize(i.suggested_response) : null,
            status: promotable(n) ? 'approved' : 'pending',
          })),
        ),
      })
      if (!ins.ok) {
        return json({ error: 'failed to store insights; mark not advanced' }, 502)
      }
      stored = await ins.json()
    }

    // 6. auto-promote the verified ones into live memory
    const promoted = insights
      .map((i, n) => ({ i, n }))
      .filter(({ n }) => promotable(n))
    if (promoted.length > 0) {
      const mem = await fetch(`${c.url}/rest/v1/assistant_memory`, {
        method: 'POST',
        headers: { ...sbHeaders(c), 'Content-Type': 'application/json' },
        body: JSON.stringify(
          promoted.map(({ i, n }) => ({
            kind: i.kind === 'gap' ? 'faq' : i.kind,
            prompt: anonymize(i.suggested_prompt ?? i.observation ?? ''),
            response: anonymize(i.suggested_response ?? ''),
            priority: 0,
            active: true,
            source_insight_id: stored[n]?.id ?? null,
            approved_by: 'auto-verifier',
          })),
        ),
      })
      if (!mem.ok) {
        return json({ error: 'failed to write memory; mark not advanced' }, 502)
      }
    }

    // 7. Slack digest — observability instead of an approval chore
    const held = insights.filter((_, n) => !promotable(n))
    if (process.env.SLACK_WEBHOOK_URL && insights.length > 0) {
      const line = (i: Record<string, string>, n: number) =>
        `• [${i.kind}] ${(i.suggested_prompt ?? i.observation ?? '').slice(0, 140)}` +
        (verdicts[n] && !promotable(n) ? ` — _${verdicts[n]?.reason ?? (verdicts[n]?.high_stakes ? 'high-stakes' : 'not grounded')}_` : '')
      const text =
        `:brain: *Assistant learning run* — scanned ${byConv.size} conversations\n` +
        (promoted.length
          ? `*Learned (now live):*\n${promoted.map(({ i }, k) => line(i, promoted[k].n)).join('\n')}\n`
          : '') +
        (held.length
          ? `*Held for review (not live — check conversation_insights):*\n${insights.map((i, n) => (!promotable(n) ? line(i, n) : null)).filter(Boolean).join('\n')}`
          : '')
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
      } catch {
        /* digest is best-effort */
      }
    }

    await fetch(`${c.url}/rest/v1/learning_runs`, {
      method: 'POST',
      headers: { ...sbHeaders(c), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversations_scanned: byConv.size,
        insights_created: insights.length,
        through_message_id: maxId,
      }),
    })

    return json(
      {
        ok: true,
        scanned: byConv.size,
        insights: insights.length,
        learned: promoted.length,
        held: held.length,
      },
      200,
    )
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'failed' }, 500)
  }
}

function sbHeaders(c: { url: string; key: string }) {
  return { apikey: c.key, Authorization: `Bearer ${c.key}` }
}

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
