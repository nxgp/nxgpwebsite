import { industries } from '../data/content'
import { Button } from './ui/Button'

/**
 * "Who we serve" (Figma 212:223): split head, three chamfered photo cards
 * with the copy laid over a navy gradient, and a closing prompt.
 */
export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="section-v2 bg-cloud text-navy">
      <div className="shell-wide">
        <div className="grid items-end gap-6 pb-16 lg:grid-cols-[740px_1fr] lg:gap-[72px]">
          <h2 id="industries-title" data-reveal className="t-h2">
            <span className="block">{industries.h2a}</span>
            <span className="block text-accent">{industries.h2b}</span>
          </h2>
          <p data-reveal className="max-w-[532px] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.6] text-slate">
            {industries.sub}
          </p>
        </div>

        <ul className="grid gap-8 md:grid-cols-3">
          {industries.items.map((it) => (
            <li
              key={it.name}
              data-reveal="stagger"
              className="group chamfer relative flex aspect-[427/457] items-end overflow-hidden bg-navy text-bg max-md:aspect-[4/5]"
            >
              <img
                src={it.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-[620ms] ease-[var(--ease-reveal)] group-hover:scale-[1.04]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[rgba(5,19,132,0.34)] to-[#010120] opacity-[0.89]" />
              <div className="relative p-6">
                <p className="t-kicker opacity-80">{it.eyebrow}</p>
                <h3 className="t-h3 pt-2">{it.name}</h3>
                <p className="pt-4 text-[15px] leading-[1.65]">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div data-reveal className="flex flex-col items-center justify-center gap-6 pt-16 text-center sm:flex-row">
          <p className="text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-slate">{industries.foot}</p>
          <Button arrow href="/discuss-a-project">
            Discuss a project
          </Button>
        </div>
      </div>
    </section>
  )
}
