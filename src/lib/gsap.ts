import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register once, app-wide. Every scroll-driven animation imports from here.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
