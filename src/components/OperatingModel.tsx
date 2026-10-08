import { operatingModel } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { useActiveOnScroll } from '../hooks/useActiveOnScroll'
import { cn } from '../lib/cn'

/**
 * Our approach (Figma 212:322): the four-step operating loop as an orbit
 * diagram beside the step list. The active step follows scroll position and
 * hover/focus (Webflow behaviour); the matching orbit node fills blue and
 * the two outer rings drift slowly. The orbit is a fixed 599px drawing,
 * shown from tablet up — on phones the step list carries the content.
 */

// node centres on the 599px artwork, clockwise from the top (Figma 212:330)
const NODES = [
  { x: 299.5, y: 121.67, label: 'above' },
  { x: 477.33, y: 299.5, label: 'below' },
  { x: 299.5, y: 477.33, label: 'below' },
  { x: 121.67, y: 299.5, label: 'below' },
] as const

// capability labels around the outer ring: centre x, top y
const CAPS = [
  { x: 299.5, y: 38 },
  { x: 541, y: 294 },
  { x: 299, y: 536 },
  { x: 58, y: 294 },
]

export function OperatingModel() {
  const ref = useReveal<HTMLDivElement>()
  const { steps } = operatingModel
  const { active, bind } = useActiveOnScroll(steps.length)

  return (
    <section id="approach" aria-labelledby="approach-title" className="section-v2 bg-bg text-navy">
      <div ref={ref} className="shell-wide">
        <div className="mx-auto flex max-w-[1224px] flex-col items-center gap-6 pb-16 text-center">
          <p data-reveal className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">
            {operatingModel.eyebrow}
          </p>
          <h2 id="approach-title" data-reveal className="t-h2">
            {operatingModel.h2a}
            <span className="text-accent">{operatingModel.h2b}</span>
          </h2>
          <p data-reveal className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.6] text-slate">
            {operatingModel.sub}
          </p>
        </div>

        <div className="flex flex-col items-center gap-12 xl:flex-row xl:gap-20">
          <Orbit active={active} />

          <ol data-reveal className="flex w-full flex-col gap-px border border-hairline bg-hairline xl:flex-1">
            {steps.map((s, i) => (
              <li
                key={s.n}
                {...bind(i)}
                tabIndex={0}
                className={cn(
                  'flex gap-6 border-l-2 px-6 py-7 transition-[background-color,border-color] duration-300 sm:px-8',
                  i === active ? 'border-accent bg-[#eeeefc]' : 'border-transparent bg-bg',
                )}
              >
                <span
                  className={cn(
                    'w-14 shrink-0 whitespace-nowrap pt-1.5 font-mono text-[11.2px] tracking-[0.14em] transition-colors duration-300',
                    i === active ? 'text-accent' : 'text-grey',
                  )}
                >
                  STEP {s.n}
                </span>
                <div className="min-w-0">
                  <h3
                    className={cn(
                      'font-heading text-[clamp(1.4rem,2vw,1.75rem)] leading-[1.2] tracking-[-0.026em] transition-colors duration-300',
                      i === active ? 'text-navy' : 'text-slate',
                    )}
                  >
                    {s.title}
                  </h3>
                  <p className="pt-3 text-[15px] leading-[1.6] text-slate">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Orbit({ active }: { active: number }) {
  const { steps, orbit, center } = operatingModel
  return (
    <div data-reveal aria-hidden className="relative hidden size-[599px] shrink-0 md:block">
      <img src="/approach/ring-outer.svg" alt="" className="orbit-spin absolute left-[58px] top-[58px] size-[483px]" />
      <img src="/approach/ring-mid.svg" alt="" className="orbit-spin-rev absolute left-[121.7px] top-[121.7px] size-[355.7px]" />
      <img src="/approach/ring-inner.svg" alt="" className="absolute left-[187.2px] top-[187.2px] size-[224.6px]" />

      <div className="absolute left-[212px] top-[262px] flex h-[75px] w-[174px] flex-col items-center justify-center gap-1">
        <img src="/approach/center.svg" alt="" className="absolute inset-0 size-full" />
        <span className="relative font-mono text-[10px] uppercase text-accent">{center.label}</span>
        <span className="relative text-[15px] text-navy">{center.title}</span>
      </div>

      {CAPS.map((c, i) => (
        <span
          key={orbit[i]}
          className="absolute w-[60px] -translate-x-1/2 text-center font-mono text-[10px] uppercase leading-[1.3] text-slate"
          style={{ left: c.x, top: c.y }}
        >
          {orbit[i]}
        </span>
      ))}

      {NODES.map((n, i) => {
        const on = i === active
        return (
          <div
            key={steps[i].n}
            className="absolute size-[56px] -translate-x-1/2 -translate-y-1/2"
            style={{ left: n.x, top: n.y }}
          >
            <span
              className={cn(
                'flex size-full items-center justify-center rounded-full border-[1.5px] font-mono text-[12px] transition-[background-color,border-color,color,opacity] duration-300',
                on ? 'border-accent bg-accent text-bg' : 'border-hairline bg-cloud text-slate opacity-55',
              )}
            >
              {steps[i].n}
            </span>
            <span
              className={cn(
                'absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[14px] transition-[color,opacity] duration-300',
                n.label === 'above' ? 'bottom-full mb-2.5' : 'top-full mt-2.5',
                on ? 'text-navy' : 'text-slate opacity-55',
              )}
            >
              {steps[i].title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
