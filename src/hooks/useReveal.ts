import { useEffect } from 'react'
import { prefersReducedMotion } from '../lib/reducedMotion'

/**
 * Reveal on scroll, as in the Webflow build: every `[data-reveal]` on the
 * page starts 18px low and transparent (`html.js` CSS in index.css) and
 * fades up over 0.62s once 8% of it is in view. Siblings marked
 * `data-reveal="stagger"` follow each other at 90ms steps.
 *
 * Call once, from App. The inline script in index.html adds `html.js`
 * before first paint and drops it again after 3s if this never runs
 * (`data-ready`), so content can't stay hidden if the bundle fails.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-ready', '')
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const show = (el: Element) => el.classList.add('is-in')

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach(show)
      return
    }

    for (const el of els) {
      if (el.dataset.reveal !== 'stagger' || !el.parentElement) continue
      const group = Array.from(el.parentElement.children).filter(
        (c) => (c as HTMLElement).dataset.reveal === 'stagger',
      )
      el.style.transitionDelay = `${group.indexOf(el) * 90}ms`
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          show(e.target)
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
