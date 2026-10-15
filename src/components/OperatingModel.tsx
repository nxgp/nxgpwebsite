import { operatingModel } from '../data/content'
import { useActiveOnScroll } from '../hooks/useActiveOnScroll'
import { cn } from '../lib/cn'

/**
 * Our approach, built to the Webflow build: the four-step operating loop as
 * a CSS orbit beside the step list. The orbit scales with its column; the
 * two dashed rings drift slowly. The active step follows scroll position and
 * hover/focus; the matching orbit node fills blue.
 */

// node boxes on the orbit, as % of its width (Webflow .orbit-node-1…4)
const NODES = [
  { left: 45.3125, top: 15.625, above: true },
  { left: 75, top: 45.3125 },
  { left: 45.3125, top: 75 },
  { left: 15.625, top: 45.3125 },
] as const

export function OperatingModel() {
  const { steps } = operatingModel
  const { active, bind } = useActiveOnScroll(steps.length)

  return (
    <section id="approach" aria-labelledby="approach-title" className="section-v2 bg-bg text-ink">
      <div className="shell">
        <div data-reveal className="mb-16 flex flex-col items-center gap-6 text-center">
          <p className="t-eyebrow">{operatingModel.eyebrow}</p>
          <h2 id="approach-title" className="t-h2 text-navy">
            {operatingModel.h2a}
            <span className="text-accent">{operatingModel.h2b}</span>
          </h2>
          <p className="t-lead max-w-[74ch]">{operatingModel.sub}</p>
        </div>

        <div className="grid items-start gap-10 min-[992px]:grid-cols-[0.92fr_1fr] min-[992px]:gap-[72px]">
          <figure className="m-0 min-[992px]:sticky min-[992px]:top-[102px]">
            <Orbit active={active} />
          </figure>

          <ol data-reveal className="grid border border-hairline">
            {steps.map((s, i) => (
              <li
                key={s.n}
                {...bind(i)}
                className={cn(
                  'grid grid-cols-[74px_1fr] gap-x-4 border-b border-l-[3px] border-b-hairline px-8 py-[30px] transition-[background-color,border-color] duration-[320ms] ease-[ease] last:border-b-0 max-md:grid-cols-1 max-md:gap-y-2 max-md:px-5',
                  i === active ? 'border-l-accent bg-peri/[0.26]' : 'border-l-transparent',
                )}
              >
                <span className="whitespace-nowrap pt-[7px] font-mono text-[12px] tracking-[0.14em] text-accent">
                  STEP {s.n}
                </span>
                <div>
                  <h3 className="text-[length:var(--fs-h6)] font-500 leading-[1.25] tracking-[-0.02em] text-navy">
                    {s.title}
                  </h3>
                  <p className={cn('mt-3 text-[14px]', i === active ? 'text-ink' : 'text-slate')}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

const LABEL = 'absolute font-mono text-[12px] uppercase tracking-[0.14em] text-slate max-[479px]:text-[10px]'

function Orbit({ active }: { active: number }) {
  const { steps, orbit, center } = operatingModel
  // side labels break onto two lines, as in Figma, so they clear the nodes
  const twoLines = (s: string) => s.replace(/ (\S+)$/, '\n$1')
  return (
    <div
      data-reveal
      role="img"
      aria-label="The Nx delivery loop: discover, prioritize, deliver and optimize"
      className="relative aspect-square w-full"
    >
      <div className="orbit-spin absolute left-[9.6875%] top-[9.6875%] aspect-square w-[80.625%] rounded-full border border-dashed border-hairline" />
      <div className="orbit-spin-rev absolute left-[20.3125%] top-[20.3125%] aspect-square w-[59.375%] rounded-full border border-dashed border-hairline" />
      <div className="absolute left-[31.25%] top-[31.25%] aspect-square w-[37.5%] rounded-full border border-hairline" />

      <div className="orbit-tab absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 whitespace-nowrap bg-peri/[0.28] px-2.5 py-1">
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{center.label}</span>
        <span className="text-[12px] text-navy">{center.title}</span>
      </div>

      {/* on small phones the top/bottom labels move out to the edge so the
          step names above and below the nodes don't run into them */}
      <span className={cn(LABEL, 'left-1/2 top-[3%] -translate-x-1/2 whitespace-nowrap max-[479px]:top-[1%]')}>{orbit[0]}</span>
      <span className={cn(LABEL, 'left-[92%] top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-pre-line text-center')}>
        {twoLines(orbit[1])}
      </span>
      <span className={cn(LABEL, 'bottom-[3%] left-1/2 -translate-x-1/2 whitespace-nowrap max-[479px]:bottom-[1%]')}>{orbit[2]}</span>
      <span className={cn(LABEL, 'left-[8%] top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-pre-line text-center')}>
        {twoLines(orbit[3])}
      </span>

      {NODES.map((n, i) => {
        const on = i === active
        return (
          <div
            key={steps[i].n}
            className="absolute aspect-square w-[9.375%]"
            style={{ left: `${n.left}%`, top: `${n.top}%` }}
          >
            <span
              className={cn(
                'flex size-full items-center justify-center rounded-full border font-mono text-[12px] transition-[background-color] duration-[320ms] ease-[ease]',
                on ? 'border-accent bg-accent text-white' : 'border-hairline bg-white text-slate',
              )}
            >
              {steps[i].n}
            </span>
            <span
              className={cn(
                'absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[14px] transition-colors duration-[320ms] max-[479px]:text-[12px]',
                'above' in n ? 'bottom-full mb-2.5 max-[479px]:mb-1.5' : 'top-full mt-2.5 max-[479px]:mt-1.5',
                on ? 'text-navy' : 'text-slate',
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
