import { useState } from 'react'
import { ArrowRight, Check, CalendarDays, Link2, Mail } from 'lucide-react'
import { cn } from '../../lib/cn'
import { sketch as copy } from '../../data/content'
import { useBooking } from '../BookingModal'
import type { Sketch } from '../../lib/sketch-types'

/**
 * The payoff: a visitor's workflow rendered as a first-pass agent design, in
 * the exact visual language of the Agent Hub vignette — studio backdrop,
 * cropped wordmark, chain cells with the periwinkle human-gate, assembling
 * with the same staggered choreography.
 *
 * Default export so it can be lazy()-loaded behind the first submit.
 */

const D = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties

const TYPE_LABEL: Record<string, string> = {
  read: 'read',
  reason: 'reason',
  act: 'act',
  notify: 'notify',
}

function Cell({
  n,
  label,
  detail,
  tag,
  guard = false,
  delay,
}: {
  n: number
  label: string
  detail: string
  tag?: string
  guard?: boolean
  delay: number
}) {
  return (
    <div
      className={cn(
        'pv-pop min-w-0 rounded-[10px] border bg-surface px-3 py-2 shadow-sm',
        guard ? 'border-peri' : 'border-line',
      )}
      style={D(delay)}
    >
      <p className="flex items-baseline gap-1.5">
        <span className={cn('text-[0.62rem] font-800 tabular-nums', guard ? 'text-peri' : 'text-ink-faint')}>
          {n}
        </span>
        <span className={cn('truncate text-[0.8rem] font-800', guard ? 'text-peri' : 'text-ink')}>{label}</span>
        {tag && (
          <span className="ml-auto shrink-0 rounded-[5px] bg-bg px-1.5 py-0.5 text-[0.52rem] font-700 uppercase tracking-[0.05em] text-ink-faint">
            {tag}
          </span>
        )}
      </p>
      <p className="mt-0.5 text-[0.7rem] font-600 leading-snug text-ink-soft">{detail}</p>
    </div>
  )
}

/** Inline "email me this sketch" — also the lead-capture mechanic. */
function EmailMe({ sketchId }: { sketchId: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || state === 'busy') return
    setState('busy')
    try {
      const r = await fetch('/api/sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sketchId, email }),
      })
      setState(r.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p className="flex items-center gap-1.5 text-[0.85rem] font-600 text-ink-soft">
        <Check className="size-4 text-[#1D8A46]" /> Sent — check your inbox.
      </p>
    )
  }
  return (
    <form onSubmit={submit} className="flex min-w-0 items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address to send this sketch to"
        className="h-[42px] w-[190px] min-w-0 rounded-pill border border-line bg-surface px-4 text-[0.9rem] outline-none transition-colors focus:border-accent/50"
      />
      <button
        type="submit"
        disabled={state === 'busy'}
        className="inline-flex h-[42px] shrink-0 items-center gap-2 rounded-pill border border-line bg-surface px-4 text-[0.9rem] font-700 transition-colors hover:border-ink/20 disabled:opacity-50"
      >
        <Mail className="size-4" /> Email me this sketch
      </button>
      {state === 'error' && <span className="text-[0.8rem] font-600 text-[#B4671B]">Try again?</span>}
    </form>
  )
}

export default function AgentCanvas({ sketch, sketchId }: { sketch: Sketch; sketchId: string | null }) {
  const openBooking = useBooking()
  const [copied, setCopied] = useState(false)
  const steps = sketch.steps ?? []
  // trigger + steps + guardrail, one continuous choreography
  const delayFor = (i: number) => 0.15 + i * 0.16
  const guardDelay = delayFor(steps.length + 1)
  const shareUrl = sketchId ? `https://nxgp.io/sketch?s=${sketchId}` : null

  function copyLink() {
    if (!shareUrl) return
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div
      className="relative overflow-hidden rounded-inner border border-line shadow-sm"
      style={{ background: 'linear-gradient(160deg, #EEF0F8 0%, #DFE3F2 55%, #CFD4EA 100%)' }}
    >
      {/* studio wordmark — the generated agent's name */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 top-2 select-none whitespace-nowrap font-display text-[2.6rem] font-800 tracking-[-0.04em] text-navy/[0.05] sm:text-[4rem]"
      >
        {(sketch.name ?? 'YOUR AGENT').toUpperCase()}
      </span>

      <div className="relative p-3 sm:p-6">
        {/* the designer window */}
        <div className="flex flex-col overflow-hidden rounded-inner border border-line bg-surface shadow-soft">
          <div className="flex items-center gap-2.5 border-b border-line bg-bg/50 px-3.5 py-2.5">
            <div className="win-dots flex shrink-0 gap-1.5">
              <span style={{ background: '#FF5F57' }} />
              <span style={{ background: '#FEBC2E' }} />
              <span style={{ background: '#28C840' }} />
            </div>
            <span className="min-w-0 truncate text-[0.62rem] font-700 uppercase tracking-[0.09em] text-ink-faint">
              Agent designer · first draft
            </span>
            <span
              className={cn(
                'ml-auto shrink-0 rounded-pill px-2 py-0.5 text-[0.62rem] font-700',
                sketch.feasibility === 'ambitious'
                  ? 'bg-[#FFF3E4] text-[#B4671B]'
                  : 'bg-accent-wash text-accent-deep',
              )}
            >
              {sketch.feasibility === 'ambitious' ? 'ambitious — worth a call' : 'standard build'}
            </span>
          </div>

          <div className="flex flex-col gap-3.5 p-3.5 sm:p-5">
            <div className="pv-in" style={D(0)}>
              <p className="font-display text-[1.15rem] font-800 tracking-[-0.01em]">{sketch.name}</p>
              <p className="mt-0.5 text-[0.85rem] leading-snug text-ink-soft">{sketch.summary}</p>
            </div>

            {/* the backbone: trigger → steps → human gate */}
            <div>
              <p className="mb-1.5 text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                One run, start to finish
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                <Cell n={1} label={sketch.trigger?.label ?? ''} detail={sketch.trigger?.detail ?? ''} tag="trigger" delay={delayFor(0)} />
                {steps.map((s, i) => (
                  <Cell
                    key={i}
                    n={i + 2}
                    label={s.label}
                    detail={s.detail}
                    tag={TYPE_LABEL[s.type]}
                    delay={delayFor(i + 1)}
                  />
                ))}
                <Cell
                  n={steps.length + 2}
                  label="Human gate"
                  detail={`${sketch.guardrail?.condition ?? ''} → ${sketch.guardrail?.action ?? ''}`}
                  tag="escalate"
                  guard
                  delay={guardDelay}
                />
              </div>
            </div>

            {/* architect's margins: integrations · metrics */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="pv-in rounded-[10px] border border-line bg-bg/50 px-3 py-2.5" style={D(guardDelay + 0.2)}>
                <p className="text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                  Likely integrations
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(sketch.integrations ?? []).map((sys) => (
                    <span key={sys} className="rounded-pill border border-line bg-surface px-2.5 py-1 text-[0.72rem] font-600 text-ink-soft">
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pv-in rounded-[10px] border border-line bg-bg/50 px-3 py-2.5" style={D(guardDelay + 0.35)}>
                <p className="text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">Worth measuring</p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {(sketch.metrics ?? []).map((m) => (
                    <li key={m} className="flex items-start gap-1.5 text-[0.78rem] font-600 text-ink-soft">
                      <Check className="mt-[2px] size-3.5 shrink-0 text-[#1D8A46]" /> {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* the architect's question — proof of thinking, hook for the call */}
            <div className="pv-in flex items-start gap-2.5 border-l-2 border-accent pl-3" style={D(guardDelay + 0.5)}>
              <p className="text-[0.85rem] leading-snug text-ink">
                <span className="font-700">The question we'd ask next: </span>
                {sketch.clarify}
              </p>
            </div>
            {sketch.feasibility === 'ambitious' && sketch.feasibilityNote && (
              <p className="pv-in -mt-1 text-[0.78rem] font-600 text-ink-faint" style={D(guardDelay + 0.6)}>
                Why "ambitious": {sketch.feasibilityNote}
              </p>
            )}
          </div>
        </div>

        {/* the ask */}
        <div className="pv-in mt-4 flex flex-wrap items-center gap-3" style={D(guardDelay + 0.7)}>
          <button
            onClick={openBooking}
            className="inline-flex h-[42px] items-center gap-2 rounded-pill bg-ink px-5 text-[0.9rem] font-700 text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <CalendarDays className="size-4" /> Want us to build this? Book a call
            <ArrowRight className="size-4" />
          </button>
          {sketchId && <EmailMe sketchId={sketchId} />}
          {shareUrl && (
            <button
              onClick={copyLink}
              className="inline-flex h-[42px] items-center gap-2 rounded-pill border border-line bg-surface px-4 text-[0.9rem] font-700 transition-colors hover:border-ink/20"
            >
              <Link2 className="size-4" /> {copied ? 'Copied!' : 'Copy link'}
            </button>
          )}
        </div>
        <p className="pv-in mt-3 max-w-[52rem] text-[0.75rem] font-600 leading-relaxed text-ink-faint" style={D(guardDelay + 0.8)}>
          {copy.footnote}
        </p>
      </div>
    </div>
  )
}
