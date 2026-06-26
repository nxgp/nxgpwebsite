import { useEffect, useRef } from 'react'
import { isCoarsePointer, prefersReducedMotion } from '../lib/reducedMotion'

/**
 * Small custom cursor: a hard dot tracks the pointer 1:1, a ring trails with
 * inertia and scales over interactive elements. Disabled on touch / coarse
 * pointers and under reduced-motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let visible = false

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      if (!visible) {
        visible = true
        d.style.opacity = '1'
        r.style.opacity = '1'
      }
      const hot = !!(e.target as HTMLElement)?.closest?.('a, button, [data-cursor-hot]')
      r.classList.toggle('is-hot', hot)
    }

    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    const onLeave = () => {
      d.style.opacity = '0'
      r.style.opacity = '0'
      visible = false
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} />
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} />
    </>
  )
}
