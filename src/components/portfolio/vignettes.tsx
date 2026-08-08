import { Check, FileText, Database, BarChart3, Star, Zap } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Portfolio vignettes — one animated "outcome moment" per product, each in a
 * DIFFERENT visual form mapped to what the product actually is:
 *
 *   Agent Hub · agents        → agent backbone + the fleet running in prod
 *   Mentera · Tera            → chat + tool-calls across every clinic workflow
 *   Kiotel · knowledge        → sources converging into a cited answer
 *   Western Digital · WD Chat → question in → generated dashboard out
 *   Harbor Industrial         → fleet logbook + asset health + copilot
 *   Convey · SRE              → live terminal with a code diff
 *   NX · website assistant    → chat (the ONLY chat scene — it IS the chat)
 *   Vantage · reputation      → multi-location reputation dashboard
 *
 * Shared window chrome keeps them one family; interiors are deliberately
 * distinct. All motion is single-run CSS keyframes with per-element delays
 * (--d); scenes replay on stage remount and rest at their completed state
 * (reduced-motion lands there instantly).
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
        <div className="win-dots flex shrink-0 gap-1.5">
          <span style={{ background: '#FF5F57' }} />
          <span style={{ background: '#FEBC2E' }} />
          <span style={{ background: '#28C840' }} />
        </div>
        <span
          className={cn(
            // truncate + min-w-0 so a long title never becomes a min-content
            // floor that widens the whole grid track on narrow screens
            'min-w-0 truncate text-[0.62rem] font-700 uppercase tracking-[0.09em]',
            dark ? 'text-white/50' : 'text-ink-faint',
          )}
        >
          {title}
        </span>
        {badge && <span className="ml-auto shrink-0">{badge}</span>}
      </div>
      <div className="relative flex-1 overflow-hidden p-3.5">{children}</div>
    </div>
  )
}

const wash = { background: 'linear-gradient(135deg, #F4F4FF 0%, #FDFDFC 62%)' }
const dotGrid = {
  background:
    'radial-gradient(circle, #D9D9E8 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(135deg, #F7F7FF 0%, #FDFDFC 70%)',
}

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

/* ---------- 01 · Agent Hub — the anatomy of a production agent + the fleet
   Top: what every agent actually does — sense, reason, act with tools, and
   escalate to a human when policy says so (the step that separates a demo
   from production). Bottom: the fleet already running, with a new agent
   going live. Outcome: many agents in production, no ML team. */

const chain = [
  { label: 'Trigger', sub: 'invoice lands', at: 0.4 },
  { label: 'Reason', sub: 'policy + context', at: 1.0 },
  { label: 'Act', sub: 'ERP · email', at: 1.6 },
  { label: 'Escalate', sub: '> $5k to a human', at: 2.2, guard: true },
]

const fleet = [
  { name: 'invoice-triage', runs: '1,347', at: 3.0 },
  { name: 'ticket-router', runs: '892', at: 3.2 },
  { name: 'claims-intake', runs: '', at: 3.4, deploying: true },
]

export function ForgeViz() {
  return (
    <Window title="Agent Hub · agent builder" badge={<Pill className="bg-accent-wash text-accent-deep">governed runtime</Pill>}>
      <div className="flex h-full flex-col gap-2.5" style={dotGrid}>
        <p className="text-[0.54rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
          Every agent, same backbone
        </p>

        {/* the flow every production agent follows — a 2×2 grid on phones
            (four cells in a row can't fit 345px), one arrowed row from sm up */}
        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-stretch sm:gap-1">
          {chain.map((c, i) => (
            <div key={c.label} className="flex items-center gap-1 sm:flex-1">
              <div
                className={cn(
                  'pv-pop min-w-0 flex-1 rounded-[9px] border bg-surface px-2 py-1.5 shadow-sm',
                  c.guard ? 'border-peri' : 'border-line',
                )}
                style={D(c.at)}
              >
                <p className={cn('truncate text-[0.66rem] font-800', c.guard ? 'text-peri' : 'text-ink')}>
                  {/* numbers carry the sequence where the arrows are hidden */}
                  <span className="sm:hidden">{i + 1}. </span>
                  {c.label}
                </p>
                <p className="truncate text-[0.55rem] font-600 text-ink-faint">{c.sub}</p>
              </div>
              {i < chain.length - 1 && (
                <span className="pv-in hidden shrink-0 text-[0.7rem] font-700 text-peri sm:inline" style={D(c.at + 0.3)}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="pv-in text-[0.58rem] font-600 text-ink-faint" style={D(2.6)}>
          Guardrails, retries and audit trail come with the runtime — not bolted on later.
        </p>

        {/* the fleet already in production */}
        <div className="mt-0.5 flex flex-1 flex-col gap-1.5">
          <p className="text-[0.54rem] font-800 uppercase tracking-[0.09em] text-ink-faint">
            Running in production
          </p>
          {fleet.map((f) => (
            <div key={f.name} className="pv-in flex items-center gap-2 rounded-[8px] border border-line bg-surface px-2.5 py-1.5" style={D(f.at)}>
              <span className="font-mono text-[0.64rem] font-700 text-ink">{f.name}</span>
              {f.deploying ? (
                <>
                  <span className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-bg">
                    <span className="pv-bar block h-full rounded-full bg-accent" style={D(f.at + 0.3)} />
                  </span>
                  <Pill className="pv-pop shrink-0 bg-[#E7F8EC] text-[#1D8A46]" style={D(f.at + 1.2)}>
                    <i className="size-1.5 rounded-full bg-[#28C840]" /> live
                  </Pill>
                </>
              ) : (
                <>
                  <span className="ml-auto text-[0.6rem] font-700 tabular-nums text-accent">
                    {f.runs}
                  </span>
                  <span className="text-[0.55rem] font-600 text-ink-faint">runs today</span>
                  <Pill className="shrink-0 bg-[#E7F8EC] text-[#1D8A46]">
                    <i className="size-1.5 rounded-full bg-[#28C840]" /> live
                  </Pill>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="pv-in mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-inner bg-ink px-3 py-2 text-white" style={D(4.6)}>
          <span className="text-[0.66rem] font-700 sm:text-[0.7rem]">3 agents in production</span>
          <span className="text-[0.66rem] font-700 text-au-mint sm:text-[0.7rem]">shipped without an ML team</span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 02 · Tera — chat-driven automation across the whole clinic ----
   Tera is a chat application AND the platform underneath it: staff ask in
   plain language, Tera executes across every clinic workflow. The rail shows
   the breadth (front desk → analytics); the thread shows it taking real
   actions with tools, lighting each domain up as it goes. */

const domains = [
  { label: 'Front desk', at: 1.5 },
  { label: 'Scheduling', at: 2.6 },
  { label: 'Comms', at: 2.0 },
  { label: 'Pre-charting', at: 1.5 },
  { label: 'Back office', at: 3.1 },
  { label: 'Analytics', at: 3.6 },
]

const actions = [
  { tag: 'Pre-charting', text: '6 charts drafted from last-visit notes', at: 1.5 },
  { tag: 'Comms', text: '4 patients texted — personalised, 1 replied', at: 2.0 },
  { tag: 'Scheduling', text: 'No-show slot refilled from the waitlist', at: 2.6 },
  { tag: 'Back office', text: '2 prior auths submitted to payer', at: 3.1 },
]

export function TeraViz() {
  return (
    <Window
      title="Tera · clinic AI"
      badge={
        <Pill className="bg-accent-wash text-accent-deep">
          <i className="size-1.5 animate-pulse rounded-full bg-accent" /> taking actions
        </Pill>
      }
    >
      {/* phones: workflows as a wrapping strip above a full-width chat —
          the side rail squeezed the thread until every action truncated */}
      <div className="flex h-full flex-col gap-2 sm:flex-row sm:gap-3" style={wash}>
        {/* the platform surface: every workflow it covers */}
        <div className="flex shrink-0 flex-wrap gap-1 sm:w-[104px] sm:flex-col sm:flex-nowrap">
          <p className="w-full pb-0.5 text-[0.54rem] font-800 uppercase tracking-[0.08em] text-ink-faint">
            Clinic workflows
          </p>
          {domains.map((d) => (
            <span
              key={d.label}
              className="pv-glow rounded-[7px] border border-line bg-surface/70 px-2 py-1 text-[0.6rem] font-600 text-ink-faint"
              style={D(d.at)}
            >
              {d.label}
            </span>
          ))}
        </div>

        {/* the chat that drives them */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="pv-in max-w-[88%] self-end rounded-[12px] rounded-br-[4px] bg-accent px-3 py-1.5 text-[0.72rem] font-500 text-white" style={D(0.2)}>
            Prep my afternoon clinic
          </div>
          <div className="pv-in max-w-[92%] rounded-[12px] rounded-bl-[4px] border border-line bg-surface px-3 py-1.5 text-[0.72rem] text-ink" style={D(0.9)}>
            On it — working through the afternoon list now.
          </div>

          {/* tool calls executing, one per workflow */}
          <div className="mt-0.5 flex flex-col gap-1">
            {actions.map((a) => (
              <div key={a.tag} className="pv-in flex items-center gap-2 rounded-[8px] border border-line bg-surface px-2 py-1.5" style={D(a.at)}>
                <Check className="size-3 shrink-0 text-[#1D8A46]" />
                <span className="truncate text-[0.68rem] font-600 text-ink">{a.text}</span>
                <span className="ml-auto shrink-0 rounded-[5px] bg-accent-wash px-1.5 py-0.5 text-[0.52rem] font-700 uppercase tracking-[0.05em] text-accent-deep">
                  {a.tag}
                </span>
              </div>
            ))}
          </div>

          <div className="pv-in mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-inner bg-ink px-3 py-2 text-white" style={D(4.1)}>
            <span className="text-[0.66rem] font-700 sm:text-[0.7rem]">Afternoon ready · 14 patients</span>
            <span className="text-[0.66rem] font-700 text-au-mint sm:text-[0.7rem]">0 staff touches</span>
          </div>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 03 · Cortex — sources converge into an answer ---------- */

const srcs = [
  { y: 26, label: 'refund-policy.pdf', at: 0.4 },
  { y: 96, label: 'wiki · billing', at: 0.8 },
  { y: 166, label: 'ticket #4821', at: 1.2 },
]

export function CortexViz() {
  return (
    <Window title="Knowledge engine · Kiotel" badge={<Pill className="bg-bg text-ink-soft">3 sources connected</Pill>}>
      {/* phones: a vertical flow (sources → converge → answer) — the desktop
          collage of absolutely-positioned panels collides at 345px */}
      <div className="relative flex h-full w-full flex-col gap-1.5 sm:block" style={wash}>
        {srcs.map((s0) => (
          <div key={s0.label} className="pv-in flex w-fit items-center gap-1.5 rounded-pill border border-line bg-surface px-2.5 py-1.5 sm:absolute sm:left-2" style={{ top: s0.y, ...D(s0.at) }}>
            <FileText className="size-3 text-peri" />
            <span className="text-[0.64rem] font-600 text-ink-soft">{s0.label}</span>
          </div>
        ))}
        {/* the convergence, spelled out vertically on phones */}
        <span className="pv-in self-center text-[0.9rem] font-700 leading-none text-peri sm:hidden" style={D(1.9)}>
          ↓
        </span>
        <svg className="absolute inset-0 hidden h-full w-full sm:block" aria-hidden>
          {[40, 110, 180].map((y, i) => (
            <path
              key={y}
              d={`M150 ${y} C 220 ${y} 240 108 292 112`}
              fill="none"
              stroke="var(--color-peri)"
              strokeWidth="1.5"
              className="pv-draw"
              style={{ ...D(1.7 + i * 0.25), '--len': '180' } as React.CSSProperties}
            />
          ))}
        </svg>
        <div className="pv-pop w-full rounded-inner border border-accent/40 bg-surface p-3 shadow-soft sm:absolute sm:right-2 sm:top-[54px] sm:w-[240px]" style={D(2.8)}>
          <p className="text-[0.62rem] font-700 uppercase tracking-[0.08em] text-ink-faint">Answer</p>
          <p className="mt-1 text-[0.74rem] leading-relaxed text-ink">
            Enterprise plans: 30-day refund window, pro-rated credit within 5 business days.
          </p>
          <Pill className="pv-pop mt-2 bg-accent-wash text-accent-deep" style={D(3.6)}>
            <Check className="size-3" /> grounded · 3 sources cited
          </Pill>
        </div>
        <p className="pv-in mt-auto text-center text-[0.66rem] font-600 text-ink-faint sm:absolute sm:inset-x-0 sm:bottom-1 sm:mt-0" style={D(4.2)}>
          Docs, wikis, tickets — one brain, every answer cited
        </p>
      </div>
    </Window>
  )
}

/* ---------- 07 · Website concierge — chat becomes a lead ----------
   The one chat scene. Reads top-to-bottom as a single causal story:
   conversation → visitor hands over contact → lead lands in the team's
   Slack → the assistant learns from it. No floating panels. */

export function BeaconViz() {
  return (
    <Window title="elevano.com · 2:14 AM" badge={<Pill className="bg-bg text-ink-soft">visitor online</Pill>}>
      <div className="flex h-full flex-col gap-1.5" style={wash}>
        {/* the conversation */}
        <div className="pv-in max-w-[80%] self-end rounded-[12px] rounded-br-[4px] bg-accent px-3 py-1.5 text-[0.73rem] font-500 text-white" style={D(0.2)}>
          Do you integrate with our EHR?
        </div>
        <div className="pv-in max-w-[86%] rounded-[12px] rounded-bl-[4px] border border-line bg-surface px-3 py-1.5 text-[0.73rem] leading-snug text-ink" style={D(1)}>
          Yes — 50+ EHR integrations, two-way sync. Want me to put you in touch with the team?
        </div>
        <div className="pv-in max-w-[80%] self-end rounded-[12px] rounded-br-[4px] bg-accent px-3 py-1.5 text-[0.73rem] font-500 text-white" style={D(1.9)}>
          Sure — dana@carepath.io
        </div>

        {/* the handoff moment — makes the causality explicit */}
        <div className="pv-in my-0.5 flex items-center gap-2" style={D(2.6)}>
          <span className="h-px flex-1 bg-line" />
          <Pill className="bg-accent-wash text-accent-deep">
            <Check className="size-3" /> captured · sent to your team
          </Pill>
          <span className="h-px flex-1 bg-line" />
        </div>

        {/* where it lands, 3 seconds later */}
        <div className="pv-in rounded-inner bg-ink px-3.5 py-2.5 text-white" style={D(3.1)}>
          <p className="text-[0.58rem] font-700 uppercase tracking-[0.09em] text-au-mint">
            # leads · just now
          </p>
          <p className="mt-1 text-[0.78rem] font-700">Dana K. · CarePath Health</p>
          <p className="text-[0.68rem] leading-snug text-white/65">
            Needs an EHR-integrated copilot · booked Tue 2:30
          </p>
        </div>

        {/* and it got smarter from the exchange */}
        <div className="pv-in mt-auto flex items-center gap-2" style={D(4.1)}>
          <Zap className="size-3 shrink-0 text-accent" />
          <span className="text-[0.66rem] font-600 text-ink-faint">
            Assistant learned this answer — next visitor gets it instantly
          </span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 04 · WD Chat — question in, dashboard out ---------- */

// heights in px; `over` = beat target (accent) vs under (periwinkle)
const bars = [
  { h: 38, label: 'NA', over: false, at: 2.5 },
  { h: 62, label: 'EMEA', over: true, at: 2.65 },
  { h: 46, label: 'APAC', over: false, at: 2.8 },
  { h: 76, label: 'LATAM', over: true, at: 2.95 },
]
const TARGET_TOP = 92 - 56 // dashed target line sits at 56px of the 92px plot

const systems = ['warehouse', 'CRM', 'finance']

export function OmniViz() {
  return (
    <Window title="WD Chat · analytics workspace" badge={<Pill className="bg-accent-wash text-accent-deep">50+ apps</Pill>}>
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        {/* the question */}
        <div className="pv-in flex items-center gap-2 self-end rounded-[12px] bg-accent px-3 py-2 text-[0.76rem] font-500 text-white" style={D(0.2)}>
          Q3 pipeline by region vs target
        </div>

        {/* grounding: which enterprise systems it read */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[0.6rem] font-700 uppercase tracking-[0.08em] text-ink-faint">
            reading
          </span>
          {systems.map((sys, i) => (
            <Pill key={sys} className="pv-glow border border-line bg-surface text-ink-faint" style={D(0.9 + i * 0.2)}>
              <Database className="size-2.5" /> {sys}
            </Pill>
          ))}
        </div>

        {/* the generated dashboard — hugs its content on phones so the card
            doesn't stretch into dead space; fills the stage from sm up */}
        <div className="pv-in rounded-inner border border-line bg-surface p-3 sm:flex-1" style={D(1.7)}>
          <div className="flex items-start justify-between">
            <p className="text-[0.66rem] font-800 uppercase tracking-[0.08em] text-ink-faint">
              Q3 pipeline · by region
            </p>
            <Pill className="pv-pop bg-accent-wash text-accent-deep" style={D(3.6)}>
              <Check className="size-3" /> live data
            </Pill>
          </div>

          <div className="mt-2 flex items-end gap-3">
            {/* bar chart the model just built */}
            <div className="relative h-[92px] flex-1 border-b border-line">
              {/* target line — gives the bars something to mean */}
              <span
                className="pv-in absolute inset-x-0 border-t border-dashed border-ink-faint/50"
                style={{ top: TARGET_TOP, ...D(2.3) }}
              >
                {/* label sits over the short NA bar on the left — on the right
                    it collided with the tall LATAM bar on narrow screens */}
                <span className="absolute -top-[7px] left-0 bg-surface pr-1 text-[0.5rem] font-700 uppercase tracking-[0.06em] text-ink-faint">
                  target
                </span>
              </span>
              <div className="absolute inset-0 flex items-end justify-around">
                {bars.map((b) => (
                  <span key={b.label} className="flex w-9 flex-col items-center">
                    <span
                      className={cn(
                        'pv-rise w-5 rounded-t-[3px]',
                        b.over ? 'bg-accent' : 'bg-peri/55',
                      )}
                      style={{ height: b.h, ...D(b.at) }}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* KPI readouts */}
            <div className="flex w-[92px] shrink-0 flex-col gap-1.5 sm:w-[112px]">
              {[
                { v: '$18.4M', l: 'weighted', at: 3.1 },
                { v: '112%', l: 'of target', at: 3.3 },
              ].map((k) => (
                <div key={k.l} className="pv-in rounded-[8px] border border-line bg-bg/60 px-2 py-1.5" style={D(k.at)}>
                  <p className="font-display text-[0.95rem] font-800 leading-none text-ink">{k.v}</p>
                  <p className="text-[0.54rem] font-600 text-ink-faint">{k.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-1 flex justify-around pr-[104px] sm:pr-[124px]">
            {bars.map((b) => (
              <span key={b.label} className="w-9 text-center text-[0.54rem] font-700 text-ink-faint">
                {b.label}
              </span>
            ))}
          </div>
        </div>

        <div className="pv-in mt-auto flex items-center gap-2 rounded-inner bg-ink px-3 py-2 text-white sm:mt-0" style={D(4)}>
          <BarChart3 className="size-3.5 shrink-0 text-au-mint" />
          <span className="text-[0.68rem] font-700 sm:text-[0.72rem]">Dashboard built from the question</span>
          {/* wrapper carries the responsive hide — Pill's own inline-flex would
              fight `hidden` for CSS-order priority */}
          <span className="ml-auto hidden sm:block">
            <Pill className="bg-white/10 text-white/80">export · share</Pill>
          </span>
        </div>
      </div>
    </Window>
  )
}

/* ---------- 08 · Vantage — multi-location reputation dashboard ---------- */

export function ReputationViz() {
  return (
    <Window title="Reputation console · Vantage" badge={<Pill className="bg-bg text-ink-soft">watching 12 locations</Pill>}>
      {/* phones: spread the three blocks through the portrait stage instead of
          leaving one large hole above the bottom-pinned location bars */}
      <div className="flex h-full flex-col justify-between gap-2.5 sm:justify-start" style={wash}>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="pv-in rounded-inner border border-line bg-surface p-2.5" style={D(0.3)}>
            <p className="text-[0.58rem] font-700 uppercase tracking-[0.07em] text-ink-faint">Rating</p>
            <p className="font-display text-[1.3rem] font-800 leading-tight text-ink">
              4.6<span className="text-[0.8rem] text-[#D9A514]"> ★</span>
            </p>
            <svg viewBox="0 0 72 20" className="mt-0.5 h-4 w-full" aria-hidden>
              <path d="M2 17 C 20 16 30 12 42 10 S 62 5 70 3" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" className="pv-draw" style={{ ...D(0.8), '--len': '90' } as React.CSSProperties} />
            </svg>
          </div>
          <div className="pv-in rounded-inner border border-line bg-surface p-2.5" style={D(0.5)}>
            <p className="text-[0.58rem] font-700 uppercase tracking-[0.07em] text-ink-faint">This week</p>
            <p className="font-display text-[1.3rem] font-800 leading-tight text-ink">32</p>
            <p className="text-[0.6rem] font-600 text-ink-faint">reviews handled</p>
          </div>
          <div className="pv-in rounded-inner border border-line bg-surface p-2.5" style={D(0.7)}>
            <p className="text-[0.58rem] font-700 uppercase tracking-[0.07em] text-ink-faint">Pipeline</p>
            <p className="font-display text-[1.3rem] font-800 leading-tight text-accent">+7</p>
            <p className="text-[0.6rem] font-600 text-ink-faint">leads from reviews</p>
          </div>
        </div>

        <div className="pv-in flex items-center gap-3 rounded-inner border border-line bg-surface px-3 py-2.5" style={D(1.5)}>
          <span className="flex gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <Star key={i} className="pv-pop size-3 fill-[#D9A514] text-[#D9A514]" style={D(1.8 + i * 0.12)} />
            ))}
            <Star className="size-3 text-line" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[0.7rem] italic text-ink-soft">“Great service — wait time could improve…”</span>
          <Pill className="pv-pop ml-auto shrink-0 bg-[#E7F8EC] text-[#1D8A46]" style={D(3)}>
            <Check className="size-3" /> replied on-brand
          </Pill>
        </div>

        <div className="space-y-1.5 sm:mt-auto">
          {[
            { l: 'Downtown', w: '92%', at: 3.6 },
            { l: 'Riverside', w: '78%', at: 3.8 },
            { l: 'Airport', w: '64%', at: 4.0 },
          ].map((r) => (
            <div key={r.l} className="pv-in flex items-center gap-2" style={D(r.at)}>
              <span className="w-16 text-[0.62rem] font-600 text-ink-faint">{r.l}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                <span className="pv-bar block h-full rounded-full bg-peri" style={{ ...D(r.at + 0.15), width: r.w }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}

/* ---------- 06 · Sentinel — live terminal ---------- */

const logs = [
  { t: '08:41:02', line: 'gateway ok · 200 · 34ms', at: 0.3 },
  { t: '08:41:04', line: 'billing-svc ok · 200 · 51ms', at: 0.8 },
]

export function SentinelViz() {
  return (
    <Window
      dark
      title="Convey · prod logs"
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

        <Pill className="pv-in mt-1 w-fit border border-peri/40 bg-peri/15 text-[#B9BCFF]" style={D(2.3)}>
          root cause · stale connection pool
        </Pill>

        {/* the fix, as a diff */}
        <div className="pv-in mt-1 w-fit min-w-[240px] rounded-[10px] border border-white/10 bg-white/5 p-2" style={D(3.1)}>
          <p className="text-[0.58rem] font-sans font-700 uppercase tracking-[0.08em] text-white/40">
            fix · pool.ts
          </p>
          <p className="mt-1 text-[#FF8A8A]">- maxIdleTime: Infinity</p>
          <p className="text-[#6EE7A0]">+ maxIdleTime: 30_000</p>
        </div>
        <Pill className="pv-pop w-fit bg-[#123B23] text-[#4ADE80]" style={D(4)}>
          <Check className="size-3" /> PR #214 opened · fix ready for review
        </Pill>

        <p className="pv-in mt-auto text-center font-sans text-[0.66rem] font-600 text-white/40" style={D(4.7)}>
          Root cause in minutes, not days — customers never noticed
        </p>
      </div>
    </Window>
  )
}

/* ---------- 05 · Harbor Industrial — fleet logbook & asset health ---------- */

const vessels = [
  { id: 'HRB-04', task: 'Engine hours logged', status: 'ok', at: 0.5 },
  { id: 'HRB-11', task: 'Hydraulic check due', status: 'due', at: 1.2 },
  { id: 'HRB-22', task: 'Crane inspection', status: 'ok', at: 1.9 },
]

export function HarborViz() {
  return (
    <Window
      title="Fleet logbook · Harbor Industrial"
      badge={<Pill className="bg-bg text-ink-soft">18 assets tracked</Pill>}
    >
      <div className="flex h-full flex-col gap-2.5" style={wash}>
        {/* structured logbook rows — the thing that replaced paper */}
        {vessels.map((v) => (
          <div key={v.id} className="pv-in flex items-center gap-3 rounded-inner border border-line bg-surface px-3 py-2" style={D(v.at)}>
            <span className="rounded-[6px] bg-navy px-1.5 py-0.5 font-mono text-[0.6rem] font-700 text-white">
              {v.id}
            </span>
            <span className="text-[0.74rem] font-600 text-ink">{v.task}</span>
            {v.status === 'ok' ? (
              <Pill className="pv-pop ml-auto bg-[#E7F8EC] text-[#1D8A46]" style={D(v.at + 0.5)}>
                <Check className="size-3" /> logged
              </Pill>
            ) : (
              <Pill className="pv-pop ml-auto bg-[#FFF3E4] text-[#B4671B]" style={D(v.at + 0.5)}>
                scheduled
              </Pill>
            )}
          </div>
        ))}

        {/* the copilot answering from the logbook */}
        <div className="pv-in mt-auto rounded-inner border border-accent/30 bg-accent-wash/40 px-3 py-2.5" style={D(2.9)}>
          <p className="text-[0.6rem] font-800 uppercase tracking-[0.08em] text-accent-deep">
            Harbor copilot
          </p>
          <p className="mt-1 text-[0.74rem] leading-snug text-ink">
            “Which assets are overdue this week?” →{' '}
            <span className="font-700">HRB-11 hydraulics, scheduled Thu.</span>
          </p>
        </div>

        <div className="pv-in grid grid-cols-3 gap-2" style={D(3.8)}>
          {[
            { v: '40%', l: 'less reporting time' },
            { v: '25%', l: 'faster resolution' },
            { v: '15%', l: 'higher availability' },
          ].map((m) => (
            <div key={m.l} className="rounded-[10px] border border-line bg-surface px-2 py-1.5 text-center">
              <p className="font-display text-[1.05rem] font-800 leading-none text-accent">{m.v}</p>
              <p className="mt-0.5 text-[0.56rem] font-600 leading-tight text-ink-faint">{m.l}</p>
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}

export const VIGNETTES: Record<string, () => React.ReactNode> = {
  forge: ForgeViz,
  tera: TeraViz,
  cortex: CortexViz,
  omni: OmniViz,
  harbor: HarborViz,
  convey: SentinelViz,
  beacon: BeaconViz,
  keystone: ReputationViz,
}
