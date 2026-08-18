/**
 * "Discuss a project" form.
 *
 * POST /api/contact { name, email, company?, help?, message, page?, website? }
 *   → { ok: true, emailed: boolean }
 *
 * Lands in the same `leads` table the assistant and the sketch tool feed, with
 * source='form', so the team has one place to look rather than three.
 *
 * Env: SUPABASE_URL + SUPABASE_SECRET_KEY  (storage; degrades gracefully)
 *      SLACK_WEBHOOK_URL                   (team ping)
 *      RESEND_API_KEY                      (confirmation to the sender)
 */
import { sendInquiryEmail } from './_email'
import { CALENDLY_URL } from './_knowledge'

export const config = { runtime: 'edge' }

const MAX = { name: 120, email: 200, company: 160, help: 80, message: 4000, page: 200 }

function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  return (
    origin === 'https://nxgp.io' ||
    origin === 'https://www.nxgp.io' ||
    origin.endsWith('.vercel.app') ||
    origin.startsWith('http://localhost') ||
    origin.startsWith('http://127.0.0.1')
  )
}

// best-effort per-isolate throttle; the real backstop is the daily count below
const bucket = new Map<string, { n: number; t: number }>()
function burstLimit(ip: string): boolean {
  const now = Date.now()
  const b = bucket.get(ip)
  if (!b || now - b.t > 600_000) {
    bucket.set(ip, { n: 1, t: now })
    return true
  }
  b.n += 1
  return b.n <= 5 // 5 submissions / 10 min / IP
}

function sb(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  return url && key ? { url, key } : null
}

async function overDailyLimit(ip: string): Promise<boolean> {
  const c = sb()
  if (!c) return false
  try {
    const since = new Date(Date.now() - 86_400_000).toISOString()
    const r = await fetch(
      `${c.url}/rest/v1/leads?select=id&source=eq.form&ip=eq.${encodeURIComponent(ip)}&created_at=gte.${since}`,
      {
        headers: {
          apikey: c.key,
          Authorization: `Bearer ${c.key}`,
          Prefer: 'count=exact',
          Range: '0-0',
        },
      },
    )
    return Number(r.headers.get('content-range')?.split('/')[1] ?? 0) >= 10
  } catch {
    return false
  }
}

async function notifySlack(f: Record<string, string>, emailed: string): Promise<boolean> {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return false
  const text =
    `:inbox_tray: *New project inquiry* (form)\n` +
    `*Name:* ${f.name}\n*Email:* ${f.email}\n*Company:* ${f.company || '—'}\n` +
    `*Looking for:* ${f.help || '—'}\n*Message:* ${f.message}\n` +
    `*Page:* ${f.page || '—'}\n*Confirmation email:* ${emailed}`
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405, req)
  if (!originAllowed(req)) return json({ error: 'forbidden' }, 403, req)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'bad json' }, 400, req)
  }

  // honeypot: a real person never fills a field they cannot see
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true, emailed: false }, 200, req) // look successful to the bot
  }

  const str = (k: keyof typeof MAX) => String(body[k] ?? '').trim().slice(0, MAX[k])
  const f = {
    name: str('name'),
    email: str('email'),
    company: str('company'),
    help: str('help'),
    message: str('message'),
    page: str('page'),
  }

  if (!f.name) return json({ error: 'Please add your name.' }, 400, req)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return json({ error: 'That email address does not look right.' }, 400, req)
  }
  if (f.message.length < 10) {
    return json({ error: 'Tell us a little about the project, even a sentence.' }, 400, req)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (!burstLimit(ip) || (await overDailyLimit(ip))) {
    return json({ error: 'That is a lot of submissions. Email hello@nxgp.io and we will pick it up.' }, 429, req)
  }

  const emailed = await sendInquiryEmail(f, CALENDLY_URL)
  const slackOk = await notifySlack(f, emailed)

  const c = sb()
  if (c) {
    await fetch(`${c.url}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'form',
        name: f.name,
        email: f.email,
        company: f.company || null,
        interest: f.help || 'Project inquiry',
        summary: f.message,
        page: f.page || null,
        ip,
        slack_notified: slackOk,
      }),
    }).catch(() => {})
  }

  return json({ ok: true, emailed: emailed === 'sent' }, 200, req)
}

function cors(req: Request): Record<string, string> {
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
    headers: { 'Content-Type': 'application/json', ...cors(req) },
  })
}
