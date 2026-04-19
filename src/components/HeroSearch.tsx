'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { buildSearchIndex, searchArticles } from '@/lib/search'
import type { ArticleListItem } from '@/types/article'

interface Props {
  articles: ArticleListItem[]
}

export default function HeroSearch({ articles }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticleListItem[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    buildSearchIndex(articles)
  }, [articles])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
        setResults([])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setSelected(-1)
    if (q.length >= 2) {
      const r = searchArticles(q, articles).slice(0, 6).map(r => r.item)
      setResults(r)
      setOpen(true)
    } else {
      setResults([])
      setOpen(false)
    }
  }, [articles])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, -1)) }
    if (e.key === 'Enter' && selected >= 0 && results[selected]) {
      const r = results[selected]
      router.push(`/${r.categorySlug}/${r.slug}`)
      setOpen(false)
      setQuery('')
    }
  }

  const navigate = (article: ArticleListItem) => {
    router.push(`/${article.categorySlug}/${article.slug}`)
    setOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '14px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.30)',
        }}
      >
        <svg
          className="w-5 h-5 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ color: 'rgba(240,240,243,0.45)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Pesquisar artigos... (⌘K)"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-faint"
          style={{ color: 'var(--color-text)', caretColor: 'var(--color-brand-light)' }}
          aria-label="Pesquisar artigos"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            className="transition-colors text-xs shrink-0"
            style={{ color: 'rgba(240,240,243,0.45)' }}
          >
            ✕
          </button>
        )}
        <kbd
          className="hidden md:inline-flex items-center px-2 py-1 rounded font-mono text-xs shrink-0"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(240,240,243,0.45)',
          }}
        >
          ⌘K
        </kbd>
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 overflow-hidden z-50"
          style={{
            background: 'rgba(14,14,14,0.97)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '14px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.60)',
          }}
        >
          <ul role="listbox">
            {results.map((article, i) => (
              <li key={`${article.categorySlug}/${article.slug}`} role="option" aria-selected={i === selected}>
                <button
                  onClick={() => navigate(article)}
                  className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors"
                  style={{ background: i === selected ? 'rgba(154,17,233,0.12)' : 'transparent' }}
                >
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: 'var(--color-brand-light)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--color-text)' }}>
                      {article.frontmatter.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-60)' }}>
                      {article.frontmatter.category}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 px-4 py-6 text-center text-sm z-50"
          style={{
            background: 'rgba(14,14,14,0.97)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '14px',
            backdropFilter: 'blur(24px)',
            color: 'var(--color-text-60)',
          }}
        >
          Nenhum resultado para &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
