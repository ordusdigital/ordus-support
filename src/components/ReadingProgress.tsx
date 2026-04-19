'use client'

import { useEffect } from 'react'

export default function ReadingProgress() {
  useEffect(() => {
    const el = document.getElementById('reading-progress')

    const onScroll = () => {
      const doc = document.documentElement
      const pct = doc.scrollHeight > doc.clientHeight
        ? (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100
        : 0
      if (el) el.style.width = `${pct}%`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (el) el.style.width = '0%'
    }
  }, [])

  return null
}
