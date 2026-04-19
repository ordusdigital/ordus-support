import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { runPipeline } from './screenshot-pipeline-lib'
import { checkArticle } from './qa-checker'

const app = express()
app.use(express.json())

const PORT = parseInt(process.env.PORT ?? '3001', 10)

interface ScreenshotRequest {
  articlePath: string
  categorySlug: string
  slug: string
}

interface QARequest {
  articlePath: string
}

app.post('/screenshot', async (req, res) => {
  const { articlePath, categorySlug, slug }: ScreenshotRequest = req.body

  if (!articlePath || !categorySlug || !slug) {
    return res.status(400).json({ error: 'articlePath, categorySlug e slug são obrigatórios' })
  }

  try {
    const result = await runPipeline({ articlePath, categorySlug, slug })
    return res.json(result)
  } catch (err) {
    console.error('/screenshot error:', err)
    return res.status(500).json({ success: false, screenshots: [], errors: [String(err)] })
  }
})

app.post('/qa', async (req, res) => {
  const { articlePath }: QARequest = req.body

  if (!articlePath) {
    return res.status(400).json({ error: 'articlePath é obrigatório' })
  }

  try {
    const result = checkArticle(articlePath)
    return res.json(result)
  } catch (err) {
    console.error('/qa error:', err)
    return res.status(500).json({ passed: false, issues: [String(err)], warnings: [] })
  }
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Screenshot Worker rodando na porta ${PORT}`)
})
