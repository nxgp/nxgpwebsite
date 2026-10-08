import { useEffect, useRef, useState } from 'react'
import type Lenis from 'lenis'
import { portfolio, type Product } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { prefersReducedMotion, isCoarsePointer } from '../lib/reducedMotion'
import { cn } from '../lib/cn'

const GAP = 24

/**
 * "What we've built" rail (Figma 212:58; behaviour from the Webflow build).
 *
 * Desktop: the section pins and vertical scroll drives the track sideways,
 * with a progress bar; if the rail is taller than the viewport it is zoomed
 * down to fit. Prev/next move one card. Touch, small screens and reduced
 * motion get a native swipe row with scroll-snap instead — same markup,
 * nothing hidden before JS runs.
 */
export function WorkRail() {
  const head = useReveal<HTMLDivElement>()
  const section = useRef<HTMLElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  // live values for the scroll handler, without re-subscribing
  const state = useRef({ pinned: false, overflow: 0 })

  useEffect(() => {
    const s = section.current, r = rail.current, v = viewport.current, t = track.current
    if (!s || !r || !v || !t) return

    const edges = (start: boolean, end: boolean) => {
      setAtStart(start)
      setAtEnd(end)
    }

    const native = () => {
      if (state.current.pinned) return
      edges(t.scrollLeft <= 2, t.scrollLeft >= t.scrollWidth - t.clientWidth - 2)
    }

    const unpin = () => {
      state.current.pinned = false
      setPinned(false)
      s.style.height = ''
      r.style.zoom = ''
      t.style.transform = ''
      if (bar.current) bar.current.style.transform = ''
      native()
    }

    const update = () => {
      if (!state.current.pinned) return
      const k = s.offsetHeight - window.innerHeight
      const p = k <= 0 ? 0 : Math.min(1, Math.max(0, -s.getBoundingClientRect().top / k))
      t.style.transform = `translate3d(${-p * state.current.overflow}px,0,0)`
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      edges(p <= 0, p >= 1)
    }

    const measure = () => {
      if (prefersReducedMotion() || isCoarsePointer() || window.innerWidth < 768) return unpin()
      r.style.zoom = ''
      t.style.transform = ''
      state.current.pinned = true
      setPinned(true)
      // fit the whole rail (head + cards) inside the viewport
      const z = Math.min(1, (window.innerHeight - 8) / (r.offsetHeight + 138))
      if (z < 1) r.style.zoom = String(z)
      const overflow = Math.max(0, t.scrollWidth - v.clientWidth)
      if (overflow < 40) return unpin()
      state.current.overflow = overflow
      s.style.height = `${window.innerHeight + overflow}px`
      update()
    }

    let timer = 0
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 150)
    }

    t.addEventListener('scroll', native, { passive: true })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', measure)
    measure()
    return () => {
      window.clearTimeout(timer)
      t.removeEventListener('scroll', native)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', measure)
    }
  }, [])

  /** Move one card in either direction. */
  const page = (dir: -1 | 1) => {
    const s = section.current, t = track.current
    if (!s || !t) return
    const card = t.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.getBoundingClientRect().width + GAP : t.clientWidth
    if (!state.current.pinned) {
      t.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      return
    }
    // pinned: translate the card step back into page scroll distance
    const k = s.offsetHeight - window.innerHeight
    const zoom = Number(rail.current?.style.zoom || 1)
    const delta = (dir * (step / zoom) / state.current.overflow) * k
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    if (lenis) lenis.scrollTo(window.scrollY + delta, { duration: 0.6 })
    else window.scrollBy({ top: delta, behavior: 'smooth' })
  }

  return (
    <section
      id="work"
      ref={section}
      aria-labelledby="work-title"
      className={cn('relative bg-rail text-bg', !pinned && 'section-v2')}
    >
      <div
        className={cn(
          pinned && 'sticky top-0 grid h-svh content-center overflow-hidden pb-10 pt-[98px]',
        )}
      >
        <div ref={rail} className="shell-wide">
          <div ref={head} className="flex items-end justify-between gap-6 pb-12">
            <h2 id="work-title" data-reveal className="t-h2 max-w-[833px]">
              <span className="block">{portfolio.h2a}</span>
              <span className="block text-peri">{portfolio.h2b}</span>
            </h2>
            <div data-reveal className="hidden shrink-0 gap-3 sm:flex">
              <RailButton dir={-1} disabled={atStart} onClick={() => page(-1)} />
              <RailButton dir={1} disabled={atEnd} onClick={() => page(1)} />
            </div>
          </div>

          <div
            ref={viewport}
            className={cn(pinned && 'mr-[calc((100vw-var(--shell-wide))/-2)]')}
          >
            <div
              ref={track}
              className={cn(
                'flex items-start gap-6',
                pinned
                  ? 'will-change-transform'
                  : 'swipe -mr-4 overflow-x-auto pb-2 pr-4 sm:mr-[calc((100vw-var(--shell-wide))/-2)]',
              )}
            >
              {portfolio.products.map((p) => (
                <WorkCard key={p.id} p={p} />
              ))}
            </div>
          </div>

          <div className={cn('mt-8 h-0.5 bg-bg/16', !pinned && 'hidden')}>
            <div ref={bar} className="h-full origin-left scale-x-0 bg-peri" />
          </div>
        </div>
      </div>
    </section>
  )
}

function RailButton({ dir, disabled, onClick }: { dir: -1 | 1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={disabled}
      aria-label={dir < 0 ? 'Previous project' : 'Next project'}
      className="flex size-[46px] items-center justify-center rounded-full border border-bg/16 text-bg transition-[background-color,opacity] duration-300 hover:bg-bg/[0.12] aria-disabled:opacity-40"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
        <path d={dir < 0 ? 'M10 3L5 8L10 13' : 'M6 3L11 8L6 13'} stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  )
}

function WorkCard({ p }: { p: Product }) {
  return (
    <a
      data-card
      href={`/work/${p.slug}`}
      className="swipe-item group flex w-[min(340px,78vw)] shrink-0 flex-col gap-6"
    >
      <div className="chamfer relative aspect-[340/425] overflow-hidden bg-navy">
        <img
          src={p.card.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-[620ms] ease-[var(--ease-reveal)] group-hover:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent from-45% to-black/75" />
        <span
          aria-hidden
          className="absolute bottom-4 right-4 flex size-[38px] items-center justify-center rounded-full border border-bg/35 bg-black/45 transition-[background-color,transform] duration-300 ease-[var(--ease-reveal)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-accent"
        >
          <svg viewBox="0 0 14 14" fill="none" className="size-3.5">
            <path d="M3 11L11 3M11 9V3H5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </div>
      <div>
        <p className="t-kicker text-peri">
          {p.builtFor ?? p.client} · {p.role}
        </p>
        <h3 className="pt-2 font-heading text-[20px] leading-[1.2] tracking-[-0.026em]">{p.outcome}</h3>
        <p className="pt-3 text-[15px] leading-[1.6] text-rail-copy">{p.card.blurb}</p>
        <ul className="flex flex-wrap gap-2 pt-4">
          {p.card.tags.map((tag) => (
            <li key={tag} className="chip border-bg/16 text-bg">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </a>
  )
}
