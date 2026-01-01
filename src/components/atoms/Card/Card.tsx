import { splitProps, type JSX } from 'solid-js';
import { tv } from 'tailwind-variants';

const card = tv({
  base: 'rounded-lg bg-secondary border border-ui-border',
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    },
    elevation: {
      flat: '',
      raised: 'shadow-lg'
    }
  },
  defaultVariants: {
    padding: 'md',
    elevation: 'flat'
  }
});

export interface CardProps {
  children: JSX.Element;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 'flat' | 'raised';
  class?: string;
  'aria-label'?: string;
}

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, [
    'children',
    'padding',
    'elevation',
    'class'
  ]);
  
  return (
    <div
      class={card({
        padding: local.padding,
        elevation: local.elevation,
        class: local.class
      })}
      aria-label={others['aria-label']}
      {...others}
    >
      {local.children}
    </div>
  );
}

