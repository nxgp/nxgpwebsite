import { useEffect, useRef, useState } from 'react'
import { reviews } from '../data/content'
import { prefersReducedMotion } from '../lib/reducedMotion'
import { cn } from '../lib/cn'

const INTERVAL = 6000

/**
 * Testimonial slider, built to the Webflow build: a navy chamfered card with
 * one centred quote at a time — crossfades every 6s, dots to jump, pauses on
 * mouse hover or focus, never auto-advances under reduced motion. Webflow's
 * slides 2 and 3 are placeholders, so ours carry the real client quotes.
 * Beyond Webflow: a pause button stops it for good (WCAG 2.2.2), the dots
 * have 24px targets, and touch never sets the hover pause.
 */
export function Reviews() {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const count = reviews.items.length
  const timer = useRef(0)
  const paused = hovered || focused || stopped

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return
    timer.current = window.setTimeout(() => setActive((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(timer.current)
  }, [active, paused, count])

  return (
    <section aria-labelledby="reviews-title" className="section-v2 bg-bg text-ink">
      <div className="shell">
        <div data-reveal className="mb-16 grid gap-6 min-[992px]:grid-cols-[1fr_0.7fr] min-[992px]:items-end min-[992px]:gap-x-20">
          <h2 id="reviews-title" className="t-h2 text-navy">
            <span className="block text-accent">{reviews.h2a}</span>
            <span className="block">{reviews.h2b}</span>
          </h2>
          <p className="t-lead max-w-[74ch]">{reviews.sub}</p>
        </div>

        <div
          data-reveal
          className="chamfer flex flex-col items-center justify-center gap-8 bg-navy px-24 py-16 text-bg max-md:px-6 max-md:py-10"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {/* every slide shares one grid cell so the card keeps the tallest height */}
          <div className="grid w-full">
            {reviews.items.map((r, i) => {
              const [name, title] = r.name.split(' · ')
              return (
                <figure
                  key={r.context}
                  aria-hidden={i !== active}
                  className={cn(
                    'col-start-1 row-start-1 flex flex-col items-center justify-between gap-8 transition-opacity duration-[620ms]',
                    i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                >
                  <blockquote className="mt-6 max-w-[44ch] text-center text-[length:var(--fs-h6)] leading-[1.45] tracking-[-0.02em]">
                    {r.quote}
                  </blockquote>
                  <figcaption className="mt-10 flex w-full max-w-[44ch] flex-col items-center gap-1 border-t border-bg/20 pt-6 text-center text-[14px] text-mist">
                    <span className="font-500 text-bg">{name}</span>
                    <span>
                      {title}, {r.context}
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>

          {count > 1 && (
            <div className="flex items-center gap-1">
              <div className="flex" role="group" aria-label="Testimonials">
                {reviews.items.map((r, i) => (
                  <button
                    key={r.context}
                    type="button"
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === active}
                    onClick={() => setActive(i)}
                    // 24px target around the 4px pill
                    className="flex h-6 min-w-6 items-center justify-center"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'block h-1 rounded-sm transition-[width,background-color] duration-[320ms] ease-[ease]',
                        i === active ? 'w-6 bg-peri' : 'w-1 bg-bg/30',
                      )}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label={stopped ? 'Play testimonials' : 'Pause testimonials'}
                onClick={() => setStopped((v) => !v)}
                className="flex size-6 items-center justify-center text-bg/60 hover:text-bg"
              >
                <svg viewBox="0 0 12 12" aria-hidden className="size-3 fill-current">
                  {stopped ? <path d="M3 1.5v9l7.5-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
