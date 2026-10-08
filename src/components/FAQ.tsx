import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { faq } from '../data/content'
import { cn } from '../lib/cn'

/**
 * FAQ (Figma 212:479): heading and email prompt beside a one-open-at-a-time
 * accordion. The plus closes to a minus and the answer opens over 0.32s, as
 * in the Webflow build.
 */
export function FAQ() {
  const ref = useReveal<HTMLDivElement>()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-v2 bg-bg text-navy">
      <div ref={ref} className="shell grid gap-10 lg:grid-cols-[1fr_697px] lg:gap-[60px]">
        <div>
          <h2 id="faq-title" data-reveal className="t-h2 max-w-[459px] font-400">
            {faq.h2a}
            <span className="text-accent">{faq.h2Hi}</span>.
          </h2>
          <p data-reveal className="pt-6 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-slate">
            {faq.sub}{' '}
            <a href={`mailto:${faq.email}`} className="text-accent hover:underline">
              {faq.email}
            </a>
          </p>
        </div>

        <div data-reveal className="border-t border-hairline">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            const id = `faq-${i}`
            return (
              <div key={item.q} className="border-b border-hairline">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-8 text-left text-[18px] font-500 leading-[1.4] transition-colors duration-300 hover:text-accent"
                  >
                    {item.q}
                    <span aria-hidden className="relative size-3.5 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                      <span
                        className={cn(
                          'absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current transition-transform duration-300',
                          isOpen ? 'rotate-0' : 'rotate-90',
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-a`}
                  role="region"
                  aria-labelledby={`${id}-q`}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[66ch] pb-8 text-[15px] leading-[1.65] text-slate">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
