/* ============================================================
   Nx Growth Partners — all site copy. Grounded in the
   "Nx Growth Partners - Introduction" company deck (2026).

   Nx is an EMBEDDED TECHNOLOGY PARTNER — "your team, extended.
   From idea to production." Senior operators + engineers work
   INSIDE the client's business across AI engineering, custom
   software and embedded delivery. NOT a venture studio, NOT
   AI-only, NOT staff-aug. The spine is the operating loop:
   Discover → Prioritize → Deliver → Optimize. Engagement models:
   Nx Blueprint → Nx Project Delivery → Nx Managed Support →
   Nx Embedded Engineering. One CTA everywhere: Book a call.
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
  h1a: 'Your team, extended.',
  h1b: 'From idea to production.',
  sub: 'Nx Growth Partners embeds experienced operators and engineers inside your business — to find the highest-impact opportunities, align technology to business outcomes, and build the systems that move you forward.',
  ctaPrimary: 'Book a call',
  ctaSecondary: 'See how we work',
  note: 'AI engineering · custom software · embedded delivery — for private equity, enterprise and government.',
}

// Intrinsic pixel dimensions let the browser reserve the right aspect ratio
// before each image loads — zero layout shift (CLS) from the logo strip.
export const proof = {
  label: 'Trusted by',
  logos: [
    { name: 'Western Digital', src: '/logos/western-digital.png', big: false, w: 2048, h: 565 },
    { name: 'Harbor Industrial', src: '/logos/harbor-industrial.png', big: true, w: 184, h: 178 },
    { name: 'ecoATM', src: '/logos/ecoatm.png', big: false, w: 2033, h: 741 },
    { name: 'Kiotel', src: '/logos/kiotel.png', big: true, w: 1563, h: 1563 },
    { name: 'TIAA', src: '/logos/tiaa.png', big: false, w: 598, h: 151 },
  ] as { name: string; src: string; big: boolean; w: number; h: number }[],
}

// CLIENT REVIEWS — real quotes and attributions from the company deck.
export const reviews = {
  kicker: 'In their words',
  h2: 'What it feels like to have us inside the team.',
  sub: 'Three engagements, told by the leaders who ran them.',
  items: [
    {
      quote:
        'The team helped us bring multiple AI capabilities into a single, scalable platform. The team combined strong engineering execution with a clear understanding of our enterprise requirements, enabling us to reduce third-party software spend and launch new AI functionality faster.',
      name: 'Roopak Patel · Director of Engineering',
      context: 'Western Digital',
    },
    {
      quote:
        'NxGP revolutionized our digital operations with their exceptional logbook application for real time data tracking across our fleet. Their expertise in cloud solutions not only streamlined our processes but also saved us valuable time and resources, enabling greater efficiency and productivity.',
      name: 'Raj Patel · Chief Executive Officer',
      context: 'Harbor Industrial',
    },
    {
      quote:
        'Their ability to combine strong software engineering with a practical understanding of our business. They operate like an extension of our team and remain focused on building technology that creates measurable value for our properties and guests.',
      name: 'Jon Goodheart · Chief Technology Officer',
      context: 'Kiotel',
    },
  ],
}

// THE SHIFT — why now, straight from the deck (with cited sources).
export const shift = {
  kicker: 'The shift',
  h2: 'AI is forcing a re-evaluation of how work gets done.',
  sub: 'In every department, the conversation has moved from pilots to production — but most businesses are still figuring out where to start.',
  frictions: [
    {
      label: 'Process friction',
      title: 'Minutes become days',
      body: 'Work crosses too many handoffs, approvals, spreadsheets, and disconnected systems before anything is decided.',
    },
    {
      label: 'Manual dependency',
      title: 'People are the glue',
      body: 'Skilled teams spend their days moving information between systems instead of improving the business.',
    },
    {
      label: 'Operational leakage',
      title: 'Value quietly escapes',
      body: 'Missed follow-ups, inconsistent data, and duplicated effort cost revenue, time, and insight every week.',
    },
  ],
  stats: [
    { value: '95%', body: 'of enterprise generative AI pilots deliver zero measurable P&L impact.', source: 'MIT NANDA, 2025' },
    { value: '2/3', body: 'of companies remain stuck in experimentation or pilot mode.', source: 'McKinsey, 2025' },
    { value: '90%', body: 'of companies have employees using personal AI tools for work.', source: 'MIT Shadow AI, 2026' },
    { value: '73%', body: 'say they need more training and implementation resources.', source: 'Goldman Sachs, 2026' },
  ],
}

export type LoopStep = { n: string; title: string; body: string }

export const operatingModel = {
  kicker: 'How we work',
  h2: 'One loop, tied to your business — not just your backlog.',
  sub: "We don't start from a backlog. We find what actually moves your numbers, then run the same four steps until it does — every release pointed at a result you can name.",
  steps: [
    { n: '01', title: 'Discover', body: "First we find what's worth building. Working inside the business, we follow where time, money and customers slip away — and come back with the few moves that matter most." },
    { n: '02', title: 'Prioritize', body: 'Then we sequence them. Each opportunity gets weighed by impact, effort and how ready your team is to adopt it, so we start where the return shows up fastest.' },
    { n: '03', title: 'Deliver', body: 'We build inside your stack and ship continuously — real software in production that people use, not a pile of closed tickets or a demo that never lands.' },
    { n: '04', title: 'Optimize', body: 'Then we watch what it does. Every release tells us the next move — what to scale, what to fix, and what to build next.' },
  ] as LoopStep[],
}

export type Pillar = { title: string; outcome: string; body: string; caps: string[]; icon: string }

export const services = {
  kicker: 'What we deliver',
  h2: 'Three pillars. One embedded team.',
  sub: 'Engage one pillar, or a cross-functional team across all three. Each is led by the outcome — the capabilities are the proof of range.',
  pillars: [
    {
      title: 'AI & Workflow Automation',
      outcome: 'Put AI to work where it actually pays off.',
      body: 'Redesign operational work with the right mix of AI, automation, software, and human decision-making.',
      caps: ['AI Agents & Copilots', 'Enterprise Knowledge & RAG', 'Workflow Automation', 'Human-in-the-loop Design', 'Evaluation & Monitoring'],
      icon: 'Sparkles',
    },
    {
      title: 'Software & Product Delivery',
      outcome: "Ship the software your team can't build fast enough.",
      body: 'Build secure, scalable software around the workflows that off-the-shelf products cannot address.',
      caps: ['Internal Tools & Portals', 'SaaS Platforms', 'Web & Mobile Applications', 'APIs & System Integrations', 'Data Platforms & Cloud'],
      icon: 'Boxes',
    },
    {
      title: 'Embedded Engineering',
      outcome: 'A senior team inside your roadmap.',
      body: 'A senior-led team that plugs into your roadmap and stays accountable for what ships.',
      caps: ['Product Strategy & Architecture', 'Frontend, Backend, AI & Data', 'QA & DevOps', 'Cloud Delivery & Support', 'Continuous Improvement'],
      icon: 'Users',
    },
  ] as Pillar[],
}

export type Engagement = { name: string; duration: string; body: string }

// HOW WE ENGAGE — the four engagement models from the deck.
export const engagement = {
  kicker: 'How we engage',
  h2: 'Start with a blueprint. Scale as value lands.',
  sub: 'Four ways to work together — from a focused discovery sprint to a fully embedded senior team.',
  items: [
    {
      name: 'Nx Blueprint',
      duration: '2–4 weeks',
      body: 'Discovery and planning that identifies the highest-value workflow, software, and AI opportunities in your operation. You leave with a prioritized roadmap, estimated investment, and a sequenced plan for execution.',
    },
    {
      name: 'Nx Project Delivery',
      duration: '8–16+ weeks',
      body: 'End-to-end design and development of a defined software, automation, data, or AI initiative. From solution design through production launch, in weekly increments with clear milestones.',
    },
    {
      name: 'Nx Managed Support',
      duration: '3–12+ months',
      body: 'A senior-led team embedded in your organization, delivering against a prioritized roadmap. Built for businesses with multiple initiatives and evolving requirements.',
    },
    {
      name: 'Nx Embedded Engineering',
      duration: 'Ongoing · quarterly',
      body: 'Operation, monitoring, and continuous improvement of deployed systems, so business value keeps compounding after launch.',
    },
  ] as Engagement[],
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
    { name: 'Private Equity', buyer: 'Operating partners & portfolio-company leadership', frame: 'Portfolio value creation, technical diligence and speed across portcos — one partner spanning GTM, AI and product, without standing up an in-house tech org.', visual: 'pe', accent: '#0000F4' },
    { name: 'Enterprise', buyer: 'Revenue, IT, product and data leaders', frame: 'Senior capacity and outcomes without long agency cycles or heavy hiring — an embedded team that ships inside your stack and displaces slow integrators and staff aug.', visual: 'enterprise', accent: '#5B5BD6' },
    { name: 'Government', buyer: 'Procurement-driven buyers', frame: 'Capabilities and teaming today, building toward past performance and contract vehicles. We frame this honestly — and never claim posture we do not hold.', visual: 'gov', accent: '#8080FF', note: 'Capabilities & teaming' },
  ] as Industry[],
}

export type Venture = {
  name: string
  tag: string
  domain: string
  blurb: string
  metrics?: { value: string; label: string }[]
  visual: 'vitals' | 'uptime' | 'build' | 'assets' | 'scaffold' | 'orchestrator' | 'messages'
  accent: string
}

// Client case studies from the company deck (with real outcome metrics),
// plus products the team has shipped end to end — the bar we work to.
export const work = {
  kicker: 'Client case studies',
  h2: "The proof isn't a deck. It's what we've shipped.",
  sub: 'Real engagements, real production systems, real numbers — this is the bar the embedded team works to.',
  ventures: [
    {
      name: 'Western Digital',
      tag: 'Enterprise AI at scale',
      domain: 'Computer hardware manufacturer',
      blurb:
        'Built and deployed an organization-wide AI platform that unified multiple agents, internal knowledge sources, and workflows into one secure experience designed to scale across the enterprise.',
      metrics: [
        { value: '$5M', label: 'SaaS contract spend eliminated' },
        { value: '3×', label: 'more capabilities delivered' },
        { value: '50%', label: 'faster delivery of AI functionality' },
      ],
      visual: 'orchestrator',
      accent: '#0000F4',
    },
    {
      name: 'Harbor Industrial',
      tag: 'Operational intelligence',
      domain: 'Maritime transportation',
      blurb:
        'Built a maintenance operations platform combining structured logbooks, asset tracking, analytics, and an AI copilot — giving teams more accurate, consistent data and faster decision-making.',
      metrics: [
        { value: '40%', label: 'less time spent on reporting' },
        { value: '25%', label: 'faster issue resolution' },
        { value: '15%', label: 'higher fleet availability' },
      ],
      visual: 'assets',
      accent: '#5B5BD6',
    },
    {
      name: 'Kiotel',
      tag: 'Accelerating delivery',
      domain: 'Hospitality technology',
      blurb:
        'Re-architected the platform and expanded its guest experience capabilities to improve reliability, support continuous operation, and make new features easier to launch without disrupting service.',
      metrics: [
        { value: '35%', label: 'faster release cycles' },
        { value: '2×', label: 'features shipped per quarter' },
        { value: '30%', label: 'lower property support costs' },
      ],
      visual: 'build',
      accent: '#060B33',
    },
    {
      name: 'Mentera',
      tag: 'Healthcare AI',
      domain: 'Clinical platform',
      blurb:
        'A full clinical platform, built end to end — backend, web, native iOS and Android, and 50+ EHR integrations, with AI woven through the workflow. Shipped to a regulated bar.',
      visual: 'vitals',
      accent: '#0000F4',
    },
    {
      name: 'Convey',
      tag: 'Reliability',
      domain: 'Operations platform',
      blurb:
        'An autonomous reliability agent for regulated utilities — it cuts root-cause analysis from days to under an hour, and remembers the codebase so the team does not have to.',
      visual: 'uptime',
      accent: '#5B5BD6',
    },
  ] as Venture[],
}

export const about = {
  kicker: 'About',
  h2: "A senior team you'd want inside your business.",
  sub: 'Businesses are not short on ideas. They are constrained by the expertise and execution required to turn them into working systems. We founded NxGP to close the gap between a business idea and the engineering that brings it to life.',
  stats: [
    { value: '50+', label: 'Projects delivered' },
    { value: '40+', label: 'Team members' },
    { value: '2018', label: 'Founding year' },
  ],
  team: [
    {
      name: 'Gurjeet Nijjar',
      role: 'CEO',
      bio: 'Systems engineering and operations-focused founder who has built tooling to help teams work smarter by connecting fragmented systems across startups and enterprises.',
    },
    {
      name: 'Ravi Singh',
      role: 'CTO',
      bio: 'Principal Architect with experience building purpose-built solutions across industries, combining agents, LLMs, and modern application architecture to create AI-native, intent-driven user experiences.',
    },
    {
      name: 'Monit Vats',
      role: 'Operating Advisor',
      bio: 'Versatile business leader and transformational operator with experience helping SaaS organizations scale through strategic sales, operational leadership, and cross-functional team transformation.',
    },
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
      a: 'We start with the Nx Blueprint — a 2–4 week discovery that produces a prioritized roadmap with estimated investment. From there we scope project delivery or an embedded engagement. We can work through enterprise and government procurement — the first step is a 30-minute call.',
    },
    {
      q: 'Are you big enough to handle our scale?',
      a: 'Our leverage is senior people and one operating loop, not headcount. The embedded model and weekly cadence scale with the work, backed by named proof of what the team has shipped.',
    },
    {
      q: 'Do we have to engage all three pillars?',
      a: 'No — engage one (AI & workflow automation, software & product delivery, or embedded engineering) or a cross-functional team across all three. We help you pick on the first call, based on what moves your numbers.',
    },
  ],
}

export const cta = {
  h2Lines: ['Let’s find what', 'moves your business.'],
  sub: "Tell us where you are — PE, enterprise or government — and we'll map where technology can create the most value. A 30-minute intro, no pitch deck.",
  email: 'hello@nxgp.io',
  ctaPrimary: 'Book a call',
  ctaSecondary: 'See the pillars',
}

export const footer = {
  blurb: 'An embedded technology partner across AI engineering, custom software and embedded delivery.',
  tagline: 'Build systems that scale.',
  copyright: '© 2026 Nx Growth Partners · nxgp.io',
  columns: [
    {
      heading: 'Services',
      links: [
        { label: 'AI & Workflow Automation', href: '#services' },
        { label: 'Software & Product Delivery', href: '#services' },
        { label: 'Embedded Engineering', href: '#services' },
      ],
    },
    {
      heading: 'Industries',
      links: [
        { label: 'Private Equity', href: '#industries' },
        { label: 'Enterprise', href: '#industries' },
        { label: 'Government', href: '#industries' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'How we work', href: '#how-we-work' },
        { label: 'Work', href: '#work' },
        { label: 'About', href: '#about' },
        { label: 'Book a call', href: '#cta' },
      ],
    },
    {
      heading: 'Connect',
      links: [
        { label: 'hello@nxgp.io', href: 'mailto:hello@nxgp.io' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nx-growth-parnters' },
        { label: 'nxgp.io', href: 'https://nxgp.io' },
      ],
    },
  ] as { heading: string; links: { label: string; href: string }[] }[],
}
