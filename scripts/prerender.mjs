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
const template = readFileSync(indexPath, 'utf8')

const appHtml = render()
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html')
}
writeFileSync(
  indexPath,
  template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
)

// the server bundle is a build intermediate — don't ship it
rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })

console.log(`prerender: injected ${(appHtml.length / 1024).toFixed(1)}kB of static HTML into dist/index.html`)
