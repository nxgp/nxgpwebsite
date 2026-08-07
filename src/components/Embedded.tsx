import { Check, X, ArrowRight } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { embedded } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'

export function Embedded() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={embedded.kicker} title={embedded.h2} sub={embedded.sub} />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div data-reveal className="rounded-card border border-accent/25 bg-accent-wash/50 p-7 shadow-sm">
            <p className="text-[0.78rem] font-800 uppercase tracking-[0.06em] text-accent-deep">{embedded.embed.label}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {embedded.embed.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-white"><Check className="size-3" /></span>
                  <span className="text-[0.98rem] font-600 text-ink">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="rounded-card border border-line bg-surface p-7 shadow-sm">
            <p className="text-[0.78rem] font-800 uppercase tracking-[0.06em] text-ink-faint">{embedded.handoff.label}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {embedded.handoff.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-faint"><X className="size-3" /></span>
                  <span className="text-[0.98rem] font-500 text-ink-soft line-through decoration-ink-faint/40">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal className="mt-6 flex flex-col items-center gap-4 rounded-card bg-ink px-6 py-7 text-white sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {embedded.cadence.map((c, i) => (
              <span key={c} className="flex items-center gap-2">
                <span className="rounded-pill bg-white/10 px-4 py-1.5 text-[0.86rem] font-700">{c}</span>
                {/* arrows are hidden once the chips wrap — a trailing arrow
                    pointing at a line break reads as broken */}
                {i < embedded.cadence.length - 1 && (
                  <ArrowRight className="hidden size-4 text-white/40 sm:block" />
                )}
              </span>
            ))}
            <span className="rounded-pill bg-accent px-3 py-1.5 text-[0.78rem] font-700 sm:ml-1">every week</span>
          </div>
          <p className="text-center text-[0.95rem] text-white/60 sm:text-right">{embedded.cadenceNote}</p>
        </div>
      </div>
    </section>
  )
}
