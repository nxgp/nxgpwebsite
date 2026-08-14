import { Compass, Rocket, Users, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { engagement } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'

const icons: LucideIcon[] = [Compass, Rocket, Users, RefreshCw]

/**
 * HOW WE ENGAGE — the four engagement models from the deck, in sequence:
 * Blueprint → Project Delivery → Managed Support → Embedded Engineering.
 */
export function Engagement() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="engagement" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader title={engagement.h2} sub={engagement.sub} />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {engagement.items.map((e, i) => {
            const Icon = icons[i]
            return (
              <div data-reveal key={e.name}>
                <Card className="flex h-full flex-col p-6">
                  <span className="flex size-10 items-center justify-center rounded-inner bg-accent-wash text-accent-deep">
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.18rem] font-800 tracking-[-0.01em]">{e.name}</h3>
                  <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">{e.body}</p>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
