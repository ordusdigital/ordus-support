import Link from 'next/link'
import { getCategoryIcon } from '@/components/icons/CategoryIcons'
import type { Category } from '@/lib/categories'

interface CategoryWithCount extends Category {
  articleCount: number
}

interface Props {
  categories: CategoryWithCount[]
}

const PRIORITY_LABELS: Record<number, string> = {
  0: 'Essencial',
  1: 'Importante',
  2: 'Avançado',
  3: 'Técnico',
}

export default function CategoryGrid({ categories }: Props) {
  const grouped = [0, 1, 2, 3].map(p => ({
    priority: p,
    label: PRIORITY_LABELS[p],
    items: categories.filter(c => c.priority === p),
  })).filter(g => g.items.length > 0)

  return (
    <div className="space-y-10">
      {grouped.map(group => (
        <div key={group.priority}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-sm font-semibold text-text-muted uppercase tracking-wider">
              {group.label}
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.items.map(cat => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex items-start gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-primary hover:bg-bg-hover transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-hover flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text group-hover:text-primary transition-colors leading-snug">
                    {cat.name}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {cat.articleCount > 0 ? `${cat.articleCount} artigo${cat.articleCount !== 1 ? 's' : ''}` : 'Em breve'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
