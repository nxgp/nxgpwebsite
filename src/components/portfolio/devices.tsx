import { cn } from '../../lib/cn'

/**
 * Device hardware + studio scenes for the portfolio stage — all CSS, no
 * images. Inspired by agency showcase sections: a soft studio backdrop, a
 * giant cropped wordmark, and the product UI living inside believable
 * hardware (phone / tablet / laptop) instead of a flat card.
 *
 * Layer contract for motion (kept on separate wrappers so transforms never
 * fight): Scene provides perspective → `.dev-in` entrance (opacity/rise) →
 * `.dev-float` idle loop → innermost element carries the static 3D tilt.
 */

/* ---------- the studio ---------- */

export function Scene({
  wordmark,
  dark = false,
  bg,
  children,
  className,
}: {
  /** Giant background brand name, cropped by the panel edge. */
  wordmark: string
  dark?: boolean
  /** Backdrop gradient — per-product studio lighting. */
  bg: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-inner border border-line shadow-sm [perspective:1400px]"
      style={{ background: bg }}
    >
      {/* spotlight falling from the top */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 50% -10%, rgba(255,255,255,0.5), transparent 70%)',
          opacity: dark ? 0.08 : 0.9,
        }}
      />
      {/* the cropped wordmark, like a studio backdrop print */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-3 top-2 select-none whitespace-nowrap font-display text-[3rem] font-800 tracking-[-0.04em] sm:-right-4 sm:text-[4.6rem]',
          dark ? 'text-white/[0.06]' : 'text-navy/[0.05]',
        )}
      >
        {wordmark}
      </span>
      <div className={cn('relative flex h-full w-full', className)}>{children}</div>
    </div>
  )
}

/** Elliptical ground shadow under a floating device. */
export function GroundShadow({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute rounded-[50%] blur-[10px]', className)}
      style={{ background: dark ? 'rgba(0,0,0,0.5)' : 'rgba(6,11,51,0.18)' }}
    />
  )
}

/* ---------- shared bits ---------- */

const bezelMetal = {
  background: 'linear-gradient(145deg, #4a4d58 0%, #16181f 35%, #2c2f38 65%, #4a4d58 100%)',
}

/** Minimal phone/tablet status bar — time + signal + battery. */
function StatusBar({ inset = false }: { inset?: boolean }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between px-3.5 pb-0.5 text-[0.5rem] font-700 text-ink',
        inset ? 'pt-1.5' : 'pt-1',
      )}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        {/* signal */}
        <span className="flex items-end gap-[1.5px]" aria-hidden>
          <i className="h-[3px] w-[2px] rounded-[1px] bg-ink" />
          <i className="h-[5px] w-[2px] rounded-[1px] bg-ink" />
          <i className="h-[7px] w-[2px] rounded-[1px] bg-ink" />
        </span>
        {/* battery */}
        <span className="relative h-[7px] w-[13px] rounded-[2px] border border-ink/60" aria-hidden>
          <i className="absolute inset-[1px] right-[3px] rounded-[1px] bg-ink" />
        </span>
      </span>
    </div>
  )
}

/** Diagonal screen glare — sells the glass. */
function Glare() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        background:
          'linear-gradient(118deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 28%, transparent 45%)',
      }}
    />
  )
}

/* ---------- hardware ---------- */

export function PhoneFrame({
  children,
  className,
  screenClassName,
}: {
  children: React.ReactNode
  className?: string
  screenClassName?: string
}) {
  return (
    <div
      className={cn('aspect-[9/19] rounded-[13.5%_/_6.4%] p-[5px] shadow-device', className)}
      style={bezelMetal}
    >
      <div
        className={cn(
          'relative flex h-full w-full flex-col overflow-hidden rounded-[12%_/_5.7%] bg-surface',
          screenClassName,
        )}
      >
        {/* dynamic island */}
        <span className="absolute left-1/2 top-[6px] z-30 h-[11px] w-[34%] -translate-x-1/2 rounded-full bg-black" aria-hidden />
        <StatusBar />
        <div className="relative min-h-0 flex-1">{children}</div>
        <Glare />
      </div>
    </div>
  )
}

export function TabletFrame({
  children,
  landscape = false,
  className,
  screenClassName,
}: {
  children: React.ReactNode
  landscape?: boolean
  className?: string
  screenClassName?: string
}) {
  return (
    <div
      className={cn(
        'rounded-[18px] p-[9px] shadow-device sm:rounded-[22px] sm:p-[11px]',
        landscape ? 'aspect-[4/3]' : 'aspect-[3/4]',
        className,
      )}
      style={bezelMetal}
    >
      <div
        className={cn(
          'relative flex h-full w-full flex-col overflow-hidden rounded-[10px] bg-surface sm:rounded-[13px]',
          screenClassName,
        )}
      >
        {/* front camera */}
        <span className="absolute left-1/2 top-[3px] z-30 size-[4px] -translate-x-1/2 rounded-full bg-black/70" aria-hidden />
        <StatusBar inset />
        <div className="relative min-h-0 flex-1">{children}</div>
        <Glare />
      </div>
    </div>
  )
}

export function LaptopFrame({
  children,
  className,
  screenClassName,
}: {
  children: React.ReactNode
  className?: string
  screenClassName?: string
}) {
  return (
    <div className={cn('w-full', className)}>
      {/* lid */}
      <div className="rounded-[12px] rounded-b-none p-[6px] pb-0" style={bezelMetal}>
        <div
          className={cn(
            'relative aspect-[16/10] w-full overflow-hidden rounded-t-[7px]',
            screenClassName,
          )}
        >
          {children}
          <Glare />
        </div>
      </div>
      {/* deck — wider than the lid, with the thumb notch */}
      <div className="relative left-1/2 h-[11px] w-[112%] -translate-x-1/2 rounded-b-[14px] rounded-t-[2px] bg-gradient-to-b from-[#d4d6dd] via-[#b7b9c2] to-[#8f919b] shadow-device">
        <span className="absolute left-1/2 top-0 h-[4px] w-[13%] -translate-x-1/2 rounded-b-[6px] bg-[#9b9da7]" aria-hidden />
      </div>
    </div>
  )
}
