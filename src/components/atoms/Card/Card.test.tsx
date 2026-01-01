import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Card } from './Card';

describe('Card', () => {
    describe('Rendering', () => {
        it('renders with children', () => {
            render(() => <Card>Card content</Card>);
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });

        it('renders with custom class', () => {
            const { container } = render(() => (
                <Card class="custom-class">Test</Card>
            ));
            const div = container.querySelector('div');
            expect(div?.className).toContain('custom-class');
        });
    });

    describe('Padding Variants', () => {
        const paddingMap = {
            none: 'p-0',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8'
        } as const;

        Object.entries(paddingMap).forEach(([padding, expectedClass]) => {
            it(`applies correct classes for ${padding} padding`, () => {
                const { container } = render(() => (
                    <Card padding={padding as any}>Test</Card>
                ));
                const div = container.querySelector('div');
                expect(div?.className).toContain(expectedClass);
            });
        });
    });

    describe('Elevation Variants', () => {
        it('applies flat elevation by default', () => {
            const { container } = render(() => <Card>Test</Card>);
            const div = container.querySelector('div');
            expect(div?.className).not.toContain('shadow-lg');
        });

        it('applies raised elevation when specified', () => {
            const { container } = render(() => (
                <Card elevation="raised">Test</Card>
            ));
            const div = container.querySelector('div');
            expect(div?.className).toContain('shadow-lg');
        });

        it('applies flat elevation when specified', () => {
            const { container } = render(() => (
                <Card elevation="flat">Test</Card>
            ));
            const div = container.querySelector('div');
            expect(div?.className).not.toContain('shadow-lg');
        });
    });

    describe('Base Styles', () => {
        it('applies base card styles', () => {
            const { container } = render(() => <Card>Test</Card>);
            const div = container.querySelector('div');
            expect(div?.className).toContain('rounded-lg');
            expect(div?.className).toContain('bg-secondary');
            expect(div?.className).toContain('border');
            expect(div?.className).toContain('border-ui-border');
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            render(() => (
                <Card aria-label="Product card">Content</Card>
            ));
            const card = screen.getByLabelText('Product card');
            expect(card).toBeInTheDocument();
        });
    });

    describe('Default Values', () => {
        it('uses default padding (md) when not specified', () => {
            const { container } = render(() => <Card>Test</Card>);
            const div = container.querySelector('div');
            expect(div?.className).toContain('p-6');
        });

        it('uses default elevation (flat) when not specified', () => {
            const { container } = render(() => <Card>Test</Card>);
            const div = container.querySelector('div');
            expect(div?.className).not.toContain('shadow-lg');
        });
    });
});

