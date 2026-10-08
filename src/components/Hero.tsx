import { hero, proof } from '../data/content'
import { scrollToId } from '../lib/useSmoothScroll'
import { Button } from './ui/Button'

/**
 * v2 hero (Figma 212:5): centered editorial headline on navy over the
 * ribbed-curtain photo, with the client logo strip pinned to the bottom.
 * Static by design — the Webflow reference has no hero entrance, so the
 * prerendered page is final from first paint.
 */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[min(802px,100svh)] flex-col overflow-hidden bg-navy text-bg md:min-h-[802px]">
      <img
        src="/hero/ribbed.webp"
        alt=""
        width={1000}
        height={563}
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(6,11,51,0.88) 0%, rgba(6,11,51,0) 58%), linear-gradient(61.9deg, rgb(6,11,51) 0.45%, rgba(6,11,51,0.74) 52.7%, rgba(6,11,51,0.22) 83.3%)',
        }}
      />

      <div className="shell relative flex flex-col items-center gap-8 pt-[clamp(140px,15vw,211px)] text-center">
        <h1 className="t-h1 max-w-[52rem] text-white">
          <span className="block">
            {hero.h1a}
            <span className="text-hero-hi">{hero.h1Hi}</span>
          </span>
          <span className="block">{hero.h1b}</span>
        </h1>
        <span aria-hidden className="h-[5px] w-16 bg-accent" />
        <p className="max-w-[828px] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-haze">{hero.sub}</p>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Button variant="light" arrow href="/discuss-a-project">
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
      </div>

      {/* client logos — alpha masks tinted lavender, as in Figma */}
      <ul
        aria-label={proof.label}
        className="shell relative mt-auto flex flex-wrap items-center justify-center gap-x-16 gap-y-6 pb-10 pt-16"
      >
        {proof.strip.map((l) => (
          <li key={l.name} className="flex h-[60px] items-center">
            <span
              role="img"
              aria-label={l.name}
              className="block bg-[#b0a6cc] opacity-[0.82]"
              style={{
                width: l.w,
                height: l.h,
                maskImage: `url(${l.src})`,
                WebkitMaskImage: `url(${l.src})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
