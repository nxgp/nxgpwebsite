import { useReveal } from '../hooks/useReveal'
import { about } from '../data/content'
import { Eyebrow } from './ui/Eyebrow'

export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="section bg-surface/40">
      <div ref={ref} className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-[34rem]">
          <div data-reveal><Eyebrow>{about.kicker}</Eyebrow></div>
          <h2 data-reveal className="t-h2 mt-4">{about.h2}</h2>
          <p data-reveal className="t-lead mt-5">{about.sub}</p>
        </div>
        <div className="flex flex-col">
          {about.points.map((p, i) => (
            <div
              data-reveal
              key={p.title}
              className={
                'flex gap-5 py-6 ' +
                (i > 0 ? 'border-t border-line' : 'pt-0')
              }
            >
              <span className="mt-1 text-[0.85rem] font-800 text-accent-deep">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-[1.2rem] font-800 tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 text-[0.96rem] leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
