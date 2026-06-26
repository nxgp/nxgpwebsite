import { motion } from 'motion/react'
import { cn } from '../../lib/cn'
import { prefersReducedMotion } from '../../lib/reducedMotion'

/**
 * Surface card with the signature soft layered shadow and a spring lift on
 * hover. Hover motion is suppressed under reduced-motion.
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
} & React.ComponentProps<typeof motion.div>) {
  const reduce = prefersReducedMotion()
  return (
    <motion.div
      className={cn(
        'rounded-card border border-line bg-surface shadow-sm',
        interactive && 'transition-shadow',
        className,
      )}
      whileHover={
        interactive && !reduce
          ? { y: -4, boxShadow: 'var(--shadow-lg)' }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
