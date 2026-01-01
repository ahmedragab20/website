import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { Button } from './Button';

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(() => <Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with custom class', () => {
      const { container } = render(() => (
        <Button class="custom-class">Test</Button>
      ));
      const button = container.querySelector('button');
      expect(button?.className).toContain('custom-class');
    });

    it('renders with icon on left by default', () => {
      render(() => (
        <Button icon={<MockIcon />}>With Icon</Button>
      ));
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('renders with icon on right when specified', () => {
      render(() => (
        <Button icon={<MockIcon />} iconPosition="right">
          With Icon
        </Button>
      ));
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variantMap = {
      solid: 'bg-accent',
      subtle: 'bg-accent/20',
      text: 'bg-transparent',
      outline: 'border-2'
    } as const;

    Object.entries(variantMap).forEach(([variant, expectedClass]) => {
      it(`applies correct classes for ${variant} variant`, () => {
        const { container } = render(() => (
          <Button variant={variant as any}>Test</Button>
        ));
        const button = container.querySelector('button');
        expect(button?.className).toContain(expectedClass);
      });
    });
  });

  describe('Colors', () => {
    const colorMap = {
      accent: 'bg-accent',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600'
    } as const;

    Object.entries(colorMap).forEach(([color, expectedClass]) => {
      it(`applies correct classes for ${color} color with solid variant`, () => {
        const { container } = render(() => (
          <Button variant="solid" color={color as any}>
            Test
          </Button>
        ));
        const button = container.querySelector('button');
        expect(button?.className).toContain(expectedClass);
      });
    });
  });

  describe('Sizes', () => {
    const sizeMap = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    } as const;

    Object.entries(sizeMap).forEach(([size, expectedClasses]) => {
      it(`applies correct classes for ${size} size`, () => {
        const { container } = render(() => (
          <Button size={size as any}>Test</Button>
        ));
        const button = container.querySelector('button');
        expectedClasses.split(' ').forEach((cls) => {
          expect(button?.className).toContain(cls);
        });
      });
    });
  });

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(() => <Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button.className).toContain('opacity-50');
    });

    it('is disabled when loading prop is true', () => {
      render(() => <Button loading>Loading</Button>);
      const button = screen.getByText('Loading');
      expect(button).toBeDisabled();
      expect(button.className).toContain('opacity-75');
    });

    it('shows loading spinner when loading', () => {
      const { container } = render(() => (
        <Button loading>Loading</Button>
      ));
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('shows loading icon when loading and icon provided', () => {
      render(() => (
        <Button loading icon={<MockIcon />}>
          Loading
        </Button>
      ));
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Click</Button>);
      screen.getByText('Click').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(() => (
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      ));
      screen.getByText('Disabled').click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(() => (
        <Button onClick={handleClick} loading>
          Loading
        </Button>
      ));
      screen.getByText('Loading').click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles Enter key press', () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Submit</Button>);
      const button = screen.getByText('Submit');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press', () => {
      const handleClick = vi.fn();
      render(() => <Button onClick={handleClick}>Submit</Button>);
      const button = screen.getByText('Submit');
      button.focus();
      fireEvent.keyDown(button, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle keyboard events when disabled', () => {
      const handleClick = vi.fn();
      render(() => (
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      ));
      const button = screen.getByText('Disabled');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(() => (
        <Button aria-label="Close dialog" disabled>
          Close
        </Button>
      ));
      const button = screen.getByLabelText('Close dialog');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('has default type of button', () => {
      const { container } = render(() => <Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('respects custom type prop', () => {
      const { container } = render(() => (
        <Button type="submit">Submit</Button>
      ));
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Default Values', () => {
    it('uses default variant (solid) when not specified', () => {
      const { container } = render(() => <Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-accent');
    });

    it('uses default color (accent) when not specified', () => {
      const { container } = render(() => <Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-accent');
    });

    it('uses default size (md) when not specified', () => {
      const { container } = render(() => <Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('px-4 py-2');
    });
  });
});

