import { useReveal } from '../hooks/useReveal'
import { proof } from '../data/content'

export function Proof() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="border-y border-line bg-surface/50">
      <div ref={ref} className="shell py-12">
        <p
          data-reveal
          className="text-center text-[0.8rem] font-700 uppercase tracking-[0.1em] text-ink-faint"
        >
          {proof.label}
        </p>
        <div
          data-reveal
          className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-7 sm:gap-x-16"
        >
          {proof.logos.map((l) => (
            <img
              key={l.name}
              src={l.src}
              alt={l.name}
              loading="lazy"
              className={
                'w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0 ' +
                (l.big ? 'h-12 max-w-[80px] sm:h-14' : 'h-7 max-w-[130px] sm:h-8')
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
