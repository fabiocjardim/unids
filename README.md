# uniDS — Design System

Pipeline completo do Design System **uniDS** (Banco do Brasil):

```
Figma Tokens    ─► design-tokens/ ──► Style Dictionary ──► tokens.css / tokens.ts
Figma Componentes ──────────────────► packages/react/   ──► React + Storybook
                                                        ──► GitHub ──► Vercel ──► URL pública
```

## Estrutura

```
.
├── design-tokens/         @unids/tokens — fonte W3C DTCG + Style Dictionary
│   ├── design-tokens.json
│   ├── style-dictionary.config.js
│   └── dist/              (gerado: css/, scss/, ts/, json/)
│
├── packages/
│   └── react/             @unids/react — componentes + Storybook
│       ├── src/components/
│       └── .storybook/
│
└── package.json           (npm workspaces)
```

## Setup

```bash
npm install              # instala tudo (workspaces)
npm run tokens           # gera dist/ dos tokens
npm run storybook        # abre Storybook em http://localhost:6006
```

## Tema light / dark

Os tokens semânticos são compilados em dois arquivos CSS, ativados via atributo `data-theme`:

```html
<html data-theme="light">  <!-- ou "dark" -->
```

Componentes consomem sempre **variáveis semânticas** (`var(--button-primary-default)`), nunca cores primitivas.

## Deploy

Storybook é buildado estático para `packages/react/storybook-static/` e publicado na **Vercel** a cada push em `main`.
