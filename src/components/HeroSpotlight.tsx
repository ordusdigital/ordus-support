'use client'

import { useEffect, useRef } from 'react'

export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(154,17,233,0.10), transparent 60%)`
    }

    parent.addEventListener('mousemove', onMove)
    return () => parent.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ transition: 'background 0.15s ease' }}
    />
  )
}
