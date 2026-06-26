import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { faq } from '../data/content'
import { Eyebrow } from './ui/Eyebrow'
import { cn } from '../lib/cn'

export function FAQ() {
  const ref = useReveal<HTMLDivElement>()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section">
      <div ref={ref} className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="max-w-[26rem]">
          <div data-reveal><Eyebrow>{faq.kicker}</Eyebrow></div>
          <h2 data-reveal className="t-h2 mt-4">{faq.h2}</h2>
        </div>

        <div data-reveal className="flex flex-col">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={cn('border-t border-line', i === faq.items.length - 1 && 'border-b')}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-[1.12rem] font-700 tracking-[-0.01em] text-ink">
                    {item.q}
                  </span>
                  <Plus
                    className={cn(
                      'size-5 shrink-0 text-accent transition-transform duration-300',
                      isOpen && 'rotate-45',
                    )}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[44rem] pb-6 text-[0.98rem] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
