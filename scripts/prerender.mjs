/**
 * Post-build prerender: renders every route to its own static HTML file with
 * page-specific head tags, and generates the sitemap from the same route
 * table — URLs, titles and sitemap can never drift apart.
 *
 * Runs after `vite build` (client) + `vite build --ssr` (server bundle).
 *   dist/index.html            — home (full scroll)
 *   dist/<route>/index.html    — one per route in src/routes.tsx
 *   dist/sitemap.xml           — generated, build-dated
 */
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://nxgp.io'

const { render, ROUTES } = await import(path.join(root, 'dist-server/entry-server.js'))

/* ---------- template: read once, inline the stylesheet once ---------- */

let template = readFileSync(path.join(root, 'dist/index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html')
}

// Inline the (single, small) stylesheet — with prerendered HTML this makes
// first paint need zero render-blocking requests.
const cssLink = template.match(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = readFileSync(path.join(root, 'dist', cssLink[1]), 'utf8')
  template = template.replace(cssLink[0], `<style>${css}</style>`)
} else {
  console.warn('prerender: no stylesheet link found to inline')
}

/* ---------- per-page head rewriting ---------- */

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Swap title/description/canonical/og/twitter for a route. Every pattern
 *  must match the template — throw loudly rather than ship a page with the
 *  home page's metadata. */
function headFor(html, { title, description, url }) {
  const swaps = [
    [/<title>[\s\S]*?<\/title>/, `<title>${escAttr(title)}</title>`],
    [
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="description" content="${escAttr(description)}" />`,
    ],
    [
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${url}" />`,
    ],
    [
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${url}" />`,
    ],
    [
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escAttr(title)}" />`,
    ],
    [
      /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta property="og:description" content="${escAttr(description)}" />`,
    ],
    [
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escAttr(title)}" />`,
    ],
    [
      /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="twitter:description" content="${escAttr(description)}" />`,
    ],
  ]
  for (const [re, replacement] of swaps) {
    if (!re.test(html)) throw new Error(`prerender: head pattern not found: ${re}`)
    html = html.replace(re, replacement)
  }
  return html
}

/* ---------- render every page ---------- */

// home
const homeHtml = template.replace('<div id="root"></div>', `<div id="root">${render('/')}</div>`)
writeFileSync(path.join(root, 'dist/index.html'), homeHtml)

// routes
for (const route of ROUTES) {
  let html = headFor(template, {
    title: route.title,
    description: route.description,
    url: `${SITE}${route.path}`,
  })
  html = html.replace('<div id="root"></div>', `<div id="root">${render(route.path)}</div>`)
  const dir = path.join(root, 'dist', route.path.slice(1))
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, 'index.html'), html)
}

/* ---------- analytics on the hand-written static pages ----------
   /privacy and 404 are plain files in public/, so they never pass through
   the template above and would otherwise be the only untracked pages (404s
   are worth seeing — they show broken inbound links). Inject the SAME
   snippet from the template rather than keeping copies in sync by hand. */

const gtagSnippet = template.match(/<!-- Google tag \(gtag\.js\)[\s\S]*?<\/script>/)
if (!gtagSnippet) throw new Error('prerender: Google tag snippet not found in index.html')

for (const rel of ['privacy.html', '404.html']) {
  const file = path.join(root, 'dist', rel)
  let html = readFileSync(file, 'utf8')
  if (html.includes('gtag/js?id=')) continue // already tagged
  if (!html.includes('<head>')) throw new Error(`prerender: no <head> in ${rel}`)
  html = html.replace('<head>', `<head>\n    ${gtagSnippet[0]}`)
  writeFileSync(file, html)
}

/* ---------- sitemap, from the same table ---------- */

const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: `${SITE}/`, priority: '1.0' },
  ...ROUTES.map((r) => ({ loc: `${SITE}${r.path}`, priority: r.path.startsWith('/work/') ? '0.7' : '0.8' })),
  { loc: `${SITE}/privacy`, priority: '0.2' },
]
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n') +
  `\n</urlset>\n`
writeFileSync(path.join(root, 'dist/sitemap.xml'), sitemap)

// the server bundle is a build intermediate — don't ship it
rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })

console.log(`prerender: home + ${ROUTES.length} routes + sitemap (${urls.length} URLs)`)
