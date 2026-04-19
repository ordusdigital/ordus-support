import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/mdx'
import { getCategoryBySlug, getCategoriesByPriority } from '@/lib/categories'
import { formatDate, isNew } from '@/lib/utils'
import Breadcrumb from '@/components/Breadcrumb'
import BadgeNewUpdated from '@/components/BadgeNewUpdated'
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
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-xl text-text">
            Ordus System <span className="text-primary">Suporte</span>
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumb
          items={[
            { label: 'Suporte', href: '/' },
            { label: cat.name },
          ]}
        />

        <div className="mb-8 mt-6">
          <h1 className="font-display text-3xl font-bold text-text mb-2">{cat.name}</h1>
          <p className="text-text-muted">{cat.description}</p>
          <p className="text-text-muted text-sm mt-2">{articles.length} artigo{articles.length !== 1 ? 's' : ''}</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p>Artigos em preparação. Em breve disponíveis.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {articles.map(article => (
              <li key={article.slug}>
                <Link
                  href={`/${category}/${article.slug}`}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg bg-bg-card border border-border hover:border-primary hover:bg-bg-hover transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-text font-medium group-hover:text-primary transition-colors">
                        {article.frontmatter.title}
                      </span>
                      <BadgeNewUpdated date={article.frontmatter.lastUpdated} />
                    </div>
                    <p className="text-text-muted text-sm line-clamp-2">{article.frontmatter.description}</p>
                  </div>
                  <div className="shrink-0 text-xs text-text-muted mt-1">
                    {article.readingTime} min
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
