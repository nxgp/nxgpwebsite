import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './reducedMotion'

/**
 * App-level smooth-scroll. Lenis drives inertia; GSAP's ticker drives Lenis so
 * ScrollTrigger and Lenis share one clock (no double-RAF jitter).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 })
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])
}

/** Programmatic scroll that respects Lenis when present. */
export function scrollToId(id: string) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
