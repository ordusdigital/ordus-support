# Routine: Batch Diário de Artigos — Ordus Support

## Objetivo
Gerar 10 novos artigos PT-BR por dia para `suporte.ordussystem.com.br`, puxando conteúdo
do site oficial GHL (`help.gohighlevel.com`) e adaptando para o Ordus System.

## Contexto do projeto
- Diretório: `/Users/leandrogeseth/Projetos Antigravity/Suporte Ordus System`
- Repo: `https://github.com/ordusdigital/ordus-support`
- Conteúdo: `content/{categorySlug}/{slug}.mdx`
- Mapa GHL: `content/_ghl_map.json`
- Tracking: `content/_tracking.json`

## Execução

### Passo 1 — Atualizar mapa GHL
```bash
npm run scraper
```
Isso popula/atualiza `content/_ghl_map.json` com todos os artigos do sitemap GHL.

### Passo 2 — Identificar pendentes
Ler `content/_ghl_map.json` e `content/_tracking.json`.
Artigos pendentes = estão no `_ghl_map.json` mas NÃO em `_tracking.json.articles` com
`status: "published"`.
Ordenar por prioridade da categoria (P0 primeiro: primeiros-passos, contatos, pipelines,
automacoes). Selecionar os próximos 10.

### Passo 3 — Para cada artigo pendente

1. **Buscar conteúdo GHL**: Fazer fetch da URL (`ghlUrl`) e extrair o texto principal.
   Se a URL retornar erro 404 ou conteúdo < 100 chars, marcar como `error` no tracking e pular.

2. **Gerar MDX em PT-BR**: Escrever o artigo completo seguindo o formato:

```mdx
---
title: "TITULO EM PT-BR"
description: "Descrição de 1 linha (máx 160 chars)"
keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
category: "NOME DA CATEGORIA EM PT-BR"
categorySlug: "slug-da-categoria"
ghlReference: "URL_GHL_ORIGINAL"
lastUpdated: "YYYY-MM-DD"
screenshotSteps: []
faqs: []
priority: 2
---

[2 parágrafos introdutórios em PT-BR]

## Passo a Passo

1. **Passo**: descrição detalhada.
[6 a 10 passos]

## Perguntas Frequentes

**Pergunta?**
Resposta em 2-3 frases.
[4 perguntas frequentes]

## Próximos Passos

- [Artigo relacionado](/categoria/slug)
- [Artigo relacionado](/categoria/slug)
- [Artigo relacionado](/categoria/slug)
```

3. **Regras obrigatórias do conteúdo**:
   - NUNCA mencionar "HighLevel", "GoHighLevel", "GHL", "gohighlevel" — sempre "Ordus System"
   - Escrever em PT-BR fluente e profissional
   - "Ordus System" deve aparecer pelo menos 3x no artigo
   - Mínimo 400 palavras no corpo do artigo

4. **Salvar o arquivo**: `content/{categorySlug}/{slug}.mdx`
   Criar o diretório se não existir.

5. **Atualizar `_tracking.json`**:
```json
{
  "categorySlug/slug": {
    "status": "published",
    "priority": 0,
    "publishedAt": "YYYY-MM-DD",
    "url": "https://suporte.ordussystem.com.br/categorySlug/slug/",
    "ghlUrl": "URL_ORIGINAL"
  }
}
```

### Passo 4 — Commit e push
```bash
git add content/
git commit -m "content: batch +N artigos — YYYY-MM-DD"
git push origin main
```

### Passo 5 — Verificar conclusão
Se `_ghl_map.json` não tiver mais pendentes após o batch:
- Atualizar `_tracking.json.summary`
- Enviar mensagem no WhatsApp via Evolution API:
  ```
  POST https://api.launchpro.digital/message/sendText/geseth1
  { "number": "5519997052849", "text": "🎉 Portal Ordus Support completo! Todos os artigos GHL publicados." }
  ```
  (usar secret EVOLUTION_API_KEY do `.env.local` se disponível)

## Categorias e Prioridades

| Slug | Nome | Prioridade |
|------|------|-----------|
| primeiros-passos | Primeiros Passos | P0 |
| contatos | Contatos | P0 |
| pipelines | Pipelines e Oportunidades | P0 |
| automacoes | Automações e Fluxos | P0 |
| funis-e-sites | Funis e Sites | P1 |
| agendamentos | Agendamentos | P1 |
| email | E-mail | P1 |
| telefonia | Telefonia | P1 |
| funcionario-ia | Funcionário IA | P1 |
| visao-agencia | Visão de Agência | P2 |
| configurador-saas | Configurador SaaS | P2 |
| redes-sociais | Redes Sociais | P2 |
| reputacao | Reputação | P2 |
| relatorios | Relatórios | P2 |
| integracoes | Integrações | P2 |
| cobranca | Cobrança | P3 |
| app-mobile | App Mobile | P3 |
| api | API | P3 |
| suporte-ao-cliente | Suporte ao Cliente | P3 |
