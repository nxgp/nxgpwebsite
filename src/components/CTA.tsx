import { cta } from '../data/content'
import { Button } from './ui/Button'

/**
 * Closing CTA, built to the Webflow build: navy band with the headline,
 * intro and email on the left, the button on the right, and Webflow's thin
 * periwinkle line drawing stretched behind.
 */
export function CTA() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="section-v2 relative overflow-hidden bg-navy text-bg">
      <svg
        aria-hidden
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-0 size-full opacity-50"
      >
        <g stroke="#8080FF" strokeOpacity={0.22}>
          <path d="M300 0v400M520 0v400M700 0v400M880 0v400" />
          <path d="M300 120 420 0M520 400 760 120M700 0 880 200M880 400 1100 140" />
        </g>
      </svg>

      <div className="shell relative grid items-center gap-x-16 gap-y-8 min-[992px]:grid-cols-[1fr_auto]">
        <div data-reveal>
          <h2 id="cta-title" className="t-h2">
            <span className="block">{cta.h2Lines[0]}</span>
            <span className="text-peri">{cta.h2Lines[1]}</span>
          </h2>
          <p className="mt-8 max-w-[54ch] text-bg/80">{cta.sub}</p>
          <p className="mt-8 text-[14px] text-bg/[0.65]">
            {cta.emailLead}{' '}
            <a href={`mailto:${cta.email}`} className="text-bg underline hover:text-peri">
              {cta.email}
            </a>
          </p>
        </div>
        <div data-reveal className="justify-self-start">
          <Button variant="light" href="/discuss-a-project">
            {cta.ctaPrimary}
          </Button>
        </div>
      </div>
    </section>
  )
}
