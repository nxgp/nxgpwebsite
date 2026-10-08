import { gsap } from 'gsap'

// Loaded ONLY via loadMotion() in ./motion.ts, so gsap stays in an async
// chunk off the critical path.
export { gsap }
