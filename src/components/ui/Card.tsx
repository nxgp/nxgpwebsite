import { cn } from '../../lib/cn'

/**
 * Surface card with the signature soft layered shadow and a lift on hover.
 * Pure CSS — the global prefers-reduced-motion clamp suppresses the motion.
 */
export function Card({
  children,
  className,
  interactive = true,
  ...rest
}: {
  children: React.ReactNode
  className?: string
  interactive?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface shadow-sm',
        interactive &&
          'transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
