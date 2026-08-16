import { ArrowRight } from 'lucide-react'
import { posts } from '../data/blog.generated'
import { useReveal } from '../hooks/useReveal'
import { formatPostDate } from '../lib/blog'

/**
 * /blog — the post index. Content comes from Contentful at build time
 * (scripts/fetch-contentful.mjs), so this renders as static HTML with no
 * client-side fetching.
 */
export function BlogIndex() {
  const ref = useReveal<HTMLDivElement>()
  const [lead, ...rest] = posts

  if (posts.length === 0) {
    return (
      <section className="section">
        <div className="shell">
          <p className="t-lead max-w-[40rem]">
            We are writing the first posts now. In the meantime,{' '}
            <a href="/work" className="link-underline text-accent-deep">
              see what we have built
            </a>
            .
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div ref={ref} className="shell">
        {/* lead post */}
        <a
          data-reveal
          href={`/blog/${lead.slug}`}
          className="group grid gap-6 rounded-card border border-line bg-surface p-5 shadow-sm transition-colors hover:border-accent/40 sm:p-6 lg:grid-cols-[1.1fr_1fr] lg:items-center"
        >
          {lead.image && (
            <img
              src={`${lead.image}?w=1200&h=750&fit=fill&fm=webp&q=75`}
              alt={lead.imageAlt}
              width={1200}
              height={750}
              className="aspect-[16/10] w-full rounded-inner object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-[0.72rem] font-800 uppercase tracking-[0.08em] text-accent-deep">
              {lead.tags[0] ?? 'Article'}
            </p>
            <h2 className="t-h3 mt-2">{lead.title}</h2>
            <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-soft">
              {lead.description}
            </p>
            <p className="mt-4 text-[0.85rem] font-600 text-ink-faint">
              {lead.author} · {formatPostDate(lead.publishedDate)} · {lead.readingMinutes} min read
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[0.92rem] font-700 text-ink group-hover:text-accent-deep">
              Read the post <ArrowRight className="size-4" />
            </span>
          </div>
        </a>

        {/* the rest */}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <a
                data-reveal
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-card border border-line bg-surface p-5 shadow-sm transition-colors hover:border-accent/40"
              >
                {p.image && (
                  <img
                    src={`${p.image}?w=720&h=450&fit=fill&fm=webp&q=75`}
                    alt={p.imageAlt}
                    width={720}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/10] w-full rounded-inner object-cover"
                  />
                )}
                <p className="mt-4 text-[0.68rem] font-800 uppercase tracking-[0.08em] text-accent-deep">
                  {p.tags[0] ?? 'Article'}
                </p>
                <h3 className="mt-1.5 font-display text-[1.08rem] font-800 leading-snug tracking-[-0.01em] group-hover:text-accent-deep">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-ink-soft">
                  {p.description}
                </p>
                <p className="mt-auto pt-4 text-[0.8rem] font-600 text-ink-faint">
                  {formatPostDate(p.publishedDate)} · {p.readingMinutes} min read
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
