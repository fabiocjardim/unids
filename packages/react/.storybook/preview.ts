import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Tokens uniDS — base (primitives + spacing + typography) e os dois temas
import '@unids/tokens/css/base.css';
import '@unids/tokens/css/theme-light.css';
import '@unids/tokens/css/theme-dark.css';

import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    },
    backgrounds: { disable: true },
    layout: 'centered'
  },

  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme'
    })
  ]
};

export default preview;
