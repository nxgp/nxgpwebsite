import { cta } from '../data/content'
import { Button } from './ui/Button'

/**
 * Closing CTA (Figma 212:511): navy band with the headline and intro on the
 * left, the button on the right, and the outlined N-mark drawing behind.
 */

// Figma's background drawing: four parallelograms of the N mark, stroked on
// the inside (a 2px stroke masked to its own shape), at 30% opacity
const SHAPES = [
  { stroke: '#8080FF', d: 'M872 -70.7666V455.891L1085.11 655.775V129.19L872 -70.7666Z' },
  { stroke: '#8080FF', d: 'M642.004 522.873L872.003 738.6V455.92L642.004 240.192V522.873Z' },
  { stroke: '#0000F4', d: 'M355.736 399.975L568.845 599.931V73.2736L355.736 -126.61V399.975Z' },
  { stroke: '#0000F4', d: 'M798.844 6.32678L568.844 -209.4V73.2802L798.844 289.007V6.32678Z' },
]

export function CTA() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="section-v2 relative overflow-hidden bg-navy text-bg">
      <svg
        aria-hidden
        viewBox="0 0 1440 529"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <g opacity={0.3}>
          {SHAPES.map((s, i) => (
            <g key={s.d}>
              <mask id={`cta-shape-${i}`} fill="white">
                <path d={s.d} />
              </mask>
              <path d={s.d} stroke={s.stroke} strokeWidth={2} mask={`url(#cta-shape-${i})`} />
            </g>
          ))}
        </g>
      </svg>

      <div className="shell relative flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[1021px]">
          <h2 id="cta-title" data-reveal className="t-h2 font-normal">
            <span className="block">{cta.h2Lines[0]}</span>
            <span className="block text-peri">{cta.h2Lines[1]}</span>
          </h2>
          <p data-reveal className="pt-8 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-haze">
            {cta.sub}
          </p>
          <p data-reveal className="pt-8 text-[15px] text-mist">
            {cta.emailLead}{' '}
            <a href={`mailto:${cta.email}`} className="text-bg underline-offset-2 hover:underline">
              {cta.email}
            </a>
          </p>
        </div>
        <div data-reveal className="shrink-0 lg:pt-10">
          <Button variant="light" arrow href="/discuss-a-project">
            {cta.ctaPrimary}
          </Button>
        </div>
      </div>
    </section>
  )
}
