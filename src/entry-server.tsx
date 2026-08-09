import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * SSG entry — renders each route to static HTML at build time
 * (scripts/prerender.mjs writes one file per route). Crawlers and
 * AI answer engines that don't execute JS get the complete content;
 * users get meaningful paint before the bundle hydrates.
 */
export function render(path = '/'): string {
  return renderToString(<App path={path} />)
}

/** Route metadata for the prerender script (per-page head tags + sitemap). */
export { ROUTES } from './routes'
