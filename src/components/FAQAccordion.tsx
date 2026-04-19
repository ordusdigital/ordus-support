'use client'

import { useState } from 'react'
import type { FAQ } from '@/types/article'

interface Props {
  faqs: FAQ[]
}

export default function FAQAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  if (!faqs?.length) return null

  return (
    <div className="space-y-2 not-prose">
      {faqs.map((faq, i) => {
        const id = `faq-${i}`
        const isOpen = open === i
        return (
          <div key={i} id={id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left bg-bg-card hover:bg-bg-hover transition-colors"
              aria-expanded={isOpen}
              aria-controls={`${id}-answer`}
            >
              <span className="text-sm font-medium text-text">{faq.q}</span>
              <svg
                className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div id={`${id}-answer`} className="px-4 py-3 text-sm text-text-muted bg-bg border-t border-border leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
