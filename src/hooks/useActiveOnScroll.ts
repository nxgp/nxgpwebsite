import { useEffect, useRef, useState } from 'react'

/**
 * Active-item sync used by the Approach steps and the Delivery System layers
 * (ported from the Webflow build): the active item is whichever of the
 * items in the middle band of the viewport sits closest to its centre, and
 * hovering or focusing an item makes it active too.
 *
 * Returns the active index, a setter for hover/focus, and a ref callback
 * to attach to each item.
 */
export function useActiveOnScroll(count: number) {
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const visible = new Set<HTMLElement>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement)
          else visible.delete(e.target as HTMLElement)
        }
        if (visible.size === 0) return
        const mid = window.innerHeight / 2
        let best: HTMLElement | null = null
        let bestDist = Infinity
        for (const el of visible) {
          const r = el.getBoundingClientRect()
          const d = Math.abs(r.top + r.height / 2 - mid)
          if (d < bestDist) {
            bestDist = d
            best = el
          }
        }
        if (best) setActive(items.current.indexOf(best))
      },
      { rootMargin: '-38% 0px -38% 0px' },
    )
    items.current.slice(0, count).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
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
