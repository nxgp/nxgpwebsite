import { cta } from '../data/content'
import { Button } from './ui/Button'

/**
 * Closing CTA (Figma 212:511): navy band with the headline and intro on the
 * left, the button on the right, and faint periwinkle line art behind
 * (the Webflow build's drawing).
 */
export function CTA() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="section-v2 relative overflow-hidden bg-navy text-bg">
      <svg
        aria-hidden
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full opacity-50"
      >
        <g stroke="#8080FF" strokeOpacity=".22" fill="none">
          <path d="M300 0v400M520 0v400M700 0v400M880 0v400" />
          <path d="M300 120 420 0M520 400 760 120M700 0 880 200M880 400 1100 140" />
        </g>
      </svg>

      <div className="shell relative flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[1021px]">
          <h2 id="cta-title" data-reveal className="t-h2 font-normal">
            <span className="block">{cta.h2Lines[0]}</span>
            <span className="block text-peri">{cta.h2Lines[1]}</span>
          </h2>
          <p data-reveal className="max-w-[46rem] pt-8 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-mist">
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
