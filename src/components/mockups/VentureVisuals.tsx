import type { Venture } from '../../data/content'

/** Light, soft domain visuals — one per venture. Pure SVG. */
export function VentureVisual({ venture }: { venture: Venture }) {
  const a = venture.accent
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-inner border border-line bg-bg/50">
      <div className="absolute inset-0 opacity-[0.6]" style={{ background: `radial-gradient(120% 90% at 80% 0%, ${a}14, transparent 60%)` }} />
      <div className="relative h-full w-full p-4">{pick(venture.visual, a)}</div>
    </div>
  )
}

function pick(kind: Venture['visual'], a: string) {
  switch (kind) {
    case 'vitals': return <Vitals a={a} />
    case 'uptime': return <Uptime a={a} />
    case 'build': return <BuildGraph a={a} />
    case 'assets': return <Assets a={a} />
    case 'scaffold': return <Scaffold a={a} />
    case 'orchestrator': return <Orchestrator a={a} />
    case 'messages': return <Messages a={a} />
  }
}

/* Mentera — a vitals line */
function Vitals({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      <line x1="0" y1="110" x2="320" y2="110" stroke="var(--color-line)" />
      <path d="M0 80 H70 l10 -30 l12 60 l10 -50 l10 40 H150 l12 -44 l11 70 l10 -26 H320" stroke={a} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="183" cy="40" r="4" fill={a} />
      <g>
        <rect x="14" y="14" width="78" height="20" rx="6" fill="#fff" stroke="var(--color-line)" />
        <circle cx="26" cy="24" r="3" fill={a} />
        <rect x="34" y="20" width="46" height="7" rx="3.5" fill="var(--color-line)" />
      </g>
    </svg>
  )
}

/* Convey — uptime / incident */
function Uptime({ a }: { a: string }) {
  const bars = Array.from({ length: 22 })
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      <text x="6" y="22" fontSize="12" fontWeight="700" fill="var(--color-ink-soft)">99.98% uptime</text>
      {bars.map((_, i) => {
        const bad = i === 14
        return <rect key={i} x={8 + i * 14} y={bad ? 60 : 44} width="8" height={bad ? 70 : 86} rx="4" fill={bad ? '#E0683B' : a} opacity={bad ? 0.9 : 0.55} />
      })}
      <rect x="186" y="58" width="120" height="22" rx="7" fill="#fff" stroke="var(--color-line)" />
      <circle cx="198" cy="69" r="3.5" fill="#E0683B" />
      <rect x="208" y="65" width="86" height="7" rx="3.5" fill="var(--color-line)" />
    </svg>
  )
}

/* generic build / merge graph (spare visual) */
function BuildGraph({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      <path d="M40 24 V126" stroke="var(--color-line)" strokeWidth="2" />
      <path d="M40 64 C40 90 120 64 120 92" stroke={a} strokeWidth="2" />
      <path d="M120 92 C120 64 200 90 200 64" stroke={a} strokeWidth="2" />
      {[24, 64, 92, 126].map((y) => (<circle key={y} cx="40" cy={y} r="6" fill="#fff" stroke={a} strokeWidth="2" />))}
      <circle cx="120" cy="92" r="6" fill={a} />
      <circle cx="200" cy="64" r="6" fill="#fff" stroke={a} strokeWidth="2" />
      <rect x="226" y="40" width="84" height="16" rx="5" fill="#fff" stroke="var(--color-line)" />
      <rect x="226" y="84" width="68" height="16" rx="5" fill="#fff" stroke="var(--color-line)" />
    </svg>
  )
}

/* Logbook — asset rows with status + a copilot spark */
function Assets({ a }: { a: string }) {
  const rows = [{ y: 26, w: 96, ok: true }, { y: 58, w: 72, ok: true }, { y: 90, w: 84, ok: false }]
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="10" y={r.y - 14} width="210" height="26" rx="8" fill="#fff" stroke="var(--color-line)" />
          <rect x="22" y={r.y - 4} width="8" height="8" rx="2" fill={r.ok ? a : '#E0683B'} />
          <rect x="40" y={r.y - 3} width={r.w} height="6" rx="3" fill="var(--color-line)" />
          <rect x="176" y={r.y - 8} width="36" height="14" rx="7" fill={r.ok ? `${a}1f` : '#E0683B1f'} />
        </g>
      ))}
      <g transform="translate(232 24)">
        <rect x="0" y="0" width="78" height="102" rx="12" fill={a} opacity="0.1" />
        <path d="M39 18 l4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4 z" fill={a} />
        <rect x="14" y="64" width="50" height="6" rx="3" fill={a} opacity="0.45" />
        <rect x="14" y="78" width="34" height="6" rx="3" fill={a} opacity="0.3" />
      </g>
    </svg>
  )
}

/* Koitel — a scaffold */
function Scaffold({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}-${c}`} x={20 + c * 74} y={20 + r * 42} width="62" height="30" rx="8" fill={r === 0 && c === 0 ? a : '#fff'} opacity={r === 0 && c === 0 ? 0.16 : 1} stroke={r === 0 && c === 0 ? a : 'var(--color-line)'} strokeWidth="1.5" strokeDasharray={r === 2 ? '4 4' : undefined} />
        )),
      )}
      <circle cx="35" cy="35" r="3.5" fill={a} />
    </svg>
  )
}

/* Agentics — an orchestrator graph */
function Orchestrator({ a }: { a: string }) {
  const nodes = [[160, 30], [70, 78], [250, 78], [110, 122], [210, 122]]
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      {[[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]].map(([s, e], i) => (
        <line key={i} x1={nodes[s][0]} y1={nodes[s][1]} x2={nodes[e][0]} y2={nodes[e][1]} stroke={a} strokeOpacity="0.4" strokeWidth="1.5" />
      ))}
      {nodes.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={i === 0 ? 11 : 8} fill={i === 0 ? a : '#fff'} stroke={a} strokeWidth="2" />))}
    </svg>
  )
}

/* WD Chat — message turns */
function Messages({ a }: { a: string }) {
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" fill="none">
      <rect x="14" y="20" width="150" height="30" rx="14" fill="#fff" stroke="var(--color-line)" />
      <rect x="26" y="31" width="100" height="8" rx="4" fill="var(--color-line)" />
      <rect x="156" y="62" width="150" height="30" rx="14" fill={a} opacity="0.14" />
      <rect x="168" y="73" width="120" height="8" rx="4" fill={a} opacity="0.6" />
      <rect x="14" y="104" width="120" height="30" rx="14" fill="#fff" stroke="var(--color-line)" />
      <circle cx="30" cy="119" r="3" fill={a}><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" /></circle>
      <circle cx="42" cy="119" r="3" fill={a} opacity="0.6" />
      <circle cx="54" cy="119" r="3" fill={a} opacity="0.3" />
    </svg>
  )
}
