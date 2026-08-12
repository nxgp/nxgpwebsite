import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { withMotion } from '../lib/motion'
import { prefersReducedMotion, isSmallScreen } from '../lib/reducedMotion'
import { scrollToId } from '../lib/useSmoothScroll'
import { useBooking } from './BookingModal'
import { hero } from '../data/content'
import { Button } from './ui/Button'
import { Aurora } from './ui/Aurora'
import { HeroConsole } from './mockups/HeroConsole'

export function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const auroraRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const mockRef = useRef<HTMLDivElement>(null)
  const openBooking = useBooking()

  useEffect(() => {
    const el = root.current
    // Reduced motion: the prerendered hero is already fully visible — nothing
    // to hide, nothing to animate, no need to load the motion runtime.
    if (!el || prefersReducedMotion()) return

    return withMotion(({ gsap }) => {
      const ctx = gsap.context(() => {
        const words = gsap.utils.toArray<HTMLElement>('[data-hero-word]')
        const consoleRows = mockRef.current?.querySelectorAll<HTMLElement>('[data-console]') ?? []
        const supporting = gsap.utils.toArray<HTMLElement>('[data-hero-fade]')

        // ---- on load: clip-reveal + console assembly ----
        const tl = gsap.timeline({ delay: 0.15 })
        tl.set(words, { yPercent: 110 })
          .set(consoleRows, { opacity: 0, y: 18 })
          .set(supporting, { opacity: 0, y: 16 })
          .to(words, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 })
          .to(supporting, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, '-=0.7')
          .to(mockRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.9')
          .to(consoleRows, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.07 }, '-=0.55')

        // ---- on scroll: gentle parallax, NO pin (smooth, never sticks) ----
        if (!isSmallScreen()) {
          gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
          })
            .to(textRef.current, { y: -50, ease: 'none' }, 0)
            .to(mockRef.current, { y: -90, ease: 'none' }, 0)
            .to(auroraRef.current, { y: 40, ease: 'none' }, 0)
        }
      }, el)

      return () => ctx.revert()
    })
  }, [])

  return (
    <section id="top" ref={root} className="relative overflow-hidden">
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

          <h1 className="t-h1 mt-5">
            {[hero.h1a, hero.h1b].map((line, li) => (
              <span key={line} className="flex flex-wrap">
                {line.split(' ').map((word, i) => (
                  <span key={`${word}-${i}`} className="overflow-hidden pb-[0.08em] pr-[0.24em]">
                    <span data-hero-word className={li === 1 ? 'inline-block text-accent' : 'inline-block'}>{word}</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p data-hero-fade className="t-lead mt-6 max-w-[36rem]">{hero.sub}</p>

          <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="dark" onClick={openBooking}>
              {hero.ctaPrimary}
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="light" onClick={() => scrollToId('what-we-build')}>{hero.ctaSecondary}</Button>
          </div>

          <p data-hero-fade className="mt-6 max-w-[34rem] text-[0.88rem] font-600 text-ink-faint">{hero.note}</p>
        </div>

        {/* starts hidden for the entrance, but .hero-mock is a CSS failsafe
            that fades it in regardless — so no-JS visitors, reduced-motion
            users and slow connections all still get the console */}
        <div ref={mockRef} className="hero-mock min-w-0 opacity-0" style={{ willChange: 'transform' }}>
          <HeroConsole />
        </div>
      </div>
    </section>
  )
}
