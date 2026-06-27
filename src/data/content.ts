/* ============================================================
   Nx Growth Partners — all site copy. Grounded in
   Nx_Growth_Partners_Website_Brief_v2.docx.

   Nx is an EMBEDDED TECHNOLOGY PARTNER — "your team, extended,
   not replaced." Senior operators + engineers work INSIDE the
   client's business across three EQUAL pillars: Go-to-Market,
   AI Engineering, Product Development. AI is one of three — never
   the top-line. NOT a venture studio, NOT AI-only, NOT staff-aug.
   We do NOT build/hold our own companies, and do NOT run on agents.
   Buyers: Private Equity, Enterprise, Government. The spine is the
   operating loop: Discover → Prioritize → Deliver → Optimize.
   One CTA everywhere: Book a call.
   ============================================================ */

export const brand = 'Nx Growth Partners'

export const nav = {
  brand,
  links: [
    { label: 'How we work', id: 'how-we-work' },
    { label: 'Services', id: 'services' },
    { label: 'Industries', id: 'industries' },
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
  ],
  cta: 'Book a call',
}

export const hero = {
  pill: 'An embedded technology partner',
  h1a: 'Your team, extended —',
  h1b: 'not replaced.',
  sub: 'Nx Growth Partners embeds experienced operators and engineers inside your business — to find the highest-impact opportunities, align technology to business outcomes, and build the systems that move you forward.',
  ctaPrimary: 'Book a call',
  ctaSecondary: 'See how we work',
  note: 'Across go-to-market, AI engineering and product development — for private equity, enterprise and government.',
}

export const proof = {
  label: 'Trusted by',
  logos: [
    { name: 'Western Digital', src: '/logos/western-digital.png', big: false },
    { name: 'Harbor Industrial', src: '/logos/harbor-industrial.png', big: true },
    { name: 'ecoATM', src: '/logos/ecoatm.png', big: false },
    { name: 'Kiotel', src: '/logos/kiotel.png', big: true },
    { name: 'TIAA', src: '/logos/tiaa.png', big: false },
  ] as { name: string; src: string; big: boolean }[],
}

// CLIENT REVIEWS — placeholder quotes (the deck had no testimonial text).
// Attribution is anonymized to role + sector so we never put invented words
// in a named client's mouth. Swap in real, approved quote + name before publishing.
export const reviews = {
  kicker: 'In their words',
  h2: 'What it feels like to have us inside the team.',
  sub: 'Senior people, embedded in the business, shipping every week — here is how that lands. Quotes are anonymized until clients approve attribution.',
  items: [
    {
      quote:
        'They plugged straight into our stack and were shipping production code in the first sprint. It felt like our own engineers — just faster.',
      name: 'Engineering leadership',
      context: 'Enterprise storage',
    },
    {
      quote:
        "They didn't hand us a deck and disappear. They sat in our standups, found the real bottlenecks, and fixed them — and something shipped every week.",
      name: 'Product leadership',
      context: 'Connected hardware',
    },
    {
      quote:
        'Senior people who understood our constraints from day one. The weekly cadence kept everyone honest and the work tied to outcomes we could measure.',
      name: 'Technology leadership',
      context: 'Financial services',
    },
  ],
}

export type LoopStep = { n: string; title: string; body: string }

export const operatingModel = {
  kicker: 'How we work',
  h2: 'One loop, tied to your business — not just your backlog.',
  sub: "We don't start from a backlog. We embed a senior team, find what actually moves your numbers, and run the same four steps until it does — every release pointed at a result you can name.",
  steps: [
    { n: '01', title: 'Discover', body: "First we find what's worth building. Working inside the business, we follow where time, money and customers slip away — and come back with the few moves that matter most." },
    { n: '02', title: 'Prioritize', body: 'Then we sequence them. Each opportunity gets weighed by impact, effort and how ready your team is to adopt it, so we start where the return shows up fastest.' },
    { n: '03', title: 'Deliver', body: 'We build inside your stack and ship every week — real software in production that people use, not a pile of closed tickets or a demo that never lands.' },
    { n: '04', title: 'Optimize', body: 'Then we watch what it does. Every release tells us the next move, so the work compounds instead of resetting each quarter.' },
  ] as LoopStep[],
}

export type Pillar = { title: string; outcome: string; body: string; caps: string[]; icon: string }

export const services = {
  kicker: 'What we do',
  h2: 'Three pillars. One embedded team.',
  sub: 'Engage one pillar, or a cross-functional team across all three. Each is led by the outcome — the capabilities are the proof of range.',
  pillars: [
    {
      title: 'Go-to-Market',
      outcome: 'Grow pipeline and revenue.',
      body: 'Revenue operations that compound — the systems and motions that turn effort into pipeline.',
      caps: ['Revenue Operations', 'CRM', 'Sales Automation', 'Marketing Automation', 'Analytics', 'AI SDRs'],
      icon: 'TrendingUp',
    },
    {
      title: 'AI Engineering',
      outcome: 'Put AI to work where it actually pays off.',
      body: 'Applied AI inside your workflows — shipped to production, measured by outcome, not demos.',
      caps: ['AI Agents', 'Workflow Automation', 'Knowledge Search', 'RAG', 'LLM Integrations', 'Internal Copilots'],
      icon: 'Sparkles',
    },
    {
      title: 'Product Development',
      outcome: "Ship the software your team can't build fast enough.",
      body: 'Full-stack product, mobile and infrastructure — built to a real bar, inside your stack.',
      caps: ['SaaS Products', 'Internal Tooling', 'Customer Portals', 'Mobile Apps', 'APIs', 'Cloud Infrastructure'],
      icon: 'Boxes',
    },
  ] as Pillar[],
}

export const embedded = {
  kicker: 'The embedded model',
  h2: 'Embedded, not handed off.',
  sub: 'Most firms sell you projects or bodies. We put a senior team inside your environment and make ourselves accountable to the outcome.',
  embed: {
    label: 'Embedded — the Nx way',
    points: [
      'Inside your stack, standups and Slack',
      'A senior, cross-functional team',
      'Accountable to outcomes, not tickets',
      'Production releases every week',
      'Full transparency — you see the board live',
      'Direct access to the people building',
    ],
  },
  handoff: {
    label: 'Hand-off / staff-aug',
    points: [
      'Over the wall, mostly async',
      'Bodies you have to manage',
      'Accountable to a statement of work',
      'Big-bang delivery, months later',
      'A status deck once a month',
      'Account managers in between',
    ],
  },
  cadence: ['Plan', 'Build', 'Demo', 'Ship'],
  cadenceNote: 'A predictable weekly rhythm you can plan around.',
}

export type Industry = { name: string; buyer: string; frame: string; visual: 'pe' | 'enterprise' | 'gov'; accent: string; note?: string }

export const industries = {
  kicker: 'Who we serve',
  h2: "Built for the buyers who can't wait.",
  sub: 'Enter by industry or by service. Private equity and enterprise lead on proof; government is where we are building.',
  items: [
    { name: 'Private Equity', buyer: 'Operating partners & portfolio-company leadership', frame: 'Portfolio value creation, technical diligence and speed across portcos — one partner spanning GTM, AI and product, without standing up an in-house tech org.', visual: 'pe', accent: '#0E9F6E' },
    { name: 'Enterprise', buyer: 'Revenue, IT, product and data leaders', frame: 'Senior capacity and outcomes without long agency cycles or heavy hiring — an embedded team that ships inside your stack and displaces slow integrators and staff aug.', visual: 'enterprise', accent: '#3B7DE9' },
    { name: 'Government', buyer: 'Procurement-driven buyers', frame: 'Capabilities and teaming today, building toward past performance and contract vehicles. We frame this honestly — and never claim posture we do not hold.', visual: 'gov', accent: '#6C5CE7', note: 'Capabilities & teaming' },
  ] as Industry[],
}

export type Venture = {
  name: string
  tag: string
  domain: string
  blurb: string
  visual: 'vitals' | 'uptime' | 'build' | 'assets' | 'scaffold' | 'orchestrator' | 'messages'
  accent: string
}

// The portfolio of real products the team has shipped — proof for the
// embedded pitch. These are builds, not "companies we own and hold".
export const work = {
  kicker: 'Selected work',
  h2: "The proof isn't a deck. It's what we've shipped.",
  sub: 'Real products in production — some built end to end for clients, some ventures we shipped ourselves. This is the bar the embedded team works to.',
  ventures: [
    {
      name: 'Mentera',
      tag: 'Healthcare AI',
      domain: 'Clinical platform',
      blurb:
        'A full clinical platform, built end to end — backend, web, native iOS and Android, and 50+ EHR integrations, with AI woven through the workflow. Shipped to a regulated bar.',
      visual: 'vitals',
      accent: '#0E9F6E',
    },
    {
      name: 'Convey',
      tag: 'Reliability',
      domain: 'Operations platform',
      blurb:
        'An autonomous reliability agent for regulated utilities — it cuts root-cause analysis from days to under an hour, and remembers the codebase so the team does not have to.',
      visual: 'uptime',
      accent: '#3B7DE9',
    },
    {
      name: 'Logbook',
      tag: 'Maritime ops',
      domain: 'Port operations',
      blurb:
        'An asset and maintenance platform for ports and terminals, with Harbor Copilot — an AI assistant that answers questions straight from the logbook.',
      visual: 'assets',
      accent: '#6C5CE7',
    },
    {
      name: 'Koitel',
      tag: 'In build',
      domain: 'In development',
      blurb:
        'A venture in active development, being built on the same operating model the embedded team runs.',
      visual: 'scaffold',
      accent: '#E08A3B',
    },
    {
      name: 'Agentics',
      tag: 'Agent products',
      domain: 'Applied agents',
      blurb:
        'Applied agent products — the orchestration patterns we use day to day, packaged and put to work for others.',
      visual: 'orchestrator',
      accent: '#0E9F6E',
    },
    {
      name: 'WD Chat',
      tag: 'Conversational',
      domain: 'Conversational product',
      blurb: 'A conversational product with its own audience and shape.',
      visual: 'messages',
      accent: '#D14B8F',
    },
  ] as Venture[],
}

export const about = {
  kicker: 'About',
  h2: "A senior team you'd want inside your business.",
  sub: "You're deciding whether to trust people inside your business — so we lead with experience, judgment and accountability, not headcount.",
  points: [
    { title: 'Senior by default', body: 'Operators and engineers who have shipped real systems — not a bench of juniors you have to manage.' },
    { title: 'Cross-functional', body: 'GTM, AI and product under one accountable team, so the work connects instead of fragmenting.' },
    { title: 'Accountable to outcomes', body: 'We tie every engagement to a business result and stay until it lands — embedded, not handed off.' },
  ],
}

export const faq = {
  kicker: 'Questions',
  h2: 'The things buyers ask first.',
  items: [
    {
      q: 'How is this different from staff aug or a systems integrator?',
      a: "We're embedded and accountable to the outcome — not bodies you manage or a statement of work you babysit. A senior, cross-functional team works inside your stack, ships every week, and owns the result.",
    },
    {
      q: 'How do you handle security, data and compliance?',
      a: "We work inside your environment and to your controls — and for regulated work we run self-hosted, keeping data in your boundary. We'll tell you plainly what we do and don't hold rather than claim a posture we can't back. Detailed posture shared on request.",
    },
    {
      q: 'How do we contract and get started?',
      a: 'We start with a paid discovery to find the highest-impact opportunities, then scope an embedded engagement. We can work through enterprise and government procurement — the first step is a 30-minute call.',
    },
    {
      q: 'Are you big enough to handle our scale?',
      a: 'Our leverage is senior people and one operating loop, not headcount. The embedded model and weekly cadence scale with the work, backed by named proof of what the team has shipped.',
    },
    {
      q: 'Do we have to engage all three pillars?',
      a: 'No — engage one (go-to-market, AI engineering or product) or a cross-functional team across all three. We help you pick on the first call, based on what moves your numbers.',
    },
  ],
}

export const cta = {
  h2Lines: ['Let’s find what', 'moves your business.'],
  sub: "Tell us where you are — PE, enterprise or government — and we'll map the highest-impact opportunities. A 30-minute intro, no pitch deck.",
  email: 'hello@nxgp.io',
  ctaPrimary: 'Book a call',
  ctaSecondary: 'See the pillars',
}

export const footer = {
  blurb: 'An embedded technology partner across go-to-market, AI engineering and product development. Your team, extended — not replaced.',
  tagline: 'Your team, extended.',
  copyright: '© 2026 Nx Growth Partners · nxgp.io',
  columns: [
    { heading: 'Services', links: ['Go-to-Market', 'AI Engineering', 'Product Development'] },
    { heading: 'Industries', links: ['Private Equity', 'Enterprise', 'Government'] },
    { heading: 'Company', links: ['How we work', 'Work', 'About', 'Book a call'] },
    { heading: 'Connect', links: ['hello@nxgp.io', 'LinkedIn', 'X', 'nxgp.io'] },
  ],
}
