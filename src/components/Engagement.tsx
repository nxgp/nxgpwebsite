import { engagement } from '../data/content'
import { useActiveOnScroll } from '../hooks/useActiveOnScroll'
import { cn } from '../lib/cn'

/**
 * The Nx Delivery System (Figma 212:387, card behaviour from the Webflow
 * build): the five-plate capability stack beside one card per engagement
 * model. The stack stays in view while the cards scroll; the active card
 * (nearest the viewport centre, or hovered/focused) is highlighted.
 */

export function Engagement() {
  const { items } = engagement
  const { active, bind } = useActiveOnScroll(items.length)

  return (
    <section id="system" aria-labelledby="system-title" className="section-v2 bg-navy text-bg">
      <div className="shell">
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
            <Stack />
          </div>

          <ol data-reveal className="divide-y divide-bg/[0.09] border-y border-bg/[0.09]">
            {items.map((e, i) => (
              <li
                key={e.name}
                {...bind(i)}
                tabIndex={0}
                className={cn(
                  'border-l-[3px] p-6 transition-[background-color,border-color] duration-[320ms] ease-[ease] sm:p-[35px]',
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

// translucent electric-blue plates, top to base, fading as they go down
const PLATE_ALPHA = [0.86, 0.46, 0.3, 0.18, 0.06]

/** Figma's stack: five see-through plates, each ticked out to its label. */
function Stack() {
  const { stack } = engagement
  const n = stack.length
  return (
    <svg
      viewBox="50 80 1160 700"
      role="img"
      aria-label={`The Nx delivery system as ${n} stacked layers, from ${stack[n - 1]} at the base up to ${stack[0]}`}
      className="h-auto w-full"
    >
      {/* draw from the base up so upper plates overlap lower ones */}
      {stack
        .map((name, i) => ({ name, i }))
        .reverse()
        .map(({ name, i }) => {
          const y = 100 + i * 96
          const a = PLATE_ALPHA[i]
          const num = String(n - i).padStart(2, '0')
          return (
            <g key={name}>
              <polygon
                fill="#0000F4"
                fillOpacity={a * 0.7}
                points={`70,${y + 135} 340,${y + 270} 610,${y + 135} 610,${y + 145} 340,${y + 280} 70,${y + 145}`}
              />
              <polygon
                fill="#0000F4"
                fillOpacity={a}
                stroke="#8080FF"
                strokeOpacity={0.5}
                strokeWidth={1.5}
                points={`340,${y} 610,${y + 135} 340,${y + 270} 70,${y + 135}`}
              />
              <line x1={610} y1={y + 135} x2={664} y2={y + 135} stroke="rgba(253,253,252,.26)" strokeWidth={1.5} />
              <text
                x={680}
                y={y + 145}
                className="font-mono text-[28px] tracking-[2.5px]"
                fill={i === n - 1 ? '#FDFDFC' : '#8F93B8'}
              >
                {num} · {name.toUpperCase()}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
