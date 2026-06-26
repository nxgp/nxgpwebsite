import { cn } from '../../lib/cn'

type Blob = {
  color: string
  size: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay?: number
  duration?: number
  opacity?: number
}

/**
 * Soft pastel aurora — blurred, low-opacity blobs that drift slowly.
 * Pure CSS keyframes so it costs almost nothing and animates independently
 * of scroll. Pointer-events off; decorative.
 */
export function Aurora({
  blobs,
  className,
  dark = false,
}: {
  blobs: Blob[]
  className?: string
  dark?: boolean
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      style={{ mixBlendMode: dark ? 'screen' : 'normal' }}
    >
      {blobs.map((b, i) => (
        <span
          key={i}
          className="au-blob"
          style={{
            position: 'absolute',
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            background: b.color,
            opacity: b.opacity ?? (dark ? 0.5 : 0.55),
            borderRadius: '50%',
            filter: `blur(${Math.round(b.size * 0.42)}px)`,
            animationDelay: `${b.delay ?? 0}s`,
            animationDuration: `${b.duration ?? 22}s`,
          }}
        />
      ))}
    </div>
  )
}
