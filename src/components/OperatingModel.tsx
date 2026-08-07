import { Search, ListChecks, GitBranch, RefreshCw, ArrowRight, RotateCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { operatingModel } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'

const icons: LucideIcon[] = [Search, ListChecks, GitBranch, RefreshCw]

export function OperatingModel() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="how-we-work" className="section">
      <div ref={ref} className="shell">
        <SectionHeader
          kicker={operatingModel.kicker}
          title={operatingModel.h2}
          sub={operatingModel.sub}
        />

        {/* desktop: horizontal flow · mobile: vertical timeline */}
        <div className="relative mt-12">
          {/* connecting rail — horizontal on desktop, vertical on mobile */}
          <div className="absolute left-0 right-0 top-[26px] hidden h-px bg-line lg:block" />
          <div className="absolute left-[26px] top-8 bottom-8 w-px bg-line lg:hidden" />

          <div className="grid gap-y-9 lg:grid-cols-4 lg:gap-x-6">
            {operatingModel.steps.map((s, i) => {
              const Icon = icons[i]
              return (
                <div data-reveal key={s.title} className="relative flex gap-5 lg:block">
                  <span className="relative z-10 flex size-[52px] shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent-deep shadow-sm">
                    <Icon className="size-5" />
                    {i < operatingModel.steps.length - 1 && (
                      <ArrowRight className="absolute -right-[18px] top-[18px] hidden size-4 text-ink-faint lg:block" />
                    )}
                  </span>

                  <div className="pt-1 lg:mt-5 lg:pt-0">
                    <span className="text-[0.74rem] font-800 tracking-[0.04em] text-accent-deep">
                      STEP {s.n}
                    </span>
                    <h3 className="t-h3 mt-1.5 text-[1.4rem]">{s.title}</h3>
                    <p className="mt-2.5 text-[0.96rem] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* the loop closes — make the cycle explicit */}
        <div
          data-reveal
          className="mt-8 flex flex-col items-center gap-4 rounded-card border border-accent/20 bg-accent-wash/50 px-6 py-6 text-center sm:flex-row sm:justify-center sm:gap-3 sm:text-left"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <RotateCw className="size-5" />
          </span>
          <p className="text-[1.02rem] font-700 text-ink">
            And then it runs again —{' '}
            <span className="font-500 text-ink-soft">
              every deployment feeds the next discovery, so the work compounds
              instead of resetting each quarter.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
