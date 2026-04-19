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

  const tracking = JSON.parse(fs.readFileSync(trackingPath, 'utf-8'))
  const published = Object.values(tracking).filter((e: never) => (e as { status: string }).status === '✅ Publicado')

  console.log(`📤 Submetendo ${published.length} URLs ao Google Search Console...`)
  for (const entry of published as Array<{ urlFinal?: string; categorySlug: string; slug: string }>) {
    const url = entry.urlFinal ?? `${SITE_URL}/${entry.categorySlug}/${entry.slug}`
    await submitUrl(url)
    await new Promise(r => setTimeout(r, 200))
  }
}

main().catch(err => { console.error(err); process.exit(1) })
