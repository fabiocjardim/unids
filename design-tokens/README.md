# uniDS — Design Tokens

Design tokens do Design System **uniDS** (Banco do Brasil), exportados direto do Figma em formato estruturado.
Fonte única de verdade para **React** e **Angular**.

## 📁 Arquivos

| Arquivo | Formato | Quando usar |
|---|---|---|
| `design-tokens.json` | **W3C DTCG** (com refs `{token.path}`) | Input para **Style Dictionary** (recomendado) |
| `tokens-flat.json`   | JSON plano (valores já resolvidos) | Consumo direto via `import tokens from './tokens-flat.json'` |

> 🎯 **Recomendação:** use `design-tokens.json` com Style Dictionary. Isso permite que **ambos os times** (React/Angular) gerem os formatos nativos deles (CSS vars, SCSS, TS, Tailwind config) a partir do mesmo arquivo fonte.

---

## 🗂 Estrutura dos tokens

```
color            → paletas primitivas (neutral, blue, red, purple, amber, cyan, green, brand-blue, brand-yellow)
                   [escalas 50–950] — NÃO usar em componentes
semantic.light   → tokens semânticos light (text, icon, border, background, container, button, link, menu)
semantic.dark   → tokens semânticos dark (mesma API do light)
typography       → font-family, font-weight, font-size, line-height, letter-spacing, typescale (composites)
spacing          → escala none/2xs..7xl (base 8px)
border-radius    → none/xs..2xl/pill
border-width     → none/thin/medium/thick
size             → tamanhos fixos (ícones, avatares)
```

### ⚠️ Regra de ouro
**Componentes SEMPRE consomem tokens semânticos, nunca cores primitivas.**

```tsx
// ❌ Errado
<Button style={{ background: tokens.color.brandBlue[600] }} />

// ✅ Certo
<Button style={{ background: tokens.semantic.light.button.primary.default }} />
```

---

## ⚛️ React — Como consumir

### Opção A: Style Dictionary (recomendado)

```bash
npm i -D style-dictionary
```

`style-dictionary.config.js`:
```js
export default {
  source: ['design-tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        { destination: 'tokens.ts', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' }
      ]
    }
  }
};
```

Uso:
```tsx
import { SemanticLightTextDefault, SpacingSm } from '@/tokens/tokens';

export const Card = () => (
  <div style={{ color: SemanticLightTextDefault, padding: SpacingSm }}>…</div>
);
```

Ou via CSS vars (tema dinâmico):
```tsx
// styles/tokens.css já importado no _app.tsx/main.tsx
<div style={{ color: 'var(--semantic-light-text-default)' }} />
```

### Opção B: Consumo direto (sem build step)

```tsx
import tokens from '@/design-tokens/tokens-flat.json';

export const Card = () => (
  <div style={{
    color: tokens.semantic.light.text.default,
    padding: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
  }} />
);
```

### Integração com Tailwind

```js
// tailwind.config.js
import tokens from './design-tokens/tokens-flat.json' assert { type: 'json' };

export default {
  theme: {
    colors:       tokens.color,
    spacing:      tokens.spacing,
    borderRadius: tokens.borderRadius,
    fontSize:     tokens.typography.fontSize,
    fontFamily:   { textos: tokens.typography.fontFamily.textos.split(','),
                    titulos: tokens.typography.fontFamily.titulos.split(',') }
  }
};
```

### Integração com styled-components / emotion

```ts
// src/theme.ts
import tokens from '@/design-tokens/tokens-flat.json';

export const lightTheme = {
  ...tokens.semantic.light,
  spacing: tokens.spacing,
  radius:  tokens.borderRadius,
  type:    tokens.typography
};
export type Theme = typeof lightTheme;

// App.tsx
<ThemeProvider theme={lightTheme}>…</ThemeProvider>
```

---

## 🅰️ Angular — Como consumir

### Opção A: Style Dictionary (recomendado)

`style-dictionary.config.js`:
```js
export default {
  source: ['design-tokens.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/styles/',
      files: [
        { destination: '_tokens.scss',    format: 'scss/variables' },
        { destination: '_tokens-map.scss',format: 'scss/map-deep' }
      ]
    },
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }]
    }
  }
};
```

Em `styles.scss`:
```scss
@import 'styles/tokens';   // variáveis SCSS ($color-neutral-50, …)
@import 'styles/tokens.css'; // CSS vars para theming dinâmico
```

Uso:
```scss
// meu-componente.component.scss
.card {
  color:         $semantic-light-text-default;
  padding:       $spacing-sm;
  border-radius: $border-radius-lg;
  background:    var(--semantic-light-background-default);
}
```

### Opção B: TypeScript service

```ts
// tokens.service.ts
import tokens from '../../design-tokens/tokens-flat.json';

@Injectable({ providedIn: 'root' })
export class TokensService {
  readonly color  = tokens.color;
  readonly theme  = tokens.semantic.light;
  readonly space  = tokens.spacing;
  readonly radius = tokens.borderRadius;
  readonly type   = tokens.typography;
}

// componente.ts
constructor(public t: TokensService) {}
// template: [style.padding]="t.space.sm"
```

---

## 🌓 Theming (Light / Dark)

Exporte as CSS vars apontando para o tema ativo:

```css
:root,
[data-theme="light"] {
  --text-default: #09090b;
  --background-default: #ffffff;
  /* ... do semantic.light */
}

[data-theme="dark"] {
  --text-default: #fafafa;
  --background-default: #09090b;
  /* ... do semantic.dark */
}
```

No componente:
```css
.card { color: var(--text-default); background: var(--background-default); }
```

Troca de tema (qualquer framework):
```ts
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 🔤 Tipografia — Fontes do Banco do Brasil

O DS usa **duas famílias proprietárias**:

| Família | Uso | Fallback sugerido |
|---|---|---|
| `BancoDoBrasil Titulos` | Display, Title | `Georgia, serif` |
| `BancoDoBrasil Textos`  | Label, Paragraph, Caption | `system-ui, -apple-system, sans-serif` |

Certifique-se de hospedar as fontes (`.woff2`) no projeto e declarar:
```css
@font-face {
  font-family: 'BancoDoBrasil Textos';
  src: url('/fonts/bb-textos.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
/* Repetir para 500, 700 e para BancoDoBrasil Titulos */
```

---

## 🔁 Atualizando os tokens

Sempre que o Figma for atualizado:
1. Rode novamente a extração (comando `/design-system` neste projeto)
2. Substitua `design-tokens.json` e `tokens-flat.json`
3. Rode `npx style-dictionary build` (se estiver usando Style Dictionary)
4. Commit + PR — pipelines de CI recompilam os temas automaticamente

---

## 📊 Resumo dos tokens exportados

| Categoria | Quantidade |
|---|---|
| Paletas primitivas | 10 (neutral, brand-blue, brand-yellow, blue, cyan, green, amber, red, purple, raw) |
| Tons por paleta | 11 (50–950) |
| Tokens semânticos (light + dark) | ~180 |
| Estados semânticos (container/button/menu) | default/hover/pressed/disabled/selected/soft/tint |
| Escala typescale | 16 composites (display, title, label, paragraph, caption) |
| Escala spacing | 13 valores |
| Escala border-radius | 8 valores |

---

## 📎 Origem

- Figma: [uniDS - Guia de Estilos](https://www.figma.com/design/aFwjZ4z4swHMj7lhhttaVW/uniDS---Guia-de-Estilos)
- Formato: [W3C Design Tokens Community Group](https://design-tokens.github.io/community-group/format/)
- Tool recomendada: [Style Dictionary](https://amzn.github.io/style-dictionary)
