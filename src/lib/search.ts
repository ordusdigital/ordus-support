import Fuse from 'fuse.js'
import type { ArticleListItem } from '@/types/article'

export interface SearchResult {
  item: ArticleListItem
  score: number
}

let fuseInstance: Fuse<ArticleListItem> | null = null

export function buildSearchIndex(articles: ArticleListItem[]): Fuse<ArticleListItem> {
  fuseInstance = new Fuse(articles, {
    keys: [
      { name: 'frontmatter.title', weight: 0.5 },
      { name: 'frontmatter.description', weight: 0.3 },
      { name: 'frontmatter.keywords', weight: 0.15 },
      { name: 'frontmatter.category', weight: 0.05 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  })
  return fuseInstance
}

export function searchArticles(query: string, articles: ArticleListItem[]): SearchResult[] {
  if (!query.trim()) return []
  const fuse = fuseInstance ?? buildSearchIndex(articles)
  return fuse.search(query).map(r => ({ item: r.item, score: r.score ?? 1 }))
}
