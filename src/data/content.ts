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
   Nx Embedded Engineering. One CTA everywhere: Discuss a project.
   ============================================================ */

export const brand = 'Nx Growth Partners'

// Header links jump to home-page sections (v2 is a single scroll; inner
// pages link back to /#id). Blog isn't in the Webflow build: it's a page
// link, added so crawlers reach the blog from the header, not only the footer.
// Services is a small dropdown so the service pages are reachable from every
// page; it isn't in the Webflow build either.
export const nav = {
  brand,
  links: [
    {
      label: 'Services',
      children: [
        { label: 'Overview', href: '/services' },
        { label: 'Find developers', href: '/services/find-developers' },
      ],
    },
    { label: 'Approach', id: 'approach' },
    { label: 'Platform', id: 'system' },
    { label: 'Work', id: 'work' },
    { label: 'Industries', id: 'industries' },
    { label: 'Company', id: 'company' },
    { label: 'Blog', href: '/blog' },
  ],
  // the mobile drawer spells Platform out and adds FAQ (Webflow build)
  drawer: [
    { label: 'Services', href: '/services' },
    { label: 'Find developers', href: '/services/find-developers' },
    { label: 'Approach', id: 'approach' },
    { label: 'The Nx delivery system', id: 'system' },
    { label: 'Work', id: 'work' },
    { label: 'Industries', id: 'industries' },
    { label: 'Company', id: 'company' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Blog', href: '/blog' },
  ],
  cta: 'Discuss a project',
}

export const hero = {
  h1a: 'Your team, ',
  h1Hi: 'extended.',
  h1b: 'From idea to production.',
  sub: "Nx Growth Partners helps businesses design, build, and operate custom software, AI automation, internal tools, and digital products when off-the-shelf technology isn't enough.",
  ctaPrimary: 'Discuss a project',
  ctaSecondary: 'See how we work',
  note: 'AI engineering · custom software · embedded delivery. For private equity, enterprise and government.',
}

export const proof = {
  label: 'Trusted by',
  // hero strip, shown white at 62% as in the Webflow build: 26px tall, 42px
  // for the two stacked marks. `w` crops a file with empty space above and
  // below the mark to Webflow's displayed width.
  strip: [
    { name: 'Kiotel', src: '/logos/strip/kiotel.webp', tall: false },
    { name: 'Western Digital', src: '/logos/strip/western-digital.webp', tall: false, w: 97 },
    { name: 'ecoATM', src: '/logos/strip/ecoatm.webp', tall: false },
    { name: 'Harbor Industrial', src: '/logos/strip/harbor-industrial.webp', tall: true },
    { name: 'Advanced Medaesthetic Partners', src: '/logos/strip/amp.webp', tall: true },
  ],
}

// CLIENT REVIEWS — real quotes and attributions from the company deck.
export const reviews = {
  h2: 'What it feels like to have us inside the team.',
  h2a: 'What it feels like',
  h2b: 'to have us inside the team.',
  sub: 'A perspective from the leaders who ran the work.',
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
      name: 'Jon Goodheart · Chief Technology Officer',
      context: 'Harbor Industrial',
    },
    {
      quote:
        'Their ability to combine strong software engineering with a practical understanding of our business. They operate like an extension of our team and remain focused on building technology that creates measurable value for our properties and guests.',
      name: 'Raj Patel · Chief Executive Officer',
      context: 'Kiotel',
    },
  ],
}

// THE SHIFT — why now, straight from the deck (with cited sources).
export type LoopStep = { n: string; title: string; body: string }

export const operatingModel = {
  eyebrow: 'Our approach',
  h2: 'More than a software development partner, a true extension of your team.',
  h2a: 'More than a software development partner, ',
  h2b: 'a true extension of your team.',
  sub: 'We work with your team to identify where technology can make a meaningful difference, prioritize the right projects, and bring them into everyday use.',
  center: { label: 'In production', title: 'A result you can name' },
  // the four capability labels around the outer orbit, clockwise from top
  orbit: ['AI agents', 'Internal tools', 'Data platforms', 'QA & DevOps'],
  steps: [
    { n: '01', title: 'Discover', body: "First we find what's worth building. Working inside the business, we follow where time, money and customers slip away, then come back with the few moves that matter most." },
    { n: '02', title: 'Prioritize', body: 'Then we sequence them. Each opportunity gets weighed by impact, effort and how ready your team is to adopt it, so we start where the return shows up fastest.' },
    { n: '03', title: 'Deliver', body: 'We build inside your stack and ship continuously: real software in production that people use, not a pile of closed tickets or a demo that never lands.' },
    { n: '04', title: 'Optimize', body: 'Then we watch what it does. Every release tells us the next move: what to scale, what to fix, and what to build next.' },
  ] as LoopStep[],
}

export type Pillar = { title: string; outcome: string; body: string; caps: string[]; icon: string }

export const services = {
  h2: 'Three pillars. One embedded team.',
  sub: 'Engage one pillar, or a cross-functional team across all three. Each is led by the outcome, and the capabilities are the proof of range.',
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

export type Engagement = { name: string; body: string; tags: string[] }

// HOW WE ENGAGE — the four engagement models from the deck, shown as the
// "Nx Delivery System": one isometric plate per model.
export const engagement = {
  eyebrow: 'The Nx delivery system',
  h2: 'Start with a blueprint. Scale as value lands.',
  h2a: 'Start with a blueprint.',
  h2b: 'Scale as value lands.',
  sub: 'Four ways to work together, from a focused discovery sprint to a fully embedded senior team. Each one stands alone, and each one builds on the last.',
  items: [
    {
      name: 'Nx Blueprint',
      body: 'Discovery and planning that identifies the highest-value workflow, software, and AI opportunities in your operation. You leave with a prioritized roadmap, estimated investment, and a sequenced plan for execution.',
      tags: ['Prioritized roadmap', 'Estimated investment', 'Sequenced plan'],
    },
    {
      name: 'Nx Project Delivery',
      body: 'End-to-end design and development of a defined software, automation, data, or AI initiative. From solution design through production launch, in weekly increments with clear milestones.',
      tags: ['Solution design', 'Production launch', 'Weekly increments', 'Clear milestones'],
    },
    {
      name: 'Nx Managed Support',
      body: 'A senior-led team embedded in your organization, delivering against a prioritized roadmap. Built for businesses with multiple initiatives and evolving requirements.',
      tags: ['Senior-led team', 'Embedded in your org', 'Standing roadmap'],
    },
    {
      name: 'Nx Embedded Engineering',
      body: 'Operation, monitoring, and continuous improvement of deployed systems, so business value keeps compounding after launch.',
      tags: ['Operation', 'Monitoring', 'Continuous improvement'],
    },
  ] as Engagement[],
}

export type Capability = {
  /** reserved for a future /services/find-developers/<slug> subpage */
  slug: string
  title: string
  body: string
  icon: string
}

// FIND DEVELOPERS — /services/find-developers, contract engineers
// (staff augmentation). Copy from Gurjeet's "Services Pages" doc. Every
// action goes to the form with the "Contract developers" option preselected.
export const findDevelopers = {
  ctaHref: '/discuss-a-project?interest=developers',
  hero: {
    eyebrow: 'Software engineering staff augmentation',
    h1: 'Hire developers matched to your project.',
    sub: 'Bring on contract software engineers selected to match your technical requirements, project goals, and budget. We help define the support you need, share relevant candidate profiles, and coordinate interviews so you can choose the right fit.',
    cta: 'Find Talent',
    note: 'Nx Growth Partners has staffed 50+ software projects. We help you find offshore engineers with the skills and experience your project needs.',
  },
  when: {
    h2: 'Get the engineering support your next priority needs.',
    sub: 'Whether you have a defined role or need help figuring out who to bring on, we start with the work you need to accomplish.',
    items: [
      { title: 'Add engineering capacity', body: 'Support your roadmap with contract developers who work alongside your internal team, using your tools and development process.', icon: 'UserPlus' },
      { title: 'Fill a specialist gap', body: 'Bring in experience your team needs for a specific initiative, from backend integrations and cloud infrastructure to data pipelines and AI applications.', icon: 'Puzzle' },
      { title: 'Build a project team', body: 'Bring together complementary engineering skills for a new application, modernization effort, or internal platform.', icon: 'Users' },
    ],
  },
  capabilities: {
    h2: 'Find developers with relevant technical experience.',
    sub: 'We match engineers around the technologies involved, the complexity of the work, and the experience needed to contribute.',
    items: [
      { slug: 'full-stack-developers', title: 'Full-stack development', body: 'Build and extend applications across the frontend, backend, and database.', icon: 'Layers' },
      { slug: 'frontend-developers', title: 'Frontend development', body: 'Create responsive interfaces and improve existing web applications.', icon: 'MonitorSmartphone' },
      { slug: 'backend-developers', title: 'Backend development & integrations', body: 'Develop APIs, application services, and integrations between your business systems.', icon: 'Server' },
      { slug: 'ai-engineers', title: 'AI applications & automation', body: 'Connect AI models, business data, and software tools to support practical workflows.', icon: 'Sparkles' },
      { slug: 'forward-deployed-engineers', title: 'Forward-deployed engineering', body: 'Work directly with your team to turn business requirements into working software, integrations, and AI workflows.', icon: 'Handshake' },
      { slug: 'data-engineers', title: 'Data engineering', body: 'Build pipelines, connect data sources, and prepare reliable data for reporting and applications.', icon: 'Database' },
      { slug: 'devops-engineers', title: 'DevOps & cloud infrastructure', body: 'Improve deployment pipelines, cloud environments, monitoring, and infrastructure reliability.', icon: 'Cloud' },
      { slug: 'qa-engineers', title: 'QA & test automation', body: 'Strengthen release quality through testing, automated coverage, and clear defect reporting.', icon: 'ShieldCheck' },
    ] as Capability[],
    foot: 'Don’t know which role you need? Describe the project, and we’ll help clarify the skills and experience to look for.',
    cta: 'Tell Us About Your Project',
  },
  how: {
    h2: 'From project requirements to relevant developer profiles.',
    steps: [
      { n: '01', title: 'Tell us what you need', body: 'Share what you’re building, where you need support, and your priorities for timing and budget. You don’t need a finished job description.' },
      { n: '02', title: 'Define the right fit', body: 'We clarify the technical requirements, experience level, expected hours, and working arrangement. We also establish who will manage the work.' },
      { n: '03', title: 'Review relevant profiles', body: 'We share a focused shortlist with each engineer’s background, relevant project experience, availability, pricing, and our reasoning for recommending them.' },
      { n: '04', title: 'Meet your preferred engineers', body: 'Interview the candidates, discuss your project, and assess how they would work with your team.' },
      { n: '05', title: 'Agree on terms and get started', body: 'Confirm the engagement scope, hours, working overlap, and onboarding requirements before work begins.' },
    ] as LoopStep[],
    note: 'Profile availability and start dates depend on the requirements and are confirmed during the matching process.',
  },
  profiles: {
    h2: 'See why each engineer could fit your project.',
    sub: 'Every recommendation should help you make a decision. Alongside technical skills and experience, we explain how the engineer’s background connects to your needs.',
    listLabel: 'Each profile includes:',
    list: [
      'Role, experience level, and primary technical skills.',
      'Relevant projects and individual contributions.',
      'Why we recommend them for your requirements.',
      'Technical assessment summary.',
      'Location and available working-hour overlap.',
      'Expected availability and weekly capacity.',
      'Proposed rate and engagement terms.',
    ],
    cta: 'Request Developer Profiles',
    // illustrative only: no real person, client or rate (per the doc, real
    // profiles need permission and verified availability)
    sample: {
      badge: 'Sample profile',
      role: 'Senior Backend Engineer',
      experience: '8 years of experience',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'REST & GraphQL APIs'],
      fields: [
        { label: 'Relevant project', value: 'Built the integration layer connecting a logistics company’s order, billing, and CRM systems.' },
        { label: 'Why we recommend', value: 'Has delivered API integrations at a similar scale and is used to working inside an existing team’s process.' },
        { label: 'Assessment', value: 'Strong on API design, data modelling, and code review. Clear written communication.' },
        { label: 'Location', value: 'India' },
        { label: 'Working-hour overlap', value: '4 hours with US Eastern' },
        { label: 'Availability', value: 'Full-time, 40 hours a week' },
        { label: 'Rate', value: 'Shared with your shortlist' },
      ],
    },
  },
  models: {
    h2: 'One engineer or a team built around the work.',
    items: [
      { title: 'Individual contract engineer', body: 'Add a developer or specialist to your existing team. Your team owns priorities, technical direction, and day-to-day management.' },
      { title: 'Multiple contract engineers', body: 'Bring in complementary skills across development, infrastructure, data, or QA. Agree on responsibilities and coordination before the engagement begins.' },
      { title: 'NxGP-managed delivery', body: 'Need help leading the work as well? We can separately scope a delivery engagement with engineering leadership, coordination, and defined responsibilities.', href: '/services', linkLabel: 'See our delivery services' },
    ] as { title: string; body: string; href?: string; linkLabel?: string }[],
    note: 'We’ll help determine which arrangement fits your project and your internal team’s capacity.',
  },
  faq: {
    h2a: 'Questions about engaging ',
    h2Hi: 'offshore developers',
    items: [
      { q: 'Can we engage just one developer?', a: 'Yes. We can help with an individual contract engineer, a specialist role, or multiple engineers, depending on your requirements and availability.' },
      { q: 'Where are your engineers based?', a: 'This offering focuses on engineers based in India. We confirm each candidate’s location, working hours, and available overlap before you decide.' },
      { q: 'Can we interview developers before moving forward?', a: 'Yes. You can meet recommended engineers, discuss their experience, and assess their fit before agreeing to an engagement.' },
      { q: 'What if we don’t know which technical skills we need?', a: 'Start with the problem you’re solving and what you want to accomplish. We’ll help clarify the roles, technical skills, and experience needed.' },
      { q: 'How quickly can we receive profiles or get started?', a: 'Timing depends on the role, technical requirements, availability, and your interview and onboarding process. We confirm an expected timeline after reviewing your needs.' },
      { q: 'Who manages the developers?', a: 'For staff augmentation engagements, your team manages priorities and day-to-day work. If you need NxGP to lead delivery, we scope and price that responsibility separately.' },
      { q: 'Can developers work during our business hours?', a: 'We match against your required overlap and confirm the proposed schedule for each candidate. Full working-day overlap depends on availability and the engagement arrangement.' },
      { q: 'How does pricing work?', a: 'Pricing depends on the engineer’s experience, technical specialization, committed hours, and engagement model. You receive the proposed rate and commercial terms before making a commitment.' },
      { q: 'How long does an engagement need to be?', a: 'Duration and minimum commitments depend on the role and working arrangement. We agree on the expected term, hours, and notice requirements before work begins.' },
      { q: 'What happens if an engineer isn’t the right fit?', a: 'Raise the concern with your NxGP contact so we can review the issue and agree on next steps. Any replacement arrangements are defined in your engagement terms.' },
      { q: 'Can you manage the entire project?', a: 'Yes. NxGP also offers managed software delivery. If you need a team responsible for an agreed scope, tell us in your inquiry so we can discuss the appropriate engagement.' },
    ],
  },
}

export type Industry = {
  name: string
  /** eyebrow on the v2 card */
  eyebrow: string
  /** card copy on the v2 card */
  body: string
  /** card photo, ~960px wide, with a 480px version for small cards */
  image: string
  imageSm: string
  // buyer + frame stay as the fuller positioning the Nx Assistant draws on
  buyer: string
  frame: string
  visual: 'pe' | 'enterprise' | 'gov'
  accent: string
}

export const industries = {
  h2: 'Who we serve: industry verticals.',
  h2a: 'Who we serve',
  h2b: 'Industry Verticals',
  sub: 'We partner with businesses that want to put AI to work, from organizations across telecom, media, financial services, manufacturing, software, and healthcare. We bring together AI, data, cloud engineering, and user experience design to build solutions around how your business operates.',
  foot: 'Not sure where you fit? We map it on the first call.',
  items: [
    { name: 'Private Equity', eyebrow: 'Operating partners & portfolio leadership', body: 'We help investors assess technology opportunities and turn growth plans into action, working across AI, product development, and go-to-market execution to build value across the portfolio.', image: '/industries/private-equity-960.webp', imageSm: '/industries/private-equity-480.webp', buyer: 'Operating partners & portfolio-company leadership', frame: 'Portfolio value creation, technical diligence and speed across portcos: one partner spanning GTM, AI and product, without standing up an in-house tech org.', visual: 'pe', accent: '#0000F4' },
    { name: 'Enterprise', eyebrow: 'Innovation, product, and technology leaders', body: 'Move priority projects forward with experienced engineers who work alongside your team, fit into your existing systems, and take ownership from planning through delivery.', image: '/industries/enterprise-960.webp', imageSm: '/industries/enterprise-480.webp', buyer: 'Revenue, IT, product and data leaders', frame: 'Senior capacity and outcomes without long agency cycles or heavy hiring: an embedded team that ships inside your stack and displaces slow integrators and staff aug.', visual: 'enterprise', accent: '#5B5BD6' },
    { name: 'Government', eyebrow: 'Agency leaders & contracting partners', body: 'We work with government contractors and agency teams to address technology needs through focused delivery and teaming partnerships, with a clear understanding of project requirements and our role.', image: '/industries/government-960.webp', imageSm: '/industries/government-480.webp', buyer: 'Procurement-driven buyers', frame: 'Capabilities and teaming today, building toward past performance and contract vehicles. We frame this honestly, and never claim posture we do not hold.', visual: 'gov', accent: '#8080FF' },
  ] as Industry[],
}

export type Product = {
  id: string
  /** URL slug for the product's standalone page (/work/<slug>). */
  slug: string
  /** Headline in the index — a client name, or a platform name where that
   *  reads better. */
  client: string
  /** Who it was actually built for, when that differs from the headline.
   *  The stage attributes proof to this, so metrics never drift from the
   *  engagement that earned them. */
  builtFor?: string
  built: string
  role: string
  outcome: string
  blurb: string
  proof: string[]
  dark?: boolean
  /** v2 work-rail card: image, short blurb and the chips shown on it */
  card: { image: string; blurb: string; tags: string[] }
}

// THE PORTFOLIO — what NX built, named by who we built it for. This section
// is a showcase of delivered work, NOT a product catalogue: it should never
// read as "these are off-the-shelf things we resell". Every proof chip is an
// approved claim.
export const portfolio = {
  h2: "What we've built and problems we've solved.",
  h2a: 'What we\u2019ve built',
  h2b: 'and problems we\u2019ve solved.',
  sub: 'A selection of the systems we\u2019ve designed, built and shipped, running in production for the teams we work with.',
  products: [
    {
      id: 'forge',
      slug: 'agent-hub',
      client: 'Agent Hub',
      builtFor: 'Western Digital',
      built: 'Agent platform & runtime',
      role: 'Enterprise AI at scale',
      outcome: 'Ship production AI agents without an ML team.',
      blurb:
        'An organization-wide platform to design agents, wire their actions, and deploy them to a governed runtime, unifying agents, knowledge and workflows in one secure experience.',
      proof: ['$5M SaaS spend eliminated', '3\u00d7 more capabilities', '50% faster AI delivery'],
      card: {
        image: '/work/agent-hub.webp',
        blurb: 'An organization-wide platform to design agents, wire their actions, and deploy them to a governed runtime.',
        tags: ['$5M SaaS spend eliminated', '3\u00d7 more capabilities'],
      },
    },
    {
      id: 'tera',
      slug: 'tera',
      client: 'Mentera',
      built: 'Tera \u00b7 clinical AI platform',
      role: 'Healthcare AI',
      outcome: 'A clinic\u2019s day that runs itself.',
      blurb:
        'A chat-first AI platform for the whole clinic: front desk, scheduling, personalised outreach, pre-charting, back office and analytics. Staff ask in plain language; Tera takes the actions, end to end, across 50+ EHR integrations at a regulated bar.',
      proof: ['50+ EHR integrations', 'Front desk \u2192 back office', 'Acts with tools'],
      card: {
        image: '/work/tera.webp',
        blurb: 'A chat-first AI platform for the whole clinic: front desk, scheduling, outreach, pre-charting, back office and analytics.',
        tags: ['50+ EHR integrations', 'Acts with tools'],
      },
    },
    {
      id: 'cortex',
      slug: 'kiotel',
      client: 'Kiotel',
      built: 'Company knowledge engine',
      role: 'Knowledge & GraphRAG',
      outcome: 'Answers grounded in your own knowledge.',
      blurb:
        'A plug-and-play knowledge brain over docs, wikis and tickets. Every answer arrives with its sources attached, so teams can trust what it tells them.',
      proof: ['Plug-and-play GraphRAG', 'Sources on every answer'],
      card: {
        image: '/work/kiotel.webp',
        blurb: 'A plug-and-play knowledge brain over docs, wikis and tickets, with sources attached to every answer.',
        tags: ['Plug-and-play GraphRAG', 'Sources on every answer'],
      },
    },
    {
      id: 'omni',
      slug: 'wd-chat',
      client: 'Western Digital',
      built: 'WD Chat \u00b7 analytics workspace',
      role: 'Enterprise copilot',
      outcome: 'Ask a question, get the dashboard.',
      blurb:
        'A ChatGPT-class workspace wired into the company\u2019s warehouse, CRM and finance systems. Ask in plain language and it builds the dashboard or report, grounded in governed enterprise data.',
      proof: ['50+ app integrations', 'Dashboards & reports on demand'],
      card: {
        image: '/work/wd-chat.webp',
        blurb: 'A workspace wired into the company\u2019s warehouse, CRM and finance systems, grounded in governed enterprise data.',
        tags: ['50+ app integrations', 'Reports on demand'],
      },
    },
    {
      id: 'harbor',
      slug: 'harbor',
      client: 'Harbor Industrial',
      built: 'Maintenance operations platform',
      role: 'Maritime operations',
      outcome: 'Fleet operations that report themselves.',
      blurb:
        'Structured logbooks, asset tracking and analytics with an AI copilot on top, giving crews accurate, consistent data and faster decisions across the fleet.',
      proof: ['40% less time on reporting', '25% faster issue resolution', '15% higher fleet availability'],
      card: {
        image: '/work/harbor.webp',
        blurb: 'Structured logbooks, asset tracking and analytics with an AI copilot on top, across the fleet.',
        tags: ['40% less time on reporting', '25% faster issue resolution'],
      },
    },
    {
      id: 'convey',
      slug: 'convey',
      client: 'Convey',
      built: 'Reliability & SRE agent',
      role: 'Regulated utilities',
      outcome: 'Incidents fixed before customers notice.',
      blurb:
        'Watches logs across large applications, finds root cause, and opens the fix PR, then remembers the codebase so the team doesn\u2019t have to.',
      proof: ['Root cause: days \u2192 under an hour'],
      dark: true,
      card: {
        image: '/work/convey.webp',
        blurb: 'Watches logs across large applications, finds root cause, and opens the fix PR, then remembers the codebase.',
        tags: ['Root cause: days \u2192 under an hour'],
      },
    },
    {
      id: 'beacon',
      slug: 'elevano',
      client: 'Elevano',
      built: 'Website concierge AI',
      role: 'Lead capture & support',
      outcome: 'Visitors become qualified leads while you sleep.',
      blurb:
        'An embeddable assistant that answers from the company\u2019s own knowledge, hands qualified leads straight to the team in Slack, and learns from every conversation with verified memory.',
      proof: ['Self-learning', 'Leads straight to Slack'],
      card: {
        image: '/work/elevano.webp',
        blurb: 'An embeddable assistant that answers from the company\u2019s own knowledge and hands qualified leads to the team in Slack.',
        tags: ['Self-learning', 'Leads straight to Slack'],
      },
    },
    {
      id: 'keystone',
      slug: 'vantage',
      client: 'Vantage',
      built: 'Reputation & pipeline platform',
      role: 'Multi-location revenue ops',
      outcome: 'Reviews answer themselves, and turn into leads.',
      blurb:
        'Watches every location, drafts on-brand replies, and converts happy customers into pipeline, paired with a CRM built around the fields, views and stages their operation actually runs on.',
      proof: ['Agentic review ops', 'Custom-built CRM'],
      card: {
        image: '/work/vantage.webp',
        blurb: 'Watches every location, drafts on-brand replies, and converts happy customers into pipeline, paired with a custom CRM.',
        tags: ['Agentic review ops', 'Custom-built CRM'],
      },
    },
  ] as Product[],
}

export const about = {
  eyebrow: 'Company',
  h2: "A senior team you'd want inside your business.",
  h2a: 'A senior team you\u2019d ',
  h2Hi: 'want',
  h2b: 'inside your business.',
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
      photo: '/team/gurjeet-nijjar.jpg',
      bio: 'Systems engineering and operations-focused founder who has built tooling to help teams work smarter by connecting fragmented systems across startups and enterprises.',
    },
    {
      name: 'Ravi Singh',
      role: 'CTO',
      photo: '/team/ravi-singh.jpg',
      bio: 'Principal Architect with experience building purpose-built solutions across industries, combining agents, LLMs, and modern application architecture to create AI-native, intent-driven user experiences.',
    },
  ],
}

export const faq = {
  h2: 'Frequently asked questions.',
  h2a: 'Frequently asked ',
  h2Hi: 'questions',
  sub: 'Still unanswered? Write to',
  email: 'hello@nxgp.io',
  items: [
    {
      q: 'What does Nx Growth Partners do?',
      a: 'Nx Growth Partners is a custom software and AI development company. We design, build, integrate, and support custom software, AI automation, internal tools, digital products, data systems, and business applications.',
    },
    {
      q: 'What types of companies does NxGP work with?',
      a: 'We work with growing and established organizations that need to build new technology, improve existing systems, automate operational workflows, or add experienced product and engineering capacity.',
    },
    {
      q: 'Does NxGP only build AI solutions?',
      a: 'No. AI is one part of our engineering capability. Depending on the problem, a solution may involve custom software, workflow automation, system integrations, data infrastructure, AI, or a combination of these technologies.',
    },
    {
      q: 'Can NxGP work with our existing engineering team?',
      a: 'Yes. NxGP can own a complete project or embed product, engineering, AI, data, QA, and DevOps resources alongside an existing team.',
    },
    {
      q: 'Can NxGP support software after it launches?',
      a: 'Yes. NxGP provides ongoing application support, monitoring, maintenance, optimization, and continued development for deployed systems.',
    },
  ],
}

export const cta = {
  h2Lines: ['Let’s find what', 'moves your business.'],
  sub: "Tell us where you are, whether PE, enterprise or government, and we'll map where technology can create the most value. A 30-minute intro, no pitch deck.",
  email: 'hello@nxgp.io',
  emailLead: 'Prefer email?',
  calendly: 'https://calendly.com/ravi-nxgp',
  ctaPrimary: 'Discuss a project',
  ctaSecondary: 'See the pillars',
}

// Footer columns follow the Webflow build. Unlike Webflow (and the nav), the
// links go to the standalone pages (/about, /faq…): the footer is the one
// place every page links to them, so they aren't orphaned. Blog stays, as it
// is on nxgp.io.
export const footer = {
  blurb:
    'Embedded. Senior. Accountable. An AI engineering and custom software partner for private equity, enterprise and government.',
  copyright: '\u00a9 2026 Nx Growth Partners. All rights reserved.',
  columns: [
    {
      heading: 'Platform',
      links: [
        { label: 'System overview', href: '/#system' },
        { label: 'Nx Blueprint', href: '/services' },
        { label: 'Nx Project Delivery', href: '/services' },
        { label: 'Nx Managed Support', href: '/services' },
        { label: 'Nx Embedded Engineering', href: '/services' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'Our approach', href: '/what-we-build' },
        { label: 'AI & Workflow Automation', href: '/services' },
        { label: 'Software & Product Delivery', href: '/services' },
        { label: 'Embedded Engineering', href: '/services' },
        { label: 'Find developers', href: '/services/find-developers' },
      ],
    },
    {
      heading: 'Industries',
      links: [
        { label: 'Private Equity', href: '/industries' },
        { label: 'Enterprise', href: '/industries' },
        { label: 'Government', href: '/industries' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Work', href: '/work' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Blog', href: '/blog' },
        { label: 'hello@nxgp.io', href: 'mailto:hello@nxgp.io' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nx-growth-parnters' },
      ],
    },
  ] as { heading: string; links: { label: string; href: string }[] }[],
}
