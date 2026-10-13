import { useEffect, useRef, useState } from 'react'
import { portfolio, type Product } from '../data/content'
import { prefersReducedMotion } from '../lib/reducedMotion'
import { cn } from '../lib/cn'

const GAP = 24
/** card images shrink no further than this (px) */
const MIN_IMG = 160
/** the rail never zooms below this, so copy stays readable */
const MIN_ZOOM = 0.9

/**
 * "What we've built" rail, built to the Webflow build.
 *
 * The section pins and vertical scroll drives the track sideways, with a
 * progress bar; the track bleeds off the right edge. If the rail is taller
 * than the viewport it zooms down to fit, but no further than 0.9 (Webflow
 * has no floor); past that the card images get shorter instead, so copy
 * stays readable. Prev/next move one card. This runs at every screen size;
 * only reduced motion gets the native swipe row with scroll-snap instead —
 * same markup, nothing hidden before JS runs.
 */
export function WorkRail() {
  const section = useRef<HTMLElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  // live values for the scroll handler, without re-subscribing
  const state = useRef({ pinned: false, overflow: 0, vh: 0, width: 0, zoom: 1, x: 0 })

  useEffect(() => {
    const s = section.current, r = rail.current, v = viewport.current, t = track.current
    if (!s || !r || !v || !t) return

    // The pinned layout is sized to the *small* viewport height (100svh),
    // which stays put while mobile Safari's address bar collapses and
    // expands. Sizing to innerHeight made the rail re-zoom mid-scroll — it
    // visibly shrank and grew back on iPhone.
    const stableVh = () => {
      const probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;top:0;height:100svh;visibility:hidden;pointer-events:none'
      document.body.appendChild(probe)
      const h = probe.offsetHeight || window.innerHeight
      probe.remove()
      return h
    }

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
      state.current.zoom = 1
      setPinned(false)
      s.style.height = ''
      r.style.zoom = ''
      r.style.removeProperty('--card-img-h')
      t.style.transform = ''
      if (bar.current) bar.current.style.transform = ''
      native()
    }

    const update = () => {
      if (!state.current.pinned) return
      const k = s.offsetHeight - state.current.vh
      const p = k <= 0 ? 0 : Math.min(1, Math.max(0, -s.getBoundingClientRect().top / k))
      state.current.x = p * state.current.overflow
      t.style.transform = `translate3d(${-state.current.x}px,0,0)`
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      edges(p <= 0, p >= 1)
    }

    const fit = () => {
      // start from a clean slate so a re-fit (e.g. phone → desktop resize)
      // lands where a fresh load would
      r.style.zoom = ''
      r.style.removeProperty('--card-img-h')
      t.style.transform = ''
      if (prefersReducedMotion()) return unpin()
      state.current.pinned = true
      state.current.vh = stableVh()
      state.current.width = window.innerWidth
      setPinned(true)
      // fit the whole rail (head + cards) inside the viewport: zoom, but
      // never below 0.9 so copy and chips stay legible; past that, shorten
      // the card images rather than the text
      const room = state.current.vh - 8 - 138
      let need = r.offsetHeight - parseFloat(getComputedStyle(t).paddingBottom)
      const img = t.querySelector<HTMLElement>('[data-card-img]')
      if (need > room / MIN_ZOOM && img) {
        const cut = Math.min(need - room / MIN_ZOOM, img.offsetHeight - MIN_IMG)
        if (cut > 0) {
          r.style.setProperty('--card-img-h', `${img.offsetHeight - cut}px`)
          need -= cut
        }
      }
      const z = Math.max(MIN_ZOOM, Math.min(1, room / need))
      if (z < 1) r.style.zoom = String(z)
      state.current.zoom = z
      // distance the track travels: until the last card (plus the track's
      // end padding) meets the viewport's right edge. Measured from the
      // card itself — scrollWidth leaves out end padding on a flex row.
      const last = t.lastElementChild as HTMLElement | null
      const overflow = last
        ? Math.max(0, (last.getBoundingClientRect().right - v.getBoundingClientRect().right) / z + parseFloat(getComputedStyle(t).paddingRight))
        : 0
      if (overflow < 40) return unpin()
      state.current.overflow = overflow
      s.style.height = `${state.current.vh + overflow}px`
      update()
    }

    const measure = () => {
      // Pinning changes the section's height (the CSS estimate in index.css
      // gets close, not exact). If the reader is already past the rail — a
      // deep link to /#faq, or a resize further down — keep what they are
      // looking at in place instead of letting it slide. Measured on the
      // next section rather than from the height change: where the browser's
      // own scroll anchoring has already corrected, there's nothing left to do.
      const next = s.nextElementSibling
      const past = s.getBoundingClientRect().bottom <= 0
      const before = next?.getBoundingClientRect().top ?? 0
      fit()
      s.style.minHeight = '0px'
      const d = (next?.getBoundingClientRect().top ?? 0) - before
      if (past && d) window.scrollBy({ top: d, behavior: 'instant' })
    }

    // Keyboard focus on a card: the viewport clips rather than scrolls
    // (overflow: clip), so bring the card into view by scrolling the page —
    // the same way the wheel moves the track.
    const onFocus = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-card]')
      const st = state.current
      if (!card || !st.pinned) return
      v.scrollLeft = 0
      const z = st.zoom
      const vr = v.getBoundingClientRect(), cr = card.getBoundingClientRect()
      const left = (cr.left - vr.left) / z + st.x
      const right = left + cr.width / z
      const width = vr.width / z
      let x = st.x
      if (left < st.x) x = left - parseFloat(getComputedStyle(t).paddingLeft)
      else if (right > st.x + width) x = right - width + parseFloat(getComputedStyle(t).paddingRight)
      else return
      x = Math.min(st.overflow, Math.max(0, x))
      const k = s.offsetHeight - st.vh
      const top = window.scrollY + s.getBoundingClientRect().top + (x / st.overflow) * k
      window.scrollTo({ top, behavior: 'instant' })
    }

    let timer = 0
    const onResize = () => {
      // the mobile address bar moving changes innerHeight but not 100svh —
      // nothing to re-fit (a real window resize changes one or the other)
      const st = state.current
      if (st.pinned && window.innerWidth === st.width && stableVh() === st.vh) return
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 150)
    }

    t.addEventListener('scroll', native, { passive: true })
    t.addEventListener('focusin', onFocus)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', measure)
    measure()
    return () => {
      window.clearTimeout(timer)
      t.removeEventListener('scroll', native)
      t.removeEventListener('focusin', onFocus)
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
    const k = s.offsetHeight - state.current.vh
    const delta = (dir * (step / state.current.zoom) / state.current.overflow) * k
    const start = window.scrollY + s.getBoundingClientRect().top
    const top = Math.min(start + k, Math.max(start, window.scrollY + delta))
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section
      id="work"
      ref={section}
      aria-labelledby="work-title"
      className={cn('rail-est relative bg-rail text-bg', !pinned && 'section-v2')}
      style={{ '--cards': portfolio.products.length } as React.CSSProperties}
    >
      <div
        className={cn(
          pinned && 'sticky top-0 grid h-svh content-center overflow-clip pb-10 pt-[98px]',
        )}
      >
        <div ref={rail} className="shell">
          <div data-reveal className="mb-12 flex flex-wrap items-end gap-6">
            <h2 id="work-title" className="t-h2 flex-[1_1_22ch]">
              <span className="block">{portfolio.h2a}</span>
              <span className="block text-peri">{portfolio.h2b}</span>
            </h2>
            <div className="ml-auto flex gap-3 max-md:hidden">
              <RailButton dir={-1} disabled={atStart} onClick={() => page(-1)} />
              <RailButton dir={1} disabled={atEnd} onClick={() => page(1)} />
            </div>
          </div>

          {/* the viewport runs on into the right-hand gutter. Unconditional, so
              the first fit (measured before React re-renders as pinned) sees
              the same geometry as every later one */}
          <div ref={viewport} className={cn('mr-[calc(var(--gutter)*-1)]', pinned && 'overflow-clip')}>
            <div
              ref={track}
              className={cn(
                'flex items-start gap-6 max-[991px]:pr-[var(--gutter)]',
                pinned ? 'will-change-transform' : 'swipe overflow-x-auto pb-4',
              )}
            >
              {portfolio.products.map((p) => (
                <WorkCard key={p.id} p={p} />
              ))}
            </div>
          </div>

          <div className={cn('mt-6 h-0.5 bg-bg/16', !pinned && 'hidden')}>
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
      onClick={() => !disabled && onClick()}
      aria-disabled={disabled}
      aria-label={dir < 0 ? 'Previous project' : 'Next project'}
      className="grid size-[46px] place-items-center rounded-full border border-bg/16 text-bg hover:bg-bg/[0.12] aria-disabled:pointer-events-none aria-disabled:opacity-30"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
        <path d={dir < 0 ? 'M10 2 4 8l6 6' : 'M6 2l6 6-6 6'} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )
}

function WorkCard({ p }: { p: Product }) {
  return (
    <a
      data-card
      href={`/work/${p.slug}`}
      className="swipe-item group grid w-[318px] shrink-0 content-start gap-6 max-md:w-[78vw]"
    >
      <div data-card-img className="chamfer relative aspect-square overflow-hidden bg-navy [height:var(--card-img-h)]">
        <img
          src={p.card.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-[620ms] ease-[var(--ease-reveal)] group-hover:scale-[1.04]"
        />
      </div>
      <div>
        <p className="t-kicker text-peri">
          {p.builtFor ?? p.client} · {p.role}
        </p>
        <h3 className="mt-2 text-[length:var(--fs-large)] font-500 leading-[1.25] tracking-[-0.02em]">{p.outcome}</h3>
        <p className="mt-3 text-[14px] text-mist">{p.card.blurb}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
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
