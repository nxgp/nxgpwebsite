# Blog (Contentful)

Posts live in Contentful and are pulled **at build time**, then prerendered as
static pages. That keeps the blog consistent with the rest of the site: every
post is real HTML with its own `<title>`, canonical, breadcrumb and
`BlogPosting` JSON-LD, and visitors never wait on a client-side fetch. The
Contentful SDK and rich-text renderer stay out of the browser bundle entirely.

The trade-off: **publishing needs a rebuild** (see "Going live" below).

## How it works

```
scripts/fetch-contentful.mjs   → src/data/blog.generated.ts   (npm run build, first step)
src/routes.tsx                 → /blog + /blog/<slug> routes  (from that file)
scripts/prerender.mjs          → static HTML + sitemap        (from the route table)
```

`src/data/blog.generated.ts` is committed. Builds without Contentful
credentials keep the committed copy instead of failing, so CI, forks and
`npm run build` on a laptop all work.

Content model (`pageBlogPost`): `title`, `slug`, `publishedDate`, `author`
(→ `componentAuthor.name` + avatar), `featuredImage`, `shortDescription`,
`content` (rich text), `contentType` (tags), `seoFields` (→ `componentSeo`,
whose `pageTitle` / `pageDescription` override the defaults, and whose
`noindex` drops a post from the build).

Images are served from Contentful's CDN with `?w=…&fm=webp&q=…`, so they are
resized and converted per breakpoint without any build-time image pipeline.

## Environment

| Variable | Where | Purpose |
|---|---|---|
| `CONTENTFUL_SPACE_ID` | Vercel + `.env.local` | space |
| `CONTENTFUL_ACCESS_TOKEN` | Vercel + `.env.local` | Content Delivery token: **published** entries |
| `CONTENTFUL_PREVIEW_TOKEN` | local only | Content Preview token: drafts |

```bash
npm run blog:fetch      # published posts
npm run blog:preview    # includes drafts, for checking a post before publishing
```

## Going live

A published post appears once the site rebuilds. Wire that up once:

1. **Vercel** → Project → Settings → Git → Deploy Hooks → create one
   (name: `contentful`, branch: `main`). Copy the URL.
2. **Contentful** → Settings → Webhooks → Add Webhook
   - URL: the deploy hook, method `POST`
   - Triggers: `Entry` → **publish** and **unpublish** (add `Asset` publish if
     images are swapped without touching the entry)
   - Filter (recommended): content type equals `pageBlogPost`

Publishing then triggers a deploy and the post is live in a minute or two.
