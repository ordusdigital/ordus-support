import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Article, ArticleListItem, ArticleFrontmatter } from '@/types/article'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function parseFrontmatter(raw: Record<string, unknown>): ArticleFrontmatter {
  return {
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    keywords: Array.isArray(raw.keywords) ? raw.keywords.map(String) : [],
    category: String(raw.category ?? ''),
    categorySlug: String(raw.categorySlug ?? ''),
    ghlReference: String(raw.ghlReference ?? ''),
    lastUpdated: String(raw.lastUpdated ?? ''),
    screenshotSteps: Array.isArray(raw.screenshotSteps) ? raw.screenshotSteps : [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    priority: (raw.priority as 0 | 1 | 2 | 3) ?? 3,
  }
}

export function getAllArticles(): ArticleListItem[] {
  const articles: ArticleListItem[] = []

  if (!fs.existsSync(CONTENT_DIR)) return articles

  const categories = fs.readdirSync(CONTENT_DIR).filter(f => {
    const full = path.join(CONTENT_DIR, f)
    return fs.statSync(full).isDirectory() && !f.startsWith('_')
  })

  for (const categorySlug of categories) {
    const categoryDir = path.join(CONTENT_DIR, categorySlug)
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(categoryDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const rt = readingTime(content)

      articles.push({
        slug,
        categorySlug,
        frontmatter: parseFrontmatter(data),
        readingTime: Math.ceil(rt.minutes),
      })
    }
  }

  return articles
}

export function getArticlesByCategory(categorySlug: string): ArticleListItem[] {
  return getAllArticles().filter(a => a.categorySlug === categorySlug)
}

export function getArticleBySlug(categorySlug: string, slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, categorySlug, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)

  return {
    slug,
    categorySlug,
    frontmatter: parseFrontmatter(data),
    content,
    readingTime: Math.ceil(rt.minutes),
  }
}

export function getAllSlugs(): Array<{ category: string; article: string }> {
  return getAllArticles().map(a => ({ category: a.categorySlug, article: a.slug }))
}

export function getRelatedArticles(currentSlug: string, tags: string[], limit = 4): ArticleListItem[] {
  return getAllArticles()
    .filter(a => a.slug !== currentSlug && a.frontmatter.tags?.some(t => tags.includes(t)))
    .slice(0, limit)
}
