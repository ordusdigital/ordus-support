import Link from 'next/link'
import type { ArticleListItem } from '@/types/article'

interface Props {
  articles: ArticleListItem[]
}

export default function RelatedArticles({ articles }: Props) {
  if (!articles.length) return null

  return (
    <aside className="not-prose mt-10 pt-8 border-t border-border">
      <h3 className="font-display text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Artigos Relacionados
      </h3>
      <ul className="space-y-2">
        {articles.map(article => (
          <li key={`${article.categorySlug}/${article.slug}`}>
            <Link
              href={`/${article.categorySlug}/${article.slug}`}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group"
            >
              <svg className="w-3 h-3 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:underline">{article.frontmatter.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
