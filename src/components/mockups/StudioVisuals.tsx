import {
  Code2,
  Send,
  Megaphone,
  Settings2,
  ShieldCheck,
  Lock,
  Database,
  ScrollText,
  Boxes,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const shell =
  'relative aspect-[4/3.4] w-full overflow-hidden rounded-card border border-line bg-surface p-6 shadow-soft'

/** State 1 — one internal fleet feeding every studio function. */
export function FleetVisual() {
  const fns = [
    { icon: Code2, label: 'Engineering' },
    { icon: Send, label: 'Outreach' },
    { icon: Megaphone, label: 'Marketing' },
    { icon: Settings2, label: 'Operations' },
  ]
  return (
    <div className={shell}>
      <div className="grid-faint absolute inset-0 opacity-[0.5]" />
      <div className="relative flex h-full flex-col">
        <div className="mx-auto flex items-center gap-2 rounded-pill bg-ink px-4 py-2 text-white shadow-soft">
          <span className="size-2 animate-pulse rounded-full bg-au-mint" />
          <span className="text-[0.85rem] font-700">Internal agent fleet</span>
        </div>
        <svg className="mx-auto my-1 h-10 w-[78%]" viewBox="0 0 300 48" fill="none" aria-hidden>
          {[40, 113, 187, 260].map((x) => (
            <path key={x} d={`M150 0 C150 24 ${x} 14 ${x} 48`} stroke="var(--color-accent)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 4" />
          ))}
        </svg>
        <div className="mt-auto grid grid-cols-2 gap-2.5">
          {fns.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5 rounded-inner border border-line bg-bg/60 px-3 py-2.5">
              <span className="flex size-8 items-center justify-center rounded-[9px] bg-accent-wash text-accent-deep">
                <f.icon className="size-4" />
              </span>
              <span className="text-[0.82rem] font-700">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** State 2 — autonomy tiers, with a human gate above tier. */
export function GateVisual() {
  const tiers = [
    { t: 'T0', label: 'Read & draft', auto: true },
    { t: 'T1', label: 'Act in sandbox', auto: true },
    { t: 'T2', label: 'Ship internal', auto: true },
    { t: 'T3', label: 'Send · spend · publish', auto: false },
  ]
  return (
    <div className={shell}>
      <div className="relative flex h-full flex-col gap-2.5">
        {tiers.map((tier) => (
          <div key={tier.t} className={cn('flex items-center gap-3 rounded-inner border px-3.5 py-3', tier.auto ? 'border-line bg-bg/50' : 'border-[#E08A3B]/40 bg-[#FFF7EF]')}>
            <span className={cn('flex size-8 items-center justify-center rounded-[9px] text-[0.78rem] font-800', tier.auto ? 'bg-accent-wash text-accent-deep' : 'bg-[#E08A3B]/15 text-[#B96C1E]')}>
              {tier.t}
            </span>
            <span className="text-[0.86rem] font-700">{tier.label}</span>
            {tier.auto ? (
              <span className="ml-auto text-[0.72rem] font-700 text-accent-deep">auto</span>
            ) : (
              <span className="ml-auto flex items-center gap-1.5 rounded-pill bg-ink px-2.5 py-1 text-[0.7rem] font-700 text-white">
                <ShieldCheck className="size-3.5" /> waits for a person
              </span>
            )}
          </div>
        ))}
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-[0.74rem] font-600 text-ink-faint">
          <Lock className="size-3.5" /> every consequential action — signed and logged
        </p>
      </div>
    </div>
  )
}

/** State 3 — one shared spine under every company. */
export function SpineVisual() {
  const cos = ['Mentera', 'Convey', 'Logbook', 'Koitel']
  const spine = [
    { icon: ShieldCheck, label: 'Auth' },
    { icon: Database, label: 'Data' },
    { icon: ScrollText, label: 'Audit' },
    { icon: Boxes, label: 'Isolation' },
  ]
  return (
    <div className={shell}>
      <div className="relative flex h-full flex-col">
        <div className="grid grid-cols-4 gap-2">
          {cos.map((c) => (
            <div key={c} className="rounded-inner border border-line bg-bg/60 px-2 py-3 text-center text-[0.74rem] font-700">{c}</div>
          ))}
        </div>
        <svg className="my-2 h-8 w-full" viewBox="0 0 300 32" aria-hidden>
          {[37, 112, 187, 262].map((x) => (
            <line key={x} x1={x} y1="0" x2="150" y2="32" stroke="var(--color-line)" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="rounded-inner bg-ink p-4 shadow-soft">
          <p className="mb-3 text-center text-[0.72rem] font-700 uppercase tracking-[0.08em] text-white/55">One operating spine</p>
          <div className="grid grid-cols-4 gap-2">
            {spine.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5">
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-white/10 text-au-mint">
                  <s.icon className="size-4" />
                </span>
                <span className="text-[0.66rem] font-700 text-white/80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const studioVisuals = [FleetVisual, GateVisual, SpineVisual]
