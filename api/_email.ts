/**
 * Follow-up email — sent immediately after the assistant captures a lead.
 * One transactional email: a recap of what they told us + the booking link.
 * No sequences, no marketing. Speed-to-follow-up is the point: the email
 * lands while they're still on the site.
 *
 * Provider: Resend (plain fetch, no SDK — this runs on the Edge runtime).
 * Env:  RESEND_API_KEY   — if unset, sending is skipped gracefully
 *       EMAIL_FROM       — verified sender (default: Gurjeet Nijjar <gurjeet@nxgp.io>)
 *       EMAIL_REPLY_TO   — default gurjeet@nxgp.io
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
  const from = process.env.EMAIL_FROM || 'Gurjeet Nijjar <gurjeet@nxgp.io>'
  const replyTo = process.env.EMAIL_REPLY_TO || 'gurjeet@nxgp.io'
  const firstName = (lead.name || '').trim().split(/\s+/)[0] || 'there'

  const text = [
    `Hi ${firstName},`,
    '',
    `Thanks for talking with our assistant on nxgp.io — the team has your note and will reach out shortly.`,
    '',
    `What you told us: ${lead.interest}`,
    '',
    `If you'd like to skip the back-and-forth, grab a time that works for you here:`,
    calendlyUrl,
    '',
    `Talk soon,`,
    `Gurjeet Nijjar`,
    `Nx Growth Partners`,
    `https://nxgp.io · hello@nxgp.io`,
  ].join('\n')

  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#FDFDFC;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#14161F">
  <div style="max-width:540px;margin:0 auto">
    <p style="font-size:15px;line-height:1.6">Hi ${esc(firstName)},</p>
    <p style="font-size:15px;line-height:1.6">Thanks for talking with our assistant on <a href="https://nxgp.io" style="color:#0000F4">nxgp.io</a> — the team has your note and will reach out shortly.</p>
    <p style="font-size:14px;line-height:1.6;background:#ECECFE;border-radius:12px;padding:12px 16px"><strong>What you told us:</strong> ${esc(lead.interest)}</p>
    <p style="font-size:15px;line-height:1.6">If you'd like to skip the back-and-forth, grab a time that works for you:</p>
    <p style="margin:24px 0"><a href="${esc(calendlyUrl)}" style="background:#0000F4;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:999px;display:inline-block">Book a 30-minute intro call</a></p>
    <p style="font-size:15px;line-height:1.6">Talk soon,<br/>Gurjeet Nijjar<br/><span style="color:#8A8D96">Nx Growth Partners</span></p>
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

/* ---------------- "Sketch my agent" delivery ---------------- */

type SketchForEmail = {
  name?: string
  summary?: string
  trigger?: { label: string; detail: string }
  steps?: { type: string; label: string; detail: string }[]
  guardrail?: { condition: string; action: string }
  integrations?: string[]
  metrics?: string[]
  clarify?: string
  feasibility?: string
  feasibilityNote?: string
}

/**
 * Sends the visitor their agent sketch — the take-away artifact. Every field
 * is model- or visitor-derived, so everything is escaped before HTML.
 */
export async function sendSketchEmail(
  to: { name?: string; email: string },
  sketch: SketchForEmail,
  description: string,
  shareUrl: string,
  calendlyUrl: string,
): Promise<FollowupResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) return 'skipped'

  const base = process.env.EMAIL_BASE_URL || 'https://api.resend.com'
  const from = process.env.EMAIL_FROM || 'Gurjeet Nijjar <gurjeet@nxgp.io>'
  const replyTo = process.env.EMAIL_REPLY_TO || 'gurjeet@nxgp.io'
  const firstName = (to.name || '').trim().split(/\s+/)[0] || 'there'
  const steps = sketch.steps ?? []

  const text = [
    `Hi ${firstName},`,
    '',
    `Here's the agent sketch we drew from your description — a first pass, and the starting point of a real scoping conversation.`,
    '',
    `You described: "${description}"`,
    '',
    `# ${sketch.name}`,
    `${sketch.summary}`,
    '',
    `Trigger: ${sketch.trigger?.label} — ${sketch.trigger?.detail}`,
    ...steps.map((s, i) => `${i + 1}. [${s.type}] ${s.label} — ${s.detail}`),
    `Human gate: ${sketch.guardrail?.condition} → ${sketch.guardrail?.action}`,
    '',
    `Likely integrations: ${(sketch.integrations ?? []).join(', ')}`,
    `Worth measuring: ${(sketch.metrics ?? []).join(' · ')}`,
    '',
    `The question we'd ask next: ${sketch.clarify}`,
    '',
    `View it live: ${shareUrl}`,
    `Talk it through with the team (30 min): ${calendlyUrl}`,
    '',
    `— Gurjeet Nijjar, Nx Growth Partners`,
    `https://nxgp.io · hello@nxgp.io`,
  ].join('\n')

  const stepRows = steps
    .map(
      (s, i) =>
        `<tr><td style="padding:6px 10px 6px 0;color:#8A8D96;font-size:12px;white-space:nowrap;vertical-align:top">${i + 1} · ${esc(s.type)}</td><td style="padding:6px 0;font-size:14px"><strong>${esc(s.label)}</strong> — ${esc(s.detail)}</td></tr>`,
    )
    .join('')

  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#FDFDFC;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#14161F">
  <div style="max-width:560px;margin:0 auto">
    <p style="font-size:15px;line-height:1.6">Hi ${esc(firstName)},</p>
    <p style="font-size:15px;line-height:1.6">Here's the agent sketch we drew from your description — a first pass, and the starting point of a real scoping conversation.</p>
    <div style="border:1px solid #E8E6DF;border-radius:16px;padding:20px 22px;background:#ffffff">
      <p style="margin:0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A8D96">Agent sketch</p>
      <p style="margin:4px 0 8px;font-size:12px;color:#8A8D96">You described: &ldquo;${esc(description)}&rdquo;</p>
      <p style="margin:6px 0 2px;font-size:19px;font-weight:700">${esc(sketch.name ?? '')}</p>
      <p style="margin:0 0 12px;font-size:14px;color:#565963">${esc(sketch.summary ?? '')}</p>
      <p style="margin:0;font-size:14px"><strong>Trigger:</strong> ${esc(sketch.trigger?.label ?? '')} — ${esc(sketch.trigger?.detail ?? '')}</p>
      <table style="border-collapse:collapse;margin:8px 0">${stepRows}</table>
      <p style="margin:0;font-size:14px;background:#ECECFE;border-radius:10px;padding:10px 14px"><strong>Human gate:</strong> ${esc(sketch.guardrail?.condition ?? '')} → ${esc(sketch.guardrail?.action ?? '')}</p>
      <p style="margin:12px 0 0;font-size:13px;color:#565963"><strong>Likely integrations:</strong> ${esc((sketch.integrations ?? []).join(', '))}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#565963"><strong>Worth measuring:</strong> ${esc((sketch.metrics ?? []).join(' · '))}</p>
      <p style="margin:12px 0 0;font-size:13px;color:#565963"><em>The question we'd ask next: ${esc(sketch.clarify ?? '')}</em></p>
    </div>
    <p style="margin:20px 0"><a href="${esc(calendlyUrl)}" style="background:#0000F4;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:999px;display:inline-block">Talk it through — book 30 minutes</a></p>
    <p style="font-size:13px;color:#565963">View it live: <a href="${esc(shareUrl)}" style="color:#0000F4">${esc(shareUrl)}</a></p>
    <p style="font-size:12px;color:#8A8D96">Nx Growth Partners · <a href="https://nxgp.io" style="color:#8A8D96">nxgp.io</a> · <a href="mailto:hello@nxgp.io" style="color:#8A8D96">hello@nxgp.io</a><br/>You're receiving this one-time note because you asked for your sketch by email.</p>
  </div>
</body></html>`

  try {
    const r = await fetch(`${base}/emails`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to.email],
        reply_to: replyTo,
        subject: `Your agent sketch: ${(sketch.name ?? 'first pass').slice(0, 60)}`,
        text,
        html,
      }),
    })
    return r.ok ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
