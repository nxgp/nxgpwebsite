/**
 * Post-build prerender: injects the SSR-rendered app into dist/index.html.
 * Runs after `vite build` (client) + `vite build --ssr` (server bundle).
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const { render } = await import(
  path.join(root, 'dist-server/entry-server.js')
)

const indexPath = path.join(root, 'dist/index.html')
let html = readFileSync(indexPath, 'utf8')

// 1) Inject the SSR-rendered app markup.
const appHtml = render()
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html')
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

// 2) Inline the (single, small) stylesheet — with prerendered HTML this makes
//    first paint need zero render-blocking requests.
const cssLink = html.match(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = readFileSync(path.join(root, 'dist', cssLink[1]), 'utf8')
  html = html.replace(cssLink[0], `<style>${css}</style>`)
} else {
  console.warn('prerender: no stylesheet link found to inline')
}

writeFileSync(indexPath, html)

// the server bundle is a build intermediate — don't ship it
rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })

console.log(`prerender: injected ${(appHtml.length / 1024).toFixed(1)}kB of static HTML into dist/index.html`)
