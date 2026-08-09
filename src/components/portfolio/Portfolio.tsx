import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { prefersReducedMotion } from '../../lib/reducedMotion'
import { portfolio } from '../../data/content'
import { SectionHeader } from '../ui/SectionHeader'
import { cn } from '../../lib/cn'
// Vignettes are pure decoration and the heaviest part of this section, so
// they're split into their own chunk and fetched when the section first comes
// into view — the copy above is prerendered and never waits on them.
const Vignettes = lazy(() => import('./vignetteStage'))

const CYCLE_MS = 7000

/**
 * The portfolio stage — one product commands the screen at a time.
 *
 * Left: the eight products as a selectable index (breadth at a glance).
 * Right: a large animated vignette showing that product's outcome moment
 * (depth, one story at a time). Auto-advances like a demo reel until the
 * visitor takes over; a click pins their choice.
 */
/** Placeholder with the same footprint as a real scene — a bare studio
 *  backdrop, so the stage never flashes empty and nothing shifts when the
 *  chunk lands. */
function VignetteSkeleton() {
  return (
    <div
      className="flex h-full w-full items-end justify-center overflow-hidden rounded-inner border border-line pb-8 shadow-sm"
      style={{ background: 'linear-gradient(160deg, #F0F1F6 0%, #E2E4EE 60%, #D6D9E8 100%)' }}
    >
      <div className="h-[62%] w-[72%] animate-pulse rounded-[14px] bg-white/45" />
    </div>
  )
}

export function Portfolio() {
  const ref = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  // latches true the first time the section is seen, so the chunk is fetched
  // once and never unmounted while scrolling past
  const [seen, setSeen] = useState(false)

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

  // warm the vignette chunk during idle time, so reaching the section is
  // instant even on a fast scroll (the observer below is the backstop)
  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number }
    const warm = () => setSeen(true)
    const id = w.requestIdleCallback ? w.requestIdleCallback(warm) : window.setTimeout(warm, 2000)
    return () => {
      if (w.requestIdleCallback) return
      clearTimeout(id)
    }
  }, [])

  // only run the reel while the section is actually on screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.25, rootMargin: '200px' },
    )
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

  return (
    <section id="work" ref={sectionRef} className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader kicker={portfolio.kicker} title={portfolio.h2} sub={portfolio.sub} />

        {/* min-w-0 on every track: `1fr` is `minmax(auto, 1fr)`, so without it
            the vignette's min-content width becomes a floor and stretches the
            column past the shell — which reads as a horizontal scroll on phones. */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* ---- product index (desktop) ---- */}
          <div data-reveal className="hidden min-w-0 flex-col lg:flex">
            {portfolio.products.map((p, i) => {
              const is = i === active
              return (
                <button
                  key={p.id}
                  onClick={() => select(i)}
                  role="tab"
                  aria-selected={is}
                  aria-controls={`product-${p.id}`}
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
          <div data-reveal className="swipe -mx-[4vw] flex min-w-0 gap-2 overflow-x-auto px-[4vw] pb-1 lg:hidden">
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
          <div data-reveal className="min-w-0">
            {/* Only the active vignette mounts: they're DOM-heavy and each runs
                its own keyframe choreography, so mounting all eight would cost
                8x the nodes and animations for one visible scene. They're
                decorative, so nothing is lost for crawlers or screen readers. */}
            <div key={product.id} className="pv-stage-in" aria-hidden>
              {/* portrait on phones (stacked interiors), taller from sm up so
                  the studio scenes have air around the hardware */}
              <div className="h-[460px] sm:h-[480px]">
                <Suspense fallback={<VignetteSkeleton />}>
                  {seen ? <Vignettes id={product.id} /> : <VignetteSkeleton />}
                </Suspense>
              </div>
            </div>

            {/* Every product's copy IS rendered, so all eight are in the
                prerendered HTML for search and answer engines. Inactive panels
                are hidden with `hidden` rather than unmounted — standard
                tab-panel behaviour, and cheap (a few text nodes each). */}
            {portfolio.products.map((p, i) => (
              <div
                key={p.id}
                id={`product-${p.id}`}
                role="tabpanel"
                hidden={i !== active}
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="max-w-[34rem]">
                  <p className="text-[0.68rem] font-800 uppercase tracking-[0.09em] text-accent-deep">
                    Built for {p.builtFor ?? p.client} · {p.role}
                  </p>
                  <h3 className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">
                    <span className="font-700 text-ink">{p.outcome}</span> {p.blurb}
                  </h3>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5 sm:max-w-[220px] sm:justify-end">
                  {p.proof.map((c) => (
                    <span
                      key={c}
                      className="rounded-pill bg-accent-wash px-2.5 py-1 text-[0.68rem] font-700 text-accent-deep"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
