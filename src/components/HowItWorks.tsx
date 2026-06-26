import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion, isSmallScreen } from '../lib/reducedMotion'
import { howItWorks } from '../data/content'
import { Eyebrow } from './ui/Eyebrow'
import { studioVisuals } from './mockups/StudioVisuals'
import { cn } from '../lib/cn'

export function HowItWorks() {
  const section = useRef<HTMLDivElement>(null)
  const pinned = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [stacked, setStacked] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || isSmallScreen()) {
      setStacked(true)
      return
    }
    const el = pinned.current
    const sec = section.current
    if (!el || !sec) return

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: '+=220%',
        pin: el,
        scrub: true,
        onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3 * 0.999))),
      })
      return () => st.kill()
    }, sec)

    return () => ctx.revert()
  }, [])

  const Visual = studioVisuals[active]

  if (stacked) {
    return (
      <section id="about" className="section">
        <div className="shell">
          <Eyebrow>{howItWorks.kicker}</Eyebrow>
          <h2 className="t-h2 mt-4 max-w-[18ch]">{howItWorks.h2}</h2>
          <p className="t-lead mt-5 max-w-[40rem]">{howItWorks.sub}</p>
          <div className="mt-12 flex flex-col gap-12">
            {howItWorks.states.map((s, i) => {
              const V = studioVisuals[i]
              return (
                <div key={s.title} className="grid gap-6 sm:grid-cols-2 sm:items-center">
                  <div>
                    <span className="text-[0.8rem] font-800 text-accent-deep">0{i + 1}</span>
                    <h3 className="t-h3 mt-2">{s.title}</h3>
                    <p className="mt-3 text-ink-soft">{s.body}</p>
                  </div>
                  <V />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={section} className="relative">
      <div ref={pinned} className="flex min-h-screen items-center overflow-hidden">
        <div className="shell grid w-full items-center gap-10 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Eyebrow>{howItWorks.kicker}</Eyebrow>
            <h2 className="t-h2 mt-4 max-w-[16ch]">{howItWorks.h2}</h2>
            <p className="t-lead mt-5 max-w-[38rem]">{howItWorks.sub}</p>

            <div className="mt-10 flex flex-col gap-2">
              {howItWorks.states.map((s, i) => {
                const on = i === active
                return (
                  <button
                    key={s.title}
                    onClick={() => setActive(i)}
                    className={cn(
                      'group relative rounded-inner border px-5 py-4 text-left transition-all duration-500',
                      on ? 'border-line bg-surface shadow-soft' : 'border-transparent bg-transparent opacity-55 hover:opacity-80',
                    )}
                  >
                    <span className={cn('absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-all duration-500', on && 'h-[62%]')} />
                    <span className="flex items-center gap-3">
                      <span className={cn('flex size-7 items-center justify-center rounded-full text-[0.74rem] font-800 transition-colors duration-500', on ? 'bg-accent text-white' : 'bg-ink/5 text-ink-soft')}>{i + 1}</span>
                      <span className="text-[1.06rem] font-800 tracking-[-0.01em]">{s.title}</span>
                    </span>
                    <motion.div initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <p className="pl-10 pt-2 text-[0.95rem] leading-relaxed text-ink-soft">{s.body}</p>
                    </motion.div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.div key={active} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <Visual />
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex justify-center gap-2">
              {howItWorks.states.map((_, i) => (
                <span key={i} className={cn('h-1.5 rounded-full transition-all duration-500', i === active ? 'w-7 bg-accent' : 'w-1.5 bg-ink/15')} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
