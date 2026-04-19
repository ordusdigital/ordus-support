import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'

const GHL_LOGO_COLORS = [
  [30, 170, 90],   // verde GHL principal
  [25, 140, 70],
]

interface DetectionResult {
  hasGHLLogo: boolean
  hasGHLText: boolean
  confidence: number
}

export async function detectGHLLogo(imagePath: string): Promise<DetectionResult> {
  const { data, info } = await sharp(imagePath)
    .raw()
    .toBuffer({ resolveWithObject: true })

  let greenPixels = 0
  const totalPixels = info.width * info.height

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    for (const [tr, tg, tb] of GHL_LOGO_COLORS) {
      if (Math.abs(r - tr) < 30 && Math.abs(g - tg) < 30 && Math.abs(b - tb) < 30) {
        greenPixels++
        break
      }
    }
  }

  const ratio = greenPixels / totalPixels
  return {
    hasGHLLogo: ratio > 0.001,
    hasGHLText: false,
    confidence: ratio,
  }
}

export async function checkImageForGHL(imagePath: string): Promise<boolean> {
  const result = await detectGHLLogo(imagePath)
  if (result.hasGHLLogo) {
    console.warn(`⚠️  Possível logo GHL detectado em ${imagePath} (confiança: ${(result.confidence * 100).toFixed(2)}%)`)
    return true
  }
  return false
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Uso: logo-replacer.ts <imagem.png>')
    process.exit(1)
  }

  const imagePath = path.resolve(args[0])
  const found = await checkImageForGHL(imagePath)
  process.exit(found ? 1 : 0)
}

main().catch(err => { console.error(err); process.exit(1) })
