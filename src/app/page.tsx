import { getAllArticles } from '@/lib/mdx'
import { getCategoriesByPriority } from '@/lib/categories'
import HeroSearch from '@/components/HeroSearch'
import CategoryGrid from '@/components/CategoryGrid'
import HeroSpotlight from '@/components/HeroSpotlight'
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
    <main>
      {/* Dark hero */}
      <section className="relative flex items-center justify-center bg-gradient-hero bg-isotipo-grid overflow-hidden" style={{ minHeight: '600px' }}>
        <HeroSpotlight />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-36 text-center">
          <p className="label-brand mb-4 animate-fade-up">Central de Ajuda</p>
          <h1 className="font-display font-bold text-text leading-tight mb-4 animate-fade-up animate-fade-up-1" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)' }}>
            Como podemos{' '}
            <span className="text-gradient-brand">te ajudar?</span>
          </h1>
          <p className="text-text-muted text-lg mb-10 animate-fade-up animate-fade-up-2 max-w-xl mx-auto">
            Suporte do Ordus System em português. Tutoriais, guias e documentação completa.
          </p>
          <div className="animate-fade-up animate-fade-up-3">
            <HeroSearch articles={articles} />
          </div>
        </div>

        {/* Bottom fade to light */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F5F5F5)' }}
        />
      </section>

      {/* Light categories section */}
      <section className="py-20 px-6" style={{ background: '#F5F5F5' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="label mb-3" style={{ color: '#6A6A6A' }}>Categorias</p>
            <h2 className="font-display text-3xl font-bold" style={{ color: '#0A0A0A' }}>
              Navegue pelos tópicos
            </h2>
          </div>
          <CategoryGrid categories={categoryWithCounts} />
        </div>
      </section>

      {/* Dark footer */}
      <footer className="bg-bg border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <span>© {new Date().getFullYear()} Ordus Digital — Todos os direitos reservados</span>
          <div className="flex gap-6">
            <a href="https://ordussystem.com.br" className="hover:text-text transition-colors">Plataforma</a>
            <a href="https://ordusdigital.com.br" className="hover:text-text transition-colors">Ordus Digital</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
