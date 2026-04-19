import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllSlugs, getRelatedArticles } from '@/lib/mdx'
import { getCategoryBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import ArticleLayout from '@/components/ArticleLayout'
import AEOSchema from '@/components/AEOSchema'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ category: string; article: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(s => ({ category: s.category, article: s.article }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, article } = await params
  const data = getArticleBySlug(category, article)
  if (!data) return {}

  const { frontmatter } = data
  const ogImage = `${SITE_URL}/screenshots/${category}/${article}/step-01.png`

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${SITE_URL}/${category}/${article}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: frontmatter.lastUpdated,
    },
    alternates: {
      canonical: `${SITE_URL}/${category}/${article}`,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { category, article } = await params
  const data = getArticleBySlug(category, article)
  if (!data) notFound()

  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const related = getRelatedArticles(article, data.frontmatter.tags ?? [], 4)

  return (
    <>
      <AEOSchema
        frontmatter={data.frontmatter}
        categorySlug={category}
        slug={article}
        categoryName={cat.name}
      />
      <ArticleLayout
        article={data}
        category={cat}
        relatedArticles={related}
      />
    </>
  )
}
