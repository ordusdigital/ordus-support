import { isNew } from '@/lib/utils'

interface Props {
  date: string
}

export default function BadgeNewUpdated({ date }: Props) {
  if (!isNew(date, 7)) return null

  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
      Novo
    </span>
  )
}
