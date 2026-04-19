import Link from 'next/link'
import { getCategoryIcon } from '@/components/icons/CategoryIcons'
import type { Category } from '@/lib/categories'

interface CategoryWithCount extends Category {
  articleCount: number
}

interface Props {
  categories: CategoryWithCount[]
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map(cat => (
        <Link
          key={cat.slug}
          href={`/${cat.slug}`}
          className="group flex items-start gap-3 p-5 rounded-xl transition-all duration-200 hover:-translate-y-px"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
            style={{ background: 'rgba(154,17,233,0.08)' }}
          >
            {getCategoryIcon(cat.slug)}
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold leading-snug mb-1 transition-colors duration-200 group-hover:text-brand"
              style={{ color: '#0A0A0A' }}
            >
              {cat.name}
            </p>
            <p className="text-xs" style={{ color: '#6A6A6A' }}>
              {cat.articleCount > 0
                ? `${cat.articleCount} artigo${cat.articleCount !== 1 ? 's' : ''}`
                : 'Em breve'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
