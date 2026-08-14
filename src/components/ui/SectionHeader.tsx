import { cn } from '../../lib/cn'

export function SectionHeader({
  title,
  sub,
  align = 'left',
  dark = false,
  className,
}: {
  title: React.ReactNode
  sub?: React.ReactNode
  align?: 'left' | 'center'
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        align === 'center' && 'mx-auto text-center',
        align === 'center' ? 'max-w-[42rem]' : 'max-w-[46rem]',
        className,
      )}
    >
      <h2
        data-reveal
        className={cn('t-h2 mt-4', dark ? 'text-white' : 'text-ink')}
      >
        {title}
      </h2>
      {sub && (
        <p
          data-reveal
          className={cn(
            't-lead mt-5',
            dark && 'text-white/65',
            align === 'center' && 'mx-auto',
          )}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
