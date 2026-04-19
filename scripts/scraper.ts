import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import { parseStringPromise } from 'xml2js'
import type { GHLMap, GHLMapEntry } from '../src/types/article'
import { CATEGORIES } from '../src/lib/categories'

const GHL_SITEMAP = 'https://help.gohighlevel.com/sitemap.xml'
const OUTPUT_PATH = path.join(__dirname, '../content/_ghl_map.json')

const CATEGORY_SLUGS: Record<string, string> = {
  'getting-started': 'primeiros-passos',
  'contacts': 'contatos',
  'pipelines': 'pipelines',
  'automations': 'automacoes',
  'funnels': 'funis-e-sites',
  'websites': 'funis-e-sites',
  'calendars': 'agendamentos',
  'appointments': 'agendamentos',
  'email': 'email',
  'phone': 'telefonia',
  'ai': 'funcionario-ia',
  'agency': 'visao-agencia',
  'saas': 'configurador-saas',
  'social': 'redes-sociais',
  'reputation': 'reputacao',
  'reporting': 'relatorios',
  'analytics': 'relatorios',
  'integrations': 'integracoes',
  'billing': 'cobranca',
  'mobile': 'app-mobile',
  'api': 'api',
  'support': 'suporte-ao-cliente',
}

function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function guessCategory(url: string): string {
  const parts = url.split('/').filter(Boolean)
  for (const part of parts) {
    for (const [key, slug] of Object.entries(CATEGORY_SLUGS)) {
      if (part.toLowerCase().includes(key)) return slug
    }
  }
  return 'primeiros-passos'
}

function urlToSlug(url: string): string {
  const parts = url.split('/').filter(Boolean)
  const last = parts[parts.length - 1] ?? 'artigo'
  return last.replace(/[^a-z0-9-]/gi, '-').toLowerCase().slice(0, 80)
}

async function main() {
  console.log('🔍 Buscando sitemap GHL...')
  const xml = await fetch(GHL_SITEMAP)
  const parsed = await parseStringPromise(xml)
  const urls: string[] = parsed.urlset?.url?.map((u: { loc: string[] }) => u.loc[0]) ?? []

  const articleUrls = urls.filter(u =>
    u.includes('/en/articles/') || u.includes('/support/')
  )

  console.log(`📝 ${articleUrls.length} artigos encontrados`)

  let existing: GHLMap = {}
  if (fs.existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'))
  }

  let added = 0
  for (const url of articleUrls) {
    if (existing[url]) continue

    const categorySlug = guessCategory(url)
    const slug = urlToSlug(url)

    const entry: GHLMapEntry = {
      ghlUrl: url,
      title: '',
      categorySlug,
      slug,
      detectedAt: new Date().toISOString(),
    }
    existing[url] = entry
    added++
  }

  const contentDir = path.join(__dirname, '../content')
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(existing, null, 2))

  console.log(`✅ _ghl_map.json atualizado: ${added} novos, ${Object.keys(existing).length} total`)
}

main().catch(err => { console.error('❌', err); process.exit(1) })
