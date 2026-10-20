/**
 * IndexNow — tells Bing (and Yandex, Seznam, Naver…) which URLs just changed,
 * so new blog posts get crawled in hours instead of days. Google does NOT
 * use IndexNow; it relies on the sitemap's <lastmod> instead.
 *
 * Runs daily from Vercel Cron, AFTER the deploys it reports on are live: it
 * reads the production sitemap and submits every URL whose <lastmod> falls
 * inside the lookback window. Only routes with a real modified date (blog
 * posts + the blog index) carry one, so static pages are never resubmitted.
 *
 * GET /api/indexnow          header: Authorization: Bearer $CRON_SECRET
 * GET /api/indexnow?all=1    submit every URL in the sitemap (first run, or
 *                            after a site-wide change)
 *
 * Ownership is proven by the key file at https://nxgp.io/<KEY>.txt
 * (public/<KEY>.txt). The key is public by design; rotate both together.
 */

export const config = { runtime: 'edge' }

const SITE = 'https://nxgp.io'
const KEY = 'ae7e3b60e2533bf394396839dafca4a3'
// Cron runs every 24h; the extra 2h covers schedule jitter and slow deploys.
// Resubmitting a URL inside the overlap is harmless.
const LOOKBACK_MS = 26 * 3_600_000

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function parseSitemap(xml: string): { loc: string; lastmod?: string }[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '',
    lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  }))
}

export default async function handler(req: Request): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return json({ error: 'unauthorized' }, 401)
  }

  const res = await fetch(`${SITE}/sitemap.xml`)
  if (!res.ok) return json({ error: `sitemap fetch failed: ${res.status}` }, 502)
  const entries = parseSitemap(await res.text()).filter((e) => e.loc.startsWith(`${SITE}/`))

  const all = new URL(req.url).searchParams.get('all') === '1'
  const since = Date.now() - LOOKBACK_MS
  const urlList = entries
    .filter((e) => all || (e.lastmod && Date.parse(e.lastmod) >= since))
    .map((e) => e.loc)

  if (urlList.length === 0) return json({ submitted: 0 })

  const submit = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  })
  // 200 = accepted; 202 = accepted, key still being verified (first submits)
  if (!submit.ok) {
    return json({ error: `indexnow ${submit.status}`, detail: await submit.text() }, 502)
  }
  return json({ submitted: urlList.length, status: submit.status, urlList })
}
