import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Text } from './Text';

describe('Text', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(() => <Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders as paragraph by default', () => {
      const { container } = render(() => <Text>Test</Text>);
      const element = container.querySelector('p');
      expect(element).toBeInTheDocument();
    });

    it('renders with custom class', () => {
      const { container } = render(() => (
        <Text class="custom-class">Test</Text>
      ));
      const element = container.querySelector('p');
      expect(element?.className).toContain('custom-class');
    });
  });

  describe('Polymorphic Rendering', () => {
    const elementMap = {
      p: 'p',
      span: 'span',
      div: 'div',
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6'
    } as const;

    Object.entries(elementMap).forEach(([as, tagName]) => {
      it(`renders as ${tagName} when as="${as}"`, () => {
        const { container } = render(() => (
          <Text as={as as any}>Test</Text>
        ));
        const element = container.querySelector(tagName);
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('Sizes', () => {
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl'
    } as const;

    Object.entries(sizeMap).forEach(([size, expectedClass]) => {
      it(`applies correct classes for ${size} size`, () => {
        const { container } = render(() => (
          <Text size={size as any}>Test</Text>
        ));
        const element = container.querySelector('p');
        expect(element?.className).toContain(expectedClass);
      });
    });
  });

  describe('Weights', () => {
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    } as const;

    Object.entries(weightMap).forEach(([weight, expectedClass]) => {
      it(`applies correct classes for ${weight} weight`, () => {
        const { container } = render(() => (
          <Text weight={weight as any}>Test</Text>
        ));
        const element = container.querySelector('p');
        expect(element?.className).toContain(expectedClass);
      });
    });
  });

  describe('Colors', () => {
    const colorMap = {
      main: 'text-fg-main',
      muted: 'text-fg-muted',
      accent: 'text-accent'
    } as const;

    Object.entries(colorMap).forEach(([color, expectedClass]) => {
      it(`applies correct classes for ${color} color`, () => {
        const { container } = render(() => (
          <Text color={color as any}>Test</Text>
        ));
        const element = container.querySelector('p');
        expect(element?.className).toContain(expectedClass);
      });
    });
  });

  describe('Fonts', () => {
    const fontMap = {
      sans: 'font-sans',
      mono: 'font-mono'
    } as const;

    Object.entries(fontMap).forEach(([font, expectedClass]) => {
      it(`applies correct classes for ${font} font`, () => {
        const { container } = render(() => (
          <Text font={font as any}>Test</Text>
        ));
        const element = container.querySelector('p');
        expect(element?.className).toContain(expectedClass);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(() => (
        <Text aria-label="Description text">Content</Text>
      ));
      const element = screen.getByLabelText('Description text');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('uses default size (base) when not specified', () => {
      const { container } = render(() => <Text>Test</Text>);
      const element = container.querySelector('p');
      expect(element?.className).toContain('text-base');
    });

    it('uses default weight (normal) when not specified', () => {
      const { container } = render(() => <Text>Test</Text>);
      const element = container.querySelector('p');
      expect(element?.className).toContain('font-normal');
    });

    it('uses default color (main) when not specified', () => {
      const { container } = render(() => <Text>Test</Text>);
      const element = container.querySelector('p');
      expect(element?.className).toContain('text-fg-main');
    });

    it('uses default font (sans) when not specified', () => {
      const { container } = render(() => <Text>Test</Text>);
      const element = container.querySelector('p');
      expect(element?.className).toContain('font-sans');
    });
  });
});

