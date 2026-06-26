import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion, isSmallScreen } from '../lib/reducedMotion'
import { scrollToId } from '../lib/useSmoothScroll'
import { hero } from '../data/content'
import { Pill } from './ui/Pill'
import { Button } from './ui/Button'
import { Aurora } from './ui/Aurora'
import { HeroConsole } from './mockups/HeroConsole'

export function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const auroraRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const mockRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = prefersReducedMotion()

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('[data-hero-word]')
      const consoleRows = mockRef.current?.querySelectorAll<HTMLElement>('[data-console]') ?? []
      const supporting = gsap.utils.toArray<HTMLElement>('[data-hero-fade]')

      if (reduce) {
        gsap.set([words, supporting, consoleRows], { clearProps: 'all', opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({ delay: 0.15 })
      tl.set(words, { yPercent: 110 })
        .set(consoleRows, { opacity: 0, y: 18 })
        .set(supporting, { opacity: 0, y: 16 })
        .to(words, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 })
        .to(supporting, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, '-=0.7')
        .to(mockRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.9')
        .to(consoleRows, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.07 }, '-=0.55')

      if (!isSmallScreen()) {
        const st = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: '+=70%', pin: true, scrub: true, anticipatePin: 1 },
        })
        st.to(textRef.current, { y: -70, opacity: 0.18, ease: 'none' }, 0)
          .to(mockRef.current, { y: -150, scale: 0.94, rotateX: 7, rotateZ: -2, ease: 'none' }, 0)
          .to(auroraRef.current, { y: -34, ease: 'none' }, 0)
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={root} className="relative">
      <div ref={auroraRef} className="absolute inset-0 -z-10" style={{ willChange: 'transform' }}>
        <Aurora
          blobs={[
            { color: 'var(--color-au-peri)', size: 460, top: '-6%', left: '-4%', duration: 24 },
            { color: 'var(--color-au-mint)', size: 420, top: '8%', right: '-6%', duration: 26, delay: 2 },
            { color: 'var(--color-au-peach)', size: 360, bottom: '-12%', left: '24%', duration: 22, delay: 1, opacity: 0.42 },
            { color: 'var(--color-au-lilac)', size: 300, top: '34%', left: '46%', duration: 28, delay: 3, opacity: 0.4 },
          ]}
        />
      </div>

      <div className="shell grid items-center gap-12 pb-[clamp(40px,7vw,90px)] pt-[calc(var(--nav-h)+clamp(36px,7vw,84px))] lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div ref={textRef} className="min-w-0" style={{ willChange: 'transform' }}>
          <span data-hero-fade className="inline-block">
            <Pill href="#approach" onClick={(e: React.MouseEvent) => { e.preventDefault(); scrollToId('about') }}>
              {hero.pill}
            </Pill>
          </span>

          <h1 className="t-h1 mt-5">
            {hero.h1.map((line) => (
              <span key={line} className="flex flex-wrap">
                {line.split(' ').map((word, i) => (
                  <span key={`${word}-${i}`} className="overflow-hidden pb-[0.08em] pr-[0.24em]">
                    <span data-hero-word className="inline-block">{word}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p data-hero-fade className="t-lead mt-6 max-w-[34rem]">{hero.sub}</p>

          <form data-hero-fade onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center rounded-pill border border-line bg-surface px-1.5 py-1.5 shadow-sm focus-within:border-ink/25 sm:min-w-[16rem]">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" aria-label="Work email" placeholder={hero.inputPlaceholder} className="w-full bg-transparent px-3 py-1.5 text-[0.95rem] outline-none placeholder:text-ink-faint" />
            </div>
            <Button variant="dark" onClick={() => scrollToId('cta')}>
              {hero.ctaPrimary}
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="light" onClick={() => scrollToId('portfolio')}>{hero.ctaSecondary}</Button>
          </form>

          <p data-hero-fade className="mt-6 text-[0.88rem] font-600 text-ink-faint">{hero.note}</p>
        </div>

        <div ref={mockRef} className="min-w-0 opacity-0 [perspective:1400px]" style={{ willChange: 'transform' }}>
          <HeroConsole />
        </div>
      </div>
    </section>
  )
}
