import type { Route } from '../routes'

const SITE = 'https://nxgp.io'

/**
 * Per-page structured data: WebPage + BreadcrumbList (+ any route-specific
 * nodes). Prerendered into each page's static HTML. The home page keeps the
 * full Organization graph in Seo.tsx; pages stay lean and reference it.
 */
export function PageSeo({ route }: { route: Route }) {
  const url = `${SITE}${route.path}`
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: route.title,
        description: route.description,
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        dateModified: __BUILD_DATE__,
        inLanguage: 'en',
        publisher: { '@type': 'Organization', name: 'Nx Growth Partners', url: SITE },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: route.crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          item: `${SITE}${c.href === '/' ? '/' : c.href}`,
        })),
      },
      ...(route.jsonLd?.() ?? []),
    ],
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  )
}
