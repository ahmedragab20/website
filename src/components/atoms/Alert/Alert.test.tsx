import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Alert } from "./Alert";

describe("Alert", () => {
    describe("Rendering", () => {
        it("renders children correctly", () => {
            render(() => <Alert>Test Alert</Alert>);
            expect(screen.getByText("Test Alert")).toBeInTheDocument();
        });

        it("renders with title when provided", () => {
            render(() => <Alert title="Alert Title">Alert content</Alert>);
            expect(screen.getByText("Alert Title")).toBeInTheDocument();
            expect(screen.getByText("Alert content")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Alert class="custom-class">Test</Alert>
            ));
            const alert = container.querySelector('[role="alert"]');
            expect(alert?.className).toContain("custom-class");
        });
    });

    describe("Variants", () => {
        const variantMap = {
            solid: "bg-accent text-primary",
            subtle: "bg-accent/20",
            outline: "bg-primary text-accent border-accent",
        } as const;

        Object.entries(variantMap).forEach(([variant, expectedClass]) => {
            it(`applies correct classes for ${variant} variant`, () => {
                const { container } = render(() => (
                    <Alert variant={variant as any}>Test</Alert>
                ));
                const alert = container.querySelector('[role="alert"]');
                expect(alert?.className).toContain(expectedClass);
            });
        });
    });

    describe("Colors", () => {
        const colorMap = {
            accent: "text-accent",
            success: "text-success",
            warning: "text-warning",
            error: "text-error",
        } as const;

        Object.entries(colorMap).forEach(([color, expectedClass]) => {
            it(`applies correct classes for ${color} color`, () => {
                const { container } = render(() => (
                    <Alert variant="outline" color={color as any}>
                        Test
                    </Alert>
                ));
                const alert = container.querySelector('[role="alert"]');
                expect(alert?.className).toContain(expectedClass);
            });
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: "p-3 text-sm",
            md: "p-4 text-base",
            lg: "p-6 text-lg",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClasses]) => {
            it(`applies correct classes for ${size} size`, () => {
                const { container } = render(() => (
                    <Alert size={size as any}>Test</Alert>
                ));
                const alert = container.querySelector('[role="alert"]');
                expectedClasses.split(" ").forEach((cls) => {
                    expect(alert?.className).toContain(cls);
                });
            });
        });
    });

    describe("Interactions", () => {
        it("renders dismiss button when onDismiss is provided", () => {
            const onDismiss = vi.fn();
            render(() => (
                <Alert onDismiss={onDismiss}>Dismissible Alert</Alert>
            ));
            const button = screen.getByLabelText("Dismiss alert");
            expect(button).toBeInTheDocument();

            fireEvent.click(button);
            expect(onDismiss).toHaveBeenCalled();
        });

        it("does not render dismiss button when onDismiss is missing", () => {
            render(() => <Alert>Not Dismissible</Alert>);
            expect(
                screen.queryByLabelText("Dismiss alert")
            ).not.toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has proper role attribute", () => {
            render(() => <Alert>Test Alert</Alert>);
            const alert = screen.getByRole("alert");
            expect(alert).toBeInTheDocument();
        });

        it("has custom aria-label when provided", () => {
            render(() => (
                <Alert aria-label="Custom alert label">Alert content</Alert>
            ));
            const alert = screen.getByRole("alert");
            expect(alert).toHaveAttribute("aria-label", "Custom alert label");
        });

        it("has dismiss button with proper aria-label", () => {
            const onDismiss = vi.fn();
            render(() => <Alert onDismiss={onDismiss}>Test</Alert>);
            const button = screen.getByLabelText("Dismiss alert");
            expect(button).toBeInTheDocument();
        });
    });

    describe("Default Values", () => {
        it("uses default variant when not specified", () => {
            const { container } = render(() => <Alert>Test</Alert>);
            const alert = container.querySelector('[role="alert"]');
            expect(alert?.className).toContain("bg-accent text-primary");
        });

        it("uses default color when not specified", () => {
            const { container } = render(() => <Alert>Test</Alert>);
            const alert = container.querySelector('[role="alert"]');
            expect(alert?.className).toContain(
                "bg-accent text-primary border-accent"
            );
        });

        it("uses default size when not specified", () => {
            const { container } = render(() => <Alert>Test</Alert>);
            const alert = container.querySelector('[role="alert"]');
            expect(alert?.className).toContain("p-4 text-base");
        });
    });
});
