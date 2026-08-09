/**
 * E2E test for the chat endpoint's booking + follow-up plumbing.
 *
 * Runs the REAL api/chat.ts handler (esbuild-bundled) against mock Anthropic,
 * Resend and Slack servers, and asserts the full contract:
 *   1. capture_lead → recap email sent (correct to/escaping) → Slack ping
 *      includes follow-up status → SSE emits lead + prefilled calendar → done
 *   2. show_calendar → SSE emits calendar (no prefill), no lead, no email
 *   3. plain question → no calendar/lead events
 *   4. email provider down → lead still captured, Slack says FAILED
 *
 * No real keys needed:  node scripts/test-chat-e2e.mjs
 */
import { execSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import http from 'node:http'
import path from 'node:path'

let failures = 0
const check = (name, ok, detail = '') => {
  console.log(`${ok ? '  ✓' : '  ✗ FAIL'} ${name}${!ok && detail ? ` — ${detail}` : ''}`)
  if (!ok) failures++
}

/* ---------- mock upstream servers ---------- */

const state = { emails: [], slack: [], anthropic: [], emailMode: 'ok' }

const sse = (events) =>
  events.map((e) => `data: ${JSON.stringify(e)}\n`).join('\n') + '\n'

const toolUse = (name, input) =>
  sse([
    { type: 'content_block_start', content_block: { type: 'tool_use', id: 'tu_1', name } },
    { type: 'content_block_delta', delta: { type: 'input_json_delta', partial_json: JSON.stringify(input) } },
    { type: 'content_block_stop' },
    { type: 'message_delta', delta: { stop_reason: 'tool_use' } },
  ])

/** Both tools in one round — plus an empty text block, which the real API
 *  emits sometimes and then REJECTS if echoed back in the assistant turn. */
const dualToolUse = (lead) =>
  sse([
    { type: 'content_block_start', content_block: { type: 'text' } },
    { type: 'content_block_stop' },
    { type: 'content_block_start', content_block: { type: 'tool_use', id: 'tu_a', name: 'capture_lead' } },
    { type: 'content_block_delta', delta: { type: 'input_json_delta', partial_json: JSON.stringify(lead) } },
    { type: 'content_block_stop' },
    { type: 'content_block_start', content_block: { type: 'tool_use', id: 'tu_b', name: 'show_calendar' } },
    { type: 'content_block_delta', delta: { type: 'input_json_delta', partial_json: '{}' } },
    { type: 'content_block_stop' },
    { type: 'message_delta', delta: { stop_reason: 'tool_use' } },
  ])

const textReply = (text) =>
  sse([
    { type: 'content_block_start', content_block: { type: 'text' } },
    { type: 'content_block_delta', delta: { type: 'text_delta', text } },
    { type: 'content_block_stop' },
    { type: 'message_delta', delta: { stop_reason: 'end_turn' } },
  ])

const LEAD = {
  name: 'Dana K',
  email: 'dana@carepath.io',
  company: 'CarePath Health',
  interest: 'EHR-integrated copilot <b>with PHI</b>',
  summary: 'Clinic group evaluating an AI copilot across their EHR.',
}

const mock = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    if (req.url.startsWith('/anthropic')) {
      const parsed = JSON.parse(body)
      state.anthropic.push(parsed)
      const hasToolResult = JSON.stringify(parsed.messages).includes('tool_result')
      const lastUser = parsed.messages[parsed.messages.length - 1]
      res.writeHead(200, { 'content-type': 'text/event-stream' })
      if (hasToolResult) {
        res.end(textReply("You're all set — pick a time below."))
      } else if (JSON.stringify(lastUser).includes('BOTH_NOW')) {
        res.end(dualToolUse(LEAD))
      } else if (JSON.stringify(lastUser).includes('BOOK_NOW')) {
        res.end(toolUse('show_calendar', {}))
      } else if (JSON.stringify(lastUser).includes('LEAD_NOW')) {
        res.end(toolUse('capture_lead', LEAD))
      } else {
        res.end(textReply('We build AI systems. What are you working on?'))
      }
    } else if (req.url.startsWith('/resend')) {
      if (state.emailMode === 'fail') {
        res.writeHead(500).end('{"error":"boom"}')
      } else {
        state.emails.push(JSON.parse(body))
        res.writeHead(200, { 'content-type': 'application/json' }).end('{"id":"em_1"}')
      }
    } else if (req.url.startsWith('/slack')) {
      state.slack.push(JSON.parse(body).text)
      res.writeHead(200).end('ok')
    } else {
      res.writeHead(404).end()
    }
  })
})
await new Promise((r) => mock.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${mock.address().port}`

/* ---------- bundle + import the real handler ---------- */

process.env.ANTHROPIC_API_KEY = 'test-key'
process.env.ANTHROPIC_BASE_URL = `${base}/anthropic`
process.env.RESEND_API_KEY = 'test-key'
process.env.EMAIL_BASE_URL = `${base}/resend`
process.env.SLACK_WEBHOOK_URL = `${base}/slack`
delete process.env.SUPABASE_URL // storage skips gracefully

const tmp = mkdtempSync(path.join(tmpdir(), 'nx-chat-e2e-'))
const bundle = path.join(tmp, 'chat.mjs')
execSync(
  `npx -y esbuild api/chat.ts --bundle --format=esm --platform=node --outfile=${bundle}`,
  { stdio: 'pipe' },
)
const { default: handler } = await import(bundle)

async function chat(text, id = crypto.randomUUID()) {
  const res = await handler(
    new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ conversationId: id, messages: [{ role: 'user', content: text }] }),
    }),
  )
  const raw = await res.text()
  return raw
    .split('\n')
    .filter((l) => l.startsWith('data:'))
    .map((l) => JSON.parse(l.slice(5)))
}

/* ---------- scenario 1: capture_lead ---------- */
console.log('scenario 1: capture_lead → email + slack + calendar')
{
  const events = await chat('LEAD_NOW please')
  const types = events.map((e) => e.t)
  check('lead event emitted', types.includes('lead'))
  check('confirmation streamed', events.some((e) => e.t === 'delta' && e.text.includes('pick a time')))
  const cal = events.find((e) => e.t === 'calendar')
  check('calendar event emitted', !!cal)
  check('calendar prefilled with email', !!cal && cal.url.includes(encodeURIComponent('dana@carepath.io')))
  check('calendar is embed-mode', !!cal && cal.url.includes('embed_type=Inline'))
  check(
    'calendar arrives after confirmation text',
    types.lastIndexOf('delta') < types.indexOf('calendar'),
  )
  check('stream completes', types[types.length - 1] === 'done')

  check('exactly one recap email', state.emails.length === 1)
  const em = state.emails[0] ?? {}
  check('email to the lead', JSON.stringify(em.to) === '["dana@carepath.io"]')
  check('email subject set', em.subject === 'Your intro call with Nx Growth Partners')
  check('email text has booking link', (em.text || '').includes('calendly.com'))
  check('email recaps their need', (em.text || '').includes('EHR-integrated copilot'))
  check(
    'visitor-typed HTML is escaped',
    (em.html || '').includes('&lt;b&gt;with PHI&lt;/b&gt;') && !(em.html || '').includes('<b>with PHI</b>'),
  )
  check('slack ping sent', state.slack.length === 1)
  check('slack reports email sent', (state.slack[0] || '').includes('recap email sent'))
}

/* ---------- scenario 2: show_calendar ---------- */
console.log('scenario 2: show_calendar → calendar only')
{
  const before = state.emails.length
  const events = await chat('BOOK_NOW please')
  const types = events.map((e) => e.t)
  const cal = events.find((e) => e.t === 'calendar')
  check('calendar event emitted', !!cal)
  check('no prefill without a lead', !!cal && !cal.url.includes('email='))
  check('no lead event', !types.includes('lead'))
  check('no email sent', state.emails.length === before)
  check('stream completes', types[types.length - 1] === 'done')
}

/* ---------- scenario 3: plain question ---------- */
console.log('scenario 3: plain question → no booking surfaces')
{
  const events = await chat('what do you build?')
  const types = events.map((e) => e.t)
  check('answer streamed', events.some((e) => e.t === 'delta' && e.text.includes('What are you working on')))
  check('no calendar event', !types.includes('calendar'))
  check('no lead event', !types.includes('lead'))
}

/* ---------- scenario 4: email provider down ---------- */
console.log('scenario 4: email provider down → lead still lands, slack flags it')
{
  state.emailMode = 'fail'
  const slackBefore = state.slack.length
  const events = await chat('LEAD_NOW please')
  const types = events.map((e) => e.t)
  check('lead still captured', types.includes('lead'))
  check('calendar still shown', types.includes('calendar'))
  check('slack flags failed email', (state.slack[slackBefore] || '').includes('FAILED'))
}

/* ---------- scenario 5: both tools in one round (+ empty text block) ---------- */
console.log('scenario 5: capture_lead + show_calendar in one round')
{
  state.emailMode = 'ok'
  const emailsBefore = state.emails.length
  const anthropicBefore = state.anthropic.length
  const events = await chat('BOTH_NOW please')
  const types = events.map((e) => e.t)
  check('lead captured once', types.filter((t) => t === 'lead').length === 1)
  check('one email sent', state.emails.length === emailsBefore + 1)
  const cal = events.find((e) => e.t === 'calendar')
  check('single calendar event', events.filter((e) => e.t === 'calendar').length === 1)
  check('calendar keeps the lead prefill', !!cal && cal.url.includes(encodeURIComponent('dana@carepath.io')))
  check('stream completes (no API 400)', types[types.length - 1] === 'done')

  // the follow-up request must answer BOTH tool_use blocks and must not
  // echo the empty text block back to the API
  const followupReq = state.anthropic[anthropicBefore + 1]
  const lastMsg = followupReq?.messages[followupReq.messages.length - 1]
  const resultIds = (Array.isArray(lastMsg?.content) ? lastMsg.content : [])
    .filter((c) => c.type === 'tool_result')
    .map((c) => c.tool_use_id)
    .sort()
  check('tool_result for every tool_use', JSON.stringify(resultIds) === '["tu_a","tu_b"]')
  const assistantMsg = followupReq?.messages[followupReq.messages.length - 2]
  const emptyText = (Array.isArray(assistantMsg?.content) ? assistantMsg.content : []).some(
    (c) => c.type === 'text' && !c.text.trim(),
  )
  check('empty text block filtered from assistant turn', !emptyText)
}

mock.close()
rmSync(tmp, { recursive: true, force: true })

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
