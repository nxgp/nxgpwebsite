import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/reducedMotion'
import { quote } from '../data/content'

export function Quote() {
  const ref = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const words = el.querySelectorAll<HTMLElement>('[data-q-word]')
    const ctx = gsap.context(() => {
      gsap.from(words, {
        opacity: 0.12,
        duration: 0.5,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 32%', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section">
      <div className="shell">
        <blockquote ref={ref} className="mx-auto max-w-[42rem] text-center">
          <p className="text-[clamp(1.8rem,4.2vw,3rem)] font-800 leading-[1.14] tracking-[-0.03em]">
            {quote.text.split(' ').map((w, i) => (
              <span key={i} data-q-word className="inline-block">{w}&nbsp;</span>
            ))}
          </p>
          <footer className="mt-7 text-[0.92rem] font-700 text-ink-faint">— {quote.attribution}</footer>
        </blockquote>
      </div>
    </section>
  )
}
