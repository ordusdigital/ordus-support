import { chromium } from 'playwright'
import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import type { ScreenshotStep, ArticleFrontmatter } from '../src/types/article'

const ORDUS_URL = process.env.ORDUS_SYSTEM_URL ?? ''
const DEMO_EMAIL = process.env.ORDUS_DEMO_EMAIL ?? ''
const DEMO_PASSWORD = process.env.ORDUS_DEMO_PASSWORD ?? ''
const PRIMARY_COLOR = '#7F2DC1'
const WATERMARK_TEXT = 'Ordus System'

interface PipelineOptions {
  articlePath: string
  categorySlug: string
  slug: string
  outputDir?: string
}

async function addAnnotations(
  inputBuffer: Buffer,
  stepNumber: number,
  highlightSelector?: string,
): Promise<Buffer> {
  const img = sharp(inputBuffer)
  const meta = await img.metadata()
  const w = meta.width ?? 1280
  const h = meta.height ?? 720

  // Watermark SVG overlay
  const watermark = Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${w - 180}" y="${h - 36}" width="170" height="28" rx="4" fill="rgba(127,45,193,0.15)"/>
      <text x="${w - 95}" y="${h - 17}" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.35)" text-anchor="middle">${WATERMARK_TEXT}</text>
      <circle cx="42" cy="42" r="20" fill="${PRIMARY_COLOR}"/>
      <text x="42" y="48" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${stepNumber}</text>
      <rect x="0" y="0" width="${w}" height="4" fill="${PRIMARY_COLOR}"/>
      <rect x="0" y="${h - 4}" width="${w}" height="4" fill="${PRIMARY_COLOR}"/>
      <rect x="0" y="0" width="4" height="${h}" fill="${PRIMARY_COLOR}"/>
      <rect x="${w - 4}" y="0" width="4" height="${h}" fill="${PRIMARY_COLOR}"/>
    </svg>
  `)

  return sharp(inputBuffer)
    .composite([{ input: watermark, top: 0, left: 0 }])
    .png()
    .toBuffer()
}

async function runPipeline(opts: PipelineOptions): Promise<{ success: boolean; screenshots: string[]; errors: string[] }> {
  const screenshots: string[] = []
  const errors: string[] = []

  // Read frontmatter from MDX
  const mdxContent = fs.readFileSync(opts.articlePath, 'utf-8')
  const fmMatch = mdxContent.match(/^---\n([\s\S]+?)\n---/)
  if (!fmMatch) {
    return { success: false, screenshots: [], errors: ['Frontmatter não encontrado'] }
  }

  // Parse screenshotSteps from YAML (simplified parser)
  const stepsMatch = mdxContent.match(/screenshotSteps:\n([\s\S]+?)(?=\nfaqs:|\n[a-z]+:|\n---)/m)
  if (!stepsMatch) {
    return { success: true, screenshots: [], errors: [] }
  }

  const outputDir = opts.outputDir ?? path.join(__dirname, `../public/screenshots/${opts.categorySlug}/${opts.slug}`)
  fs.mkdirSync(outputDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()

  try {
    // Login na subconta demo
    await page.goto(`${ORDUS_URL}/login`, { waitUntil: 'networkidle' })
    await page.fill('[name="email"], [type="email"]', DEMO_EMAIL)
    await page.fill('[name="password"], [type="password"]', DEMO_PASSWORD)
    await page.click('[type="submit"]')
    await page.waitForNavigation({ waitUntil: 'networkidle' })

    console.log('✅ Login realizado na subconta demo')
  } catch (e) {
    errors.push(`Falha no login: ${e}`)
    await browser.close()
    return { success: false, screenshots, errors }
  }

  // Process each screenshot step (parsed from YAML structure)
  let stepNum = 1
  const stepBlocks = stepsMatch[1].match(/  - step: (\d+)[\s\S]+?(?=  - step:|\Z)/g) ?? []

  for (const block of stepBlocks) {
    try {
      const urlMatch = block.match(/url: (.+)/)
      const actionMatch = block.match(/action: (.+)/)
      const selectorMatch = block.match(/selector: (.+)/)
      const annotationMatch = block.match(/annotation: (.+)/)

      const url = urlMatch?.[1]?.trim()
      const action = actionMatch?.[1]?.trim() ?? 'navigate'
      const selector = selectorMatch?.[1]?.trim()
      const annotation = annotationMatch?.[1]?.trim() ?? `Passo ${stepNum}`

      if (url && action === 'navigate') {
        await page.goto(`${ORDUS_URL}${url}`, { waitUntil: 'networkidle', timeout: 15000 })
      } else if (selector && action === 'click') {
        await page.click(selector)
        await page.waitForTimeout(500)
      } else if (selector && action === 'hover') {
        await page.hover(selector)
      }

      await page.waitForTimeout(800)

      const buffer = await page.screenshot({ type: 'png', fullPage: false })
      const annotated = await addAnnotations(buffer, stepNum)

      const filename = `step-${String(stepNum).padStart(2, '0')}.png`
      const outPath = path.join(outputDir, filename)
      fs.writeFileSync(outPath, annotated)
      screenshots.push(outPath)
      console.log(`📸 Screenshot ${stepNum}: ${filename}`)
      stepNum++
    } catch (e) {
      errors.push(`Erro no step ${stepNum}: ${e}`)
      stepNum++
    }
  }

  await browser.close()
  return { success: errors.length === 0, screenshots, errors }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    console.error('Uso: screenshot-pipeline.ts <articlePath> <categorySlug> <slug>')
    process.exit(1)
  }

  const [articlePath, categorySlug, slug] = args
  const result = await runPipeline({ articlePath, categorySlug, slug })

  console.log(result.success ? '✅ Screenshots gerados' : '❌ Falhas detectadas')
  result.errors.forEach(e => console.error(' •', e))
  process.exit(result.success ? 0 : 1)
}

main().catch(err => { console.error(err); process.exit(1) })
