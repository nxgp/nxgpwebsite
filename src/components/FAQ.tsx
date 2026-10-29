import { useState } from 'react'
import { faq } from '../data/content'
import { cn } from '../lib/cn'

/**
 * FAQ, built to the Webflow build: heading and email prompt beside a
 * one-open-at-a-time accordion. The plus closes to a minus and the answer
 * opens over 0.32s.
 *
 * Defaults to the site-wide FAQ; service pages pass their own heading and
 * items, plus an idPrefix so the section and accordion ids stay unique.
 */
export function FAQ({
  h2a = faq.h2a,
  h2Hi = faq.h2Hi,
  items = faq.items,
  idPrefix = 'faq',
}: {
  h2a?: string
  h2Hi?: string
  items?: { q: string; a: string }[]
  idPrefix?: string
} = {}) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id={idPrefix} aria-labelledby={`${idPrefix}-title`} className="section-v2 bg-bg text-ink">
      <div className="shell grid items-start gap-x-[72px] gap-y-8 min-[992px]:grid-cols-[0.62fr_1fr]">
        <div data-reveal>
          <h2 id={`${idPrefix}-title`} className="t-h2 text-navy">
            <span className="block">{h2a.trim()}</span>
            <span className="text-accent">{h2Hi}.</span>
          </h2>
          <p className="t-lead mt-6 max-w-[58ch]">
            {faq.sub}{' '}
            <a href={`mailto:${faq.email}`} className="underline hover:text-accent">
              {faq.email}
            </a>
          </p>
        </div>

        <div data-reveal className="border-t border-hairline">
          {items.map((item, i) => {
            const isOpen = open === i
            const id = `${idPrefix}-${i}`
            return (
              <div key={item.q} className="border-b border-hairline">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left font-500 text-navy hover:text-accent"
                  >
                    {item.q}
                    <span aria-hidden className="relative size-3.5 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                      <span
                        className={cn(
                          'absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current transition-transform duration-[320ms] ease-[ease]',
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
                    'grid transition-[grid-template-rows] duration-[320ms] ease-[ease]',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[66ch] pb-6 text-[14px] text-slate">{item.a}</p>
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
