'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Breadcrumb from '@/components/Breadcrumb'
import FAQAccordion from '@/components/FAQAccordion'
import StepByStep from '@/components/StepByStep'
import RelatedArticles from '@/components/RelatedArticles'
import BadgeNewUpdated from '@/components/BadgeNewUpdated'
import { formatDate } from '@/lib/utils'
import type { Article, ArticleListItem } from '@/types/article'
import type { Category } from '@/lib/categories'

interface Props {
  article: Article
  category: Category
  relatedArticles: ArticleListItem[]
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="font-display text-xl font-bold text-text mt-8 mb-3 scroll-mt-20" />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="font-display text-lg font-semibold text-text mt-6 mb-2 scroll-mt-20" />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} className="rounded-lg border border-border w-full my-4" loading="lazy" />
  ),
}

function ReadingProgress() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setWidth(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      id="reading-progress"
      style={{ width: `${width}%` }}
    />
  )
}

export default function ArticleLayout({ article, category, relatedArticles }: Props) {
  const { frontmatter, content, readingTime } = article

  return (
    <div className="min-h-screen bg-bg">
      <ReadingProgress />

      <header className="border-b border-border sticky top-0 bg-bg/95 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-text">
            Ordus System <span className="text-primary">Suporte</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-10">
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              {category.name}
            </p>
            <Link
              href={`/${category.slug}`}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-4"
            >
              ← Todos os artigos
            </Link>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <Breadcrumb
            items={[
              { label: 'Suporte', href: '/' },
              { label: category.name, href: `/${category.slug}` },
              { label: frontmatter.title },
            ]}
          />

          <div className="mt-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-text-muted">{category.name}</span>
              <BadgeNewUpdated date={frontmatter.lastUpdated} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text leading-tight mb-4">
              {frontmatter.title}
            </h1>
            <p className="text-text-muted text-lg leading-relaxed mb-4">{frontmatter.description}</p>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span>Atualizado em {formatDate(frontmatter.lastUpdated)}</span>
              <span>·</span>
              <span>{readingTime} min de leitura</span>
            </div>
          </div>

          {frontmatter.screenshotSteps?.length > 0 && (
            <StepByStep
              steps={frontmatter.screenshotSteps}
              categorySlug={article.categorySlug}
              slug={article.slug}
            />
          )}

          <article className="prose prose-sm max-w-none">
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          {frontmatter.faqs?.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-bold text-text mb-4">Perguntas Frequentes</h2>
              <FAQAccordion faqs={frontmatter.faqs} />
            </section>
          )}

          <RelatedArticles articles={relatedArticles} />
        </main>

        <aside className="hidden xl:block w-48 shrink-0">
          <div className="sticky top-24 text-xs text-text-muted">
            <p className="font-semibold uppercase tracking-wider mb-3">Nesta página</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
