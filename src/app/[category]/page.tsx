import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/mdx'
import { getCategoryBySlug, getCategoriesByPriority } from '@/lib/categories'
import { formatDate } from '@/lib/utils'
import Breadcrumb from '@/components/Breadcrumb'
import BadgeNewUpdated from '@/components/BadgeNewUpdated'
import { getCategoryIcon } from '@/components/icons/CategoryIcons'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return getCategoriesByPriority().map(c => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return {}
  return {
    title: `${cat.name} — Suporte Ordus System`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const articles = getArticlesByCategory(category).sort(
    (a, b) => new Date(b.frontmatter.lastUpdated).getTime() - new Date(a.frontmatter.lastUpdated).getTime()
  )

  return (
    <main>
      {/* Dark header strip */}
      <section
        className="bg-isotipo-grid border-b border-border pt-20 pb-12 px-6"
        style={{ background: '#0A0A0A' }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Suporte', href: '/' },
              { label: cat.name },
            ]}
          />
          <div className="flex items-center gap-4 mt-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(154,17,233,0.12)', border: '1px solid rgba(154,17,233,0.20)' }}
            >
              {getCategoryIcon(cat.slug)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-text">{cat.name}</h1>
              <p className="text-text-muted text-sm mt-0.5">
                {articles.length} artigo{articles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {cat.description && (
            <p className="text-text-muted mt-4 max-w-2xl">{cat.description}</p>
          )}
        </div>
      </section>

      {/* Light article list */}
      <section className="py-12 px-6 min-h-[50vh]" style={{ background: '#F5F5F5' }}>
        <div className="max-w-4xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#6A6A6A' }}>
              <p>Artigos em preparação. Em breve disponíveis.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {articles.map(article => (
                <li key={article.slug}>
                  <Link
                    href={`/${category}/${article.slug}`}
                    className="group flex items-start justify-between gap-4 p-5 rounded-xl transition-all duration-200 hover:-translate-y-px"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="font-medium transition-colors group-hover:text-brand"
                          style={{ color: '#0A0A0A', fontSize: '0.9375rem' }}
                        >
                          {article.frontmatter.title}
                        </span>
                        <BadgeNewUpdated date={article.frontmatter.lastUpdated} />
                      </div>
                      <p className="text-sm line-clamp-2" style={{ color: '#6A6A6A' }}>
                        {article.frontmatter.description}
                      </p>
                      <p className="text-xs mt-2" style={{ color: 'rgba(106,106,106,0.70)' }}>
                        Atualizado em {formatDate(article.frontmatter.lastUpdated)}
                      </p>
                    </div>
                    <div
                      className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-pill mt-1"
                      style={{ background: 'rgba(154,17,233,0.08)', color: 'var(--color-brand-mid)' }}
                    >
                      {article.readingTime} min
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Dark footer */}
      <footer className="bg-bg border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <span>© {new Date().getFullYear()} Ordus Digital — Todos os direitos reservados</span>
          <div className="flex gap-6">
            <a href="https://ordussystem.com.br" className="hover:text-text transition-colors">Plataforma</a>
            <a href="https://ordusdigital.com.br" className="hover:text-text transition-colors">Ordus Digital</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
