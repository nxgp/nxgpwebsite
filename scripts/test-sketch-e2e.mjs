/**
 * E2E test for the "Sketch my agent" endpoint — the REAL api/sketch.ts
 * handler (esbuild-bundled) against mock Anthropic, Supabase REST, Resend
 * and Slack servers. No real keys needed:  node scripts/test-sketch-e2e.mjs
 *
 *   1. generate → schema-valid sketch stored + id returned
 *   2. share-link GET roundtrip
 *   3. email-me → Resend payload correct + HTML-escaped + Slack lead + leads row
 *   4. rejected input → no storage, rejection surfaced
 *   5. invalid model output → 502 (never a broken sketch to the visitor)
 *   6. no Supabase → sketch still generated, id null
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

/* ---------- canned model output ---------- */

const GOOD_SKETCH = {
  name: 'Invoice Triage Agent',
  summary: 'Matches AP invoices to POs and posts clean ones to NetSuite.',
  trigger: { label: 'Invoice lands', detail: 'in the AP inbox (Outlook)' },
  steps: [
    { type: 'read', label: 'Pull the PO', detail: 'Looks up the PO in NetSuite' },
    { type: 'reason', label: 'Three-way match', detail: 'Compares invoice, PO & receiving record — flags <b>gaps</b>' },
    { type: 'act', label: 'Post or hold', detail: 'Posts clean invoices; holds mismatches' },
  ],
  guardrail: { condition: 'Invoice > $5k or unknown vendor', action: 'AP lead approves in Slack' },
  integrations: ['Outlook', 'NetSuite', 'Slack'],
  metrics: ['Hours of manual matching per week', 'Exception rate'],
  clarify: 'What share of invoices arrive without a PO today?',
  feasibility: 'standard',
}

/* ---------- mock servers ---------- */

const state = {
  emails: [],
  slack: [],
  sketchRows: new Map(), // id -> row
  leadRows: [],
  mode: 'good', // good | rejected | invalid
}
const SKETCH_ID = '123e4567-e89b-42d3-a456-426614174000'

const mock = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    const send = (code, obj, headers = {}) => {
      res.writeHead(code, { 'content-type': 'application/json', ...headers })
      res.end(JSON.stringify(obj))
    }
    if (req.url.startsWith('/anthropic')) {
      const input =
        state.mode === 'good'
          ? GOOD_SKETCH
          : state.mode === 'rejected'
            ? { rejected: "That doesn't look like a workflow — try describing a process your team runs." }
            : { name: 'broken' } // invalid: missing everything else
      send(200, { content: [{ type: 'tool_use', name: 'design_agent', input }] })
    } else if (req.url.startsWith('/supabase/rest/v1/sketches')) {
      if (req.method === 'POST') {
        const row = { id: SKETCH_ID, ...JSON.parse(body) }
        state.sketchRows.set(SKETCH_ID, row)
        send(200, [row])
      } else {
        // GET by id or count probe
        const m = req.url.match(/id=eq\.([0-9a-f-]+)/)
        if (m) {
          const row = state.sketchRows.get(m[1])
          send(200, row ? [row] : [])
        } else {
          send(200, [], { 'content-range': '0-0/0' })
        }
      }
    } else if (req.url.startsWith('/supabase/rest/v1/leads')) {
      state.leadRows.push(JSON.parse(body))
      send(201, {})
    } else if (req.url.startsWith('/resend')) {
      state.emails.push(JSON.parse(body))
      send(200, { id: 'em_1' })
    } else if (req.url.startsWith('/slack')) {
      state.slack.push(JSON.parse(body).text)
      send(200, {})
    } else {
      send(404, {})
    }
  })
})
await new Promise((r) => mock.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${mock.address().port}`

process.env.ANTHROPIC_API_KEY = 'test-key'
process.env.ANTHROPIC_BASE_URL = `${base}/anthropic`
process.env.SUPABASE_URL = `${base}/supabase`
process.env.SUPABASE_SECRET_KEY = 'test-secret'
process.env.RESEND_API_KEY = 'test-key'
process.env.EMAIL_BASE_URL = `${base}/resend`
process.env.SLACK_WEBHOOK_URL = `${base}/slack`

const tmp = mkdtempSync(path.join(tmpdir(), 'nx-sketch-e2e-'))
const bundle = path.join(tmp, 'sketch.mjs')
execSync(`npx -y esbuild api/sketch.ts --bundle --format=esm --platform=node --outfile=${bundle}`, {
  stdio: 'pipe',
})
const { default: handler } = await import(bundle)

const call = (method, payload, qs = '') =>
  handler(
    new Request(`http://localhost/api/sketch${qs}`, {
      method,
      headers: { 'content-type': 'application/json' },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    }),
  )

/* ---------- 1. generate ---------- */
console.log('scenario 1: generate → stored, id returned')
{
  const r = await call('POST', { description: 'Invoices land in our AP inbox and need matching to POs' })
  const j = await r.json()
  check('200', r.status === 200, `got ${r.status}`)
  check('id returned', j.id === SKETCH_ID)
  check('sketch name', j.sketch?.name === 'Invoice Triage Agent')
  check('stored with description', state.sketchRows.get(SKETCH_ID)?.description.includes('AP inbox'))
}

/* ---------- 2. share roundtrip ---------- */
console.log('scenario 2: GET by id')
{
  const r = await call('GET', null, `?id=${SKETCH_ID}`)
  const j = await r.json()
  check('200', r.status === 200)
  check('sketch returned', j.sketch?.name === 'Invoice Triage Agent')
  check('description returned', typeof j.description === 'string')
  const miss = await call('GET', null, `?id=123e4567-e89b-42d3-a456-999999999999`)
  check('unknown id → 404', miss.status === 404)
}

/* ---------- 3. email-me ---------- */
console.log('scenario 3: email-me → Resend + Slack lead + leads row')
{
  const r = await call('POST', { id: SKETCH_ID, email: 'dana@carepath.io', name: 'Dana K' })
  const j = await r.json()
  check('ok', r.status === 200 && j.ok === true)
  check('email sent', state.emails.length === 1)
  const em = state.emails[0] ?? {}
  check('to the visitor', JSON.stringify(em.to) === '["dana@carepath.io"]')
  check('subject names the agent', (em.subject || '').includes('Invoice Triage Agent'))
  check('share link in email', (em.text || '').includes(`/sketch?s=${SKETCH_ID}`))
  check('booking link in email', (em.text || '').includes('calendly.com'))
  check(
    'model HTML escaped',
    (em.html || '').includes('&lt;b&gt;gaps&lt;/b&gt;') && !(em.html || '').includes('<b>gaps</b>'),
  )
  check('slack lead posted', state.slack.some((t) => t.includes('Sketch my agent') && t.includes('dana@carepath.io')))
  check('leads row written', state.leadRows.some((l) => l.email === 'dana@carepath.io'))
  const bad = await call('POST', { id: SKETCH_ID, email: 'not-an-email' })
  check('invalid email → 400', bad.status === 400)
}

/* ---------- 4. rejected input ---------- */
console.log('scenario 4: rejected input → surfaced, not stored')
{
  state.mode = 'rejected'
  const before = state.sketchRows.size
  const r = await call('POST', { description: 'asdf qwerty hello there friend' })
  const j = await r.json()
  check('200 with rejection', r.status === 200 && typeof j.sketch?.rejected === 'string')
  check('no id for rejections', j.id === null)
  check('not stored', state.sketchRows.size === before)
}

/* ---------- 5. invalid model output ---------- */
console.log('scenario 5: invalid model output → 502, never a broken sketch')
{
  state.mode = 'invalid'
  const r = await call('POST', { description: 'Support tickets should be triaged by urgency' })
  check('502', r.status === 502, `got ${r.status}`)
}

/* ---------- 6. graceful without Supabase ---------- */
console.log('scenario 6: no Supabase → sketch works, id null')
{
  state.mode = 'good'
  delete process.env.SUPABASE_URL
  const r = await call('POST', { description: 'Invoices land in our AP inbox and need matching to POs' })
  const j = await r.json()
  check('200', r.status === 200)
  check('sketch returned', j.sketch?.name === 'Invoice Triage Agent')
  check('id null without storage', j.id === null)
}

/* ---------- guards ---------- */
console.log('guards')
{
  const short = await call('POST', { description: 'automate' })
  check('too-short description → 400', short.status === 400)
}

mock.close()
rmSync(tmp, { recursive: true, force: true })
console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
