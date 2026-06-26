import { useReveal } from '../hooks/useReveal'
import { outcomes } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'

export function Outcomes() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="outcomes" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader kicker={outcomes.kicker} title={outcomes.h2} sub={outcomes.sub} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {outcomes.items.map((o) => (
            <div data-reveal key={o.tag}>
              <Card className="flex h-full flex-col p-7">
                <span className="self-start rounded-pill bg-accent-wash px-3 py-1 text-[0.72rem] font-700 text-accent-deep">
                  {o.tag}
                </span>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[2.6rem] font-800 leading-none tracking-[-0.03em] text-accent">
                    {o.metric}
                  </span>
                  <span className="text-[0.86rem] font-600 leading-tight text-ink-faint">
                    {o.metricLabel}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 text-[0.93rem] leading-relaxed">
                  <p className="text-ink-soft">{o.situation}</p>
                  <p className="font-600 text-ink">{o.result}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-6 text-center text-[0.86rem] font-600 text-ink-faint">
          Outcomes are anonymized — named, metric-backed stories are published as clients approve them.
        </p>
      </div>
    </section>
  )
}
