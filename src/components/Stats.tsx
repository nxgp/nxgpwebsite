import { useRef } from 'react'
import { useInView } from 'motion/react'
import NumberFlow from '@number-flow/react'
import { stats } from '../data/content'
import { Aurora } from './ui/Aurora'

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Aurora
        dark
        blobs={[
          { color: 'var(--color-au-peri)', size: 460, top: '-30%', left: '4%', opacity: 0.22, duration: 26 },
          { color: 'var(--color-au-mint)', size: 420, bottom: '-40%', right: '8%', opacity: 0.18, duration: 30, delay: 2 },
        ]}
      />
      <div className="grid-faint absolute inset-0 opacity-60" />

      <div ref={ref} className="shell relative section">
        <h2 className="t-h2 max-w-[24ch] text-white">{stats.h2}</h2>

        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.items.map((s) => (
            <div key={s.label} className="border-t border-white/15 pt-5">
              <div className="flex items-baseline text-[clamp(2.6rem,5vw,3.6rem)] font-800 leading-none tracking-[-0.04em]">
                {s.prefix && <span>{s.prefix}</span>}
                {s.valueOverride ? <span>{s.valueOverride}</span> : <NumberFlow value={inView ? s.value : 0} />}
                {s.suffix && <span>{s.suffix}</span>}
              </div>
              <p className="mt-3 text-[0.96rem] font-600 text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[44rem] text-[0.92rem] font-600 text-white/45">{stats.note}</p>
      </div>
    </section>
  )
}
