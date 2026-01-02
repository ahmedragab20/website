import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Label } from "./Label";

describe("Label", () => {
    describe("Rendering", () => {
        it("renders with children", () => {
            render(() => <Label>Email Address</Label>);
            expect(screen.getByText("Email Address")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Label class="custom-class">Test</Label>
            ));
            const label = container.querySelector("label");
            expect(label?.className).toContain("custom-class");
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClass]) => {
            it(`applies correct classes for ${size} size`, () => {
                const { container } = render(() => (
                    <Label size={size as any}>Test</Label>
                ));
                const label = container.querySelector("label");
                expect(label?.className).toContain(expectedClass);
            });
        });
    });

    describe("Required Indicator", () => {
        it("shows required asterisk when required is true", () => {
            render(() => <Label required>Email</Label>);
            const asterisk = screen.getByLabelText("required");
            expect(asterisk).toBeInTheDocument();
            expect(asterisk.textContent).toBe("*");
        });

        it("does not show required asterisk when required is false", () => {
            render(() => <Label required={false}>Email</Label>);
            expect(screen.queryByLabelText("required")).not.toBeInTheDocument();
        });

        it("does not show required asterisk when required is not specified", () => {
            render(() => <Label>Email</Label>);
            expect(screen.queryByLabelText("required")).not.toBeInTheDocument();
        });

        it("required asterisk has correct styling", () => {
            const { container } = render(() => <Label required>Email</Label>);
            const asterisk = container.querySelector(".text-error");
            expect(asterisk).toBeInTheDocument();
        });
    });

    describe("Label Association", () => {
        it("associates with input using for attribute", () => {
            render(() => (
                <>
                    <Label for="email-input">Email</Label>
                    <input id="email-input" />
                </>
            ));
            const label = screen.getByText("Email");
            expect(label).toHaveAttribute("for", "email-input");
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => <Label aria-label="Form label">Email</Label>);
            const label = screen.getByLabelText("Form label");
            expect(label).toBeInTheDocument();
        });
    });

    describe("Default Values", () => {
        it("uses default size (md) when not specified", () => {
            const { container } = render(() => <Label>Test</Label>);
            const label = container.querySelector("label");
            expect(label?.className).toContain("text-sm");
        });
    });
});
