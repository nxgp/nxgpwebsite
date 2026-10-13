import { cn } from '../../lib/cn'

/**
 * Button set from the Webflow build: square corners, 14px medium label.
 * Only the background fades (0.32s); Webflow's other transitions are invalid
 * in its export, so border and text colour switch instantly there too.
 *  primary — electric blue; navy on hover (.btn-blue)
 *  light   — soft white on navy; turns blue on hover (.btn)
 *  ghost   — hairline outline on navy; faint fill on hover (.btn-ghost)
 */
type Variant = 'primary' | 'light' | 'ghost'
type Size = 'md' | 'sm'

const base =
  'group relative inline-flex items-center justify-center gap-3 border font-500 leading-[1.65] ' +
  'transition-[background-color] duration-[320ms] ease-[ease] ' +
  'cursor-pointer select-none whitespace-nowrap'

const sizes: Record<Size, string> = {
  md: 'px-[22px] py-[14px] text-[14px]',
  // the header button (.header-btn)
  sm: 'px-[18px] py-[10px] text-[14px]',
}

const variants: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-white hover:border-navy hover:bg-navy',
  light: 'border-bg bg-bg text-navy hover:border-accent hover:bg-accent hover:text-white',
  ghost: 'border-bg/50 bg-transparent text-bg hover:border-bg hover:bg-bg/[0.12]',
}

/** 13px up-right arrow (Webflow .btn-icon); nudges 2px up-right on hover. */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={cn(
        'size-[13px] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
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
  type = 'button',
  ...rest
}: Props) {
  const cls = cn(base, sizes[size], variants[variant], className)
  const body = (
    <>
      {children}
      {arrow && <ArrowUpRight />}
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {body}
      </a>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {body}
    </button>
  )
}
