import { useState } from 'react'
import { ArrowRight, Check, CalendarDays, Link2, Mail, UserRound, Zap } from 'lucide-react'
import { cn } from '../../lib/cn'
import { sketch as copy } from '../../data/content'
import { useBooking } from '../BookingModal'
import type { Sketch, SketchStep } from '../../lib/sketch-types'

/**
 * The payoff: a visitor's workflow rendered as a first-pass agent design.
 *
 * Layout principle (v2, after "too confusing" feedback on the card grid):
 * the RUN reads as a run — one vertical timeline with a connecting spine,
 * numbered nodes and type-colored chips, ending at the periwinkle human
 * gate. Everything that annotates the run (integrations, metrics, the
 * architect's question) lives in a sidebar, visually subordinate.
 *
 * Default export so it can be lazy()-loaded behind the first submit.
 */

const D = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties

/** Type chips — each capability kind gets its own tint, so a run scans. */
const TYPE_CHIP: Record<SketchStep['type'] | 'trigger' | 'escalate', string> = {
  trigger: 'bg-accent text-white',
  read: 'border border-line bg-bg text-ink-soft',
  reason: 'bg-accent-wash text-accent-deep',
  act: 'bg-[#E7F8EC] text-[#1D8A46]',
  notify: 'bg-[#FFF3E4] text-[#B4671B]',
  escalate: 'bg-peri/15 text-peri',
}

function Node({
  n,
  kind,
  label,
  detail,
  last = false,
  delay,
}: {
  n: number
  kind: keyof typeof TYPE_CHIP
  label: string
  detail: string
  last?: boolean
  delay: number
}) {
  const guard = kind === 'escalate'
  return (
    <li className="grid grid-cols-[30px_1fr] gap-x-3">
      {/* marker + spine segment */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'pv-pop flex size-[30px] shrink-0 items-center justify-center rounded-full text-[0.72rem] font-800',
            guard
              ? 'border-2 border-peri bg-peri/10 text-peri'
              : kind === 'trigger'
                ? 'bg-accent text-white'
                : 'border border-line bg-surface text-ink-soft',
          )}
          style={D(delay)}
        >
          {guard ? <UserRound className="size-3.5" /> : n}
        </span>
        {!last && <span aria-hidden className="w-px flex-1 bg-line" />}
      </div>
      {/* the step */}
      <div className={cn('pv-in min-w-0', last ? 'pb-0' : 'pb-4')} style={D(delay + 0.06)}>
        <p className="flex flex-wrap items-center gap-2">
          <span className={cn('text-[0.9rem] font-800 leading-tight', guard ? 'text-peri' : 'text-ink')}>
            {label}
          </span>
          <span
            className={cn(
              'rounded-pill px-2 py-0.5 text-[0.56rem] font-700 uppercase tracking-[0.06em]',
              TYPE_CHIP[kind],
            )}
          >
            {kind}
          </span>
        </p>
        <p className="mt-1 max-w-[36rem] text-[0.85rem] leading-snug text-ink-soft">{detail}</p>
      </div>
    </li>
  )
}

/** Inline "email me this sketch" — also the lead-capture mechanic. */
function EmailMe({ sketchId }: { sketchId: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'recorded' | 'error'>('idle')

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
      const j = await r.json().catch(() => ({}))
      // honest state: the lead always lands; the email itself may be
      // deferred (provider not configured) — never claim an inbox delivery
      // that didn't happen
      setState(r.ok ? (j.emailed ? 'sent' : 'recorded') : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent' || state === 'recorded') {
    return (
      <p className="flex items-center gap-1.5 text-[0.85rem] font-600 text-ink-soft">
        <Check className="size-4 text-[#1D8A46]" />
        {state === 'sent' ? 'Sent — check your inbox.' : "Got it — the team will send it over shortly."}
      </p>
    )
  }
  return (
    <form onSubmit={submit} className="flex min-w-0 flex-wrap items-center gap-2">
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
  const delayFor = (i: number) => 0.15 + i * 0.14
  const gateDelay = delayFor(steps.length + 1)
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

          <div className="p-4 sm:p-6">
            <div className="pv-in" style={D(0)}>
              <p className="font-display text-[1.3rem] font-800 tracking-[-0.01em]">{sketch.name}</p>
              <p className="mt-1 max-w-[44rem] text-[0.92rem] leading-snug text-ink-soft">{sketch.summary}</p>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
              {/* ---- the run: one vertical timeline ---- */}
              <div className="min-w-0">
                <p className="mb-3 text-[0.6rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                  One run, start to finish
                </p>
                <ol className="flex flex-col">
                  <Node
                    n={1}
                    kind="trigger"
                    label={sketch.trigger?.label ?? ''}
                    detail={sketch.trigger?.detail ?? ''}
                    delay={delayFor(0)}
                  />
                  {steps.map((s, i) => (
                    <Node
                      key={i}
                      n={i + 2}
                      kind={s.type}
                      label={s.label}
                      detail={s.detail}
                      delay={delayFor(i + 1)}
                    />
                  ))}
                  <Node
                    n={steps.length + 2}
                    kind="escalate"
                    label="A human steps in"
                    detail={`${sketch.guardrail?.condition ?? ''} → ${sketch.guardrail?.action ?? ''}`}
                    last
                    delay={gateDelay}
                  />
                </ol>
              </div>

              {/* ---- the margins: what annotates the run ---- */}
              <div className="flex min-w-0 flex-col gap-4 lg:border-l lg:border-line lg:pl-8">
                <div className="pv-in" style={D(gateDelay + 0.15)}>
                  <p className="text-[0.6rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                    Likely integrations
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(sketch.integrations ?? []).map((sys) => (
                      <span
                        key={sys}
                        className="rounded-pill border border-line bg-bg/60 px-2.5 py-1 text-[0.75rem] font-600 text-ink-soft"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pv-in" style={D(gateDelay + 0.28)}>
                  <p className="text-[0.6rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                    Worth measuring
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {(sketch.metrics ?? []).map((m) => (
                      <li key={m} className="flex items-start gap-1.5 text-[0.82rem] font-600 text-ink-soft">
                        <Check className="mt-[2px] size-3.5 shrink-0 text-[#1D8A46]" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pv-in rounded-[12px] bg-accent-wash/60 px-3.5 py-3" style={D(gateDelay + 0.4)}>
                  <p className="flex items-center gap-1.5 text-[0.6rem] font-800 uppercase tracking-[0.09em] text-accent-deep">
                    <Zap className="size-3" /> The question we'd ask next
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-snug text-ink">{sketch.clarify}</p>
                </div>

                {sketch.feasibility === 'ambitious' && sketch.feasibilityNote && (
                  <p className="pv-in text-[0.78rem] font-600 leading-snug text-ink-faint" style={D(gateDelay + 0.5)}>
                    Why "ambitious": {sketch.feasibilityNote}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* the ask */}
        <div className="pv-in mt-4 flex flex-wrap items-center gap-3" style={D(gateDelay + 0.6)}>
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
        <p className="pv-in mt-3 max-w-[52rem] text-[0.75rem] font-600 leading-relaxed text-ink-faint" style={D(gateDelay + 0.7)}>
          {copy.footnote}
        </p>
      </div>
    </div>
  )
}
