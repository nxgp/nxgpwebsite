import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion, isSmallScreen } from '../lib/reducedMotion'
import { work } from '../data/content'
import type { Venture } from '../data/content'
import { Eyebrow } from './ui/Eyebrow'
import { VentureVisual } from './mockups/VentureVisuals'
import { useReveal } from '../hooks/useReveal'

function VentureCard({ v }: { v: Venture }) {
  return (
    <article className="group flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <span className="rounded-pill px-3 py-1 text-[0.72rem] font-700" style={{ background: `${v.accent}14`, color: v.accent }}>
          {v.tag}
        </span>
        <ArrowUpRight className="size-5 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>

      <h3 className="t-h3 mt-4 text-[1.55rem]">{v.name}</h3>
      <p className="mt-1 text-[0.82rem] font-700 uppercase tracking-[0.06em] text-ink-faint">{v.domain}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{v.blurb}</p>

      <div className="mt-auto pt-6" data-card-visual>
        <VentureVisual venture={v} />
      </div>
    </article>
  )
}

export function Work() {
  const section = useRef<HTMLDivElement>(null)
  const pinned = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [stacked, setStacked] = useState(false)
  const stackRef = useReveal<HTMLDivElement>()

  useEffect(() => {
    if (prefersReducedMotion() || isSmallScreen()) {
      setStacked(true)
      return
    }
    const sec = section.current
    const pin = pinned.current
    const tr = track.current
    if (!sec || !pin || !tr) return

    const ctx = gsap.context(() => {
      const getDistance = () => tr.scrollWidth - window.innerWidth + 24
      const tween = gsap.to(tr, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + getDistance(), pin, scrub: 0.6, invalidateOnRefresh: true },
      })
      tr.querySelectorAll<HTMLElement>('[data-card-visual]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 26,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left 82%', toggleActions: 'play none none reverse' },
        })
      })
      return () => tween.kill()
    }, sec)

    return () => ctx.revert()
  }, [])

  if (stacked) {
    return (
      <section id="work" className="section">
        <div ref={stackRef} className="shell">
          <div data-reveal><Eyebrow>{work.kicker}</Eyebrow></div>
          <h2 data-reveal className="t-h2 mt-4 max-w-[20ch]">{work.h2}</h2>
          <p data-reveal className="t-lead mt-5 max-w-[40rem]">{work.sub}</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {work.ventures.map((v) => (<div data-reveal key={v.name}><VentureCard v={v} /></div>))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="work" ref={section} className="relative bg-surface/40">
      <div ref={pinned} className="flex h-screen flex-col justify-center overflow-hidden">
        <div className="shell flex items-end justify-between gap-6 pb-8">
          <div>
            <Eyebrow>{work.kicker}</Eyebrow>
            <h2 className="t-h2 mt-4 max-w-[18ch]">{work.h2}</h2>
            <p className="t-lead mt-4 max-w-[36rem]">{work.sub}</p>
          </div>
          <p className="hidden shrink-0 items-center gap-2 text-[0.82rem] font-700 text-ink-faint lg:flex">
            scroll
            <span className="inline-block h-px w-10 bg-ink-faint" />
          </p>
        </div>

        <div ref={track} className="flex gap-5 pl-[max(4vw,calc((100vw-var(--shell))/2))] pr-[6vw]" style={{ willChange: 'transform' }}>
          {work.ventures.map((v) => (
            <div key={v.name} className="w-[min(82vw,400px)] shrink-0">
              <VentureCard v={v} />
            </div>
          ))}
          <div className="flex w-[min(60vw,300px)] shrink-0 items-center">
            <p className="t-h3 max-w-[16ch] text-ink-faint">The bar the embedded team works to.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
