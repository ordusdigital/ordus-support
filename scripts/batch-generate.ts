import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import { execSync } from 'child_process'
import { CATEGORIES } from '../src/lib/categories'
import type { GHLMap, GHLMapEntry } from '../src/types/article'

// ─── Config ───────────────────────────────────────────────────────────────────

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE ?? '10')
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? ''
const CONTENT_DIR = path.join(__dirname, '../content')
const GHL_MAP_PATH = path.join(CONTENT_DIR, '_ghl_map.json')
const TRACKING_PATH = path.join(CONTENT_DIR, '_tracking.json')
const TODAY = new Date().toISOString().slice(0, 10)

const FORBIDDEN_TERMS = ['HighLevel', 'GoHighLevel', 'GHL', 'gohighlevel', 'go high level', 'Highlevel']

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function httpGet(url: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http')
    const req = mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', ...headers } }, (res: any) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpGet(res.headers.location!, headers).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', (c: string) => (data += c))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function httpsPost(body: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', c => (data += c))
      res.on('end', () => resolve(data))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Claude API timeout')) })
    req.write(body)
    req.end()
  })
}

// ─── GHL scraping ─────────────────────────────────────────────────────────────

function extractTextFromHtml(html: string): string {
  // Remove scripts, styles, nav, header, footer
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')

  // Try to extract article body
  const articleMatch = text.match(/<article[\s\S]*?<\/article>/i)
    ?? text.match(/class="[^"]*article[^"]*"[\s\S]*?<\/div>/i)
    ?? text.match(/class="[^"]*intercom[^"]*article[^"]*"[\s\S]*?<\/section>/i)

  if (articleMatch) text = articleMatch[0]

  // Strip remaining HTML tags and decode entities
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)
}

function extractTitleFromHtml(html: string): string {
  const match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    ?? html.match(/<title>([^<|]+)/i)
  return match?.[1]?.trim() ?? ''
}

async function scrapeGhlArticle(url: string): Promise<{ title: string; text: string }> {
  const html = await httpGet(url)
  return {
    title: extractTitleFromHtml(html),
    text: extractTextFromHtml(html),
  }
}

// ─── Claude content generation ────────────────────────────────────────────────

function getCategoryName(slug: string): string {
  return CATEGORIES.find(c => c.slug === slug)?.name ?? slug
}

async function generateMdxWithClaude(
  ghlUrl: string,
  ghlTitle: string,
  ghlText: string,
  categorySlug: string,
  slug: string,
): Promise<string> {
  const categoryName = getCategoryName(categorySlug)

  const prompt = `Você é redator técnico do Ordus System, uma plataforma CRM.
Com base no conteúdo abaixo de um artigo de ajuda (em inglês), crie um artigo completo em português brasileiro (PT-BR) para o portal de suporte em formato MDX.

REGRAS OBRIGATÓRIAS:
- NUNCA mencione "HighLevel", "GoHighLevel", "GHL" ou qualquer variante — use SEMPRE "Ordus System"
- Escreva em PT-BR fluente e profissional
- Adapte caminhos de menu e nomes de funcionalidades para o contexto Ordus System
- Gere entre 6 e 10 passos no Passo a Passo
- Gere exatamente 4 Perguntas Frequentes relevantes
- Inclua 3 links de Próximos Passos (use caminhos como /categoria/artigo, inventando slugs coerentes)
- Saída APENAS o bloco MDX, sem explicações adicionais

ARTIGO ORIGINAL (EN):
URL: ${ghlUrl}
Título: ${ghlTitle}
Conteúdo: ${ghlText.slice(0, 6000)}

FORMATO DE SAÍDA EXATO (copie a estrutura, preencha os valores):
---
title: "TITULO EM PT-BR"
description: "DESCRICAO DE 1 LINHA EM PT-BR (máx 160 chars)"
keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
category: "${categoryName}"
categorySlug: "${categorySlug}"
ghlReference: "${ghlUrl}"
lastUpdated: "${TODAY}"
screenshotSteps: []
faqs: []
priority: 2
---

PARAGRAFO INTRODUTORIO (2-3 frases explicando o que é e para que serve).

SEGUNDO PARAGRAFO (contexto de quando/por que usar esse recurso no Ordus System).

## Passo a Passo

1. **Passo**: Descrição do passo.

2. **Passo**: Descrição do passo.

[continue até 6-10 passos]

## Perguntas Frequentes

**Pergunta 1?**
Resposta completa em 2-3 frases.

**Pergunta 2?**
Resposta completa em 2-3 frases.

**Pergunta 3?**
Resposta completa em 2-3 frases.

**Pergunta 4?**
Resposta completa em 2-3 frases.

## Próximos Passos

- [Título do artigo relacionado 1](/categoria/slug-do-artigo)
- [Título do artigo relacionado 2](/categoria/slug-do-artigo)
- [Título do artigo relacionado 3](/categoria/slug-do-artigo)`

  const requestBody = JSON.stringify({
    model: 'claude-opus-4-7',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = await httpsPost(requestBody)
  const parsed = JSON.parse(raw)

  if (parsed.error) throw new Error(`Claude API error: ${JSON.stringify(parsed.error)}`)

  const mdx = parsed.content?.[0]?.text ?? ''
  if (!mdx.startsWith('---')) throw new Error('Claude retornou formato inválido (sem frontmatter)')

  return mdx
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateMdx(mdx: string): { ok: boolean; issues: string[] } {
  const issues: string[] = []

  for (const term of FORBIDDEN_TERMS) {
    if (new RegExp(term, 'i').test(mdx)) issues.push(`Termo proibido: "${term}"`)
  }
  if (!mdx.includes('Ordus System')) issues.push('"Ordus System" não encontrado')
  if (!mdx.startsWith('---')) issues.push('Frontmatter ausente')
  if (!mdx.includes('## Passo a Passo')) issues.push('Seção "Passo a Passo" ausente')
  if (!mdx.includes('## Perguntas Frequentes')) issues.push('Seção "Perguntas Frequentes" ausente')

  return { ok: issues.length === 0, issues }
}

// ─── Tracking ─────────────────────────────────────────────────────────────────

interface TrackingFile {
  lastUpdated: string
  articles: Record<string, {
    status: string
    priority: number
    publishedAt: string
    url?: string
    ghlUrl?: string
    error?: string
  }>
  summary: {
    total: number
    published: number
    pending: number
    p0_complete: number
    p1_complete: number
  }
}

function loadTracking(): TrackingFile {
  if (!fs.existsSync(TRACKING_PATH)) {
    return { lastUpdated: TODAY, articles: {}, summary: { total: 0, published: 0, pending: 0, p0_complete: 0, p1_complete: 0 } }
  }
  try {
    return JSON.parse(fs.readFileSync(TRACKING_PATH, 'utf-8'))
  } catch {
    return { lastUpdated: TODAY, articles: {}, summary: { total: 0, published: 0, pending: 0, p0_complete: 0, p1_complete: 0 } }
  }
}

function saveTracking(tracking: TrackingFile): void {
  const published = Object.values(tracking.articles).filter(a => a.status === 'published').length
  const total = Object.keys(tracking.articles).length
  const p0 = Object.values(tracking.articles).filter(a => a.status === 'published' && a.priority === 0).length
  const p1 = Object.values(tracking.articles).filter(a => a.status === 'published' && a.priority === 1).length

  tracking.lastUpdated = TODAY
  tracking.summary = { total, published, pending: total - published, p0_complete: p0, p1_complete: p1 }

  fs.writeFileSync(TRACKING_PATH, JSON.stringify(tracking, null, 2))
}

// ─── GHL map ─────────────────────────────────────────────────────────────────

function loadGhlMap(): GHLMap {
  if (!fs.existsSync(GHL_MAP_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(GHL_MAP_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function getPriority(categorySlug: string): number {
  return CATEGORIES.find(c => c.slug === categorySlug)?.priority ?? 3
}

// ─── Pending selection ────────────────────────────────────────────────────────

function selectPending(ghlMap: GHLMap, tracking: TrackingFile, count: number): GHLMapEntry[] {
  const publishedKeys = new Set(
    Object.entries(tracking.articles)
      .filter(([, v]) => v.status === 'published')
      .map(([k]) => k)
  )

  const pending = Object.values(ghlMap).filter(entry => {
    const key = `${entry.categorySlug}/${entry.slug}`
    return !publishedKeys.has(key)
  })

  // Sort by category priority (P0 first), then by detectedAt
  pending.sort((a, b) => {
    const pa = getPriority(a.categorySlug)
    const pb = getPriority(b.categorySlug)
    if (pa !== pb) return pa - pb
    return a.detectedAt.localeCompare(b.detectedAt)
  })

  return pending.slice(0, count)
}

// ─── Run scraper ──────────────────────────────────────────────────────────────

async function refreshGhlMap(): Promise<number> {
  console.log('🔍 Atualizando _ghl_map.json via scraper...')
  try {
    execSync('npx ts-node --project tsconfig.scripts.json scripts/scraper.ts', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    })
    const map = loadGhlMap()
    return Object.keys(map).length
  } catch (e) {
    console.warn('⚠️  Scraper falhou, usando _ghl_map.json existente')
    return Object.keys(loadGhlMap()).length
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY não definida')
    process.exit(1)
  }

  // 1. Refresh GHL map
  const totalGhl = await refreshGhlMap()
  console.log(`📊 Total de artigos GHL mapeados: ${totalGhl}`)

  const ghlMap = loadGhlMap()
  const tracking = loadTracking()

  // 2. Find pending
  const pending = selectPending(ghlMap, tracking, BATCH_SIZE)

  if (pending.length === 0) {
    const published = Object.values(tracking.articles).filter(a => a.status === 'published').length
    console.log(`\n🎉 TODOS OS ARTIGOS PUBLICADOS! Total: ${published}/${totalGhl}`)
    console.log('✅ Portal em modo de monitoramento — aguardando novos artigos no GHL.')
    process.exit(0)
  }

  console.log(`\n📝 Processando ${pending.length} artigos neste batch:\n`)
  pending.forEach((e, i) => console.log(`  ${i + 1}. [${e.categorySlug}] ${e.ghlUrl}`))
  console.log('')

  // 3. Generate each article
  let generated = 0
  let failed = 0

  for (const entry of pending) {
    const key = `${entry.categorySlug}/${entry.slug}`
    const outDir = path.join(CONTENT_DIR, entry.categorySlug)
    const outFile = path.join(outDir, `${entry.slug}.mdx`)

    // Skip if MDX already exists and is published
    if (fs.existsSync(outFile) && tracking.articles[key]?.status === 'published') {
      console.log(`⏭️  Pulando ${key} (já existe)`)
      continue
    }

    console.log(`\n⚙️  Gerando: ${entry.ghlUrl}`)

    try {
      // Fetch GHL content
      const { title, text } = await scrapeGhlArticle(entry.ghlUrl)
      if (text.length < 100) throw new Error('Conteúdo GHL muito curto ou inacessível')

      console.log(`   📄 Scrape OK: "${title}" (${text.length} chars)`)

      // Generate MDX
      const mdx = await generateMdxWithClaude(
        entry.ghlUrl,
        title || entry.title,
        text,
        entry.categorySlug,
        entry.slug,
      )

      // Validate
      const { ok, issues } = validateMdx(mdx)
      if (!ok) {
        console.warn(`   ⚠️  Validação falhou: ${issues.join(', ')}`)
        tracking.articles[key] = {
          status: 'error',
          priority: getPriority(entry.categorySlug),
          publishedAt: '',
          ghlUrl: entry.ghlUrl,
          error: issues.join('; '),
        }
        failed++
        continue
      }

      // Write file
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(outFile, mdx)

      // Update tracking
      tracking.articles[key] = {
        status: 'published',
        priority: getPriority(entry.categorySlug),
        publishedAt: TODAY,
        url: `https://suporte.ordussystem.com.br/${key}/`,
        ghlUrl: entry.ghlUrl,
      }

      console.log(`   ✅ Salvo: content/${key}.mdx`)
      generated++

      // Rate limit: 2s between Claude calls
      if (generated < pending.length) await new Promise(r => setTimeout(r, 2000))

    } catch (err: any) {
      console.error(`   ❌ Erro: ${err.message}`)
      tracking.articles[key] = {
        status: 'error',
        priority: getPriority(entry.categorySlug),
        publishedAt: '',
        ghlUrl: entry.ghlUrl,
        error: err.message,
      }
      failed++
    }
  }

  // 4. Save tracking
  saveTracking(tracking)

  // 5. Summary
  const totalPublished = Object.values(tracking.articles).filter(a => a.status === 'published').length
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Batch concluído
   Gerados:    ${generated}
   Erros:      ${failed}
   Publicados: ${totalPublished}/${totalGhl} artigos GHL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  if (generated === 0 && failed > 0) process.exit(1)
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
