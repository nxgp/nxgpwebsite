/**
 * Follow-up email — sent immediately after the assistant captures a lead.
 * One transactional email: a recap of what they told us + the booking link.
 * No sequences, no marketing. Speed-to-follow-up is the point: the email
 * lands while they're still on the site.
 *
 * Provider: Resend (plain fetch, no SDK — this runs on the Edge runtime).
 * Env:  RESEND_API_KEY   — if unset, sending is skipped gracefully
 *       EMAIL_FROM       — verified sender (default: Nx Growth Partners <hello@nxgp.io>)
 *       EMAIL_REPLY_TO   — default hello@nxgp.io
 *       EMAIL_BASE_URL   — override for tests (default https://api.resend.com)
 */

type FollowupLead = {
  name?: string
  email: string
  company?: string
  interest: string
}

/** Lead fields are visitor-typed — escape them before they touch HTML. */
const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export type FollowupResult = 'sent' | 'skipped' | 'failed'

export async function sendFollowupEmail(
  lead: FollowupLead,
  calendlyUrl: string,
): Promise<FollowupResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) return 'skipped'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return 'failed'

  const base = process.env.EMAIL_BASE_URL || 'https://api.resend.com'
  const from = process.env.EMAIL_FROM || 'Nx Growth Partners <hello@nxgp.io>'
  const replyTo = process.env.EMAIL_REPLY_TO || 'hello@nxgp.io'
  const firstName = (lead.name || '').trim().split(/\s+/)[0] || 'there'

  const text = [
    `Hi ${firstName},`,
    '',
    `Thanks for talking with our assistant on nxgp.io. The team has your note and will reach out shortly.`,
    '',
    `What you told us: ${lead.interest}`,
    '',
    `If you'd like to skip the back-and-forth, grab a time that works for you here:`,
    calendlyUrl,
    '',
    `Talk soon,`,
    `The Nx Growth Partners team`,
    `https://nxgp.io · hello@nxgp.io`,
  ].join('\n')

  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#FDFDFC;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#14161F">
  <div style="max-width:540px;margin:0 auto">
    <p style="font-size:15px;line-height:1.6">Hi ${esc(firstName)},</p>
    <p style="font-size:15px;line-height:1.6">Thanks for talking with our assistant on <a href="https://nxgp.io" style="color:#0000F4">nxgp.io</a>. The team has your note and will reach out shortly.</p>
    <p style="font-size:14px;line-height:1.6;background:#ECECFE;border-radius:12px;padding:12px 16px"><strong>What you told us:</strong> ${esc(lead.interest)}</p>
    <p style="font-size:15px;line-height:1.6">If you'd like to skip the back-and-forth, grab a time that works for you:</p>
    <p style="margin:24px 0"><a href="${esc(calendlyUrl)}" style="background:#0000F4;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:999px;display:inline-block">Book a 30-minute intro call</a></p>
    <p style="font-size:15px;line-height:1.6">Talk soon,<br/>The Nx Growth Partners team</p>
    <p style="font-size:12px;color:#8A8D96">Nx Growth Partners · <a href="https://nxgp.io" style="color:#8A8D96">nxgp.io</a> · <a href="mailto:hello@nxgp.io" style="color:#8A8D96">hello@nxgp.io</a><br/>You're receiving this one-time note because you shared your email with our site assistant.</p>
  </div>
</body></html>`

  try {
    const r = await fetch(`${base}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [lead.email],
        reply_to: replyTo,
        subject: 'Your intro call with Nx Growth Partners',
        text,
        html,
      }),
    })
    return r.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
