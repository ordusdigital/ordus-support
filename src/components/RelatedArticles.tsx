import Link from 'next/link'
import type { ArticleListItem } from '@/types/article'

interface Props {
  articles: ArticleListItem[]
}

export default function RelatedArticles({ articles }: Props) {
  if (!articles.length) return null

  return (
    <aside className="not-prose mt-12 pt-10 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-5"
        style={{ color: '#6A6A6A', letterSpacing: '0.10em' }}
      >
        Artigos Relacionados
      </h3>
      <ul className="space-y-2">
        {articles.map(article => (
          <li key={`${article.categorySlug}/${article.slug}`}>
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="group flex items-center gap-2.5 p-3.5 rounded-lg transition-all duration-200"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <svg
                className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: 'var(--color-brand)' }}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span
                className="text-sm font-medium transition-colors group-hover:text-brand"
                style={{ color: '#0A0A0A' }}
              >
                {article.frontmatter.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
