import { useEffect, useRef } from 'react'

/**
 * A single fixed background layer whose tint shifts very subtly between
 * sections as you scroll (warm → cooler → warm). Sells continuity.
 */
const WARM = [247, 246, 242]
const COOL = [238, 243, 244]

export function TonalBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      const t = Math.sin(p * Math.PI)
      const c = WARM.map((w, i) => Math.round(w + (COOL[i] - w) * t))
      el.style.backgroundColor = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} aria-hidden className="fixed inset-0 -z-50" style={{ backgroundColor: 'rgb(247,246,242)' }} />
}
