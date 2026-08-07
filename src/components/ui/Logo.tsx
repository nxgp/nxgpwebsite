import { cn } from '../../lib/cn'

/**
 * Nx Growth Partners logo — the official layered-N mark from the brand
 * guidelines. Two periwinkle (#8080FF) and two electric-blue (#0000F4)
 * parallelograms whose negative space forms the letter N. Geometry is taken
 * verbatim from the brand's icon SVG, normalized to a tight viewBox.
 * Pass `mono` to render the mark in a single color (currentColor) for
 * monochrome contexts, per the brand's mono variants.
 */
export function NxMark({ className, mono = false }: { className?: string; mono?: boolean }) {
  const peri = mono ? 'currentColor' : '#8080FF'
  const blue = mono ? 'currentColor' : '#0000F4'
  return (
    <svg
      viewBox="0 0 412 570"
      fill="none"
      className={cn('w-auto', className)}
      aria-hidden
    >
      <polygon fill={peri} points="291.05,83.33 291.05,399.86 411.2,520 411.2,203.51" />
      <polygon fill={peri} points="161.4,440.11 291.05,569.76 291.05,399.86 161.4,270.21" />
      <polygon fill={blue} points="0,366.25 120.15,486.43 120.15,169.9 0,49.76" />
      <polygon fill={blue} points="249.8,129.65 120.15,0 120.15,169.9 249.8,299.55" />
    </svg>
  )
}

export function Logo({
  className,
  word = true,
  dark = false,
}: {
  className?: string
  word?: boolean
  /** On dark surfaces the wordmark flips to white; the mark keeps its brand colors. */
  dark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <NxMark className="h-8" />
      {word && (
        <span
          className="flex flex-col font-logo font-500 leading-[1.08] tracking-[-0.01em]"
          style={{ color: dark ? '#ffffff' : 'var(--color-navy)' }}
        >
          <span className="text-[1.02rem]">Nx Growth</span>
          <span className="text-[1.02rem]">Partners</span>
        </span>
      )}
    </span>
  )
}
