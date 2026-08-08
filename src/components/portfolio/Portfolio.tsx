import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { prefersReducedMotion } from '../../lib/reducedMotion'
import { portfolio } from '../../data/content'
import { SectionHeader } from '../ui/SectionHeader'
import { cn } from '../../lib/cn'
import { VIGNETTES } from './vignettes'

const CYCLE_MS = 7000

/**
 * The portfolio stage — one product commands the screen at a time.
 *
 * Left: the eight products as a selectable index (breadth at a glance).
 * Right: a large animated vignette showing that product's outcome moment
 * (depth, one story at a time). Auto-advances like a demo reel until the
 * visitor takes over; a click pins their choice.
 */
export function Portfolio() {
  const ref = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // deep-link support: /?product=3 opens with that product pinned.
  // Applied post-hydration so the prerendered HTML (product 1) never
  // mismatches the client's first render.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get('product'))
    if (Number.isFinite(n) && n >= 1 && n <= portfolio.products.length) {
      setActive(n - 1)
      setPinned(true)
    }
  }, [])

  // only run the reel while the section is actually on screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (pinned || !inView || prefersReducedMotion()) return
    const t = setInterval(
      () => setActive((a) => (a + 1) % portfolio.products.length),
      CYCLE_MS,
    )
    return () => clearInterval(t)
  }, [pinned, inView])

  const select = (i: number) => {
    setActive(i)
    setPinned(true)
  }

  const product = portfolio.products[active]
  const Viz = VIGNETTES[product.id]

  return (
    <section id="work" ref={sectionRef} className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader kicker={portfolio.kicker} title={portfolio.h2} sub={portfolio.sub} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* ---- product index (desktop) ---- */}
          <div data-reveal className="hidden flex-col lg:flex">
            {portfolio.products.map((p, i) => {
              const is = i === active
              return (
                <button
                  key={p.id}
                  onClick={() => select(i)}
                  aria-pressed={is}
                  className={cn(
                    'group relative border-l-2 px-5 py-3 text-left transition-colors duration-200',
                    is
                      ? 'border-accent bg-surface'
                      : 'border-line hover:border-ink-faint',
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        'text-[0.68rem] font-800 tabular-nums',
                        is ? 'text-accent' : 'text-ink-faint',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'font-display text-[1.02rem] font-800 tracking-[-0.01em]',
                        is ? 'text-ink' : 'text-ink-soft group-hover:text-ink',
                      )}
                    >
                      {p.client}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 block pl-[30px] text-[0.8rem] font-500 leading-snug',
                      is ? 'text-ink-soft' : 'text-ink-faint',
                    )}
                  >
                    {p.built}
                  </span>
                  {/* auto-advance progress on the active row */}
                  {is && !pinned && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-line">
                      <span
                        key={active}
                        className="pv-progress block h-full bg-accent/60"
                        style={{ '--cycle': `${CYCLE_MS}ms` } as React.CSSProperties}
                      />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ---- product chips (mobile) ---- */}
          <div data-reveal className="swipe -mx-[4vw] flex gap-2 overflow-x-auto px-[4vw] pb-1 lg:hidden">
            {portfolio.products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => select(i)}
                className={cn(
                  'swipe-item shrink-0 rounded-pill border px-3.5 py-1.5 text-[0.82rem] font-700 transition-colors',
                  i === active
                    ? 'border-accent bg-accent text-white'
                    : 'border-line bg-surface text-ink-soft',
                )}
              >
                {p.client}
                <span className="ml-1.5 font-500 opacity-70">{p.role}</span>
              </button>
            ))}
          </div>

          {/* ---- stage ---- */}
          <div data-reveal>
            <div key={product.id} className="pv-stage-in">
              <div className="h-[330px] sm:h-[400px]">
                <Viz />
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-[34rem]">
                  <p className="text-[0.68rem] font-800 uppercase tracking-[0.09em] text-accent-deep">
                    Built for {product.client} · {product.role}
                  </p>
                  <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">
                    <span className="font-700 text-ink">{product.outcome}</span>{' '}
                    {product.blurb}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5 sm:max-w-[220px] sm:justify-end">
                  {product.proof.map((c) => (
                    <span
                      key={c}
                      className="rounded-pill bg-accent-wash px-2.5 py-1 text-[0.68rem] font-700 text-accent-deep"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
