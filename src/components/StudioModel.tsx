import { Code2, Rocket, Sparkles, LineChart, Landmark } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { studio } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'

const icons: Record<string, LucideIcon> = { Code2, Rocket, Sparkles, LineChart, Landmark }

export function StudioModel() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="studio" className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={studio.kicker} title={studio.h2} sub={studio.sub} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {studio.pillars.map((p, i) => {
            const Icon = icons[p.icon]
            return (
              <div data-reveal key={p.title}>
                <Card className="flex h-full flex-col p-6">
                  <span className="flex size-11 items-center justify-center rounded-inner bg-accent-wash text-accent-deep">
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-5 flex items-center gap-2 text-[0.72rem] font-700 text-ink-faint">0{i + 1}</span>
                  <h3 className="t-h3 mt-1.5 text-[1.25rem]">{p.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{p.body}</p>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
