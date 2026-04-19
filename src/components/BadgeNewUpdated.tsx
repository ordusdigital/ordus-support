import { isNew } from '@/lib/utils'

interface Props {
  date: string
}

export default function BadgeNewUpdated({ date }: Props) {
  const fresh = isNew(date, 7)
  const recent = !fresh && isNew(date, 30)

  if (!fresh && !recent) return null

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill text-xs font-semibold"
      style={{
        background: 'rgba(154,17,233,0.10)',
        border: '1px solid rgba(154,17,233,0.22)',
        color: 'var(--color-brand-mid)',
        letterSpacing: '0.04em',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-dot-pulse"
        style={{ background: 'var(--color-brand)' }}
      />
      {fresh ? 'Novo' : 'Atualizado'}
    </span>
  )
}
