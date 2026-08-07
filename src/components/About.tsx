import { useReveal } from '../hooks/useReveal'
import { about } from '../data/content'
import { Eyebrow } from './ui/Eyebrow'

export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="about" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-[34rem]">
            <div data-reveal><Eyebrow>{about.kicker}</Eyebrow></div>
            <h2 data-reveal className="t-h2 mt-4">{about.h2}</h2>
            <p data-reveal className="t-lead mt-5">{about.sub}</p>

            <div data-reveal className="mt-9 grid grid-cols-3 gap-4">
              {about.stats.map((s) => (
                <div key={s.label} className="border-l-2 border-accent/30 pl-4">
                  <span className="block font-display text-[1.9rem] font-800 leading-none tracking-[-0.02em] text-ink">
                    {s.value}
                  </span>
                  <span className="mt-1.5 block text-[0.8rem] font-600 text-ink-faint">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
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
