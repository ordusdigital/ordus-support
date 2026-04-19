import { SITE_URL } from '@/lib/utils'
import type { ArticleFrontmatter } from '@/types/article'

interface Props {
  frontmatter: ArticleFrontmatter
  categorySlug: string
  slug: string
  categoryName: string
}

export default function AEOSchema({ frontmatter, categorySlug, slug, categoryName }: Props) {
  const articleUrl = `${SITE_URL}/${categorySlug}/${slug}`
  const ogImage = `${SITE_URL}/screenshots/${categorySlug}/${slug}/step-01.png`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        name: frontmatter.title,
        description: frontmatter.description,
        author: { '@type': 'Organization', name: 'Ordus System' },
        publisher: {
          '@type': 'Organization',
          name: 'Ordus Digital',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        dateModified: frontmatter.lastUpdated,
        mainEntityOfPage: articleUrl,
        image: ogImage,
      },
      {
        '@type': 'FAQPage',
        mainEntity: (frontmatter.faqs ?? []).map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Suporte', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: categoryName, item: `${SITE_URL}/${categorySlug}` },
          { '@type': 'ListItem', position: 3, name: frontmatter.title },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
