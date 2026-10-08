# NX Growth Partners — marketing site

The marketing site for NX Growth Partners (nxgp.io), an embedded technology partner: "Your
team, extended. From idea to production." Senior engineers working inside the client's
business across AI engineering, custom software and embedded delivery, for private equity,
enterprise and government.

The v2 design comes from the Figma file "NxGP v2 Design" (page "Final Dev", frame
`07-updated orders`), which is the source of truth for the look. Transitions and
interactions follow the Webflow reference build.

## Stack

- **Vite + React 19 + TypeScript**, **Tailwind CSS v4** (`@theme` tokens in `src/index.css`)
- Motion follows the Webflow build: native smooth scroll, CSS reveal-on-scroll
  (`src/hooks/useReveal.ts`, gated by the `html.js` script in `index.html`) and 0.32s state
  transitions
- Type: **Google Sans Flex** (body), **Poppins** 400/500 (headings), **JetBrains Mono**
  (labels), self-hosted in `public/fonts`
- Every page is prerendered at build time (`src/entry-server.tsx`, `scripts/prerender.mjs`,
  `src/routes.tsx`), each with its own title, description, canonical and JSON-LD
- Contentful blog fetched at build time (`scripts/fetch-contentful.mjs`), Vercel functions in
  `api/` (chat, contact, feedback) and the Nx Assistant chat widget

Everything respects `prefers-reduced-motion`: reveals, the orbit rotation, testimonial
autoplay and the pinned work rail all switch off or fall back to native scrolling.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # then: node scripts/local-server.mjs → http://localhost:4200
npm run lint
```

## Home page sections

Header · Hero with client logos · Work rail (pinned horizontal scroll on desktop, swipe on
touch) · Industries · Testimonial · Company · Approach (orbit synced to the steps) · Nx
Delivery System (isometric stack synced to the engagement cards) · FAQ · CTA · Footer.

The signature shape is the **chamfer**: the `.chamfer` utility clips the top-right and
bottom-left corners (26px, 18px on phones).

All copy lives in `src/data/content.ts`. The Nx Assistant (`api/_knowledge.ts`) and the
JSON-LD read the same objects, so keep their existing fields when editing copy.

## Notes

- SEO: OG/Twitter meta, JSON-LD Organization, `public/robots.txt` + `sitemap.xml`.
