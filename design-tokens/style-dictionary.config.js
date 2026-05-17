/**
 * Style Dictionary — uniDS Design Tokens
 *
 * Gera três arquivos CSS separados para suportar troca de tema light/dark:
 *
 *   dist/css/base.css         → tokens não-temáticos (color primitives, spacing,
 *                                border-radius, border-width, size, typography)
 *                                sob :root
 *   dist/css/theme-light.css  → semantic.light.* com prefixo "semantic-light-"
 *                                removido, sob :root, [data-theme="light"]
 *   dist/css/theme-dark.css   → semantic.dark.* com prefixo "semantic-dark-"
 *                                removido, sob [data-theme="dark"]
 *   dist/css/tokens.css       → entrypoint que importa os três
 *
 *   dist/ts/tokens.ts         → objeto JS tipado (todos os tokens)
 *   dist/ts/tokens.d.ts       → tipos TypeScript
 *   dist/json/tokens.json     → JSON flat resolvido
 *
 * Regra: componentes consomem var(--button-primary-default), nunca
 * var(--color-brand-blue-600). A troca de tema acontece em
 * <html data-theme="light|dark">.
 */

import StyleDictionary from 'style-dictionary';

// Formato customizado: gera CSS vars opcionalmente sob um seletor diferente
// de :root e opcionalmente removendo um prefixo do nome. Composites de
// tipografia (typescale.*) são pulados porque não fazem sentido como CSS var
// única — consumir via @unids/tokens (TS) em vez disso.
StyleDictionary.registerFormat({
  name: 'css/themed-variables',
  format: ({ dictionary, options = {} }) => {
    const { selector = ':root', stripPrefix = '' } = options;
    const lines = dictionary.allTokens
      .filter((token) => {
        const value = token.$value ?? token.value;
        return typeof value === 'string' || typeof value === 'number';
      })
      .map((token) => {
        let name = token.name;
        if (stripPrefix && name.startsWith(stripPrefix)) {
          name = name.slice(stripPrefix.length);
        }
        const value = token.$value ?? token.value;
        return `  --${name}: ${value};`;
      });
    return `${selector} {\n${lines.join('\n')}\n}\n`;
  }
});

const notSemantic = (token) => token.path[0] !== 'semantic';
const lightSemantic = (token) => token.path[0] === 'semantic' && token.path[1] === 'light';
const darkSemantic = (token) => token.path[0] === 'semantic' && token.path[1] === 'dark';

export default {
  source: ['./design-tokens.json'],

  platforms: {
    'css-base': {
      transformGroup: 'css',
      buildPath: './dist/css/',
      files: [
        {
          destination: 'base.css',
          format: 'css/themed-variables',
          filter: notSemantic,
          options: { selector: ':root' }
        }
      ]
    },

    'css-light': {
      transformGroup: 'css',
      buildPath: './dist/css/',
      files: [
        {
          destination: 'theme-light.css',
          format: 'css/themed-variables',
          filter: lightSemantic,
          options: {
            selector: ':root,\n[data-theme="light"]',
            stripPrefix: 'semantic-light-'
          }
        }
      ]
    },

    'css-dark': {
      transformGroup: 'css',
      buildPath: './dist/css/',
      files: [
        {
          destination: 'theme-dark.css',
          format: 'css/themed-variables',
          filter: darkSemantic,
          options: {
            selector: '[data-theme="dark"]',
            stripPrefix: 'semantic-dark-'
          }
        }
      ]
    },

    scss: {
      transformGroup: 'scss',
      buildPath: './dist/scss/',
      files: [
        { destination: '_tokens.scss',     format: 'scss/variables' },
        { destination: '_tokens-map.scss', format: 'scss/map-deep' }
      ]
    },

    ts: {
      transformGroup: 'js',
      buildPath: './dist/ts/',
      files: [
        { destination: 'tokens.ts',   format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' }
      ]
    },

    json: {
      transformGroup: 'js',
      buildPath: './dist/json/',
      files: [
        { destination: 'tokens.json',        format: 'json/flat' },
        { destination: 'tokens-nested.json', format: 'json/nested' }
      ]
    }
  }
};
