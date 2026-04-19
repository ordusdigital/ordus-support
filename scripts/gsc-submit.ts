import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://suporte.ordussystem.com.br'
const GSC_KEY = process.env.GOOGLE_SEARCH_CONSOLE_KEY ?? ''

async function submitUrl(url: string): Promise<void> {
  const auth = new google.auth.GoogleAuth({
    keyFile: GSC_KEY,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })

  const client = await auth.getClient()
  const indexing = google.indexing({ version: 'v3', auth: client as never })

  await indexing.urlNotifications.publish({
    requestBody: { url, type: 'URL_UPDATED' },
  })
  console.log(`✅ Submetido ao GSC: ${url}`)
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length > 0) {
    for (const url of args) {
      await submitUrl(url.startsWith('http') ? url : `${SITE_URL}/${url}`)
    }
    return
  }

  // Submit all published articles from tracking
  const trackingPath = path.join(__dirname, '../content/_tracking.json')
  if (!fs.existsSync(trackingPath)) {
    console.log('Nenhum tracking encontrado')
    return
  }

  const trackingFile = JSON.parse(fs.readFileSync(trackingPath, 'utf-8'))
  // suporta { articles: { "cat/slug": { status, url } } } e TrackingMap flat
  const articlesMap: Record<string, { status: string; url?: string }> =
    trackingFile.articles ?? trackingFile

  const published = Object.entries(articlesMap).filter(
    ([, v]) => v.status === 'published' || v.status === '✅ Publicado'
  )

  console.log(`📤 Submetendo ${published.length} URLs ao Google Search Console...`)
  for (const [key, entry] of published) {
    const url = entry.url ?? `${SITE_URL}/${key}/`
    await submitUrl(url)
    await new Promise(r => setTimeout(r, 200))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
