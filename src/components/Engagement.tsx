import { engagement } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { useActiveOnScroll } from '../hooks/useActiveOnScroll'
import { cn } from '../lib/cn'

/**
 * The Nx Delivery System (Figma 212:387, behaviour and stack drawing from
 * the Webflow build): the four engagement models as stacked isometric
 * plates beside one card per model. The stack stays in view while the cards
 * scroll; the active card (nearest the viewport centre, or hovered/focused)
 * lifts its plate and turns it electric blue.
 */

// plate faces per layer, top (L01) to base (L04) — Webflow stack colours
const PLATES = [
  { left: '#11157E', right: '#14189C', top: '#1A1EC0', stroke: 'rgba(128,128,255,.6)' },
  { left: '#0C1050', right: '#0F1362', top: '#131878', stroke: 'rgba(128,128,255,.45)' },
  { left: '#090C40', right: '#0B0F50', top: '#0E1260', stroke: 'rgba(128,128,255,.45)' },
  { left: '#070A2E', right: '#090D38', top: '#0B1042', stroke: 'rgba(128,128,255,.45)' },
]

export function Engagement() {
  const ref = useReveal<HTMLDivElement>()
  const { items } = engagement
  const { active, bind } = useActiveOnScroll(items.length)

  return (
    <section id="system" aria-labelledby="system-title" className="section-v2 bg-navy text-bg">
      <div ref={ref} className="shell">
        <div className="mx-auto flex max-w-[1022px] flex-col items-center pb-[72px] text-center">
          <p data-reveal className="pb-6 text-[12px] uppercase tracking-[0.14em] text-peri">
            {engagement.eyebrow}
          </p>
          <h2 id="system-title" data-reveal className="t-h2">
            <span className="block">{engagement.h2a}</span>
            <span className="block text-peri">{engagement.h2b}</span>
          </h2>
          <p data-reveal className="pt-6 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.55] text-mist">
            {engagement.sub}
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[641px_1fr] lg:gap-[101px]">
          <div className="lg:sticky lg:top-[102px]">
            <Stack active={active} />
          </div>

          <ol data-reveal className="divide-y divide-bg/[0.09] border-y border-bg/[0.09]">
            {items.map((e, i) => (
              <li
                key={e.name}
                {...bind(i)}
                tabIndex={0}
                className={cn(
                  'border-l-[3px] p-6 transition-[background-color,border-color] duration-300 sm:p-[35px]',
                  i === active ? 'border-l-peri bg-accent/[0.24]' : 'border-l-transparent',
                )}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-peri">
                  Layer {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="pt-4 font-heading text-[24px] font-500 leading-[1.2] tracking-[-0.02em]">{e.name}</h3>
                <p className="pt-4 text-[15px] leading-[1.65] text-mist">{e.body}</p>
                <ul className="flex flex-wrap gap-2 pt-4">
                  {e.tags.map((t) => (
                    <li key={t} className="border border-bg/24 px-[9px] py-1 text-[12px] leading-[1.15] text-[#d3d6ec]">
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Stack({ active }: { active: number }) {
  const { items } = engagement
  return (
    <svg
      viewBox="50 80 1040 620"
      role="img"
      aria-label={`The Nx delivery system: ${items.length} engagement models as stacked plates, ${items[0].name} at the top to ${items[items.length - 1].name} at the base`}
      className="h-auto w-full"
    >
      {/* draw from the base up so upper plates overlap lower ones */}
      {items
        .map((e, i) => ({ e, i }))
        .reverse()
        .map(({ e, i }) => {
          const y = 100 + i * 96
          const c = PLATES[i]
          return (
            <g key={e.name} className="slab" data-state={i === active ? 'active' : 'idle'}>
              <polygon fill={c.left} points={`70,${y + 135} 340,${y + 270} 340,${y + 286} 70,${y + 151}`} />
              <polygon fill={c.right} points={`340,${y + 270} 610,${y + 135} 610,${y + 151} 340,${y + 286}`} />
              <polygon
                className="slab-top"
                fill={c.top}
                stroke={c.stroke}
                points={`340,${y} 610,${y + 135} 340,${y + 270} 70,${y + 135}`}
              />
              <line className="slab-tick" x1={610} y1={y + 135} x2={664} y2={y + 135} strokeWidth={1.5} />
              <text className="slab-label" x={676} y={y + 142}>
                {String(i + 1).padStart(2, '0')} · {e.name.toUpperCase()}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
