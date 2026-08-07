import { useReveal } from '../hooks/useReveal'
import { shift } from '../data/content'
import { SectionHeader } from './ui/SectionHeader'
import { Card } from './ui/Card'
import { Aurora } from './ui/Aurora'

/* ------------------------------------------------------------------
   Animated friction visuals — one per card, drawn in the same idiom
   as the product mockups (surface panels, hairlines, brand accents).
   All motion is CSS keyframes (see index.css "The Shift" block), so
   reduced-motion users get a clean static diagram.
   ------------------------------------------------------------------ */

const VIZ_FRAME =
  'mt-6 rounded-inner border border-line p-3'

/** 01 · Process friction — work hops across handoffs while minutes become days. */
function HandoffViz() {
  const nodes = [
    { x: 24, label: 'Request' },
    { x: 92, label: 'Approve' },
    { x: 160, label: 'Sheet' },
    { x: 228, label: 'Re-enter' },
    { x: 296, label: 'Decide' },
  ]
  return (
    <div className={VIZ_FRAME} style={{ background: 'linear-gradient(135deg, #F4F4FF 0%, #FDFDFC 70%)' }}>
      <svg viewBox="0 0 320 120" className="w-full" aria-hidden>
        {/* timer chip — the cost of every hop */}
        <g>
          <rect x="216" y="10" width="90" height="22" rx="11" fill="#fff" stroke="var(--color-line)" />
          <circle cx="230" cy="21" r="4.5" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
          <path d="M230 18.5 V21 L232 22.5" stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <text className="sv-swap-a" x="242" y="25" fontSize="10" fontWeight="600" fill="var(--color-ink)">5 minutes</text>
          <text className="sv-swap-b" x="242" y="25" fontSize="10" fontWeight="600" fill="#D14B4B" opacity="0">3 days</text>
        </g>

        {/* rail */}
        <line x1="24" y1="72" x2="296" y2="72" stroke="var(--color-line)" strokeWidth="1.5" />

        {/* handoff nodes */}
        {nodes.map((n, i) => (
          <g key={n.label}>
            <circle className="sv-node" cx={n.x} cy="72" r="9" fill="#fff" stroke="var(--color-peri)" strokeWidth="1.5" style={{ animationDelay: `${i * 1.44}s` }} />
            <circle className="sv-node" cx={n.x} cy="72" r="3" fill="var(--color-peri)" style={{ animationDelay: `${i * 1.44}s` }} />
            <text x={n.x} y="98" fontSize="7.5" fontWeight="600" letterSpacing="0.06em" fill="var(--color-ink-faint)" textAnchor="middle">
              {n.label.toUpperCase()}
            </text>
          </g>
        ))}

        {/* the piece of work, hopping stop to stop */}
        <circle className="sv-travel" cx="24" cy="72" r="5.5" fill="var(--color-accent)" />
      </svg>
    </div>
  )
}

/** 02 · Manual dependency — every system routes through one human. */
function GlueViz() {
  const systems = [
    { x: 14, y: 16, label: 'CRM' },
    { x: 14, y: 78, label: 'ERP' },
    { x: 252, y: 16, label: 'Sheets' },
    { x: 252, y: 78, label: 'Email' },
  ]
  return (
    <div className={VIZ_FRAME} style={{ background: 'linear-gradient(225deg, #F4F4FF 0%, #FDFDFC 70%)' }}>
      <svg viewBox="0 0 320 120" className="w-full" aria-hidden>
        {/* flows dragged through the middle by hand */}
        <path className="sv-dash" d="M68 29 C110 34 130 48 148 55" stroke="var(--color-peri)" strokeWidth="1.6" fill="none" />
        <path className="sv-dash" d="M68 91 C110 86 130 72 148 65" stroke="var(--color-peri)" strokeWidth="1.6" fill="none" style={{ animationDelay: '-0.5s' }} />
        <path className="sv-dash" d="M172 55 C190 48 210 34 252 29" stroke="var(--color-peri)" strokeWidth="1.6" fill="none" style={{ animationDelay: '-0.9s' }} />
        <path className="sv-dash" d="M172 65 C190 72 210 86 252 91" stroke="var(--color-peri)" strokeWidth="1.6" fill="none" style={{ animationDelay: '-0.2s' }} />

        {/* the systems */}
        {systems.map((s) => (
          <g key={s.label}>
            <rect x={s.x} y={s.y} width="54" height="26" rx="8" fill="#fff" stroke="var(--color-line)" />
            <text x={s.x + 27} y={s.y + 17} fontSize="8.5" fontWeight="600" fill="var(--color-ink-soft)" textAnchor="middle">
              {s.label}
            </text>
          </g>
        ))}

        {/* the human glue */}
        <circle className="sv-pulse" cx="160" cy="60" r="17" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        <circle cx="160" cy="60" r="17" fill="var(--color-accent-wash)" stroke="var(--color-accent)" strokeWidth="1.5" />
        <circle cx="160" cy="55" r="4.5" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.6" />
        <path d="M152 70 C152 64 168 64 168 70" fill="none" stroke="var(--color-accent-deep)" strokeWidth="1.6" strokeLinecap="round" />
        <text x="160" y="98" fontSize="7.5" fontWeight="600" letterSpacing="0.06em" fill="var(--color-ink-faint)" textAnchor="middle">
          YOUR BEST PEOPLE
        </text>
      </svg>
    </div>
  )
}

/** 03 · Operational leakage — value flows through the pipe and drips out of the crack. */
function LeakViz() {
  return (
    <div className={VIZ_FRAME} style={{ background: 'linear-gradient(315deg, #F4F4FF 0%, #FDFDFC 70%)' }}>
      <svg viewBox="0 0 320 120" className="w-full" aria-hidden>
        {/* the pipe */}
        <rect x="16" y="34" width="288" height="30" rx="15" fill="#fff" stroke="var(--color-line)" strokeWidth="1.5" />
        {/* the crack */}
        <path d="M166 64 l6 7 M178 64 l4 5" stroke="var(--color-line)" strokeWidth="1.5" strokeLinecap="round" />

        {/* value moving through */}
        {[0, 1.3, 2.6, 3.9].map((d) => (
          <circle key={d} className="sv-flow" cx="28" cy="49" r="4.5" fill="var(--color-accent)" style={{ animationDelay: `${-d}s` }} />
        ))}

        {/* value leaking out */}
        {[0, 0.9, 1.7].map((d, i) => (
          <circle key={d} className="sv-drip" cx={168 + i * 6} cy="66" r="3.5" fill="var(--color-peri)" style={{ animationDelay: `${-d}s` }} />
        ))}

        <text x="174" y="116" fontSize="7.5" fontWeight="600" letterSpacing="0.06em" fill="var(--color-ink-faint)" textAnchor="middle">
          REVENUE · TIME · INSIGHT
        </text>

        {/* what arrives at the end */}
        <g>
          <rect x="252" y="8" width="52" height="18" rx="9" fill="#fff" stroke="var(--color-line)" />
          <text x="278" y="20" fontSize="8.5" fontWeight="700" fill="#D14B4B" textAnchor="middle">− leak</text>
        </g>
      </svg>
    </div>
  )
}

const visuals = [HandoffViz, GlueViz, LeakViz]

/**
 * THE SHIFT — why now. The three operational frictions AI is exposing, and
 * the market numbers (with sources) showing most companies are stuck between
 * pilots and production. Content from the company deck.
 */
export function Shift() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="the-shift" className="section">
      <div ref={ref} className="shell">
        <SectionHeader kicker={shift.kicker} title={shift.h2} sub={shift.sub} />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {shift.frictions.map((f, i) => {
            const Viz = visuals[i]
            return (
              <div data-reveal key={f.label}>
                <Card interactive={false} className="flex h-full flex-col p-6">
                  <p className="text-[0.72rem] font-800 uppercase tracking-[0.08em] text-accent-deep">
                    {f.label}
                  </p>
                  <h3 className="t-h3 mt-2.5 text-[1.35rem]">{f.title}</h3>
                  <p className="mt-2 text-[0.94rem] leading-relaxed text-ink-soft">{f.body}</p>
                  <div className="mt-auto">
                    <Viz />
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        <div
          data-reveal
          className="relative mt-4 overflow-hidden rounded-card bg-navy px-7 py-8 text-white shadow-lg"
        >
          <Aurora
            dark
            blobs={[
              { color: 'var(--color-au-peri)', size: 420, top: '-58%', left: '-6%', opacity: 0.3, duration: 26 },
              { color: 'var(--color-au-lilac)', size: 380, bottom: '-62%', right: '-4%', opacity: 0.24, duration: 30, delay: 2 },
            ]}
          />
          <div className="grid-faint absolute inset-0" aria-hidden />
          <div className="relative grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {shift.stats.map((s) => (
              <div key={s.source}>
                <span className="block font-display text-[2.4rem] font-800 leading-none tracking-[-0.02em] text-au-mint">
                  {s.value}
                </span>
                <p className="mt-2.5 text-[0.9rem] leading-snug text-white/75">{s.body}</p>
                <p className="mt-1.5 text-[0.68rem] font-700 uppercase tracking-[0.08em] text-white/40">
                  {s.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
