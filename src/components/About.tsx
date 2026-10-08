import { useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import { about } from '../data/content'
import { prefersReducedMotion } from '../lib/reducedMotion'

/**
 * Company (Figma 212:288): founding story with headline figures beside the
 * two leader cards. Figures count up once when they scroll into view, as in
 * the Webflow build; the prerendered page already shows the final values.
 */
export function About() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="company" aria-labelledby="company-title" className="section-v2 bg-cloud text-navy">
      <div ref={ref} className="shell">
        <div className="pb-[72px]">
          <p data-reveal className="t-eyebrow pb-6">
            {about.eyebrow}
          </p>
          <h2 id="company-title" data-reveal className="t-h2 font-400">
            <span className="block">
              {about.h2a}
              <span className="text-accent">{about.h2Hi}</span>
            </span>
            <span className="block text-accent">{about.h2b}</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[440px_1fr] lg:gap-[115px]">
          <div data-reveal>
            <p className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.65] text-slate">{about.sub}</p>
            <dl className="grid grid-cols-3 gap-6 pt-8">
              {about.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-3">
                  <dt className="text-[15px] leading-[1.5] text-slate">{s.label}</dt>
                  <dd className="m-0 text-[clamp(2.4rem,4vw,3.25rem)] font-500 leading-none tracking-[-0.035em]">
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul data-reveal className="flex flex-col gap-6">
            {about.team.map((t) => (
              <li key={t.name} className="flex gap-6 border border-hairline bg-bg p-6 max-sm:flex-col">
                <img
                  src={t.photo}
                  alt={t.name}
                  width={109}
                  height={109}
                  loading="lazy"
                  decoding="async"
                  className="size-[109px] shrink-0 object-cover"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h3 className="text-[17px] font-500 leading-[1.4]">{t.name}</h3>
                  <p className="text-[11.2px] uppercase tracking-[0.12em] text-accent">{t.role}</p>
                  <p className="pt-2.5 text-[13px] leading-[1.65] text-slate">{t.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/**
 * "50+" counts 0 → 50 over 1.2s (ease-out cubic) on first view. Values that
 * are years ("2018") are left alone — counting up to a date reads oddly.
 */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const m = value.match(/^(\d+)(\D*)$/)
    if (!el || !m || /^(19|20)\d{2}$/.test(value)) return
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    const n = Number(m[1])
    const suffix = m[2]
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        let t0 = 0
        const tick = (t: number) => {
          t0 ||= t
          const p = Math.min(1, (t - t0) / 1200)
          el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suffix
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <span ref={ref}>{value}</span>
}
