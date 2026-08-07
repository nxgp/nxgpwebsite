import { useReveal } from '../hooks/useReveal'
import { shift } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'

/**
 * THE SHIFT — why now. The three operational frictions AI is exposing, and
 * the market numbers (with sources) showing most companies are stuck between
 * pilots and production. Content from the company deck.
 */
export function Shift() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="the-shift" className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={shift.kicker} title={shift.h2} sub={shift.sub} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {shift.frictions.map((f) => (
            <div data-reveal key={f.label}>
              <Card interactive={false} className="h-full p-7">
                <p className="text-[0.72rem] font-800 uppercase tracking-[0.08em] text-accent-deep">
                  {f.label}
                </p>
                <h3 className="t-h3 mt-3 text-[1.35rem]">{f.title}</h3>
                <p className="mt-2.5 text-[0.96rem] leading-relaxed text-ink-soft">{f.body}</p>
              </Card>
            </div>
          ))}
        </div>

        <div
          data-reveal
          className="mt-6 grid gap-x-8 gap-y-8 rounded-card bg-navy px-7 py-9 text-white shadow-lg sm:grid-cols-2 lg:grid-cols-4"
        >
          {shift.stats.map((s) => (
            <div key={s.source}>
              <span className="block font-display text-[2.4rem] font-800 leading-none tracking-[-0.02em] text-au-mint">
                {s.value}
              </span>
              <p className="mt-3 text-[0.92rem] leading-snug text-white/75">{s.body}</p>
              <p className="mt-2 text-[0.7rem] font-700 uppercase tracking-[0.08em] text-white/40">
                {s.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
