'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500"
      style={{ pointerEvents: 'none' }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(scrolled
            ? {
                margin: '12px auto 0',
                width: 'min(1100px, calc(100% - 32px))',
                borderRadius: '100px',
                background: 'radial-gradient(800px 200px at 50% -50%, rgba(30,30,30,0.92), rgba(10,10,10,0.88))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.50), 0 0 0 0.5px rgba(154,17,233,0.15)',
                padding: '10px 24px',
                animation: 'pillIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
              }
            : {
                width: '100%',
                borderRadius: '0',
                background: 'rgba(10,10,10,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '14px 32px',
              }),
        }}
      >
        <div
          className="flex items-center justify-between gap-8"
          style={{ maxWidth: scrolled ? 'none' : '1200px', margin: scrolled ? 'none' : '0 auto' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span
              className="font-display font-bold text-text"
              style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}
            >
              Ordus System
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-pill"
              style={{
                background: 'rgba(154,17,233,0.15)',
                border: '1px solid rgba(154,17,233,0.25)',
                color: '#C060FF',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '10px',
              }}
            >
              Suporte
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-text-muted hover:text-text transition-colors"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              Artigos
            </Link>
            <Link
              href="https://ordussystem.com.br"
              target="_blank"
              rel="noopener"
              className="text-text-muted hover:text-text transition-colors"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              Plataforma
            </Link>
            <Link
              href="https://ordusdigital.com.br"
              target="_blank"
              rel="noopener"
              className="text-text-muted hover:text-text transition-colors"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              Ordus Digital
            </Link>
          </div>

          {/* CTA */}
          <a
            href="https://ordussystem.com.br"
            target="_blank"
            rel="noopener"
            className="hidden md:flex items-center gap-1.5 shrink-0 text-white font-semibold transition-all"
            style={{
              fontSize: '0.8125rem',
              padding: '7px 16px',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, #9A11E9, #7F2DC1)',
              boxShadow: '0 0 16px rgba(154,17,233,0.30)',
            }}
          >
            Acessar plataforma
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </nav>
    </div>
  )
}
