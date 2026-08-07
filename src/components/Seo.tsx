import { services, faq, reviews, about, engagement } from '../data/content'

const SITE = 'https://nxgp.io'

/**
 * JSON-LD structured data, generated from the same content objects the page
 * renders — one source of truth, no drift. Prerendered into the static HTML
 * so every crawler and answer engine sees it without executing JS.
 *
 * Graph: Organization (with founders, offer catalog, client reviews)
 * + WebSite + WebPage + FAQPage.
 */
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'Nx Growth Partners',
      alternateName: 'NxGP',
      url: SITE,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/icon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE}/og.png`,
      email: 'hello@nxgp.io',
      foundingDate: '2018',
      slogan: 'Your team, extended. From idea to production.',
      description:
        'An embedded technology partner across AI engineering, custom software and embedded delivery. Senior operators and engineers work inside the client’s business and ship in weekly increments tied to business outcomes.',
      sameAs: ['https://www.linkedin.com/company/nx-growth-parnters'],
      founder: about.team.map((t) => ({
        '@type': 'Person',
        name: t.name,
        jobTitle: t.role,
        description: t.bio,
      })),
      knowsAbout: [
        'AI engineering',
        'Workflow automation',
        'AI agents',
        'Enterprise knowledge and RAG',
        'Custom software development',
        'Product development',
        'Embedded engineering teams',
        'Private equity value creation',
        'Enterprise software',
        'Government technology',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: services.pillars.map((p) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: p.title,
            description: p.body,
            serviceType: p.caps.join(', '),
            provider: { '@id': `${SITE}/#organization` },
          },
        })),
      },
      makesOffer: engagement.items.map((e) => ({
        '@type': 'Offer',
        name: e.name,
        description: `${e.body} (${e.duration})`,
      })),
      review: reviews.items.map((r) => ({
        '@type': 'Review',
        reviewBody: r.quote,
        author: {
          '@type': 'Person',
          name: r.name.split(' · ')[0],
          jobTitle: r.name.split(' · ')[1],
          worksFor: { '@type': 'Organization', name: r.context },
        },
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Nx Growth Partners',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: 'Nx Growth Partners — Your team, extended. From idea to production.',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#organization` },
      primaryImageOfPage: `${SITE}/og.png`,
      inLanguage: 'en',
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
}

export function Seo() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
