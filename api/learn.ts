/**
 * Nx Assistant — learning pass.
 *
 * Reads recent conversations, extracts ANONYMIZED patterns (questions the
 * assistant handled badly, recurring objections, framings that worked), and
 * writes them to `conversation_insights` as *pending*. A human approves them
 * into `assistant_memory`; only then do they reach a live prompt.
 *
 * Nothing here is auto-promoted, and no visitor identity is ever stored:
 * that is what keeps one visitor's session from leaking into another's.
 *
 * POST /api/learn   header: x-learn-secret: $LEARN_SECRET
 * Run it from cron (e.g. Vercel Cron, weekly) or by hand.
 */

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

    // 4. store as pending — second anonymization pass before writing.
    // If this insert fails we must NOT advance the high-water mark, or the
    // batch's insights are silently lost forever; bail and let the next run
    // re-mine the same window instead.
    if (insights.length > 0) {
      const ins = await fetch(`${c.url}/rest/v1/conversation_insights`, {
        method: 'POST',
        headers: { ...sbHeaders(c), 'Content-Type': 'application/json' },
        body: JSON.stringify(
          insights.map((i) => ({
            kind: i.kind,
            observation: anonymize(i.observation ?? ''),
            suggested_prompt: i.suggested_prompt ? anonymize(i.suggested_prompt) : null,
            suggested_response: i.suggested_response ? anonymize(i.suggested_response) : null,
            status: 'pending',
          })),
        ),
      })
      if (!ins.ok) {
        return json({ error: 'failed to store insights; mark not advanced' }, 502)
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

    return json({ ok: true, scanned: byConv.size, insights: insights.length }, 200)
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
