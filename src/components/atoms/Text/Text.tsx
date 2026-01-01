import { splitProps, type JSX } from 'solid-js';
import { tv } from 'tailwind-variants';

const text = tv({
  base: '',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    color: {
      main: 'text-fg-main',
      muted: 'text-fg-muted',
      accent: 'text-accent'
    },
    font: {
      sans: 'font-sans',
      mono: 'font-mono'
    }
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'main',
    font: 'sans'
  }
});

export interface TextProps {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: JSX.Element;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'main' | 'muted' | 'accent';
  font?: 'sans' | 'mono';
  class?: string;
  'aria-label'?: string;
}

const createTextElement = (
  tag: string,
  props: Record<string, any>,
  children: JSX.Element
) => {
  const elementMap = {
    p: <p {...props}>{children}</p>,
    span: <span {...props}>{children}</span>,
    div: <div {...props}>{children}</div>,
    h1: <h1 {...props}>{children}</h1>,
    h2: <h2 {...props}>{children}</h2>,
    h3: <h3 {...props}>{children}</h3>,
    h4: <h4 {...props}>{children}</h4>,
    h5: <h5 {...props}>{children}</h5>,
    h6: <h6 {...props}>{children}</h6>
  } as const;
  
  return elementMap[tag as keyof typeof elementMap] || elementMap.p;
};

export function Text(props: TextProps) {
  const [local, others] = splitProps(props, [
    'children',
    'size',
    'weight',
    'color',
    'font',
    'class',
    'as'
  ]);
  
  const tag = local.as || 'p';
  const className = text({
    size: local.size,
    weight: local.weight,
    color: local.color,
    font: local.font,
    class: local.class
  });
  
  return createTextElement(
    tag,
    {
      class: className,
      'aria-label': others['aria-label'],
      ...others
    },
    local.children
  );
}

