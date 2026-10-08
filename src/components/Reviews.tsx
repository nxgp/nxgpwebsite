import { useEffect, useRef, useState } from 'react'
import { reviews } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { prefersReducedMotion } from '../lib/reducedMotion'
import { cn } from '../lib/cn'

const INTERVAL = 6000

/**
 * Testimonial (Figma 212:270): a navy chamfered card with one quote at a
 * time. With more than one quote it behaves like the Webflow slider —
 * crossfades every 6s, dots to jump, pauses on hover or focus, and never
 * auto-advances under reduced motion.
 */
export function Reviews() {
  const ref = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = reviews.items.length
  const timer = useRef(0)

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return
    timer.current = window.setTimeout(() => setActive((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(timer.current)
  }, [active, paused, count])

  return (
    <section aria-labelledby="reviews-title" className="section-v2 bg-bg text-navy">
      <div ref={ref} className="shell">
        <div className="flex flex-col gap-6 pb-[72px] lg:flex-row lg:items-end lg:gap-[58px]">
          <h2 id="reviews-title" data-reveal className="t-h2">
            <span className="block text-accent">{reviews.h2a}</span>
            <span className="block">{reviews.h2b}</span>
          </h2>
          <p data-reveal className="max-w-[418px] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-slate">
            {reviews.sub}
          </p>
        </div>

        <div
          data-reveal
          className="chamfer flex min-h-[466px] flex-col items-center justify-center bg-navy px-6 py-10 text-bg sm:px-[72px] sm:py-[72px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* every slide shares one grid cell so the card keeps the tallest height */}
          <div className="grid w-full max-w-[616px]">
            {reviews.items.map((r, i) => {
              const [name, title] = r.name.split(' · ')
              return (
                <figure
                  key={r.context}
                  aria-hidden={i !== active}
                  className={cn(
                    'relative col-start-1 row-start-1 transition-opacity duration-[620ms]',
                    i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute -left-14 -top-4 hidden text-[80px] leading-none text-accent sm:block"
                  >
                    “
                  </span>
                  <blockquote className="text-[clamp(1.2rem,1.9vw,1.62rem)] leading-[1.42]">
                    <span className="sm:hidden">“</span>
                    {r.quote}”
                  </blockquote>
                  <figcaption className="mt-10 border-t border-bg/[0.18] pt-4 text-[13px] leading-[1.7]">
                    <span className="block font-500">{name}</span>
                    <span className="block text-mist">
                      {title}, {r.context}
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>

          {count > 1 && (
            <div className="mt-8 flex gap-2" role="group" aria-label="Testimonials">
              {reviews.items.map((r, i) => (
                <button
                  key={r.context}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    // 4px pill, with a larger invisible hit area
                    "relative h-1 rounded-sm transition-[background-color,width] duration-300 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']",
                    i === active ? 'w-6 bg-peri' : 'w-1 bg-bg/30',
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
