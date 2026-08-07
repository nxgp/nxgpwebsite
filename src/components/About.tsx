import { useReveal } from '../hooks/useReveal'
import { about } from '../data/content'
import { Eyebrow } from './ui/Eyebrow'

export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-[36rem]">
            <div data-reveal><Eyebrow>{about.kicker}</Eyebrow></div>
            <h2 data-reveal className="t-h2 mt-4">{about.h2}</h2>
            <p data-reveal className="t-lead mt-5">{about.sub}</p>
          </div>

          <div data-reveal className="flex flex-col gap-7">
            {about.stats.map((s) => (
              <div key={s.label} className="border-l-2 border-accent/30 pl-6">
                <span className="block font-display text-[2.6rem] font-800 leading-none tracking-[-0.02em] text-ink">
                  {s.value}
                </span>
                <span className="mt-1.5 block text-[0.85rem] font-600 text-ink-faint">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* founding team */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {about.team.map((t) => (
            <div
              data-reveal
              key={t.name}
              className="rounded-card border border-line bg-surface p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent-wash font-display text-[0.95rem] font-800 text-accent-deep">
                {t.name.split(' ').map((w) => w[0]).join('')}
              </span>
              <h3 className="mt-4 font-display text-[1.15rem] font-800 tracking-[-0.01em]">{t.name}</h3>
              <p className="text-[0.8rem] font-700 uppercase tracking-[0.06em] text-accent-deep">{t.role}</p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
