/**
 * Nx Assistant — visitor feedback (👍/👎 on replies).
 *
 * POST /api/feedback { conversationId, rating: 1 | -1, question?, answer? }
 *
 * Stored with the question + answer snippet inline so the learning pass can
 * use ratings even after raw transcripts have been purged by retention.
 */

export const config = { runtime: 'edge' }

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

// light per-isolate cap — feedback is one click, nobody legitimate sends 30/min
const bucket = new Map<string, { n: number; t: number }>()
function limited(ip: string): boolean {
  const now = Date.now()
  const b = bucket.get(ip)
  if (!b || now - b.t > 60_000) {
    bucket.set(ip, { n: 1, t: now })
    return false
  }
  b.n += 1
  return b.n > 30
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 })
  if (!originAllowed(req)) return new Response(null, { status: 403 })
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (limited(ip)) return new Response(null, { status: 429 })

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return new Response(null, { status: 204 }) // nowhere to store; accept quietly

  let body: { conversationId?: string; rating?: number; question?: string; answer?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(null, { status: 400 })
  }
  const rating = body.rating === 1 ? 1 : body.rating === -1 ? -1 : null
  if (!rating) return new Response(null, { status: 400 })

  try {
    await fetch(`${url}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: String(body.conversationId ?? '').slice(0, 64) || null,
        rating,
        question: String(body.question ?? '').slice(0, 500) || null,
        answer_snippet: String(body.answer ?? '').slice(0, 500) || null,
      }),
    })
  } catch {
    /* feedback is best-effort */
  }
  return new Response(null, { status: 204 })
}
