import { useId } from 'react'
import { cn } from '../../lib/cn'

/**
 * Nx Growth Partners logo — the flowing "Nx" ligature with the green crossing
 * stroke, recreated as theme-able SVG. The dark strokes use `currentColor` so
 * the same mark works in ink on light surfaces and white on dark.
 */
export function NxMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 120 84" fill="none" className={cn('w-auto', className)} aria-hidden>
      <defs>
        <linearGradient id={id} x1="36" y1="74" x2="96" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0A7E58" />
          <stop offset="1" stopColor="#34C88E" />
        </linearGradient>
      </defs>
      <path
        d="M22 73 L22 35 C22 25 32 23 39 32 L62 64 C71 78 90 79 95 62 C99 50 91 45 83 51"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M37 72 L95 22" stroke={`url(#${id})`} strokeWidth="11" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({
  className,
  word = true,
}: {
  className?: string
  word?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <NxMark className="h-7" />
      {word && (
        <span className="flex flex-col leading-[1.05]">
          <span className="text-[0.66rem] font-700 uppercase tracking-[0.16em]">
            Growth
          </span>
          <span className="text-[0.66rem] font-700 uppercase tracking-[0.16em]">
            Partners
          </span>
        </span>
      )}
    </span>
  )
}
