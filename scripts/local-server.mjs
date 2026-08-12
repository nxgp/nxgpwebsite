/**
 * Local full-stack server — the built site plus the REAL edge handlers, so
 * the assistant and Sketch-my-agent work on localhost exactly as they do on
 * Vercel. Reads env from .env.local (gitignored).
 *
 *   npm run build && node scripts/local-server.mjs   → http://localhost:4200
 *
 * Serves dist/ with directory-index resolution (like Vercel; NOT like
 * `vite preview`, whose SPA fallback shadows the per-route pages) and
 * mounts /api/chat, /api/sketch, /api/feedback from an esbuild bundle.
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PORT || 4200)

// ---- env from .env.local ----
const envPath = path.join(root, '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('⚠ ANTHROPIC_API_KEY not set — chat and sketching will 503')
}

// ---- bundle the real handlers ----
const tmp = mkdtempSync(path.join(tmpdir(), 'nx-local-'))
const handlers = {}
for (const name of ['chat', 'sketch', 'feedback']) {
  // branches differ in which endpoints exist (e.g. sketch only lands with
  // its feature) — mount what's here rather than dying on what isn't
  if (!existsSync(path.join(root, `api/${name}.ts`))) continue
  const out = path.join(tmp, `${name}.mjs`)
  execSync(`npx -y esbuild api/${name}.ts --bundle --format=esm --platform=node --outfile=${out}`, {
    cwd: root,
    stdio: 'pipe',
  })
  handlers[name] = (await import(out)).default
}

// ---- static resolution, Vercel-style ----
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
}

function staticFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/'
  if (clean.includes('..')) return null
  const candidates =
    clean === '/'
      ? ['index.html']
      : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`]
  for (const rel of candidates) {
    const p = path.join(root, 'dist', rel)
    if (existsSync(p) && !p.endsWith(path.sep)) {
      try {
        return { body: readFileSync(p), type: MIME[path.extname(p)] ?? 'application/octet-stream' }
      } catch {
        /* directory hit — keep looking */
      }
    }
  }
  return null
}

// ---- server ----
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`)

    const api = url.pathname.match(/^\/api\/(chat|sketch|feedback)$/)
    if (api) {
      const chunks = []
      for await (const c of req) chunks.push(c)
      const request = new Request(`http://localhost:${PORT}${req.url}`, {
        method: req.method,
        headers: { ...req.headers, 'x-forwarded-for': '127.0.0.1' },
        ...(chunks.length ? { body: Buffer.concat(chunks) } : {}),
      })
      if (!handlers[api[1]]) {
        res.writeHead(404, { 'content-type': 'application/json' })
        res.end(`{"error":"/api/${api[1]} not on this branch"}`)
        return
      }
      try {
        const response = await handlers[api[1]](request)
        res.writeHead(response.status, Object.fromEntries(response.headers))
        if (response.body) {
          // stream — the chat endpoint is SSE
          for await (const chunk of response.body) res.write(chunk)
        }
        res.end()
      } catch (e) {
        console.error(`api/${api[1]}:`, e)
        res.writeHead(500).end('{"error":"local server error"}')
      }
      return
    }

    const file = staticFile(url.pathname)
    if (file) {
      res.writeHead(200, { 'content-type': file.type })
      res.end(file.body)
    } else {
      const notFound = staticFile('/404') ?? { body: 'Not found', type: 'text/plain' }
      res.writeHead(404, { 'content-type': notFound.type })
      res.end(notFound.body)
    }
  })
  .listen(PORT, () => {
    console.log(`nx local server → http://localhost:${PORT}`)
    console.log(`  sketch:  http://localhost:${PORT}/sketch`)
    console.log(
      `  env: anthropic ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗'} · supabase ${process.env.SUPABASE_URL ? '✓' : '✗'} · resend ${process.env.RESEND_API_KEY ? '✓' : '✗'} · slack ${process.env.SLACK_WEBHOOK_URL ? '✓' : '✗'}`,
    )
  })
