import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/reducedMotion'

/**
 * Batched fade-up reveal — the consistent token used everywhere:
 *   y: 24 → 0, opacity 0 → 1, 0.8s, power3.out, stagger 0.08.
 * Put `data-reveal` on each child to stagger; attach the ref to an ancestor.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('[data-reveal]'),
    )
    if (targets.length === 0) return

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    gsap.set(targets, { opacity: 0, y: 24 })
    const batch = ScrollTrigger.batch(targets, {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
          onComplete: () =>
            els.forEach((el) => ((el as HTMLElement).style.willChange = 'auto')),
        }),
    })

    return () => batch.forEach((t) => t.kill())
  }, [])

  return ref
}
