import { Check } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { engineering } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'

export function Engineering() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="engineering" className="section bg-surface/40">
      <div ref={ref} className="shell">
        <SectionHeader kicker={engineering.kicker} title={engineering.h2} sub={engineering.sub} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {engineering.capabilities.map((c) => (
            <div data-reveal key={c.title}>
              <Card className="flex h-full flex-col p-6">
                <h3 className="text-[1.12rem] font-800 tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{c.body}</p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {c.tags.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-[0.84rem] font-600 text-ink-faint">
                      <Check className="size-3.5 text-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-line bg-surface px-6 py-5 shadow-sm">
          <span className="mr-2 text-[0.72rem] font-700 uppercase tracking-[0.08em] text-ink-faint">The stack</span>
          {engineering.stack.map((s) => (
            <span key={s} className="rounded-pill bg-bg px-3 py-1 text-[0.82rem] font-700 text-ink-soft">{s}</span>
          ))}
        </div>

        <div data-reveal className="mt-6 overflow-hidden rounded-card bg-ink p-7 text-white shadow-lg sm:p-9">
          <div>
            <span className="t-eyebrow text-au-mint">{engineering.proof.label}</span>
            <h3 className="t-h3 mt-3 text-white">{engineering.proof.name}</h3>
            <p className="mt-2 max-w-[34rem] text-white/65">{engineering.proof.line}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {engineering.proof.chips.map((chip) => (
              <span key={chip} className="rounded-pill border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.82rem] font-700 text-white/85">{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
