import { TrendingUp, Sparkles, Boxes, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { services } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { scrollToId } from '../lib/useSmoothScroll'

const icons: Record<string, LucideIcon> = { TrendingUp, Sparkles, Boxes }

export function Services() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="services" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader kicker={services.kicker} title={services.h2} sub={services.sub} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {services.pillars.map((p) => {
            const Icon = icons[p.icon]
            return (
              <div data-reveal key={p.title}>
                <Card className="flex h-full flex-col p-7">
                  <span className="flex size-11 items-center justify-center rounded-inner bg-accent-wash text-accent-deep">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[1.4rem] font-800 tracking-[-0.015em]">{p.title}</h3>
                  <p className="mt-2 text-[1rem] font-700 text-accent-deep">{p.outcome}</p>
                  <p className="mt-3 text-[0.96rem] leading-relaxed text-ink-soft">{p.body}</p>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-[0.7rem] font-700 uppercase tracking-[0.08em] text-ink-faint">Capabilities</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {p.caps.map((c) => (
                        <li key={c} className="flex items-center gap-1.5 text-[0.85rem] font-600 text-ink-soft">
                          <Check className="size-3.5 shrink-0 text-accent" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        <div data-reveal className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <p className="text-[0.95rem] font-600 text-ink-soft">
            Engage one pillar — or a cross-functional team across all three.
          </p>
          <Button variant="dark" onClick={() => scrollToId('cta')}>
            Book a call
          </Button>
        </div>
      </div>
    </section>
  )
}
