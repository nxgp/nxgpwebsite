import { industries } from '../data/content'
import { Button } from './ui/Button'

/**
 * "Who we serve", built to the Webflow build: split head, three chamfered
 * 4:5 photo cards with the copy over a navy scrim, and a closing prompt.
 */
export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="section-v2 bg-cloud text-ink">
      <div className="shell">
        <div data-reveal className="mb-16 grid gap-6 min-[992px]:grid-cols-[1fr_0.7fr] min-[992px]:items-end min-[992px]:gap-x-20">
          <h2 id="industries-title" className="t-h2 text-navy">
            <span className="block">{industries.h2a}</span>
            <span className="text-accent">{industries.h2b}</span>
          </h2>
          <p className="t-lead max-w-[74ch]">{industries.sub}</p>
        </div>

        <ul className="grid gap-7 min-[992px]:grid-cols-3">
          {industries.items.map((it) => (
            <li
              key={it.name}
              data-reveal="stagger"
              className="group chamfer relative flex aspect-[4/5] items-end overflow-hidden text-bg"
            >
              <img
                src={it.image}
                srcSet={`${it.imageSm} 480w, ${it.image} 960w`}
                sizes="(min-width: 992px) 30vw, 100vw"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-[620ms] ease-[var(--ease-reveal)] group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(#060b3359_0%,#060b339e_45%,#060b33f0_100%)]"
              />
              <div className="relative p-7">
                <p className="t-kicker text-bg/[0.72]">{it.eyebrow}</p>
                <h3 className="t-h3 mt-3">{it.name}</h3>
                <p className="mt-4 text-[14px] text-bg/[0.85]">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center max-md:flex-col">
          <p className="text-slate">{industries.foot}</p>
          <Button href="/discuss-a-project">Discuss a project</Button>
        </div>
      </div>
    </section>
  )
}
