import { useState } from 'react'
import { ArrowRight, Check, CalendarDays, Link2, Mail, UserRound, Zap } from 'lucide-react'
import { cn } from '../../lib/cn'
import { sketch as copy } from '../../data/content'
import { useBooking } from '../BookingModal'
import type { Sketch, SketchStep } from '../../lib/sketch-types'

/**
 * The payoff (v3): the visitor's workflow shown as THEIR agent already
 * running in Agent Hub — the same visual formula as the portfolio vignette
 * Ravi approved. Three bands inside the designer window:
 *
 *   1. The backbone — a compact arrowed chain (shape at a glance)
 *   2. A simulated run — each step fires as a feed row (the readable story)
 *   3. The dark punchline bar (guarded · logged · human gate armed)
 *
 * Margins (integrations / metrics / the architect's question) sit in a
 * subordinate side column. Not a document; a scene.
 *
 * Default export so it can be lazy()-loaded behind the first submit.
 */

const D = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties

const dotGrid = {
  background:
    'radial-gradient(circle, #D9D9E8 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(135deg, #F7F7FF 0%, #FDFDFC 70%)',
}

const TYPE_CHIP: Record<SketchStep['type'] | 'trigger' | 'escalate', string> = {
  trigger: 'bg-accent text-white',
  read: 'border border-line bg-bg text-ink-soft',
  reason: 'bg-accent-wash text-accent-deep',
  act: 'bg-[#E7F8EC] text-[#1D8A46]',
  notify: 'bg-[#FFF3E4] text-[#B4671B]',
  escalate: 'bg-peri/15 text-peri',
}

/** One node in the backbone chain — ForgeViz cell DNA. */
function ChainCell({
  n,
  label,
  sub,
  guard = false,
  accent = false,
  delay,
}: {
  n: number
  label: string
  sub: string
  guard?: boolean
  accent?: boolean
  delay: number
}) {
  return (
    <div
      className={cn(
        'pv-pop min-w-0 flex-1 rounded-[9px] border px-2.5 py-1.5 shadow-sm',
        guard ? 'border-peri bg-peri/[0.06]' : accent ? 'border-accent/50 bg-surface' : 'border-line bg-surface',
      )}
      style={D(delay)}
    >
      <p className={cn('truncate text-[0.7rem] font-800', guard ? 'text-peri' : 'text-ink')}>
        <span className="lg:hidden">{n}. </span>
        {label}
      </p>
      <p className="truncate text-[0.58rem] font-600 text-ink-faint">{sub}</p>
    </div>
  )
}

/** One row of the simulated run — TeraViz action-row DNA. */
function RunRow({
  icon,
  text,
  chip,
  chipKind,
  guard = false,
  delay,
}: {
  icon: React.ReactNode
  text: React.ReactNode
  chip: string
  chipKind: keyof typeof TYPE_CHIP
  guard?: boolean
  delay: number
}) {
  return (
    <div
      className={cn(
        'pv-in flex items-center gap-2 rounded-[9px] border px-2.5 py-2',
        guard ? 'border-peri/60 bg-peri/[0.07]' : 'border-line bg-surface',
      )}
      style={D(delay)}
    >
      <span className="shrink-0">{icon}</span>
      <span className={cn('min-w-0 flex-1 text-[0.8rem] leading-snug', guard ? 'font-600 text-ink' : 'text-ink')}>
        {text}
      </span>
      <span
        className={cn(
          'shrink-0 rounded-pill px-2 py-0.5 text-[0.54rem] font-700 uppercase tracking-[0.06em]',
          TYPE_CHIP[chipKind],
        )}
      >
        {chip}
      </span>
    </div>
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
      setState(r.ok ? (j.emailed ? 'sent' : 'recorded') : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent' || state === 'recorded') {
    return (
      <p className="flex items-center gap-1.5 text-[0.85rem] font-600 text-ink-soft">
        <Check className="size-4 text-[#1D8A46]" />
        {state === 'sent' ? 'Sent — check your inbox.' : 'Got it — the team will send it over shortly.'}
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
  const shareUrl = sketchId ? `https://nxgp.io/sketch?s=${sketchId}` : null

  // choreography: chain assembles first, then the run plays through it
  const chainDelay = (i: number) => 0.1 + i * 0.12
  const runStart = chainDelay(steps.length + 2) + 0.15
  const runDelay = (i: number) => runStart + i * 0.35
  const gateDelay = runDelay(steps.length + 1)

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
        {/* the Agent Hub window */}
        <div className="flex flex-col overflow-hidden rounded-inner border border-line bg-surface shadow-soft">
          <div className="flex items-center gap-2.5 border-b border-line bg-bg/50 px-3.5 py-2.5">
            <div className="win-dots flex shrink-0 gap-1.5">
              <span style={{ background: '#FF5F57' }} />
              <span style={{ background: '#FEBC2E' }} />
              <span style={{ background: '#28C840' }} />
            </div>
            <span className="min-w-0 truncate text-[0.62rem] font-700 uppercase tracking-[0.09em] text-ink-faint">
              Agent Hub · {sketch.name}
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

          <div className="flex flex-col gap-3.5 p-3.5 sm:p-5" style={dotGrid}>
            <div className="pv-in" style={D(0)}>
              <p className="font-display text-[1.2rem] font-800 tracking-[-0.01em]">{sketch.name}</p>
              <p className="mt-0.5 max-w-[46rem] text-[0.85rem] leading-snug text-ink-soft">{sketch.summary}</p>
            </div>

            {/* ---- band 1: the backbone chain ---- */}
            <div>
              <p className="mb-1.5 text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                The backbone
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:flex lg:items-stretch lg:gap-1">
                <div className="flex items-center gap-1 lg:flex-1">
                  <ChainCell
                    n={1}
                    label={sketch.trigger?.label ?? ''}
                    sub="trigger"
                    accent
                    delay={chainDelay(0)}
                  />
                  <span className="pv-in hidden shrink-0 text-[0.7rem] font-700 text-peri lg:inline" style={D(chainDelay(0) + 0.08)}>
                    →
                  </span>
                </div>
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1 lg:flex-1">
                    <ChainCell
                      n={i + 2}
                      label={s.label}
                      sub={s.systems?.[0] ?? s.type}
                      delay={chainDelay(i + 1)}
                    />
                    <span
                      className="pv-in hidden shrink-0 text-[0.7rem] font-700 text-peri lg:inline"
                      style={D(chainDelay(i + 1) + 0.08)}
                    >
                      →
                    </span>
                  </div>
                ))}
                <div className="flex items-center lg:flex-1">
                  <ChainCell
                    n={steps.length + 2}
                    label="Human gate"
                    sub="escalation"
                    guard
                    delay={chainDelay(steps.length + 1)}
                  />
                </div>
              </div>
            </div>

            {/* ---- band 2 + margins ---- */}
            <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr] lg:gap-6">
              {/* the simulated run */}
              <div className="min-w-0">
                <p className="mb-1.5 flex items-center gap-1.5 text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                  <i className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden /> Simulated run
                </p>
                <div className="flex flex-col gap-1.5">
                  <RunRow
                    icon={<Zap className="size-3.5 text-accent" />}
                    text={sketch.trigger?.detail ?? ''}
                    chip="trigger"
                    chipKind="trigger"
                    delay={runDelay(0)}
                  />
                  {steps.map((s, i) => (
                    <RunRow
                      key={i}
                      icon={<Check className="size-3.5 text-[#1D8A46]" />}
                      text={
                        <>
                          {s.detail}
                          {s.systems && s.systems.length > 0 && (
                            <span className="text-ink-faint"> · {s.systems.join(' + ')}</span>
                          )}
                        </>
                      }
                      chip={s.type}
                      chipKind={s.type}
                      delay={runDelay(i + 1)}
                    />
                  ))}
                  <RunRow
                    icon={<UserRound className="size-3.5 text-peri" />}
                    text={
                      <>
                        <span className="font-700 text-peri">{sketch.guardrail?.condition}</span>
                        {' → '}
                        {sketch.guardrail?.action}
                      </>
                    }
                    chip="human"
                    chipKind="escalate"
                    guard
                    delay={gateDelay}
                  />
                </div>

                {/* the punchline */}
                <div
                  className="pv-in mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-inner bg-ink px-3 py-2 text-white"
                  style={D(gateDelay + 0.4)}
                >
                  <span className="text-[0.68rem] font-700">
                    {steps.length + 1} steps · {(sketch.integrations ?? []).length} systems · human gate armed
                  </span>
                  <span className="text-[0.68rem] font-700 text-au-mint">guarded · logged · auditable</span>
                </div>
              </div>

              {/* the margins */}
              <div className="flex min-w-0 flex-col gap-3">
                <div className="pv-in rounded-[10px] border border-line bg-surface/80 px-3 py-2.5" style={D(runStart + 0.2)}>
                  <p className="text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                    Wired into
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(sketch.integrations ?? []).map((sys) => (
                      <span
                        key={sys}
                        className="rounded-pill border border-line bg-bg/70 px-2.5 py-1 text-[0.72rem] font-600 text-ink-soft"
                      >
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pv-in rounded-[10px] border border-line bg-surface/80 px-3 py-2.5" style={D(runStart + 0.4)}>
                  <p className="text-[0.56rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
                    Worth measuring
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {(sketch.metrics ?? []).map((m) => (
                      <li key={m} className="flex items-start gap-1.5 text-[0.78rem] font-600 text-ink-soft">
                        <Check className="mt-[2px] size-3.5 shrink-0 text-[#1D8A46]" /> {m}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pv-in rounded-[10px] bg-accent-wash/70 px-3 py-2.5" style={D(gateDelay + 0.2)}>
                  <p className="text-[0.56rem] font-800 uppercase tracking-[0.09em] text-accent-deep">
                    The question we'd ask next
                  </p>
                  <p className="mt-1 text-[0.82rem] leading-snug text-ink">{sketch.clarify}</p>
                </div>

                {sketch.feasibility === 'ambitious' && sketch.feasibilityNote && (
                  <p className="pv-in text-[0.75rem] font-600 leading-snug text-ink-faint" style={D(gateDelay + 0.3)}>
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
