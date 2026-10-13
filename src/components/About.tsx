import { useEffect, useRef } from 'react'
import { about } from '../data/content'
import { prefersReducedMotion } from '../lib/reducedMotion'

/**
 * Company, built to the Webflow build: founding story with headline figures
 * beside two chamfered leader cards. Figures count up once when they scroll
 * into view; the prerendered page already shows the final values.
 */
export function About() {
  return (
    <section id="company" aria-labelledby="company-title" className="section-v2 bg-cloud text-ink">
      <div className="shell">
        <div data-reveal className="mb-16 flex flex-col items-start gap-6">
          <p className="t-eyebrow">{about.eyebrow}</p>
          <h2 id="company-title" className="t-h2 text-navy">
            {about.h2a}
            <span className="text-accent">
              {about.h2Hi} {about.h2b}
            </span>
          </h2>
        </div>

        <div className="grid items-start gap-12 min-[992px]:grid-cols-[0.85fr_1fr] min-[992px]:gap-[72px]">
          <div data-reveal>
            <p className="max-w-[40ch] text-slate">{about.sub}</p>
            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
              {about.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-3 text-[14px] text-slate">{s.label}</dt>
                  <dd className="m-0 text-[length:var(--fs-h2)] font-500 leading-none tracking-[-0.03em] text-navy">
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul data-reveal className="grid auto-rows-fr gap-6">
            {about.team.map((t) => (
              <li
                key={t.name}
                className="chamfer grid grid-cols-[132px_1fr] gap-6 bg-bg p-6 max-md:grid-cols-1 max-md:items-start"
              >
                <div className="chamfer h-full min-h-[148px] overflow-hidden bg-cloud max-md:aspect-[9/10] max-md:h-auto max-md:min-h-0 max-md:w-[132px]">
                  <img
                    src={t.photo}
                    alt={`${t.name}, ${t.role} at Nx Growth Partners`}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover object-[50%_22%]"
                  />
                </div>
                <div>
                  <h3 className="text-[16px] font-500 leading-[1.25] text-navy">{t.name}</h3>
                  <p className="mt-[3px] text-[12px] uppercase leading-[1.25] tracking-[0.14em] text-accent">{t.role}</p>
                  <p className="mt-3 text-[14px] text-slate">{t.bio}</p>
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
