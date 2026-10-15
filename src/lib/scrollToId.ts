import { prefersReducedMotion } from './reducedMotion'

/**
 * Programmatic scroll to a section. Native smooth scroll, as in the Webflow
 * build; sections carry a scroll-margin that clears the fixed header.
 */
export function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}
