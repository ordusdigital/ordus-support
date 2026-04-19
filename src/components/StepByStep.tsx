'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ScreenshotStep } from '@/types/article'

interface Props {
  steps: ScreenshotStep[]
  categorySlug: string
  slug: string
}

export default function StepByStep({ steps, categorySlug, slug }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (!steps?.length) return null

  const imgPath = (step: number) =>
    `/screenshots/${categorySlug}/${slug}/step-${String(step).padStart(2, '0')}.png`

  return (
    <div className="not-prose space-y-6 my-6">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
            {step.step}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text text-sm mb-3">{step.description}</p>
            <button
              onClick={() => setLightbox(i)}
              className="block w-full rounded-lg border border-border overflow-hidden hover:border-primary transition-colors"
              aria-label={`Ampliar screenshot do passo ${step.step}`}
            >
              <Image
                src={imgPath(step.step)}
                alt={step.annotation}
                width={1200}
                height={675}
                className="w-full h-auto"
                loading="lazy"
              />
            </button>
            <p className="text-xs text-text-muted mt-1">{step.annotation}</p>
          </div>
        </div>
      ))}

      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              Fechar ✕
            </button>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setLightbox(l => l !== null && l > 0 ? l - 1 : l)}
                disabled={lightbox === 0}
                className="text-white/70 hover:text-white disabled:opacity-30 px-3 py-1 text-sm"
              >
                ← Anterior
              </button>
              <span className="text-white/70 text-sm">{lightbox + 1} / {steps.length}</span>
              <button
                onClick={() => setLightbox(l => l !== null && l < steps.length - 1 ? l + 1 : l)}
                disabled={lightbox === steps.length - 1}
                className="text-white/70 hover:text-white disabled:opacity-30 px-3 py-1 text-sm"
              >
                Próximo →
              </button>
            </div>
            <Image
              src={imgPath(steps[lightbox].step)}
              alt={steps[lightbox].annotation}
              width={1200}
              height={675}
              className="w-full h-auto rounded-lg"
            />
            <p className="text-white/60 text-sm mt-2 text-center">{steps[lightbox].annotation}</p>
          </div>
        </div>
      )}
    </div>
  )
}
