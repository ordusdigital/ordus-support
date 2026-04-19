import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://suporte.ordussystem.com.br'),
  title: {
    default: 'Suporte Ordus System — Central de Ajuda em Português',
    template: '%s | Suporte Ordus System',
  },
  description: 'Central de suporte do Ordus System em português brasileiro. Tutoriais, guias e documentação completa para CRM, automações, pipelines e muito mais.',
  keywords: ['Ordus System', 'CRM brasil', 'suporte CRM', 'GoHighLevel português', 'tutorial CRM'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Suporte Ordus System',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-bg text-text font-body antialiased">
        <div id="reading-progress" style={{ width: '0%' }} />
        {children}
      </body>
    </html>
  )
}
