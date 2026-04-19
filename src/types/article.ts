export interface ScreenshotStep {
  step: number
  description: string
  action: 'navigate' | 'click' | 'hover' | 'fill' | 'scroll'
  url?: string
  selector?: string
  highlight?: string
  annotation: string
}

export interface FAQ {
  q: string
  a: string
}

export interface ArticleFrontmatter {
  title: string
  description: string
  keywords: string[]
  category: string
  categorySlug: string
  ghlReference: string
  lastUpdated: string
  screenshotSteps: ScreenshotStep[]
  faqs: FAQ[]
  tags?: string[]
  priority?: 0 | 1 | 2 | 3
}

export interface Article {
  slug: string
  categorySlug: string
  frontmatter: ArticleFrontmatter
  content: string
  readingTime: number
}

export interface ArticleListItem {
  slug: string
  categorySlug: string
  frontmatter: ArticleFrontmatter
  readingTime: number
}

export interface GHLMapEntry {
  ghlUrl: string
  title: string
  categorySlug: string
  slug: string
  detectedAt: string
  publishedAt?: string
}

export type GHLMap = Record<string, GHLMapEntry>

export type TrackingStatus =
  | '⏳ Pendente'
  | '🔄 Gerando'
  | '📝 Gerado'
  | '📸 Screenshots'
  | '🔍 Em QA'
  | '✅ Publicado'
  | '❌ Erro'
  | '🔧 Revisão Manual'

export interface TrackingEntry {
  id: string
  titlePtBr: string
  category: string
  slug: string
  urlGhl: string
  prioridade: 0 | 1 | 2 | 3
  status: TrackingStatus
  geradoEm?: string
  screenshots?: number
  qa?: boolean
  publicadoEm?: string
  urlFinal?: string
  observacoes?: string
}

export type TrackingMap = Record<string, TrackingEntry>
