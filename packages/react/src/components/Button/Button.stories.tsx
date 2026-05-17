import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// Ícone genérico via SVG inline — só pra demonstrar iconLeft/iconRight/iconOnly.
// Em produção, usar uma lib de ícones (ex.: lucide-react) ou ícones do projeto.
const ArrowRightIcon = (
  <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" aria-hidden="true">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = (
  <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%" aria-hidden="true">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: 'Componentes/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Continuar',
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'critical-primary',
        'critical-secondary',
        'critical-tertiary'
      ]
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    onClick: { action: 'clicked' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Implementação fiel ao componente `Button` do uniDS v4.0 no Figma. ' +
          'Pill shape, fonte `BancoDoBrasil Titulos` (fallback Inter), 6 hierarquias × 3 tamanhos. ' +
          'Use o toolbar pra alternar o tema light/dark — todas as cores respeitam `data-theme`.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ---------------- Variantes individuais ---------------- */

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const CriticalPrimary: Story = {
  args: { variant: 'critical-primary', children: 'Excluir conta' }
};
export const CriticalSecondary: Story = {
  args: { variant: 'critical-secondary', children: 'Excluir conta' }
};
export const CriticalTertiary: Story = {
  args: { variant: 'critical-tertiary', children: 'Excluir conta' }
};

/* ---------------- Estados / tamanhos ---------------- */

export const Disabled: Story = { args: { disabled: true, children: 'Indisponível' } };

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Largura total' },
  parameters: { layout: 'padded' }
};

export const WithIconLeft: Story = {
  args: { iconLeft: PlusIcon, children: 'Adicionar' }
};
export const WithIconRight: Story = {
  args: { iconRight: ArrowRightIcon, children: 'Avançar' }
};
export const IconOnly: Story = {
  args: { iconLeft: PlusIcon, children: undefined, 'aria-label': 'Adicionar' }
};

/* ---------------- Matriz completa ---------------- */

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'critical-primary',
  'critical-secondary',
  'critical-tertiary'
] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export const TodasAsVariantes: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Matriz de **todas as 6 hierarquias × 3 tamanhos**, mais o estado disabled. ' +
          'Alterne o tema no toolbar pra ver light × dark.'
      }
    }
  },
  render: () => (
    <div style={{ display: 'grid', gap: 28 }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 10 }}>
          <strong style={{ fontSize: 14, textTransform: 'capitalize' }}>{variant}</strong>
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                Continuar
              </Button>
            ))}
            <Button variant={variant} size="md" iconLeft={PlusIcon}>
              Com ícone
            </Button>
            <Button variant={variant} size="md" iconLeft={PlusIcon} aria-label="Add" />
            <Button variant={variant} size="md" disabled>
              Disabled
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
};
