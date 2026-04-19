export function isNew(dateStr: string, days = 7): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diff <= days
}

export function isRecentlyUpdated(dateStr: string, days = 7): boolean {
  return isNew(dateStr, days)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://suporte.ordussystem.com.br'
