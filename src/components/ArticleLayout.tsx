import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Breadcrumb from '@/components/Breadcrumb'
import FAQAccordion from '@/components/FAQAccordion'
import StepByStep from '@/components/StepByStep'
import RelatedArticles from '@/components/RelatedArticles'
import BadgeNewUpdated from '@/components/BadgeNewUpdated'
import TableOfContents from '@/components/TableOfContents'
import ReadingProgress from '@/components/ReadingProgress'
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
    <h2 {...props} className="font-display text-xl font-bold mt-8 mb-3 scroll-mt-24" style={{ color: '#0A0A0A' }} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="font-display text-lg font-semibold mt-6 mb-2 scroll-mt-24" style={{ color: '#0A0A0A' }} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} className="rounded-lg w-full my-4" style={{ border: '1px solid rgba(0,0,0,0.08)' }} loading="lazy" />
  ),
}

export default function ArticleLayout({ article, category, relatedArticles }: Props) {
  const { frontmatter, content, readingTime } = article

  return (
    <div className="min-h-screen">
      <ReadingProgress />

      {/* Dark article header */}
      <section
        className="bg-isotipo-grid border-b border-border pt-20 pb-12 px-6"
        style={{ background: '#0A0A0A' }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Suporte', href: '/' },
              { label: category.name, href: `/${category.slug}` },
              { label: frontmatter.title },
            ]}
          />

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-pill"
                style={{ background: 'rgba(154,17,233,0.12)', color: 'var(--color-brand-light)', border: '1px solid rgba(154,17,233,0.20)' }}
              >
                {category.name}
              </span>
              <BadgeNewUpdated date={frontmatter.lastUpdated} />
            </div>

            <h1
              className="font-display font-bold text-text leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              {frontmatter.title}
            </h1>

            <p className="text-text-muted text-lg leading-relaxed mb-5 max-w-2xl">
              {frontmatter.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span>Atualizado em {formatDate(frontmatter.lastUpdated)}</span>
              <span>·</span>
              <span>{readingTime} min de leitura</span>
              <span>·</span>
              <Link href={`/${category.slug}`} className="hover:text-text transition-colors">
                ← {category.name}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Light content area */}
      <section className="px-6 py-12" style={{ background: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto flex gap-10">
          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {frontmatter.screenshotSteps?.length > 0 && (
              <div className="mb-10">
                <StepByStep
                  steps={frontmatter.screenshotSteps}
                  categorySlug={article.categorySlug}
                  slug={article.slug}
                />
              </div>
            )}

            <article className="prose-light">
              <MDXRemote source={content} components={mdxComponents} />
            </article>

            {frontmatter.faqs?.length > 0 && (
              <section className="mt-12 pt-10 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <h2 className="font-display text-xl font-bold mb-6" style={{ color: '#0A0A0A' }}>
                  Perguntas Frequentes
                </h2>
                <FAQAccordion faqs={frontmatter.faqs} />
              </section>
            )}

            <RelatedArticles articles={relatedArticles} />
          </main>

          {/* TOC sidebar */}
          <aside className="hidden xl:block w-52 shrink-0">
            <TableOfContents content={content} />
          </aside>
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
    </div>
  )
}
