import { useEffect, useRef, useState } from 'react'

/**
 * Active-item sync used by the Approach steps and the Delivery System layers
 * (ported from the Webflow build): the active item is whichever of the
 * items in the middle band of the viewport (38%–62%) sits closest to its
 * centre, and hovering or focusing an item makes it active too.
 *
 * Webflow only re-picks when an item enters or leaves that band, so with
 * tall cards two can share the band and the highlight lags a card behind.
 * Here the pick reruns on every scroll frame (rAF-throttled) instead.
 *
 * Returns the active index, a setter for hover/focus, and a ref callback
 * to attach to each item.
 */
export function useActiveOnScroll(count: number) {
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    let frame = 0
    const pick = () => {
      frame = 0
      const vh = window.innerHeight
      const mid = vh / 2
      let best = -1
      let bestDist = Infinity
      items.current.slice(0, count).forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.bottom <= vh * 0.38 || r.top >= vh * 0.62) return
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      if (best >= 0) setActive(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [count])

  const bind = (i: number) => ({
    ref: (el: HTMLElement | null) => {
      items.current[i] = el
    },
    onPointerEnter: () => setActive(i),
    onFocus: () => setActive(i),
  })

  return { active, setActive, bind }
}
