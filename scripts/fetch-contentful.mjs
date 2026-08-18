/**
 * Build-time Contentful fetch.
 *
 * This site is statically prerendered (no server runtime for pages), so blog
 * content is pulled at build time and written to src/data/blog.generated.ts.
 * routes.tsx reads that file, which means every post gets a real prerendered
 * page with its own title, canonical and JSON-LD, and lands in the sitemap
 * automatically. Nothing about the blog costs the visitor a client-side fetch.
 *
 * Rich text is rendered to HTML HERE rather than in the browser, so the
 * Contentful renderer never enters the client bundle.
 *
 * Publishing a post therefore needs a rebuild: point a Contentful webhook at
 * a Vercel deploy hook (see docs/BLOG.md).
 *
 *   CONTENTFUL_SPACE_ID       required
 *   CONTENTFUL_ACCESS_TOKEN   Content Delivery token (published entries)
 *   CONTENTFUL_PREVIEW_TOKEN  optional; with CONTENTFUL_PREVIEW=1 includes drafts
 *
 * Without credentials the script leaves the committed generated file alone, so
 * builds never fail just because a secret is missing.
 */
import { createClient } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(root, 'src/data/blog.generated.ts')

const space = process.env.CONTENTFUL_SPACE_ID
const usePreview = process.env.CONTENTFUL_PREVIEW === '1'
const token = usePreview
  ? process.env.CONTENTFUL_PREVIEW_TOKEN
  : process.env.CONTENTFUL_ACCESS_TOKEN

if (!space || !token) {
  const how = usePreview ? 'CONTENTFUL_PREVIEW_TOKEN' : 'CONTENTFUL_ACCESS_TOKEN'
  console.warn(
    `contentful: CONTENTFUL_SPACE_ID/${how} not set — keeping the committed ` +
      `${existsSync(OUT) ? 'blog.generated.ts' : '(missing) blog.generated.ts'}`,
  )
  if (!existsSync(OUT)) writeFileSync(OUT, emptyModule())
  process.exit(0)
}

const client = createClient({
  space,
  accessToken: token,
  ...(usePreview ? { host: 'preview.contentful.com' } : {}),
})

/* ---------- rich text ---------- */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const assetUrl = (u) => (u?.startsWith('//') ? `https:${u}` : u)

/** Tailwind-flavoured HTML so posts inherit the site's type scale. */
const renderOptions = {
  renderMark: {
    [MARKS.CODE]: (t) => `<code class="rounded bg-bg px-1.5 py-0.5 font-mono text-[0.9em]">${t}</code>`,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_n, next) => `<p class="mt-5 leading-relaxed text-ink-soft">${next(_n.content)}</p>`,
    // the page renders the post title as the h1, so a body h1 becomes an h2
    // rather than giving the page two competing top-level headings
    [BLOCKS.HEADING_1]: (_n, next) => `<h2 class="t-h3 mt-10">${next(_n.content)}</h2>`,
    [BLOCKS.HEADING_2]: (_n, next) => `<h2 class="t-h3 mt-10">${next(_n.content)}</h2>`,
    [BLOCKS.HEADING_3]: (_n, next) =>
      `<h3 class="mt-8 font-display text-[1.15rem] font-800 tracking-[-0.01em]">${next(_n.content)}</h3>`,
    [BLOCKS.HEADING_4]: (_n, next) => `<h4 class="mt-6 font-700">${next(_n.content)}</h4>`,
    // NB: no flex here. `display:flex` turns the <li>s into flex items, which
    // removes their markers entirely, and Tailwind's preflight already sets
    // list-style:none — so the bullets need list-disc/list-decimal spelled out.
    [BLOCKS.UL_LIST]: (_n, next) =>
      `<ul class="mt-5 list-disc space-y-2 pl-6 marker:text-ink-faint">${next(_n.content)}</ul>`,
    [BLOCKS.OL_LIST]: (_n, next) =>
      `<ol class="mt-5 list-decimal space-y-2 pl-6 marker:text-ink-faint">${next(_n.content)}</ol>`,
    [BLOCKS.LIST_ITEM]: (_n, next) =>
      `<li class="leading-relaxed text-ink-soft [&>p]:mt-0 [&>ul]:mt-2 [&>ol]:mt-2">${next(_n.content)}</li>`,
    [BLOCKS.QUOTE]: (_n, next) =>
      `<blockquote class="mt-6 border-l-2 border-accent pl-4 text-ink [&>p]:mt-0">${next(_n.content)}</blockquote>`,
    [BLOCKS.HR]: () => `<hr class="mt-8 border-line" />`,
    // Tables shipped as bare <table>/<td>, which preflight renders as
    // squashed text. Style them, bold the header row, and let them scroll
    // sideways on narrow screens instead of blowing out the column.
    [BLOCKS.TABLE]: (_n, next) =>
      `<div class="mt-6 overflow-x-auto rounded-inner border border-line">` +
      `<table class="w-full border-collapse text-[0.92rem] [&_tr:first-child]:bg-bg [&_tr:first-child]:font-700 [&_tr:first-child]:text-ink">` +
      `<tbody>${next(_n.content)}</tbody></table></div>`,
    [BLOCKS.TABLE_ROW]: (_n, next) => `<tr class="border-b border-line last:border-0">${next(_n.content)}</tr>`,
    [BLOCKS.TABLE_CELL]: (_n, next) =>
      `<td class="border-r border-line px-3 py-2.5 align-top text-ink-soft last:border-0 [&>p]:mt-0 [&>p+p]:mt-2">${next(_n.content)}</td>`,
    [BLOCKS.TABLE_HEADER_CELL]: (_n, next) =>
      `<th class="border-r border-line bg-bg px-3 py-2.5 text-left align-top font-700 text-ink last:border-0 [&>p]:mt-0">${next(_n.content)}</th>`,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const f = node.data?.target?.fields
      if (!f?.file?.url) return ''
      const { width, height } = f.file.details?.image ?? {}
      return (
        `<img src="${esc(assetUrl(f.file.url))}" alt="${esc(f.title ?? '')}"` +
        (width ? ` width="${width}" height="${height}"` : '') +
        ` loading="lazy" decoding="async" class="mt-8 w-full rounded-inner border border-line" />`
      )
    },
    // component - Rich image, embedded in the body
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const f = node.data?.target?.fields
      const img = f?.image?.fields
      if (!img?.file?.url) return ''
      const cap = f.caption
        ? `<figcaption class="mt-2 text-[0.85rem] text-ink-faint">${esc(f.caption)}</figcaption>`
        : ''
      return (
        `<figure class="mt-8"><img src="${esc(assetUrl(img.file.url))}" alt="${esc(img.title ?? '')}"` +
        ` loading="lazy" decoding="async" class="w-full rounded-inner border border-line" />${cap}</figure>`
      )
    },
    [INLINES.HYPERLINK]: (node, next) => {
      const url = node.data?.uri ?? ''
      const ext = /^https?:\/\//.test(url) && !url.includes('nxgp.io')
      return (
        `<a href="${esc(url)}" class="font-600 text-accent-deep underline underline-offset-2 hover:text-accent"` +
        (ext ? ' target="_blank" rel="noopener noreferrer"' : '') +
        `>${next(node.content)}</a>`
      )
    },
  },
}

/**
 * Editors often repeat the post title as the first heading in the body. The
 * page already renders the title as its h1, so drop that leading heading
 * rather than showing it twice.
 */
function stripDuplicateTitle(doc, title) {
  const first = doc?.content?.[0]
  if (!first || !/^heading-/.test(first.nodeType)) return doc
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  if (norm(plainText({ content: [first] })) !== norm(title)) return doc
  return { ...doc, content: doc.content.slice(1) }
}

/** Plain text for meta descriptions and reading time. */
function plainText(doc) {
  const walk = (n) =>
    n.nodeType === 'text' ? n.value : (n.content ?? []).map(walk).join(n.nodeType === 'paragraph' ? '' : ' ')
  return (doc?.content ?? []).map(walk).join(' ').replace(/\s+/g, ' ').trim()
}

/* ---------- fetch ---------- */

const res = await client.getEntries({
  content_type: 'pageBlogPost',
  order: ['-fields.publishedDate'],
  include: 3,
})

const posts = res.items
  .map((item) => {
    const f = item.fields
    if (!f?.slug || !f?.title) return null
    const seo = f.seoFields?.fields ?? {}
    const body = plainText(f.content)
    return {
      id: item.sys.id,
      slug: String(f.slug).replace(/^\/+|^blog\/+/g, ''),
      title: String(f.title),
      description: String(f.shortDescription ?? seo.pageDescription ?? body.slice(0, 200)),
      publishedDate: f.publishedDate ?? item.sys.createdAt,
      updatedAt: item.sys.updatedAt,
      author: f.author?.fields?.name ?? 'Nx Growth Partners',
      authorAvatar: assetUrl(f.author?.fields?.avatar?.fields?.file?.url) ?? null,
      image: assetUrl(f.featuredImage?.fields?.file?.url) ?? null,
      imageAlt: f.featuredImage?.fields?.title ?? String(f.title),
      tags: Array.isArray(f.contentType) ? f.contentType : [],
      readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
      // SEO component overrides, when the editor filled them in
      seoTitle: seo.pageTitle ?? null,
      seoDescription: seo.pageDescription ?? null,
      noindex: Boolean(seo.noindex),
      html: documentToHtmlString(stripDuplicateTitle(f.content, String(f.title)), renderOptions),
    }
  })
  .filter(Boolean)
  .filter((p) => !p.noindex)

writeFileSync(OUT, module_(posts))
console.log(
  `contentful: ${posts.length} post(s) → src/data/blog.generated.ts` +
    (usePreview ? ' (PREVIEW: includes drafts)' : ''),
)

/* ---------- emit ---------- */

function module_(posts) {
  return `${header()}export const posts: BlogPost[] = ${JSON.stringify(posts, null, 2)}\n`
}
function emptyModule() {
  return `${header()}export const posts: BlogPost[] = []\n`
}
function header() {
  return `// GENERATED by scripts/fetch-contentful.mjs — do not edit by hand.
// Regenerated on every build; committed so builds work without credentials.
export type BlogPost = {
  id: string
  slug: string
  title: string
  description: string
  publishedDate: string
  updatedAt: string
  author: string
  authorAvatar: string | null
  image: string | null
  imageAlt: string
  tags: string[]
  readingMinutes: number
  seoTitle: string | null
  seoDescription: string | null
  noindex: boolean
  /** Rich text pre-rendered to HTML at build time. */
  html: string
}

`
}
