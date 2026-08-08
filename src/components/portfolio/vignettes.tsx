import { Check, Calendar, FileText, Database, Bot, Sparkles, Star } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Portfolio vignettes — one animated "outcome moment" per product.
 *
 * Shared idiom (matches the hero console): window chrome with traffic dots,
 * hairline rows, pill badges. All motion is single-run CSS keyframes with
 * per-element delays (--d); the stage remounts each scene, so it replays on
 * every visit. Under reduced motion each scene rests at its completed state.
 */

/* ---------- shared chrome ---------- */

function Window({
  title,
  badge,
  dark = false,
  children,
}: {
  title: string
  badge?: React.ReactNode
  dark?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-inner border shadow-sm',
        dark ? 'border-white/10 bg-navy text-white' : 'border-line bg-surface',
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2.5 border-b px-3.5 py-2.5',
          dark ? 'border-white/10' : 'border-line bg-bg/50',
        )}
      >
        <div className="win-dots flex gap-1.5">
          <span style={{ background: '#FF5F57' }} />
          <span style={{ background: '#FEBC2E' }} />
          <span style={{ background: '#28C840' }} />
        </div>
        <span
          className={cn(
            'text-[0.62rem] font-700 uppercase tracking-[0.09em]',
            dark ? 'text-white/50' : 'text-ink-faint',
          )}
        >
          {title}
        </span>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      <div className="relative flex-1 overflow-hidden p-3.5">{children}</div>
    </div>
  )
}

const wash = { background: 'linear-gradient(135deg, #F4F4FF 0%, #FDFDFC 62%)' }

function Pill({
  className,
  children,
  style,
}: {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[0.62rem] font-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

const D = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties

/* ---------- 01 · NX Agentic Platform ---------- */

export function AgenticViz() {
  return (
    <Window
      title="Agent registry"
      badge={<Pill className="bg-accent-wash text-accent-deep">prod</Pill>}
    >
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        <div className="pv-in flex items-center gap-3 rounded-inner border border-line bg-surface px-3 py-2.5" style={D(0.1)}>
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-accent-wash text-accent-deep">
            <Bot className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.8rem] font-700">invoice-triage-agent</span>
            <span className="block truncate text-[0.66rem] font-600 text-ink-faint">
              built by the ops team · no ML team involved
            </span>
          </span>
          <span className="relative ml-auto h-5 w-[74px]">
            <Pill className="pv-out absolute right-0 bg-bg text-ink-soft" style={D(1.4)}>
              draft
            </Pill>
            <Pill className="pv-pop absolute right-0 bg-[#E7F8EC] text-[#1D8A46]" style={D(1.5)}>
              <i className="size-1.5 rounded-full bg-[#28C840]" /> running
            </Pill>
          </span>
        </div>

        <div className="pv-in flex items-center justify-between rounded-inner border border-line bg-surface px-3 py-2.5" style={D(2.1)}>
          <span className="text-[0.62rem] font-700 uppercase tracking-[0.09em] text-ink-faint">
            Requests served
          </span>
          <span className="relative h-6 w-16 text-right font-display text-[1.15rem] font-800 tracking-[-0.01em] text-accent">
            <span className="pv-out absolute right-0" style={D(3.2)}>1,206</span>
            <span className="pv-in absolute right-0" style={D(3.25)}>1,347</span>
          </span>
        </div>

        <div className="pv-in flex items-center gap-3 rounded-inner border border-dashed border-line px-3 py-2" style={D(4)}>
          <span className="flex size-7 items-center justify-center rounded-[9px] bg-bg text-ink-faint">
            <Sparkles className="size-3.5" />
          </span>
          <span className="text-[0.74rem] font-600 text-ink-soft">churn-radar-agent</span>
          <Pill className="ml-auto bg-bg text-ink-faint">queued</Pill>
        </div>

        <p className="pv-in mt-auto text-center text-[0.68rem] font-600 text-ink-faint" style={D(4.8)}>
          2 agents in production · 0 engineers on call
        </p>
      </div>
    </Window>
  )
}

/* ---------- 02 · Tera ---------- */

const teraTasks = [
  { label: 'Patient intake sent', at: 0.3 },
  { label: 'Consent form signed', at: 1.4 },
  { label: 'No-show rebooked · Tue 2:40', at: 2.5 },
]

export function TeraViz() {
  return (
    <Window
      title="Today at the clinic"
      badge={
        <Pill className="bg-accent-wash text-accent-deep">
          <i className="size-1.5 animate-pulse rounded-full bg-accent" /> handled by Tera
        </Pill>
      }
    >
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        {teraTasks.map((t) => (
          <div key={t.label} className="pv-in flex items-center gap-3 rounded-inner border border-line bg-surface px-3 py-2.5" style={D(t.at)}>
            <span className="flex size-7 items-center justify-center rounded-[9px] bg-accent-wash text-accent-deep">
              <FileText className="size-3.5" />
            </span>
            <span className="text-[0.78rem] font-600">{t.label}</span>
            <span className="pv-pop ml-auto flex size-5 items-center justify-center rounded-full bg-[#E7F8EC] text-[#1D8A46]" style={D(t.at + 0.55)}>
              <Check className="size-3" />
            </span>
          </div>
        ))}
        <div className="pv-in mt-auto flex items-center justify-center gap-2 rounded-inner bg-ink px-3 py-2 text-white" style={D(3.8)}>
          <span className="text-[0.72rem] font-700">12 tasks handled today</span>
          <span className="text-[0.72rem] font-600 text-au-mint">· 0 staff touches</span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 03 · Graph Brain ---------- */

const sources = [
  { label: 'policy-v4.pdf', at: 1.3 },
  { label: 'wiki · billing', at: 1.7 },
  { label: 'ticket #4821', at: 2.1 },
]

export function GraphBrainViz() {
  return (
    <Window title="Company knowledge" badge={<Pill className="bg-bg text-ink-soft">connected</Pill>}>
      <div className="flex h-full flex-col gap-3" style={wash}>
        <div className="pv-in rounded-pill border border-line bg-surface px-3.5 py-2 text-[0.78rem] font-600 text-ink" style={D(0.1)}>
          <span className="text-ink-faint">⌕ </span>
          <span className="pv-type" style={D(0.35)}>What’s our enterprise refund policy?</span>
        </div>

        <div className="flex gap-2">
          {sources.map((s) => (
            <span key={s.label} className="pv-glow rounded-pill border border-line bg-surface px-2.5 py-1 text-[0.66rem] font-600 text-ink-faint" style={D(s.at)}>
              {s.label}
            </span>
          ))}
        </div>

        <div className="pv-in rounded-inner border border-line bg-surface p-3" style={D(2.7)}>
          <p className="text-[0.76rem] leading-relaxed text-ink">
            Enterprise plans include a 30-day refund window; billing issues a pro-rated credit
            within 5 business days.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Pill className="pv-pop bg-accent-wash text-accent-deep" style={D(3.5)}>
              <Check className="size-3" /> grounded · 3 sources
            </Pill>
          </div>
        </div>

        <p className="pv-in mt-auto text-center text-[0.68rem] font-600 text-ink-faint" style={D(4.2)}>
          Your docs, wikis and tickets — one brain, every answer cited
        </p>
      </div>
    </Window>
  )
}

/* ---------- 04 · NX Chat Assistant ---------- */

export function AssistantViz() {
  return (
    <Window title="yoursite.com · 2:14 AM" badge={<Pill className="bg-bg text-ink-soft">visitor online</Pill>}>
      <div className="relative flex h-full flex-col gap-2" style={wash}>
        <div className="pv-in max-w-[78%] self-end rounded-[12px] bg-accent px-3 py-2 text-[0.76rem] font-500 text-white" style={D(0.2)}>
          Can it plug into our support stack?
        </div>
        <div className="pv-in max-w-[82%] rounded-[12px] border border-line bg-surface px-3 py-2 text-[0.76rem] text-ink" style={D(1)}>
          Yes — and I can show you. Want to grab 30 minutes?{' '}
          <span className="font-700 text-accent underline underline-offset-2">Book a call ↗</span>
        </div>

        {/* the outcome: lead lands in the team's Slack while everyone sleeps */}
        <div className="pv-in absolute bottom-9 right-0 w-[220px] rounded-inner bg-ink p-3 text-white shadow-lg" style={D(2.4)}>
          <p className="text-[0.6rem] font-700 uppercase tracking-[0.09em] text-au-mint"># leads · just now</p>
          <p className="mt-1 text-[0.76rem] font-700">New lead — Dana K.</p>
          <p className="text-[0.68rem] text-white/65">needs an AI copilot · booked for Tue</p>
        </div>
        <Pill className="pv-pop absolute bottom-1 right-0 border border-line bg-surface text-ink-soft" style={D(3.6)}>
          <Sparkles className="size-3 text-accent" /> learned +1 answer
        </Pill>
      </div>
    </Window>
  )
}

/* ---------- 05 · Enterprise Chat ---------- */

const apps = [
  { icon: Calendar, label: 'Calendar', at: 2 },
  { icon: FileText, label: 'Docs', at: 2.5 },
  { icon: Database, label: 'CRM', at: 3 },
]

export function EntChatViz() {
  return (
    <Window title="Company chat" badge={<Pill className="bg-accent-wash text-accent-deep">50+ apps</Pill>}>
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        <div className="pv-in max-w-[85%] self-end rounded-[12px] bg-bg px-3 py-2 text-[0.76rem] font-600 text-ink" style={D(0.2)}>
          Move the QBR to Friday and brief the team
        </div>
        <div className="pv-in max-w-[88%] rounded-[12px] border border-line bg-surface px-3 py-2.5" style={D(1)}>
          <p className="text-[0.76rem] text-ink">
            On it — rescheduling, updating the brief, and logging it to the account.
          </p>
          <div className="mt-2 flex gap-1.5">
            {apps.map((a) => (
              <span key={a.label} className="pv-in inline-flex items-center gap-1 rounded-pill border border-line bg-bg px-2 py-0.5 text-[0.64rem] font-600 text-ink-soft" style={D(a.at)}>
                <a.icon className="size-3 text-accent" /> {a.label}
                <Check className="pv-pop size-3 text-[#1D8A46]" style={D(a.at + 0.4)} />
              </span>
            ))}
          </div>
        </div>
        <div className="pv-in mt-auto flex items-center justify-center gap-2 rounded-inner bg-ink px-3 py-2 text-white" style={D(3.9)}>
          <Check className="size-3.5 text-au-mint" />
          <span className="text-[0.72rem] font-700">Done — 3 apps updated from one chat</span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 06 · NX Bird Eye ---------- */

export function BirdEyeViz() {
  return (
    <Window title="Reviews · all locations" badge={<Pill className="bg-bg text-ink-soft">watching</Pill>}>
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        <div className="pv-in rounded-inner border border-line bg-surface px-3 py-2.5" style={D(0.2)}>
          <div className="flex items-center gap-1.5">
            <span className="text-[0.72rem] font-700">New review</span>
            <span className="ml-1 flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <Star key={i} className="pv-pop size-3 fill-[#D9A514] text-[#D9A514]" style={D(0.6 + i * 0.15)} />
              ))}
              <Star className="size-3 text-line" />
            </span>
          </div>
          <p className="mt-1 text-[0.7rem] italic text-ink-soft">
            “Great service — wait time could improve…”
          </p>
        </div>

        <div className="pv-in rounded-inner border border-line bg-surface px-3 py-2.5" style={D(1.7)}>
          <p className="text-[0.6rem] font-700 uppercase tracking-[0.09em] text-accent-deep">
            Reply · drafting
          </p>
          <div className="pv-shimmer mt-1.5 h-2 w-[85%] rounded" />
          <div className="pv-shimmer mt-1 h-2 w-[62%] rounded" />
          <Pill className="pv-pop mt-2 bg-[#E7F8EC] text-[#1D8A46]" style={D(3.2)}>
            <Check className="size-3" /> posted on-brand
          </Pill>
        </div>

        <div className="pv-in mt-auto flex items-end justify-between" style={D(3.9)}>
          <Pill className="bg-accent-wash text-accent-deep">3 reviews → 2 leads this week</Pill>
          <svg viewBox="0 0 90 28" className="h-7 w-[90px]" aria-hidden>
            <path
              d="M2 24 C18 22 26 18 40 16 S 70 10 88 4"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              className="pv-draw"
              style={{ ...D(4.1), '--len': '120' } as React.CSSProperties}
            />
          </svg>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 07 · NX CRM ---------- */

const fields = [
  { label: 'Fleet size', value: '240 trucks', at: 0.9 },
  { label: 'License #', value: 'TX-88410', at: 1.5 },
  { label: 'Renewal', value: 'Mar 2027', at: 2.1 },
]

export function CrmViz() {
  return (
    <Window title="Accounts · Meridian Logistics" badge={<Pill className="bg-accent-wash text-accent-deep">custom fields</Pill>}>
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        <div className="pv-in rounded-inner border border-line bg-surface p-3" style={D(0.2)}>
          {fields.map((f) => (
            <div key={f.label} className="pv-in flex items-center justify-between border-b border-line py-1.5 text-[0.74rem] last:border-0" style={D(f.at)}>
              <span className="font-600 text-ink-faint">{f.label}</span>
              <span className="font-700 text-ink">{f.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <p className="mb-1.5 text-[0.6rem] font-700 uppercase tracking-[0.09em] text-ink-faint">
            Pipeline
          </p>
          <div className="relative grid grid-cols-3 gap-2">
            {['Qualified', 'Proposal', 'Closed'].map((c) => (
              <div key={c} className="rounded-inner border border-dashed border-line px-2 py-3 text-center text-[0.62rem] font-700 uppercase tracking-[0.06em] text-ink-faint">
                {c}
              </div>
            ))}
            <Pill
              className="pv-slide absolute left-2 top-[26px] bg-accent text-white shadow-sm"
              style={{ ...D(3), '--tx': 'calc(100% + 26px)' } as React.CSSProperties}
            >
              Meridian ●
            </Pill>
          </div>
        </div>
        <p className="pv-in text-center text-[0.68rem] font-600 text-ink-faint" style={D(4)}>
          Their fields, their pipeline — live in days
        </p>
      </div>
    </Window>
  )
}

/* ---------- 08 · SRE Agent ---------- */

const logs = [
  { t: '08:41:02', line: 'gateway ok · 200 · 34ms', at: 0.3 },
  { t: '08:41:04', line: 'billing-svc ok · 200 · 51ms', at: 0.8 },
]

export function SreViz() {
  return (
    <Window
      dark
      title="Prod logs · live"
      badge={
        <Pill className="bg-white/10 text-white/70">
          <i className="size-1.5 animate-pulse rounded-full bg-[#28C840]" /> watching
        </Pill>
      }
    >
      <div className="flex h-full flex-col gap-1.5 font-mono text-[0.68rem] leading-relaxed">
        {logs.map((l) => (
          <p key={l.t} className="pv-in text-[#9FA4C8]" style={D(l.at)}>
            <span className="text-white/35">{l.t}</span> {l.line}
          </p>
        ))}
        <p className="pv-in pv-flash rounded px-1 text-[#FF7B7B]" style={D(1.4)}>
          <span className="text-white/35">08:41:07</span> billing-svc ERR · timeout · retries exhausted
        </p>
        <p className="pv-in text-[#9FA4C8]" style={D(1.9)}>
          <span className="text-white/35">08:41:08</span> gateway ok · 200 · 36ms
        </p>

        <div className="mt-3 flex flex-col items-start gap-2 font-sans">
          <Pill className="pv-in border border-peri/40 bg-peri/15 text-[#B9BCFF]" style={D(2.7)}>
            root cause found · stale connection pool
          </Pill>
          <Pill className="pv-pop bg-[#123B23] text-[#4ADE80]" style={D(3.7)}>
            <Check className="size-3" /> PR #214 opened · fix ready for review
          </Pill>
        </div>

        <p className="pv-in mt-auto text-center font-sans text-[0.66rem] font-600 text-white/40" style={D(4.5)}>
          Root cause in minutes, not days — customers never noticed
        </p>
      </div>
    </Window>
  )
}

export const VIGNETTES: Record<string, () => React.ReactNode> = {
  agentic: AgenticViz,
  tera: TeraViz,
  graphbrain: GraphBrainViz,
  assistant: AssistantViz,
  entchat: EntChatViz,
  birdeye: BirdEyeViz,
  crm: CrmViz,
  sre: SreViz,
}
