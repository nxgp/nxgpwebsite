/* ============================================================
   NX Growth Partners — all site copy.
   Positioning rule: agents are INTERNAL studio leverage only.
   Never "agents run/operate the companies". People own decisions;
   the fleet does the volume — internally.
   ============================================================ */

export const nav = {
  brand: 'NX Growth Partners',
  links: [
    { label: 'Studio', id: 'studio' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Approach', id: 'approach' },
    { label: 'About', id: 'about' },
  ],
  portal: 'Portal',
  cta: 'Start a venture',
}

export const hero = {
  pill: 'An AI-native venture studio',
  h1: ['Build companies', 'like software.'],
  sub: 'NX Growth Partners is a holding company and venture studio. We design, build and operate exceptional companies — and run the studio itself on a fleet of AI agents, so a small team ships at the scale of a large one.',
  ctaPrimary: 'Start a venture',
  ctaSecondary: 'See the portfolio',
  inputPlaceholder: 'you@company.com',
  note: 'A growing portfolio across healthcare, reliability and developer tools.',
}

export const proof = {
  label: 'The studio behind a growing portfolio',
  wordmarks: ['Mentera', 'Convey', 'Logbook', 'Koitel', 'Agentics', 'WD Chat'],
}

export const studio = {
  kicker: 'The studio',
  h2: 'Everything a company needs, under one roof.',
  sub: 'We design, build and take companies to market — and run all of it on one internal operating model, so we can do it again and again.',
  pillars: [
    {
      title: 'Engineering',
      body: 'Full-stack product, mobile, backend and cloud — built AI-native, in-house. The same team builds every venture, Mentera included.',
      icon: 'Code2',
    },
    {
      title: 'Go-to-market',
      body: 'Sourcing, outreach and partnerships that put new ventures in front of the right people.',
      icon: 'Rocket',
    },
    {
      title: 'Brand & marketing',
      body: 'Positioning, content and demand, produced at studio scale.',
      icon: 'Sparkles',
    },
    {
      title: 'Operations & sales',
      body: 'Pipeline, close and the day-to-day that keeps companies moving.',
      icon: 'LineChart',
    },
    {
      title: 'Investments',
      body: 'Capital behind the model, and the companies we choose to hold.',
      icon: 'Landmark',
    },
  ],
}

export const howItWorks = {
  kicker: 'Our edge',
  h2: 'Hiring to grow is so last decade.',
  sub: "Our leverage isn't headcount — it's a standing internal fleet and one operating spine. People own the consequential decisions; agents do the volume.",
  states: [
    {
      title: 'One internal fleet, every function',
      body: "A standing fleet of 25 specialist agents and an orchestrator handles the studio's engineering, outreach, marketing and sales — across every venture at once.",
    },
    {
      title: 'People hold the consequential calls',
      body: 'Agents run at fixed autonomy tiers (T0–T3). Anything that ships, sends or spends above its tier waits for a person — and every approval is signed to a name and logged.',
    },
    {
      title: 'One spine under the studio',
      body: 'Shared auth, data, audit and per-venture isolation, so spinning up the next company re-architects nothing.',
    },
  ],
}

export type Venture = {
  name: string
  tag: string
  domain: string
  blurb: string
  visual:
    | 'vitals'
    | 'uptime'
    | 'build'
    | 'assets'
    | 'scaffold'
    | 'orchestrator'
    | 'messages'
  accent: string
}

export const portfolio = {
  kicker: 'The portfolio',
  h2: "Companies we've built and hold.",
  sub: 'Some are ours end to end; some are client ventures we operate. Each is described by what it is — built to a real bar.',
  ventures: [
    {
      name: 'Mentera',
      tag: 'Flagship · Healthcare AI',
      domain: 'Clinical platform',
      blurb:
        'An end-to-end clinical platform: backend, web, native iOS and Android, and 50+ EHR integrations, with AI woven through the clinical workflow. Built in full, to a regulated bar.',
      visual: 'vitals',
      accent: '#0E9F6E',
    },
    {
      name: 'Convey',
      tag: 'Client · Reliability',
      domain: 'Operations platform',
      blurb:
        'An autonomous reliability agent for an operations platform serving regulated utilities — it compresses root-cause analysis from days to under an hour, and acts as institutional memory over the codebase. Built self-hosted to a strict compliance bar.',
      visual: 'uptime',
      accent: '#3B7DE9',
    },
    {
      name: 'Logbook',
      tag: 'Venture · Maritime ops',
      domain: 'Port operations platform',
      blurb:
        'An asset and maintenance platform for ports and terminals — locations, assets, alerts and reports in one system, with Harbor Copilot, an AI assistant that answers questions over the logbook.',
      visual: 'assets',
      accent: '#6C5CE7',
    },
    {
      name: 'Koitel',
      tag: 'Internal · In build',
      domain: 'In active development',
      blurb:
        'An internal venture in active development, incubated on the same spine.',
      visual: 'scaffold',
      accent: '#E08A3B',
    },
    {
      name: 'Agentics',
      tag: 'Client · Agent products',
      domain: 'Applied agent products',
      blurb:
        'An applied-agents engagement — our orchestration patterns put to work for a client.',
      visual: 'orchestrator',
      accent: '#0E9F6E',
    },
    {
      name: 'WD Chat',
      tag: 'Venture · Conversational',
      domain: 'Conversational product',
      blurb:
        'A conversational product in the portfolio, with its own audience and shape.',
      visual: 'messages',
      accent: '#D14B8F',
    },
  ] as Venture[],
}

export const engineering = {
  kicker: 'How we build',
  h2: 'Full-stack, AI-native — and all in-house.',
  sub: 'Every venture is built by the same team, end to end: design, web, mobile, backend, cloud and the AI woven through it. No outsourcing, no handoffs.',
  capabilities: [
    { title: 'Product design & UX', body: 'Interfaces people actually understand.', tags: ['Design systems', 'Prototyping', 'User research'] },
    { title: 'Modern web apps', body: 'Fast, resilient web products.', tags: ['React / Next.js', 'State & data', 'Performance'] },
    { title: 'Cloud & DevOps', body: 'Infrastructure that scales without drama.', tags: ['IaC', 'Containers', 'CI/CD'] },
    { title: 'Backend & APIs', body: 'Robust foundations under everything.', tags: ['Serverless', 'Data engineering', 'Security'] },
    { title: 'AI & machine learning', body: 'AI woven into the product, not bolted on.', tags: ['LLM integration', 'MLOps', 'Vector search'] },
    { title: 'Mobile', body: 'Native iOS and Android, shipped together.', tags: ['iOS', 'Android', 'Offline-first'] },
  ],
  stack: ['React', 'Next.js', 'React Native', 'TypeScript', 'Node', 'Python', 'Postgres', 'Supabase', 'Docker', 'Kubernetes', 'AWS', 'Vercel', 'Claude', 'pgvector'],
  proof: {
    label: 'Flagship proof',
    name: 'Mentera',
    line: 'A regulated clinical product, taken from zero to shipped — in full.',
    chips: ['Backend', 'Web', 'Native iOS / Android', '50+ EHR integrations', 'AI clinical workflow'],
  },
}

export const stats = {
  h2: "You're building something to stand the test of time. So are we.",
  note: 'The agent fleet is internal — it powers how the studio works, not the companies it builds.',
  items: [
    { value: 5, suffix: '+', label: 'companies & engagements in the portfolio' },
    { value: 25, suffix: '', label: 'specialist agents in the internal fleet (+ orchestrator)' },
    { value: 1, suffix: '', label: 'operating spine under all of them' },
    { value: 0, prefix: 'T0–T', valueOverride: '3', label: 'autonomy tiers, human-gated' },
  ] as {
    value: number
    suffix?: string
    prefix?: string
    valueOverride?: string
    label: string
  }[],
}

export const quote = {
  text: "A company's cost used to be its payroll. We changed the denominator.",
  attribution: 'The NX Growth Partners operating thesis',
}

export const approach = {
  kicker: 'How we operate',
  h2: 'The same loop, every time — which is exactly why it compounds.',
  steps: [
    { n: '01', title: 'Underwrite the bet', body: "We only start what we'd put our own capital and fleet-time behind. The thesis gets pressure-tested before a line of code exists." },
    { n: '02', title: 'Build it well', body: 'Our in-house team and the internal fleet design and ship the product — full-stack, mobile, AI-native — to a real quality bar.' },
    { n: '03', title: 'People hold the calls', body: 'Agents run at tiers T0–T3; anything above tier waits for a person, signed and logged.' },
    { n: '04', title: 'Operate, hold, recycle', body: 'The company goes live on the shared spine and we hold it. What the fleet learns makes the next venture cheaper and faster.' },
  ],
}

export const cta = {
  h2Lines: ['Have a company to build?', 'Let’s talk.'],
  sub: 'A venture to scale, a company to operate, or capital to put behind the model — start the conversation.',
  email: 'hello@nxgp.io',
  ctaPrimary: 'hello@nxgp.io',
  ctaSecondary: 'Explore the portfolio',
}

export const footer = {
  blurb:
    'A holding company and venture studio. We build, hold and operate companies — run on an AI-native operating model.',
  tagline: 'Multiply the companies. Compound the value.',
  copyright: '© 2026 NX Growth Partners · nxgp.io',
  columns: [
    { heading: 'Studio', links: ['The model', 'Our edge', 'Portfolio', 'Investments'] },
    { heading: 'Ventures', links: ['Mentera', 'Convey', 'Logbook', 'Agentics'] },
    { heading: 'Company', links: ['About', 'Approach', 'Contact', 'Portal'] },
    { heading: 'Connect', links: ['hello@nxgp.io', 'LinkedIn', 'X', 'nxgp.io'] },
  ],
}
