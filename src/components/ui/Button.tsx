import { cn } from '../../lib/cn'
import { useMagnetic } from '../../hooks/useMagnetic'

type Variant = 'dark' | 'light' | 'ghost'

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 ' +
  'text-[0.95rem] font-700 leading-none transition-[background,color,box-shadow,transform] ' +
  'duration-200 ease-[cubic-bezier(.22,1,.36,1)] cursor-pointer select-none whitespace-nowrap'

const variants: Record<Variant, string> = {
  dark: 'bg-ink text-white shadow-sm hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0',
  light:
    'bg-surface text-ink border border-line shadow-sm hover:border-ink/20 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'bg-transparent text-ink hover:bg-ink/[0.05]',
}

type Props = {
  children: React.ReactNode
  variant?: Variant
  href?: string
  onClick?: () => void
  className?: string
  magnetic?: boolean
  type?: 'button' | 'submit'
} & Record<string, unknown>

/** Primary action. Magnetic by default (springs toward cursor). */
export function Button({
  children,
  variant = 'dark',
  href,
  onClick,
  className,
  magnetic = true,
  type = 'button',
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(
    magnetic ? 0.3 : 0,
  )
  const cls = cn(base, variants[variant], className)

  if (href) {
    return (
      <a ref={ref} href={href} className={cls} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
