import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

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
      options: ['primary', 'secondary', 'tertiary', 'critical', 'critical-secondary']
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    onClick: { action: 'clicked' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Botão do uniDS. Consome tokens semânticos `--button-{variant}-{state}` e respeita o tema ativo em `<html data-theme="light|dark">`. Selecione o tema no toolbar do Storybook.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Critical: Story = { args: { variant: 'critical', children: 'Excluir conta' } };
export const CriticalSecondary: Story = {
  args: { variant: 'critical-secondary', children: 'Excluir conta' }
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Indisponível' }
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Largura total' },
  parameters: { layout: 'padded' }
};

const sizes = ['sm', 'md', 'lg'] as const;
const variants = [
  'primary',
  'secondary',
  'tertiary',
  'critical',
  'critical-secondary'
] as const;

export const TodasAsVariantes: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Matriz de todas as variantes × tamanhos. Use o toolbar de tema para alternar entre light e dark.'
      }
    }
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: 8 }}>
          <strong style={{ font: 'inherit', textTransform: 'capitalize' }}>{variant}</strong>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {size.toUpperCase()}
              </Button>
            ))}
            <Button variant={variant} size="md" disabled>
              Disabled
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
};
