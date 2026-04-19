import * as fs from 'fs'
import * as path from 'path'
import { google } from 'googleapis'
import type { TrackingMap, TrackingEntry, TrackingStatus } from '../src/types/article'

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID ?? ''
const TRACKING_PATH = path.join(__dirname, '../content/_tracking.json')

const COLUMNS = [
  'ID', 'Título PT-BR', 'Categoria', 'Slug', 'URL GHL',
  'Prioridade', 'Status', 'Gerado em', 'Screenshots',
  'QA', 'Publicado em', 'URL Final', 'Observações',
]

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth: await auth.getClient() as never })
}

export async function syncToSheets(tracking: TrackingMap): Promise<void> {
  const sheets = await getSheets()
  const rows = Object.values(tracking).map(e => [
    e.id, e.titlePtBr, e.category, e.slug, e.urlGhl,
    e.prioridade, e.status, e.geradoEm ?? '', e.screenshots ?? '',
    e.qa ?? '', e.publicadoEm ?? '', e.urlFinal ?? '', e.observacoes ?? '',
  ])

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEETS_ID,
    range: 'Artigos!A2',
    valueInputOption: 'RAW',
    requestBody: { values: rows },
  })
  console.log(`✅ ${rows.length} linhas sincronizadas no Sheets`)
}

export async function updateStatus(id: string, status: TrackingStatus, extra?: Partial<TrackingEntry>): Promise<void> {
  let tracking: TrackingMap = {}
  if (fs.existsSync(TRACKING_PATH)) {
    tracking = JSON.parse(fs.readFileSync(TRACKING_PATH, 'utf-8'))
  }

  if (tracking[id]) {
    tracking[id] = { ...tracking[id], status, ...extra }
    fs.writeFileSync(TRACKING_PATH, JSON.stringify(tracking, null, 2))
  }

  if (SHEETS_ID) {
    await syncToSheets(tracking)
  }
}

export function loadTracking(): TrackingMap {
  if (!fs.existsSync(TRACKING_PATH)) return {}
  return JSON.parse(fs.readFileSync(TRACKING_PATH, 'utf-8'))
}

export function saveTracking(tracking: TrackingMap): void {
  fs.writeFileSync(TRACKING_PATH, JSON.stringify(tracking, null, 2))
}

async function main() {
  const tracking = loadTracking()
  if (Object.keys(tracking).length === 0) {
    console.log('Nenhum artigo no tracking')
    return
  }
  await syncToSheets(tracking)
}

main().catch(err => { console.error(err); process.exit(1) })
