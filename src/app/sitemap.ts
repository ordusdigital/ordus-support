import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/mdx'
import { getCategoriesByPriority } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const categories = getCategoriesByPriority()

  const articleUrls: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${SITE_URL}/${a.categorySlug}/${a.slug}`,
    lastModified: new Date(a.frontmatter.lastUpdated),
    changeFrequency: 'weekly',
    priority: a.frontmatter.priority === 0 ? 0.9 : a.frontmatter.priority === 1 ? 0.8 : 0.7,
  }))

  const categoryUrls: MetadataRoute.Sitemap = categories.map(c => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...categoryUrls,
    ...articleUrls,
  ]
}
