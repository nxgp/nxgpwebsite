import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/reducedMotion'
import { cta } from '../data/content'
import { Button } from './ui/Button'
import { Aurora } from './ui/Aurora'
import { scrollToId } from '../lib/useSmoothScroll'

export function CTA() {
  const root = useRef<HTMLDivElement>(null)
  const aurora = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>('[data-cta-word]')
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 72%' } })
      tl.from(words, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08 })
      if (aurora.current) {
        gsap.fromTo(aurora.current, { opacity: 0.4, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 78%' } })
      }
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="cta" className="section">
      <div className="shell">
        <div ref={root} className="relative overflow-hidden rounded-card bg-ink px-7 py-[clamp(56px,9vw,110px)] text-center text-white shadow-lg">
          <div ref={aurora} className="absolute inset-0">
            <Aurora
              dark
              blobs={[
                { color: 'var(--color-au-peri)', size: 520, top: '-34%', left: '8%', opacity: 0.3, duration: 24 },
                { color: 'var(--color-au-mint)', size: 460, bottom: '-44%', right: '6%', opacity: 0.26, duration: 28, delay: 1.5 },
                { color: 'var(--color-au-lilac)', size: 360, top: '20%', right: '34%', opacity: 0.2, duration: 30, delay: 3 },
              ]}
            />
          </div>

          <div className="relative mx-auto max-w-[42rem]">
            <h2 className="t-h2 text-white">
              {cta.h2Lines.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <span data-cta-word className="inline-block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="t-lead mx-auto mt-5 text-white/65">{cta.sub}</p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="light" href={`mailto:${cta.email}`} className="bg-white text-ink">
                {cta.ctaPrimary}
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => scrollToId('portfolio')}>
                {cta.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
