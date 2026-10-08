/**
 * Lazy motion runtime — gsap loads as an async chunk instead of blocking
 * first paint. The prerendered page is fully visible and interactive
 * without it.
 */
export type MotionModule = typeof import('./motionRuntime')

let loader: Promise<MotionModule> | null = null

export function loadMotion(): Promise<MotionModule> {
  loader ??= import('./motionRuntime')
  return loader
}

/**
 * Effect helper: run `fn` once the motion runtime arrives, unless the effect
 * has already cleaned up. Returns a disposer suitable for returning straight
 * from useEffect — it cancels a pending run and calls fn's own cleanup.
 */
export function withMotion(fn: (m: MotionModule) => void | (() => void)): () => void {
  let alive = true
  let cleanup: void | (() => void)
  loadMotion().then((m) => {
    if (alive) cleanup = fn(m)
  })
  return () => {
    alive = false
    if (cleanup) cleanup()
  }
}
