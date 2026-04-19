'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^#{2,3}\s+(.+)$/gm
  const headings: Heading[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[0].startsWith('###') ? 3 : 2
    const text = match[1].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    headings.push({ id, text, level })
  }

  return headings
}

interface Props {
  content: string
}

export default function TableOfContents({ content }: Props) {
  const headings = extractHeadings(content)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0% -70% 0%', threshold: 0 }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav className="sticky top-28">
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: '#6A6A6A', letterSpacing: '0.10em' }}
      >
        Nesta página
      </p>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '0.75rem' : '0' }}>
            <a
              href={`#${h.id}`}
              className="block py-0.5 text-xs leading-relaxed transition-colors duration-150"
              style={{
                color: activeId === h.id ? 'var(--color-brand)' : '#6A6A6A',
                fontWeight: activeId === h.id ? 600 : 400,
                borderLeft: activeId === h.id ? '2px solid var(--color-brand)' : '2px solid transparent',
                paddingLeft: activeId === h.id ? '0.5rem' : (h.level === 3 ? '1.25rem' : '0.5rem'),
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
