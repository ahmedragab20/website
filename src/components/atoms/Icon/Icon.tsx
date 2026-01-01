import { splitProps, type JSX } from 'solid-js';
import { tv } from 'tailwind-variants';

const icon = tv({
  base: 'flex-shrink-0',
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    },
    color: {
      default: 'text-fg-main',
      muted: 'text-fg-muted',
      accent: 'text-accent',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600'
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'default'
  }
});

export interface IconProps {
  children: JSX.Element; // Lucide icon component
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  class?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export function Icon(props: IconProps) {
  const [local, others] = splitProps(props, [
    'children',
    'size',
    'color',
    'class',
    'aria-label',
    'aria-hidden'
  ]);
  
  return (
    <span
      class={icon({
        size: local.size,
        color: local.color,
        class: local.class
      })}
      aria-label={local['aria-label']}
      aria-hidden={local['aria-hidden'] ?? (local['aria-label'] ? false : true)}
      {...others}
    >
      {local.children}
    </span>
  );
}

