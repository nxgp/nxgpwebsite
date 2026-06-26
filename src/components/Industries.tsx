import { Briefcase, Building2, Landmark, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { industries } from '../data/content'
import type { Industry } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Button } from './ui/Button'
import { scrollToId } from '../lib/useSmoothScroll'

const icons: Record<Industry['visual'], LucideIcon> = { pe: Briefcase, enterprise: Building2, gov: Landmark }

export function Industries() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="industries" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader kicker={industries.kicker} title={industries.h2} sub={industries.sub} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {industries.items.map((ind) => {
            const Icon = icons[ind.visual]
            return (
              <article data-reveal key={ind.name} className="group flex flex-col rounded-card border border-line bg-surface p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-inner" style={{ background: `${ind.accent}16`, color: ind.accent }}>
                    <Icon className="size-5" />
                  </span>
                  {ind.note ? (
                    <span className="rounded-pill border border-line px-2.5 py-1 text-[0.66rem] font-700 text-ink-faint">{ind.note}</span>
                  ) : (
                    <ArrowUpRight className="size-5 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  )}
                </div>
                <h3 className="t-h3 mt-5 text-[1.5rem]">{ind.name}</h3>
                <p className="mt-1.5 text-[0.78rem] font-700 uppercase tracking-[0.05em] text-ink-faint">{ind.buyer}</p>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-soft">{ind.frame}</p>
              </article>
            )
          })}
        </div>

        <div data-reveal className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <p className="text-[0.95rem] font-600 text-ink-soft">
            Not sure where you fit? We map it on the first call.
          </p>
          <Button variant="dark" onClick={() => scrollToId('cta')}>
            Book a call
          </Button>
        </div>
      </div>
    </section>
  )
}
