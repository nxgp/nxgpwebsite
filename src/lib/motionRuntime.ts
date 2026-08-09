import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register once, app-wide. Loaded ONLY via loadMotion() in ./motion.ts, so
// gsap + lenis stay in an async chunk off the critical path.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger, Lenis }
