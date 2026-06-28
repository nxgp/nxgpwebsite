import { Quote as QuoteIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { reviews } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'

export function Reviews() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="reviews" className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={reviews.kicker} title={reviews.h2} sub={reviews.sub} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {reviews.items.map((r) => (
            <div data-reveal key={r.name}>
              <Card className="flex h-full flex-col p-7">
                <QuoteIcon className="size-7 text-accent/30" />
                <p className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-ink">
                  “{r.quote}”
                </p>
                <div className="mt-6 border-t border-line pt-5">
                  <span className="block text-[0.85rem] font-700 text-ink">
                    {r.name}
                  </span>
                  <span className="block text-[0.78rem] font-600 text-ink-faint">
                    {r.context}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
