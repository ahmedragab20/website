import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Icon } from './Icon';

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('Icon', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(() => (
        <Icon>
          <MockIcon />
        </Icon>
      ));
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders with custom class', () => {
      const { container } = render(() => (
        <Icon class="custom-class">
          <MockIcon />
        </Icon>
      ));
      const span = container.querySelector('span');
      expect(span?.className).toContain('custom-class');
    });
  });

  describe('Sizes', () => {
    const sizeMap = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8'
    } as const;

    Object.entries(sizeMap).forEach(([size, expectedClass]) => {
      it(`applies correct classes for ${size} size`, () => {
        const { container } = render(() => (
          <Icon size={size as any}>
            <MockIcon />
          </Icon>
        ));
        const span = container.querySelector('span');
        expect(span?.className).toContain(expectedClass);
      });
    });
  });

  describe('Colors', () => {
    const colorMap = {
      default: 'text-fg-main',
      muted: 'text-fg-muted',
      accent: 'text-accent',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600'
    } as const;

    Object.entries(colorMap).forEach(([color, expectedClass]) => {
      it(`applies correct classes for ${color} color`, () => {
        const { container } = render(() => (
          <Icon color={color as any}>
            <MockIcon />
          </Icon>
        ));
        const span = container.querySelector('span');
        expect(span?.className).toContain(expectedClass);
      });
    });
  });

  describe('Accessibility', () => {
    it('has aria-hidden when no aria-label is provided', () => {
      const { container } = render(() => (
        <Icon>
          <MockIcon />
        </Icon>
      ));
      const span = container.querySelector('span');
      expect(span).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not have aria-hidden when aria-label is provided', () => {
      const { container } = render(() => (
        <Icon aria-label="Close dialog">
          <MockIcon />
        </Icon>
      ));
      const span = container.querySelector('span');
      expect(span).toHaveAttribute('aria-label', 'Close dialog');
      expect(span).toHaveAttribute('aria-hidden', 'false');
    });

    it('respects explicit aria-hidden prop', () => {
      const { container } = render(() => (
        <Icon aria-hidden={false}>
          <MockIcon />
        </Icon>
      ));
      const span = container.querySelector('span');
      expect(span).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Default Values', () => {
    it('uses default size (md) when not specified', () => {
      const { container } = render(() => (
        <Icon>
          <MockIcon />
        </Icon>
      ));
      const span = container.querySelector('span');
      expect(span?.className).toContain('w-5 h-5');
    });

    it('uses default color (default) when not specified', () => {
      const { container } = render(() => (
        <Icon>
          <MockIcon />
        </Icon>
      ));
      const span = container.querySelector('span');
      expect(span?.className).toContain('text-fg-main');
    });
  });
});

