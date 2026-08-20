import { useReveal } from '../hooks/useReveal'
import { industries } from '../data/content'
import type { Industry } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Button } from './ui/Button'

/** Photography per audience, keyed off the existing `visual` field. */
const photos: Record<Industry['visual'], { src: string; alt: string }> = {
  pe: { src: '/industries/private-equity.jpg', alt: '' },
  enterprise: { src: '/industries/enterprise.jpg', alt: '' },
  gov: { src: '/industries/government.jpg', alt: '' },
}

export function Industries() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="industries" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader title={industries.h2} sub={industries.sub} />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {industries.items.map((ind) => {
            const photo = photos[ind.visual]
            return (
              <article
                data-reveal
                key={ind.name}
                className="group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-card p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                {/* the photograph. alt="" because the card's own words carry the
                    meaning; a description here would just be read twice. */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Darkening scrim. Heavier at the bottom, where the text sits,
                    so the copy keeps its contrast whatever the photo is doing
                    behind it. */}
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(6,11,51,0.30) 0%, rgba(6,11,51,0.62) 45%, rgba(6,11,51,0.88) 100%)',
                  }}
                />


                <h3 className="t-h3 text-[1.5rem] text-white">{ind.name}</h3>
                <p className="mt-1.5 text-[0.78rem] font-700 uppercase tracking-[0.05em] text-white/60">
                  {ind.buyer}
                </p>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-white/85">{ind.frame}</p>
              </article>
            )
          })}
        </div>

        <div data-reveal className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <p className="text-[0.95rem] font-600 text-ink-soft">
            Not sure where you fit? We map it on the first call.
          </p>
          <Button variant="dark" href="/discuss-a-project">
            Discuss a project
          </Button>
        </div>
      </div>
    </section>
  )
}
