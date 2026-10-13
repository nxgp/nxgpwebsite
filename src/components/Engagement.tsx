import { engagement } from '../data/content'
import { useActiveOnScroll } from '../hooks/useActiveOnScroll'
import { cn } from '../lib/cn'

/**
 * The Nx delivery system, built to the Webflow section (#system): one
 * isometric slab per engagement model in a chamfered panel beside the
 * model cards. The panel stays in view while the cards scroll; the active
 * card (nearest the viewport centre, or hovered/focused) is highlighted
 * and its slab lifts and fills blue while the others grey out.
 */

export function Engagement() {
  const { items } = engagement
  const { active, bind } = useActiveOnScroll(items.length)

  return (
    <section id="system" aria-labelledby="system-title" className="section-v2 bg-navy text-bg">
      <div className="shell">
        <div data-reveal className="mb-16 flex flex-col items-center gap-6 text-center">
          <p className="t-eyebrow text-peri">{engagement.eyebrow}</p>
          <h2 id="system-title" className="t-h2">
            <span className="block">{engagement.h2a}</span>
            <span className="block text-peri">{engagement.h2b}</span>
          </h2>
          <p className="t-lead max-w-[74ch] text-mist">{engagement.sub}</p>
        </div>

        <div className="grid items-start gap-8 min-[992px]:grid-cols-[1fr_0.92fr] min-[992px]:gap-14">
          <div className="min-[992px]:sticky min-[992px]:top-[102px]">
            <div className="grid aspect-[4/3] place-items-center border border-bg/[0.09] bg-bg/[0.03] p-3 [clip-path:polygon(0_0,calc(100%-26px)_0,100%_26px,100%_100%,26px_100%,0_calc(100%-26px))] md:p-6 min-[992px]:aspect-[1312/1000]">
              <Stack active={active} />
            </div>
          </div>

          <ol className="grid border border-bg/[0.09]">
            {items.map((e, i) => (
              <li
                key={e.name}
                {...bind(i)}
                className={cn(
                  'grid content-start gap-3 border-b border-l-[3px] border-b-bg/[0.09] px-5 py-7 transition-[background-color,border-color] duration-[320ms] md:px-7',
                  i === active ? 'border-l-peri bg-accent/[0.24]' : 'border-l-transparent',
                )}
              >
                <span className="font-mono text-[12px] uppercase leading-[1.65] tracking-[0.14em] text-peri">
                  Layer {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-h3">{e.name}</h3>
                <p className="text-[14px] leading-[1.65] text-mist">{e.body}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <li key={t} className="border border-bg/24 px-[9px] py-1 text-[12px] leading-[1.65] text-[#d3d6ec]">
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

// Webflow slab fills, top slab first: left face, right face, top face
const SLAB_FILLS = [
  ['#11157E', '#14189C', '#1A1EC0'],
  ['#0C1050', '#0F1362', '#131878'],
  ['#090C40', '#0B0F50', '#0E1260'],
  ['#070A2E', '#090D38', '#0B1042'],
]

// Webflow slab motion: idle slabs fade and grey out, the active one lifts
// 8 units on a spring-out curve, everything over 0.62s
const SLAB_EASE =
  '[transition:opacity_.62s,filter_.62s,translate_.62s_cubic-bezier(0.16,1,0.3,1)]'
const SLAB_IDLE = 'opacity-[0.58] [filter:saturate(0.24)_brightness(0.66)]'
const FADE = 'transition-[fill,stroke] duration-[620ms]'

/** One isometric slab per engagement model, first model on top. */
function Stack({ active }: { active: number }) {
  const { items } = engagement
  return (
    <svg
      viewBox="0 0 1000 780"
      role="img"
      aria-label={`The Nx delivery system: ${items.length} engagement models as stacked isometric plates, ${items[0].name} at the top to ${items[items.length - 1].name} at the base`}
      className="size-full overflow-visible"
    >
      {/* draw from the base up so upper slabs overlap lower ones */}
      {items
        .map((e, i) => ({ name: e.name, i }))
        .reverse()
        .map(({ name, i }) => {
          const y = 100 + i * 96
          const [left, right, top] = SLAB_FILLS[i] ?? SLAB_FILLS[SLAB_FILLS.length - 1]
          const on = i === active
          return (
            <g key={name} className={cn(SLAB_EASE, on ? '-translate-y-2' : SLAB_IDLE)}>
              <polygon fill={left} points={`70,${y + 135} 340,${y + 270} 340,${y + 286} 70,${y + 151}`} />
              <polygon fill={right} points={`340,${y + 270} 610,${y + 135} 610,${y + 151} 340,${y + 286}`} />
              <polygon
                stroke="rgba(128,128,255,.45)"
                className={FADE}
                style={{ fill: on ? '#0000F4' : top }}
                points={`340,${y} 610,${y + 135} 340,${y + 270} 70,${y + 135}`}
              />
              <line
                x1={610}
                y1={y + 135}
                x2={664}
                y2={y + 135}
                strokeWidth={1.5}
                className={FADE}
                style={{ stroke: on ? '#8080FF' : 'rgba(253,253,252,.26)' }}
              />
              <text
                x={676}
                y={y + 140}
                className={cn('font-mono text-[15px] tracking-[1.4px]', FADE)}
                style={{ fill: on ? '#FDFDFC' : '#C3C7E0' }}
              >
                {String(i + 1).padStart(2, '0')} · {name.toUpperCase()}
              </text>
            </g>
          )
        })}
    </svg>
  )
}
