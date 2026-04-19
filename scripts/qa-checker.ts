import * as fs from 'fs'
import * as path from 'path'

const FORBIDDEN_TERMS = [
  'HighLevel', 'GoHighLevel', 'GHL', 'gohighlevel', 'go high level',
  'Highlevel', 'highlevel', 'High Level', 'high level',
]

const REQUIRED_FRONTMATTER = [
  'title', 'description', 'keywords', 'category', 'categorySlug',
  'ghlReference', 'lastUpdated', 'screenshotSteps', 'faqs',
]

interface QAResult {
  passed: boolean
  issues: string[]
  warnings: string[]
}

export function checkArticle(filePath: string): QAResult {
  const issues: string[] = []
  const warnings: string[] = []

  if (!fs.existsSync(filePath)) {
    return { passed: false, issues: [`Arquivo não encontrado: ${filePath}`], warnings: [] }
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // 1. Verifica frontmatter
  if (!content.startsWith('---')) {
    issues.push('Frontmatter ausente — deve começar com ---')
  } else {
    const fmEnd = content.indexOf('---', 3)
    if (fmEnd === -1) {
      issues.push('Frontmatter não fechado')
    } else {
      const fmContent = content.slice(3, fmEnd)
      for (const field of REQUIRED_FRONTMATTER) {
        if (!fmContent.includes(`${field}:`)) {
          issues.push(`Campo obrigatório ausente no frontmatter: ${field}`)
        }
      }
    }
  }

  // 2. Verifica termos proibidos (case-sensitive e insensitive)
  for (const term of FORBIDDEN_TERMS) {
    const regex = new RegExp(term, 'gi')
    const matches = content.match(regex)
    if (matches) {
      issues.push(`Termo proibido "${term}" encontrado ${matches.length}x no arquivo`)
    }
  }

  // 3. Verifica "Ordus System" presente no conteúdo
  if (!content.includes('Ordus System')) {
    issues.push('"Ordus System" não encontrado no conteúdo')
  }

  // 4. Verifica tamanho mínimo
  const bodyStart = content.indexOf('---', 3)
  if (bodyStart !== -1) {
    const body = content.slice(bodyStart + 3).trim()
    const wordCount = body.split(/\s+/).length
    if (wordCount < 300) {
      warnings.push(`Conteúdo curto: ${wordCount} palavras (mínimo recomendado: 800)`)
    }
    if (wordCount < 100) {
      issues.push(`Conteúdo insuficiente: ${wordCount} palavras`)
    }
  }

  // 5. Verifica se tem FAQs no conteúdo
  if (!content.includes('## Perguntas Frequentes') && !content.includes('## FAQ')) {
    warnings.push('Seção de FAQs não encontrada no corpo do artigo')
  }

  // 6. Verifica referências de screenshots
  const screenshotRefs = (content.match(/step-\d+\.png/g) ?? []).length
  if (screenshotRefs === 0) {
    warnings.push('Nenhuma referência a screenshot encontrada')
  }

  // 7. Verifica título não muito curto
  const titleMatch = content.match(/^title:\s*"?(.+)"?\s*$/m)
  if (titleMatch) {
    const title = titleMatch[1].trim()
    if (title.length < 20) {
      warnings.push(`Título muito curto: "${title}"`)
    }
    if (!title.includes('Ordus')) {
      warnings.push('Título não menciona "Ordus System"')
    }
  }

  // 8. Description entre 150-160 chars
  const descMatch = content.match(/^description:\s*"?(.+)"?\s*$/m)
  if (descMatch) {
    const desc = descMatch[1].trim()
    if (desc.length > 160) {
      warnings.push(`Description muito longa: ${desc.length} chars (máx 160)`)
    }
    if (desc.length < 100) {
      warnings.push(`Description muito curta: ${desc.length} chars (mín 150)`)
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  }
}

function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    // Verifica todos os artigos
    const contentDir = path.join(__dirname, '../content')
    const allIssues: Array<{ file: string; result: QAResult }> = []

    const scan = (dir: string) => {
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry)
        if (fs.statSync(full).isDirectory()) { scan(full); continue }
        if (!entry.endsWith('.mdx')) continue
        const result = checkArticle(full)
        const rel = path.relative(contentDir, full)
        allIssues.push({ file: rel, result })
      }
    }
    if (fs.existsSync(contentDir)) scan(contentDir)

    const failed = allIssues.filter(a => !a.result.passed)
    const warned = allIssues.filter(a => a.result.warnings.length > 0)

    console.log(`\n📋 QA Report — ${allIssues.length} artigos verificados`)
    console.log(`✅ Aprovados: ${allIssues.length - failed.length}`)
    console.log(`❌ Reprovados: ${failed.length}`)
    console.log(`⚠️  Com avisos: ${warned.length}\n`)

    for (const { file, result } of failed) {
      console.log(`❌ ${file}`)
      result.issues.forEach(i => console.log(`   • ${i}`))
    }
    for (const { file, result } of warned) {
      if (result.passed) {
        console.log(`⚠️  ${file}`)
        result.warnings.forEach(w => console.log(`   ~ ${w}`))
      }
    }

    process.exit(failed.length > 0 ? 1 : 0)
  } else {
    const filePath = path.resolve(args[0])
    const result = checkArticle(filePath)
    console.log(`\nQA: ${path.basename(filePath)}`)
    if (result.passed) {
      console.log('✅ APROVADO')
    } else {
      console.log('❌ REPROVADO')
      result.issues.forEach(i => console.log(`  • ${i}`))
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach(w => console.log(`  ~ ${w}`))
    }
    process.exit(result.passed ? 0 : 1)
  }
}

main()
