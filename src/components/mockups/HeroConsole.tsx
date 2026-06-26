import {
  Activity,
  Hammer,
  Send,
  Megaphone,
  CircleDollarSign,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * NX's internal operating console — "NXGP · studio operations".
 * Shows how the STUDIO runs its own cross-functional work. It does NOT
 * depict an agent running a portfolio company. Every animatable element
 * carries `data-console` so the Hero can stagger the assembly on load.
 */
const ventures = [
  { name: 'Mentera', dot: '#0E9F6E', active: true },
  { name: 'Convey', dot: '#3B7DE9' },
  { name: 'Logbook', dot: '#6C5CE7' },
  { name: 'Agentics', dot: '#0E9F6E' },
  { name: 'WD Chat', dot: '#D14B8F' },
]

const feed = [
  { icon: Hammer, fn: 'Build', text: 'EHR sync shipped', meta: 'Mentera · 2m ago', tone: 'done' },
  { icon: Send, fn: 'Outreach', text: '1,240 prospects sourced', meta: 'Go-to-market · 11m ago', tone: 'run' },
  { icon: Megaphone, fn: 'Marketing', text: 'Launch brief drafted', meta: 'Convey · 26m ago', tone: 'run' },
]

export function HeroConsole() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-card border border-line bg-surface shadow-lg"
      style={{ willChange: 'transform' }}
    >
      <div data-console className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="win-dots flex gap-1.5">
          <span style={{ background: '#FF5F57' }} />
          <span style={{ background: '#FEBC2E' }} />
          <span style={{ background: '#28C840' }} />
        </div>
        <div className="ml-1 flex items-center gap-2 text-[0.78rem] font-700 text-ink-soft">
          <Activity className="size-3.5 text-accent" />
          NXGP · studio operations
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-pill bg-accent-wash px-2.5 py-1 text-[0.68rem] font-700 text-accent-deep">
          <span className="size-1.5 rounded-full bg-accent" /> fleet live
        </div>
      </div>

      <div className="grid grid-cols-[128px_1fr] sm:grid-cols-[148px_1fr]">
        <aside data-console className="border-r border-line bg-bg/40 px-2.5 py-3">
          <p className="px-2 pb-2 text-[0.62rem] font-700 uppercase tracking-[0.08em] text-ink-faint">
            Ventures
          </p>
          <ul className="flex flex-col gap-0.5">
            {ventures.map((v) => (
              <li
                key={v.name}
                className={cn(
                  'flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[0.8rem] font-600',
                  v.active ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft',
                )}
              >
                <span className="size-2 rounded-full" style={{ background: v.dot }} />
                {v.name}
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-inner border border-dashed border-line px-2 py-2 text-[0.66rem] font-600 text-ink-faint">
            + 1 internal in build
          </div>
        </aside>

        <main className="p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[0.82rem] font-800 tracking-[-0.01em]">Work in flight</p>
            <span className="text-[0.7rem] font-600 text-ink-faint">today</span>
          </div>

          <ul className="flex flex-col gap-2">
            {feed.map((f) => {
              const Icon = f.icon
              return (
                <li key={f.text} data-console className="flex items-center gap-3 rounded-inner border border-line bg-surface px-3 py-2.5">
                  <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-[10px]', f.tone === 'done' ? 'bg-accent-wash text-accent-deep' : 'bg-bg text-ink-soft')}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.84rem] font-700">{f.text}</span>
                    <span className="block text-[0.7rem] font-600 text-ink-faint">{f.fn} · {f.meta.split(' · ')[1]}</span>
                  </span>
                  {f.tone === 'done' ? (
                    <span className="ml-auto flex items-center gap-1 rounded-pill bg-accent-wash px-2 py-0.5 text-[0.66rem] font-700 text-accent-deep">
                      <Check className="size-3" /> shipped
                    </span>
                  ) : (
                    <span className="ml-auto flex items-center gap-1.5 rounded-pill bg-bg px-2 py-0.5 text-[0.66rem] font-700 text-ink-soft">
                      <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                      running
                    </span>
                  )}
                </li>
              )
            })}

            <li data-console className="relative overflow-hidden rounded-inner border border-[#E08A3B]/30 bg-[#FFF7EF] px-3 py-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#E08A3B]/15 text-[#B96C1E]">
                  <CircleDollarSign className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.84rem] font-700">Approval needed · $14k spend</span>
                  <span className="block text-[0.7rem] font-600 text-[#B96C1E]">waiting on operator — above tier T2</span>
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2 pl-11">
                <button className="rounded-pill bg-ink px-3 py-1 text-[0.72rem] font-700 text-white">Approve</button>
                <button className="rounded-pill border border-line bg-surface px-3 py-1 text-[0.72rem] font-700 text-ink-soft">Hold</button>
                <span className="ml-auto flex items-center gap-1 text-[0.66rem] font-700 text-ink-faint">
                  <ShieldCheck className="size-3.5" /> signed & logged
                </span>
              </div>
            </li>
          </ul>
        </main>
      </div>
    </div>
  )
}
