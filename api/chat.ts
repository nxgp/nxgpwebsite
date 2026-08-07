/**
 * Nx Assistant — streaming chat endpoint (Vercel Edge Function).
 *
 * POST /api/chat  { conversationId: string, messages: [{role, content}] }
 * → SSE stream:   data: {"t":"delta","text":"..."}
 *                 data: {"t":"lead"}            (lead captured, team notified)
 *                 data: {"t":"done"}
 *                 data: {"t":"err","message"}
 *
 * Env: ANTHROPIC_API_KEY (required)
 *      SUPABASE_URL + SUPABASE_SECRET_KEY   (conversation + lead storage)
 *      SLACK_WEBHOOK_URL                    (lead notifications)
 *      CALENDLY_URL                         (booking link; has default)
 * Missing integrations degrade gracefully — chat keeps working.
 */
import { SYSTEM_PROMPT, LEAD_TOOL, CALENDLY_URL } from './_knowledge'
import { loadMemory, renderMemory } from './_memory'

export const config = { runtime: 'edge' }

const MODEL = process.env.ASSISTANT_MODEL || 'claude-haiku-4-5-20251001'
// Overridable for gateways/testing; defaults to the official API.
const ANTHROPIC_BASE_URL =
  process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com'
const MAX_TURNS = 30 // messages per conversation accepted from the client
const MAX_MSG_CHARS = 2000
const MAX_TOKENS = 700
const IP_DAILY_LIMIT = 300 // messages per IP per day (Supabase-backed)
// Global cap across ALL IPs — a distributed scraper can rotate addresses past
// the per-IP limit; this bounds worst-case daily Anthropic spend. Override
// with ASSISTANT_DAILY_CAP.
const GLOBAL_DAILY_LIMIT = Number(process.env.ASSISTANT_DAILY_CAP || 2000)

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type Lead = {
  name?: string
  email: string
  company?: string
  interest: string
  summary: string
}

// best-effort per-isolate limiter (backstop when Supabase isn't configured)
const bucket = new Map<string, { n: number; t: number }>()
function localLimit(ip: string): boolean {
  const now = Date.now()
  const b = bucket.get(ip)
  if (!b || now - b.t > 60_000) {
    bucket.set(ip, { n: 1, t: now })
    return true
  }
  b.n += 1
  return b.n <= 20 // 20 messages/minute/IP
}

function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // same-origin / curl
  return (
    origin === 'https://nxgp.io' ||
    origin === 'https://www.nxgp.io' ||
    origin.endsWith('.vercel.app') ||
    origin.startsWith('http://localhost') ||
    origin.startsWith('http://127.0.0.1')
  )
}

/* ---------------- Supabase (REST) ---------------- */

function sb(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  return url && key ? { url, key } : null
}

async function sbInsert(table: string, rows: unknown): Promise<void> {
  const c = sb()
  if (!c) return
  try {
    await fetch(`${c.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(rows),
    })
  } catch {
    /* storage must never break chat */
  }
}

async function overDailyLimits(ip: string): Promise<boolean> {
  const c = sb()
  if (!c) return false
  try {
    const since = new Date(Date.now() - 86_400_000).toISOString()
    const count = async (filter: string) => {
      const r = await fetch(
        `${c.url}/rest/v1/messages?select=id${filter}&created_at=gte.${since}`,
        {
          headers: {
            apikey: c.key,
            Authorization: `Bearer ${c.key}`,
            Prefer: 'count=exact',
            Range: '0-0',
          },
        },
      )
      return Number(r.headers.get('content-range')?.split('/')[1] ?? 0)
    }
    if ((await count(`&ip=eq.${encodeURIComponent(ip)}`)) > IP_DAILY_LIMIT) return true
    return (await count('')) > GLOBAL_DAILY_LIMIT
  } catch {
    return false
  }
}

/* ---------------- Slack ---------------- */

async function notifySlack(lead: Lead, conversationId: string): Promise<boolean> {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return false
  const text =
    `:large_blue_diamond: *New website lead*\n` +
    `*Name:* ${lead.name || '—'}\n*Email:* ${lead.email}\n*Company:* ${lead.company || '—'}\n` +
    `*Needs:* ${lead.interest}\n*Summary:* ${lead.summary}\n` +
    `*Conversation:* \`${conversationId}\``
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    return r.ok
  } catch {
    return false
  }
}

/** Alert the team when chat starts failing — visitors only see a polite
 *  fallback, so without this an expired key or provider outage would go
 *  unnoticed until someone complains. Max one alert per 5 min per isolate. */
let lastErrorAlert = 0
async function alertError(detail: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url || Date.now() - lastErrorAlert < 300_000) return
  lastErrorAlert = Date.now()
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `:rotating_light: *Nx Assistant error* — visitors are getting the fallback message.\n\`\`\`${detail.slice(0, 300)}\`\`\``,
      }),
    })
  } catch {
    /* best-effort */
  }
}

/* ---------------- Anthropic ---------------- */

type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }

async function anthropicStream(
  messages: unknown[],
  onDelta: (text: string) => void,
  memoryBlock: string,
): Promise<{ blocks: ContentBlock[]; stopReason: string }> {
  // Two cache breakpoints: the base prompt stays cached even when approved
  // memory changes, so learning never costs a full cache rebuild.
  const system: unknown[] = [
    { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
  ]
  if (memoryBlock) {
    system.push({ type: 'text', text: memoryBlock, cache_control: { type: 'ephemeral' } })
  }

  const r = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      tools: [LEAD_TOOL],
      messages,
      stream: true,
    }),
  })

  if (!r.ok || !r.body) {
    const body = await r.text().catch(() => '')
    throw new Error(`anthropic ${r.status}: ${body.slice(0, 300)}`)
  }

  const blocks: ContentBlock[] = []
  let stopReason = 'end_turn'
  let currentToolJson = ''
  const reader = r.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      let ev: Record<string, any>
      try {
        ev = JSON.parse(line.slice(5))
      } catch {
        continue
      }
      switch (ev.type) {
        case 'content_block_start':
          if (ev.content_block?.type === 'text') {
            blocks.push({ type: 'text', text: '' })
          } else if (ev.content_block?.type === 'tool_use') {
            blocks.push({
              type: 'tool_use',
              id: ev.content_block.id,
              name: ev.content_block.name,
              input: {},
            })
            currentToolJson = ''
          }
          break
        case 'content_block_delta': {
          const last = blocks[blocks.length - 1]
          if (ev.delta?.type === 'text_delta' && last?.type === 'text') {
            last.text += ev.delta.text
            onDelta(ev.delta.text)
          } else if (ev.delta?.type === 'input_json_delta' && last?.type === 'tool_use') {
            currentToolJson += ev.delta.partial_json
          }
          break
        }
        case 'content_block_stop': {
          const last = blocks[blocks.length - 1]
          if (last?.type === 'tool_use' && currentToolJson) {
            try {
              last.input = JSON.parse(currentToolJson)
            } catch {
              /* leave empty */
            }
          }
          break
        }
        case 'message_delta':
          if (ev.delta?.stop_reason) stopReason = ev.delta.stop_reason
          break
      }
    }
  }
  return { blocks, stopReason }
}

/* ---------------- Handler ---------------- */

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) })
  }
  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405, req)
  }
  if (!originAllowed(req)) {
    return json({ error: 'forbidden' }, 403, req)
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: 'assistant not configured' }, 503, req)
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (!localLimit(ip)) return json({ error: 'rate limited' }, 429, req)
  if (await overDailyLimits(ip)) return json({ error: 'rate limited' }, 429, req)

  let body: { conversationId?: string; messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'bad json' }, 400, req)
  }

  const conversationId = String(body.conversationId || '').slice(0, 64)
  const raw = Array.isArray(body.messages) ? body.messages : []
  if (!conversationId || raw.length === 0) {
    return json({ error: 'conversationId and messages required' }, 400, req)
  }
  const messages: ChatMessage[] = raw
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MSG_CHARS) }))
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return json({ error: 'last message must be from user' }, 400, req)
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      let assistantText = ''
      let leadCaptured = false

      try {
        // Approved, anonymized learning from previous conversations.
        // Never raw transcripts — see api/_memory.ts privacy contract.
        const memoryBlock = renderMemory(
          await loadMemory(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY),
        )

        const apiMessages: unknown[] = [...messages]
        let round = await anthropicStream(apiMessages, (t) => {
          assistantText += t
          send({ t: 'delta', text: t })
        }, memoryBlock)

        // one tool round max — capture_lead, then let the model confirm
        if (round.stopReason === 'tool_use') {
          const tool = round.blocks.find(
            (b): b is Extract<ContentBlock, { type: 'tool_use' }> =>
              b.type === 'tool_use' && b.name === 'capture_lead',
          )
          if (tool) {
            const lead = tool.input as unknown as Lead
            const slackOk = await notifySlack(lead, conversationId)
            await sbInsert('leads', {
              conversation_id: conversationId,
              name: lead.name ?? null,
              email: lead.email,
              company: lead.company ?? null,
              interest: lead.interest,
              summary: lead.summary,
              slack_notified: slackOk,
            })
            leadCaptured = true
            send({ t: 'lead' })

            // visual break between pre-tool text and the confirmation
            if (assistantText.trim()) {
              assistantText += '\n\n'
              send({ t: 'delta', text: '\n\n' })
            }

            apiMessages.push({ role: 'assistant', content: round.blocks })
            apiMessages.push({
              role: 'user',
              content: [
                {
                  type: 'tool_result',
                  tool_use_id: tool.id,
                  content: `Lead recorded and the NxGP team has been notified. Confirm this to the visitor and share the booking link: ${CALENDLY_URL}`,
                },
              ],
            })
            round = await anthropicStream(apiMessages, (t) => {
              assistantText += t
              send({ t: 'delta', text: t })
            }, memoryBlock)
          }
        }

        // persist the exchange (last user turn + full assistant reply)
        await sbInsert('conversations', {
          id: conversationId,
          last_active: new Date().toISOString(),
          lead_captured: leadCaptured || undefined,
        })
        await sbInsert('messages', [
          {
            conversation_id: conversationId,
            role: 'user',
            content: messages[messages.length - 1].content,
            ip,
          },
          {
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantText,
            ip,
          },
        ])

        send({ t: 'done' })
      } catch (e) {
        send({
          t: 'err',
          message:
            'The assistant hit a snag. Please try again, or email hello@nxgp.io.',
        })
        const detail = e instanceof Error ? e.message : String(e)
        console.error('chat error:', detail)
        await alertError(detail)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      ...corsHeaders(req),
    },
  })
}

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin')
  return origin && originAllowed(req)
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    : {}
}

function json(obj: unknown, status: number, req: Request): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(req) },
  })
}
