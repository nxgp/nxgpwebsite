import {
  Check,
  Cloud,
  Database,
  Handshake,
  Layers,
  MonitorSmartphone,
  Puzzle,
  Server,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { findDevelopers } from '../data/content'
import { FAQ } from '../components/FAQ'
import { Button, ArrowUpRight } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useActiveOnScroll } from '../hooks/useActiveOnScroll'
import { cn } from '../lib/cn'
import { PageHeader } from './PageHeader'

/**
 * /services/find-developers — contract engineers (staff augmentation).
 * All copy lives in `findDevelopers` (content.ts); the shared CTA and Footer
 * follow from App, as on every route.
 */

const icons: Record<string, LucideIcon> = {
  UserPlus,
  Puzzle,
  Users,
  Layers,
  MonitorSmartphone,
  Server,
  Sparkles,
  Handshake,
  Database,
  Cloud,
  ShieldCheck,
}

const { ctaHref, hero, when, capabilities, how, profiles, models, faq } = findDevelopers

export function FindDevelopers() {
  return (
    <>
      <PageHeader eyebrow={hero.eyebrow} title={hero.h1} sub={hero.sub}>
        <div className="mt-8 pb-10">
          <Button href={ctaHref} arrow>
            {hero.cta}
          </Button>
          <p className="mt-4 max-w-[46rem] text-[14px] text-slate">{hero.note}</p>
        </div>
      </PageHeader>

      <When />
      <Capabilities />
      <HowItWorks />
      <Profiles />
      <Models />
      {/* Proof of delivery: intentionally omitted until approved case studies are ready. */}
      <FAQ h2a={faq.h2a} h2Hi={faq.h2Hi} items={faq.items} idPrefix="dev-faq" />
    </>
  )
}

function When() {
  return (
    <section aria-labelledby="dev-when-title" className="section-v2 bg-cloud">
      <div className="shell">
        <SectionHeader title={<span id="dev-when-title">{when.h2}</span>} sub={when.sub} />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {when.items.map((it) => {
            const Icon = icons[it.icon]
            return (
              <li data-reveal key={it.title}>
                <Card className="h-full p-7">
                  <span className="flex size-11 items-center justify-center rounded-inner bg-accent-wash text-accent-deep">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="t-h3 mt-5 text-navy">{it.title}</h3>
                  <p className="mt-3 text-[14px] text-slate">{it.body}</p>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section aria-labelledby="dev-caps-title" className="section-v2 bg-bg">
      <div className="shell">
        <SectionHeader title={<span id="dev-caps-title">{capabilities.h2}</span>} sub={capabilities.sub} />
        <ul className="mt-12 grid border-l border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.items.map((c) => {
            const Icon = icons[c.icon]
            return (
              <li
                data-reveal
                key={c.slug}
                className="border-b border-r border-hairline p-6 transition-colors duration-[320ms] ease-[ease] hover:bg-peri/[0.12]"
              >
                <Icon className="size-5 text-accent" aria-hidden />
                <h3 className="mt-4 text-[17px] font-500 leading-[1.3] tracking-[-0.01em] text-navy">{c.title}</h3>
                <p className="mt-2 text-[14px] text-slate">{c.body}</p>
              </li>
            )
          })}
        </ul>
        <div data-reveal className="mt-12 flex flex-wrap items-center gap-6 max-md:flex-col max-md:items-start">
          <p className="max-w-[56ch] text-slate">{capabilities.foot}</p>
          <Button href={ctaHref} arrow>
            {capabilities.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}

/** Numbered steps, styled like the home page's Approach list. */
function HowItWorks() {
  const { active, bind } = useActiveOnScroll(how.steps.length)
  return (
    <section aria-labelledby="dev-how-title" className="section-v2 bg-cloud">
      <div className="shell">
        <SectionHeader title={<span id="dev-how-title">{how.h2}</span>} />
        <ol data-reveal className="mt-12 grid border border-hairline bg-bg">
          {how.steps.map((s, i) => (
            <li
              key={s.n}
              {...bind(i)}
              className={cn(
                'grid grid-cols-[74px_1fr] gap-x-4 border-b border-l-[3px] border-b-hairline px-8 py-[30px] transition-[background-color,border-color] duration-[320ms] ease-[ease] last:border-b-0 max-md:grid-cols-1 max-md:gap-y-2 max-md:px-5',
                i === active ? 'border-l-accent bg-peri/[0.26]' : 'border-l-transparent',
              )}
            >
              <span className="whitespace-nowrap pt-[7px] font-mono text-[12px] tracking-[0.14em] text-accent">
                STEP {s.n}
              </span>
              <div>
                <h3 className="text-[length:var(--fs-h6)] font-500 leading-[1.25] tracking-[-0.02em] text-navy">
                  {s.title}
                </h3>
                <p className={cn('mt-3 text-[14px]', i === active ? 'text-ink' : 'text-slate')}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Profiles() {
  const { sample } = profiles
  return (
    <section aria-labelledby="dev-profiles-title" className="section-v2 bg-bg">
      <div className="shell grid items-start gap-12 min-[992px]:grid-cols-2 min-[992px]:gap-[72px]">
        <div>
          <SectionHeader title={<span id="dev-profiles-title">{profiles.h2}</span>} sub={profiles.sub} />
          <div data-reveal className="mt-8">
            <p className="font-500 text-navy">{profiles.listLabel}</p>
            <ul className="mt-4 grid gap-3">
              {profiles.list.map((l) => (
                <li key={l} className="flex gap-3 text-[15px] text-slate">
                  <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
            <Button href={ctaHref} arrow className="mt-8">
              {profiles.cta}
            </Button>
          </div>
        </div>

        <article data-reveal aria-label={sample.badge} className="chamfer bg-navy p-8 text-bg max-md:p-6">
          <span className="chip text-peri">{sample.badge}</span>
          <h3 className="t-h3 mt-6">{sample.role}</h3>
          <p className="mt-1 text-[14px] text-mist">{sample.experience}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Primary skills">
            {sample.skills.map((s) => (
              <li key={s} className="border border-bg/24 px-[9px] py-1 text-[12px] leading-[1.65] text-[#d3d6ec]">
                {s}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-4 border-t border-bg/[0.14] pt-6">
            {sample.fields.map((f) => (
              <div key={f.label}>
                <dt className="t-kicker text-peri">{f.label}</dt>
                <dd className="mt-1 text-[14px] text-bg/[0.86]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  )
}

function Models() {
  return (
    <section aria-labelledby="dev-models-title" className="section-v2 bg-cloud">
      <div className="shell">
        <SectionHeader title={<span id="dev-models-title">{models.h2}</span>} />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {models.items.map((m, i) => (
            <li data-reveal key={m.title}>
              <Card className="flex h-full flex-col p-7">
                <span className="font-mono text-[12px] tracking-[0.14em] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-h3 mt-3 text-navy">{m.title}</h3>
                <p className="mt-3 text-[14px] text-slate">{m.body}</p>
                {m.href && (
                  <a
                    href={m.href}
                    className="group mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-500 text-accent hover:text-navy"
                  >
                    {m.linkLabel}
                    <ArrowUpRight />
                  </a>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
