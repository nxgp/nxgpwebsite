import { lazy, Suspense, useEffect, useState } from 'react'
import { portfolio, type Product } from '../data/content'
import { PageHeader } from './PageHeader'

const Vignettes = lazy(() => import('../components/portfolio/vignetteStage'))

/** Static stand-in with the scene's studio look — also what the server
 *  renders: renderToString can't suspend, so the lazy scene only mounts
 *  client-side after hydration (same gate the home Portfolio uses). */
function SceneSkeleton() {
  return (
    <div
      className="h-full w-full rounded-inner border border-line"
      style={{ background: 'linear-gradient(160deg, #F0F1F6 0%, #E2E4EE 60%, #D6D9E8 100%)' }}
    />
  )
}

/**
 * Standalone lander for one piece of work: the animated showcase scene,
 * the full story, the proof, and links across the rest of the portfolio.
 * All copy comes from the same content object the home page renders.
 */
export function ProductPage({ product: p }: { product: Product }) {
  const others = portfolio.products.filter((o) => o.id !== p.id)
  // false during SSR and the hydration pass, true after mount — the lazy
  // chunk never renders on the server, so nothing suspends in renderToString
  const [seen, setSeen] = useState(false)
  useEffect(() => setSeen(true), [])

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Work', href: '/work' },
          { label: p.client, href: `/work/${p.slug}` },
        ]}
        title={`${p.client}: ${p.built}`}
        // was the kicker; kept as the sub so product pages don't lose who
        // the work was built for
        sub={`Built for ${p.builtFor ?? p.client} · ${p.role}`}
      />

      <div className="shell">
        {/* the showcase scene */}
        <div className="mt-8 h-[460px] sm:h-[480px]" aria-hidden>
          <Suspense fallback={<SceneSkeleton />}>
            {seen ? <Vignettes id={p.id} /> : <SceneSkeleton />}
          </Suspense>
        </div>

        {/* the story */}
        <div className="mx-auto mt-12 grid max-w-[62rem] gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="t-h3">{p.outcome}</h2>
            <p className="t-lead mt-4">{p.blurb}</p>
          </div>
          <div>
            <p className="text-[0.78rem] font-700 uppercase tracking-[0.08em] text-ink-faint">Proof</p>
            <ul className="mt-3 flex flex-col gap-2">
              {p.proof.map((c) => (
                <li
                  key={c}
                  className="rounded-inner bg-accent-wash px-3.5 py-2 text-[0.92rem] font-700 text-accent-deep"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* the rest of the portfolio — internal links, not dead ends */}
        <div className="mx-auto mt-16 max-w-[62rem] border-t border-line pt-10">
          <p className="text-[0.78rem] font-700 uppercase tracking-[0.08em] text-ink-faint">
            More of what we've built
          </p>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.id}>
                <a
                  href={`/work/${o.slug}`}
                  className="link-underline text-[0.98rem] font-600 text-ink-soft transition-colors hover:text-ink"
                >
                  {o.client}: {o.built}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
