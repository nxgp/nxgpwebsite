import { services, industries, portfolio, about, faq, operatingModel } from './data/content'
import { Services } from './components/Services'
import { Engagement } from './components/Engagement'
import { Industries } from './components/Industries'
import { Portfolio } from './components/portfolio/Portfolio'
import { OperatingModel } from './components/OperatingModel'
import { Shift } from './components/Shift'
import { About } from './components/About'
import { Reviews } from './components/Reviews'
import { FAQ } from './components/FAQ'
import { PageHeader, type Crumb } from './pages/PageHeader'
import { ProductPage } from './pages/ProductPage'

/**
 * Standalone pages — every major section (and every portfolio product) gets
 * its own URL, prerendered at build time with a unique title, description,
 * canonical and breadcrumb JSON-LD. The home page keeps the single scroll;
 * these are focused landers for search, answer engines and direct links,
 * ready to grow into full pages later.
 *
 * Each route's `main` is the page body BETWEEN the shared shell pieces
 * (Nav above; CTA + Footer below — App renders those). PageHeader carries
 * the breadcrumb and a short h1; the section components below keep their
 * own headlines as h2s, so nothing reads twice.
 */

export type Route = {
  path: string
  /** <title> — under ~60 chars */
  title: string
  /** meta description — under ~160 chars */
  description: string
  crumbs: Crumb[]
  main: () => React.ReactNode
  /** extra JSON-LD nodes beyond WebPage + BreadcrumbList */
  jsonLd?: () => object[]
}

const clip = (s: string, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…')

const home: Crumb = { label: 'Home', href: '/' }
const workCrumb: Crumb = { label: 'Work', href: '/work' }

const productRoutes: Route[] = portfolio.products.map((p) => ({
  path: `/work/${p.slug}`,
  title: clip(`${p.client} — ${p.built} | Nx Growth Partners`, 62),
  description: clip(`${p.outcome} ${p.blurb}`),
  crumbs: [home, workCrumb, { label: p.client, href: `/work/${p.slug}` }],
  main: () => <ProductPage product={p} />,
  jsonLd: () => [
    {
      '@type': 'CreativeWork',
      name: `${p.client} — ${p.built}`,
      description: `${p.outcome} ${p.blurb}`,
      about: p.role,
      creator: { '@type': 'Organization', name: 'Nx Growth Partners', url: 'https://nxgp.io' },
      ...(p.builtFor ? { sourceOrganization: { '@type': 'Organization', name: p.builtFor } } : {}),
    },
  ],
}))

export const ROUTES: Route[] = [
  {
    path: '/services',
    title: 'AI Engineering & Custom Software Services | Nx Growth Partners',
    description: clip(`${services.h2} ${services.sub}`),
    crumbs: [home, { label: 'Services', href: '/services' }],
    main: () => (
      <>
        <PageHeader crumbs={[home, { label: 'Services', href: '/services' }]} title="Services" />
        <Services />
        <Engagement />
      </>
    ),
  },
  {
    path: '/how-we-work',
    title: 'How We Work — One Loop, Shipping Weekly | Nx Growth Partners',
    description: clip(`${operatingModel.h2} ${operatingModel.sub}`),
    crumbs: [home, { label: 'How we work', href: '/how-we-work' }],
    main: () => (
      <>
        <PageHeader crumbs={[home, { label: 'How we work', href: '/how-we-work' }]} title="How we work" />
        <OperatingModel />
        <Shift />
      </>
    ),
  },
  {
    path: '/industries',
    title: 'Private Equity, Enterprise & Government | Nx Growth Partners',
    description: clip(`${industries.h2} ${industries.sub}`),
    crumbs: [home, { label: 'Industries', href: '/industries' }],
    main: () => (
      <>
        <PageHeader crumbs={[home, { label: 'Industries', href: '/industries' }]} title="Industries" />
        <Industries />
      </>
    ),
  },
  {
    path: '/work',
    title: "What We've Built — AI Systems in Production | Nx Growth Partners",
    description: clip(`${portfolio.h2} ${portfolio.sub}`),
    crumbs: [home, workCrumb],
    main: () => (
      <>
        <PageHeader crumbs={[home, workCrumb]} title="What we've built" />
        <Portfolio />
      </>
    ),
  },
  {
    path: '/about',
    title: 'About Nx Growth Partners — Senior Team, 50+ Projects Delivered',
    description: clip(`${about.h2} ${about.sub}`),
    crumbs: [home, { label: 'About', href: '/about' }],
    main: () => (
      <>
        <PageHeader crumbs={[home, { label: 'About', href: '/about' }]} title="About us" />
        <About />
        <Reviews />
      </>
    ),
  },
  {
    path: '/faq',
    title: 'FAQ — Working with Nx Growth Partners',
    description: clip(
      'How NxGP differs from staff aug, how engagements start, security and compliance, and what to expect — the questions buyers ask first, answered directly.',
    ),
    crumbs: [home, { label: 'FAQ', href: '/faq' }],
    main: () => (
      <>
        <PageHeader crumbs={[home, { label: 'FAQ', href: '/faq' }]} title="Frequently asked questions" />
        <FAQ />
      </>
    ),
    jsonLd: () => [
      {
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  },
  ...productRoutes,
]

export function matchRoute(path: string): Route | null {
  const clean = path.replace(/\/+$/, '') || '/'
  return ROUTES.find((r) => r.path === clean) ?? null
}
