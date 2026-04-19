import { getAllArticles } from '@/lib/mdx'
import { getCategoriesByPriority } from '@/lib/categories'
import HeroSearch from '@/components/HeroSearch'
import CategoryGrid from '@/components/CategoryGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Central de Ajuda — Suporte Ordus System',
  description: 'Encontre tutoriais, guias e respostas para suas dúvidas sobre o Ordus System em português brasileiro.',
}

export default function HomePage() {
  const articles = getAllArticles()
  const categories = getCategoriesByPriority()

  const categoryWithCounts = categories.map(cat => ({
    ...cat,
    articleCount: articles.filter(a => a.categorySlug === cat.slug).length,
  }))

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-display font-bold text-xl text-text">
            Ordus System <span className="text-primary">Suporte</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-text-muted">
            <a href="https://ordussystem.com.br" className="hover:text-text transition-colors">
              Plataforma
            </a>
            <a href="https://ordusdigital.com.br" className="hover:text-text transition-colors">
              Ordus Digital
            </a>
          </nav>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text mb-4">
          Como podemos te ajudar?
        </h1>
        <p className="text-text-muted text-lg mb-10">
          Central de suporte do Ordus System em português. Tutoriais, guias e documentação completa.
        </p>
        <HeroSearch articles={articles} />
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <CategoryGrid categories={categoryWithCounts} />
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <span>© {new Date().getFullYear()} Ordus Digital — Todos os direitos reservados</span>
          <div className="flex gap-6">
            <a href="https://ordussystem.com.br" className="hover:text-text transition-colors">Plataforma</a>
            <a href="https://ordusdigital.com.br" className="hover:text-text transition-colors">Site</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
