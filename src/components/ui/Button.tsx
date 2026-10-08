import { cn } from '../../lib/cn'
import { useMagnetic } from '../../hooks/useMagnetic'

/**
 * v2 button set (Figma "NxGP v2 Design"): square corners, 15px medium label.
 *  primary — electric blue; navy on hover (any surface)
 *  light   — soft white on navy; turns blue on hover
 *  ghost   — hairline outline on navy; faint fill on hover
 */
type Variant = 'primary' | 'light' | 'ghost'
type Size = 'md' | 'sm'

const base =
  'group relative inline-flex items-center justify-center gap-3 border font-500 leading-none ' +
  'tracking-[-0.01em] ' +
  'cursor-pointer select-none whitespace-nowrap'

const sizes: Record<Size, string> = {
  md: 'px-6 py-[14px] text-[15px]',
  sm: 'px-[18px] py-[11px] text-[15px]',
}

const variants: Record<Variant, string> = {
  primary:
    'border-accent bg-accent text-white shadow-[0_8px_18px_-12px_rgba(0,0,244,0.55)] hover:border-navy hover:bg-navy',
  light: 'border-bg bg-bg text-navy hover:border-accent hover:bg-accent hover:text-white',
  ghost: 'border-bg/40 bg-transparent text-bg hover:border-bg hover:bg-bg/[0.12]',
}

/** 14px up-right arrow (Figma node 212:16); nudges 2px up-right on hover. */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={cn(
        'size-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
        className,
      )}
    >
      <path d="M2 12L12 2M12 9V2H5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

type Props = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  /** show the up-right arrow after the label */
  arrow?: boolean
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
  magnetic?: boolean
  type?: 'button' | 'submit'
} & Record<string, unknown>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  href,
  onClick,
  className,
  magnetic = false,
  type = 'button',
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(
    magnetic ? 0.3 : 0,
  )
  const cls = cn(base, sizes[size], variants[variant], className)
  const body = (
    <>
      {children}
      {arrow && <ArrowUpRight />}
    </>
  )

  if (href) {
    return (
      <a ref={ref} href={href} className={cls} onClick={onClick} {...rest}>
        {body}
      </a>
    )
  }
  return (
    <button ref={ref} type={type} className={cls} onClick={onClick} {...rest}>
      {body}
    </button>
  )
}
