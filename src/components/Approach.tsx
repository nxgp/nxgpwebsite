import { RotateCw } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { approach } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'

export function Approach() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="approach" className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={approach.kicker} title={approach.h2} />

        <div className="relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {approach.steps.map((s, i) => (
            <div data-reveal key={s.n} className="relative flex flex-col rounded-card border border-line bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-ink text-[0.82rem] font-800 text-white">{s.n}</span>
                {i === approach.steps.length - 1 && <RotateCw className="size-4 text-accent" />}
              </div>
              <h3 className="mt-5 text-[1.12rem] font-800 leading-snug tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>

        <p data-reveal className="mt-8 flex items-center justify-center gap-2 text-[0.9rem] font-700 text-ink-faint">
          <RotateCw className="size-4 text-accent" />
          and then we do it again — with everything we learned
        </p>
      </div>
    </section>
  )
}
