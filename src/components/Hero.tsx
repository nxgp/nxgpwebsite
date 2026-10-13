import { hero, proof } from '../data/content'
import { scrollToId } from '../lib/scrollToId'
import { cn } from '../lib/cn'
import { Button } from './ui/Button'

/**
 * Hero, built to the Webflow build: centred headline on navy over the
 * ribbed-curtain photo and its two-layer scrim, a short blue rule, the two
 * actions, and the client logos in white below. Static by design — Webflow
 * has no hero entrance, so the prerendered page is final from first paint.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-bg">
      <div aria-hidden className="absolute inset-0">
        <img
          src="/hero/ribbed.webp"
          alt=""
          width={1000}
          height={563}
          fetchPriority="high"
          className="pointer-events-none size-full object-cover object-[68%_50%]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(120% 82% at 50% 42%, #060b336b, #060b33e0 72%), linear-gradient(#060b33e0, #060b3347 34%, #060b33f0)',
          }}
        />
      </div>

      <div className="shell relative pb-16 pt-[176px] text-center">
        <h1 className="t-h1 mx-auto max-w-[20ch] text-bg">
          {hero.h1a}
          <span className="text-peri">{hero.h1Hi}</span>
          <br />
          {hero.h1b}
        </h1>
        <span aria-hidden className="mx-auto mt-8 block h-1 w-[58px] bg-accent" />
        <p className="mx-auto mt-8 max-w-[66ch] text-bg/[0.82]">{hero.sub}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button variant="light" href="/discuss-a-project">
            {hero.ctaPrimary}
          </Button>
          <Button
            variant="ghost"
            href="#approach"
            onClick={(e) => {
              if (!document.getElementById('approach')) return
              e.preventDefault()
              scrollToId('approach')
            }}
          >
            {hero.ctaSecondary}
          </Button>
        </div>

        {/* client logos, knocked out to white at 62% */}
        <ul aria-label={proof.label} className="mt-[88px] flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {proof.strip.map((l) => (
            <li key={l.name}>
              <img
                src={l.src}
                alt={l.name}
                loading="lazy"
                decoding="async"
                style={'w' in l ? { width: l.w } : undefined}
                className={cn('w-auto object-cover opacity-[0.62] brightness-0 invert', l.tall ? 'h-[42px]' : 'h-[26px]')}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
