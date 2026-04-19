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
          <div
            key={i}
            id={id}
            className="overflow-hidden rounded-xl transition-all duration-200"
            style={{
              background: '#FFFFFF',
              border: isOpen ? '1px solid rgba(154,17,233,0.25)' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: isOpen ? '0 2px 12px rgba(154,17,233,0.08)' : 'var(--shadow-card)',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
              style={{ background: isOpen ? 'rgba(154,17,233,0.04)' : 'transparent' }}
              aria-expanded={isOpen}
              aria-controls={`${id}-answer`}
            >
              <span className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>{faq.q}</span>
              <svg
                className="shrink-0 transition-transform duration-300"
                style={{
                  width: 16,
                  height: 16,
                  color: isOpen ? 'var(--color-brand-mid)' : '#6A6A6A',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div
              id={`${id}-answer`}
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? '800px' : '0' }}
            >
              <div
                className="px-5 pb-5 pt-1 text-sm leading-relaxed"
                style={{
                  color: '#3A3A3A',
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                {faq.a}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
