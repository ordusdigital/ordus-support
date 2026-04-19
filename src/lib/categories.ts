export interface Category {
  slug: string
  name: string
  ghlName: string
  priority: 0 | 1 | 2 | 3
  description: string
}

export const CATEGORIES: Category[] = [
  { slug: 'primeiros-passos', name: 'Primeiros Passos', ghlName: 'Getting Started', priority: 0, description: 'Configure sua conta e comece a usar o Ordus System' },
  { slug: 'contatos', name: 'Contatos', ghlName: 'Contacts', priority: 0, description: 'Gerencie sua base de contatos e leads' },
  { slug: 'pipelines', name: 'Pipelines e Oportunidades', ghlName: 'Pipelines & Opportunities', priority: 0, description: 'Acompanhe negociações e oportunidades de venda' },
  { slug: 'automacoes', name: 'Automações e Fluxos', ghlName: 'Automations & Workflows', priority: 0, description: 'Automatize processos e fluxos de trabalho' },
  { slug: 'funis-e-sites', name: 'Funis e Sites', ghlName: 'Funnels & Websites', priority: 1, description: 'Crie funis de venda e sites profissionais' },
  { slug: 'agendamentos', name: 'Agendamentos', ghlName: 'Calendars & Appointments', priority: 1, description: 'Gerencie calendários e agendamentos de clientes' },
  { slug: 'email', name: 'E-mail', ghlName: 'Email', priority: 1, description: 'Configure e envie campanhas de e-mail' },
  { slug: 'telefonia', name: 'Telefonia', ghlName: 'Phone System', priority: 1, description: 'Gerencie chamadas e SMS pela plataforma' },
  { slug: 'funcionario-ia', name: 'Funcionário IA', ghlName: 'AI Employee', priority: 1, description: 'Configure o assistente de IA do Ordus System' },
  { slug: 'visao-agencia', name: 'Visão de Agência', ghlName: 'Agency View', priority: 2, description: 'Gerencie múltiplas subcontas como agência' },
  { slug: 'configurador-saas', name: 'Configurador SaaS', ghlName: 'SaaS Configurator', priority: 2, description: 'Configure e venda o Ordus System como SaaS' },
  { slug: 'redes-sociais', name: 'Redes Sociais', ghlName: 'Social Media Planner', priority: 2, description: 'Planeje e publique conteúdo em redes sociais' },
  { slug: 'reputacao', name: 'Reputação', ghlName: 'Reputation Management', priority: 2, description: 'Gerencie avaliações e reputação online' },
  { slug: 'relatorios', name: 'Relatórios', ghlName: 'Reporting & Analytics', priority: 2, description: 'Analise dados e resultados do negócio' },
  { slug: 'integracoes', name: 'Integrações', ghlName: 'Integrations', priority: 2, description: 'Conecte o Ordus System a outras ferramentas' },
  { slug: 'cobranca', name: 'Cobrança', ghlName: 'Billing & Subscriptions', priority: 3, description: 'Gerencie pagamentos e assinaturas' },
  { slug: 'app-mobile', name: 'App Mobile', ghlName: 'Mobile App', priority: 3, description: 'Use o Ordus System pelo celular' },
  { slug: 'api', name: 'API', ghlName: 'API & Developers', priority: 3, description: 'Integre via API para desenvolvedores' },
  { slug: 'suporte-ao-cliente', name: 'Suporte ao Cliente', ghlName: 'Customer Support', priority: 3, description: 'Gerencie tickets e atendimento ao cliente' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.slug, c]))

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORY_MAP[slug]
}

export function getCategoriesByPriority(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.priority - b.priority)
}
