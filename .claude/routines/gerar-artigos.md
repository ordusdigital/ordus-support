# Routine: Gerar Artigos — Ordus Support

## Trigger
Acionada pelo n8n via webhook quando há artigos com status "⏳ Pendente"
na planilha Google Sheets do portal (GOOGLE_SHEETS_ID no .env).

## Contexto Permanente
- Portal: suporte.ordussystem.com.br
- Repositório: github.com/ordusdigital/ordus-support
- Marca: "Ordus System" — NUNCA usar "HighLevel", "GoHighLevel", "GHL" ou variações
- Idioma: Português Brasileiro natural e profissional
- Tom: CSM experiente explicando para cliente B2B consultivo
- QA: qa-checker.ts bloqueia qualquer arquivo com termos proibidos

## Execução Autônoma (sem perguntar)

Consultar Google Sheets MCP → listar artigos com status "⏳ Pendente", ordenados por Prioridade (P0 primeiro).

Para cada artigo pendente:

### PASSO 1 — Buscar estrutura
`web_fetch` na URL GHL referenciada → extrair:
- Título original em inglês
- Lista de H2 e H3 (estrutura de tópicos apenas)
- NÃO copiar nenhum texto do artigo original

### PASSO 2 — Gerar MDX completo
Gerar artigo seguindo o template abaixo. Regras absolutas:
- "Ordus System" em vez de qualquer referência ao GHL
- Resposta direta nos primeiros 100 words (para AEO)
- Mínimo 5 FAQs com perguntas reais de usuários B2B brasileiros
- Passo a passo numerado com referências a screenshots
- Casos de uso reais do mercado B2B brasileiro
- 800–1500 palavras no corpo do artigo
- screenshotSteps definidos para CADA passo visual

### PASSO 3 — Push via GitHub MCP
Criar/atualizar arquivo:
`content/{categorySlug}/{slug}.mdx`
no repositório ordusdigital/ordus-support (branch main).

### PASSO 4 — Atualizar planilha
Google Sheets MCP → status "📝 Gerado" + data de hoje no campo "Gerado em".

### PASSO 5 — Próximo artigo
Sem parar, processar o próximo "⏳ Pendente".
Continuar até não haver mais pendentes.

---

## Template MDX Padrão

```
---
title: "{título PT-BR incluindo 'Ordus System'}"
description: "{150-160 chars com 'Ordus System' e keyword principal}"
keywords: ["{kw1}", "{kw2}", "{kw3}", "{kw4}", "{kw5}"]
category: "{categoria PT-BR}"
categorySlug: "{categoria-slug}"
ghlReference: "{url_original_ghl}"
lastUpdated: "{YYYY-MM-DD}"
priority: {0|1|2|3}
tags: ["{tag1}", "{tag2}", "{tag3}"]
screenshotSteps:
  - step: 1
    description: "{o que mostrar neste print}"
    action: "navigate"
    url: "{url exata no Ordus System — ex: /contacts}"
    highlight: "{css selector do elemento principal}"
    annotation: "1. {instrução de 4-6 palavras}"
  - step: 2
    description: "{o que mostrar}"
    action: "click"
    selector: "{css selector}"
    highlight: "{css selector}"
    annotation: "2. {instrução}"
faqs:
  - q: "{pergunta real de usuário B2B}"
    a: "{resposta direta, máx 3 parágrafos}"
  - q: "{pergunta 2}"
    a: "{resposta 2}"
  - q: "{pergunta 3}"
    a: "{resposta 3}"
  - q: "{pergunta 4}"
    a: "{resposta 4}"
  - q: "{pergunta 5}"
    a: "{resposta 5}"
---

{Parágrafo de resposta direta — 2-3 linhas — responde a pergunta principal imediatamente para AEO}

## O que é e para que serve

{Contexto de negócio B2B brasileiro — por que essa feature importa para empresas brasileiras}

## Passo a passo

1. {Instrução clara}
   ![Passo 1: {descrição}](./screenshots/step-01.png)

2. {Instrução clara}
   ![Passo 2: {descrição}](./screenshots/step-02.png)

3. {continua...}

## Dicas práticas

{2-3 casos de uso reais do mercado B2B brasileiro — evitar genérico}

## Erros comuns e como evitar

{O que os usuários costumam errar nesta feature — específico e útil}

## Perguntas Frequentes

### {pergunta 1 do frontmatter}
{resposta expandida — 2-4 parágrafos}

### {pergunta 2}
{resposta expandida}

### {pergunta 3}
{resposta expandida}

### {pergunta 4}
{resposta expandida}

### {pergunta 5}
{resposta expandida}
```

---

## Checklist antes do push (verificação mental)
- [ ] "Ordus System" aparece no título
- [ ] Nenhum "HighLevel", "GoHighLevel", "GHL" em qualquer variação
- [ ] Pelo menos 5 FAQs no frontmatter
- [ ] screenshotSteps definidos para cada passo visual
- [ ] description entre 150-160 caracteres
- [ ] keywords relevantes para o mercado BR
- [ ] ghlReference preenchido com URL original
- [ ] lastUpdated com data atual

## Em caso de erro de MCP
Se o GitHub MCP falhar: salvar o MDX localmente em /tmp/ordus-support-articles/
e notificar o n8n via webhook para reprocessamento.
