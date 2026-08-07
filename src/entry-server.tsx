import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * SSG entry — renders the full page to static HTML at build time
 * (scripts/prerender.mjs injects it into dist/index.html). Crawlers and
 * AI answer engines that don't execute JS get the complete content;
 * users get meaningful paint before the bundle hydrates.
 */
export function render(): string {
  return renderToString(<App />)
}
