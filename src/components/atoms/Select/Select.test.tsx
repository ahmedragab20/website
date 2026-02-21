import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Select } from "./Select";

describe("Select", () => {
    describe("Rendering", () => {
        it("renders with options", () => {
            render(() => (
                <Select>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                </Select>
            ));
            expect(screen.getByText("Option 1")).toBeInTheDocument();
            expect(screen.getByText("Option 2")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Select class="custom-class">
                    <option>Test</option>
                </Select>
            ));

            // The wrapper has the class
            expect(container.firstChild).toHaveClass("custom-class");
        });
    });

    describe("Variants", () => {
        const errorClasses = ["border-error", "focus:ring-error"];

        it("applies error styles when variant is error", () => {
            render(() => (
                <Select variant="error" data-testid="select">
                    <option>Test</option>
                </Select>
            ));
            const select = screen.getByTestId("select");
            errorClasses.forEach((c) => {
                expect(select.className).toContain(c);
            });
        });

        it("applies error styles when aria-invalid is true", () => {
            render(() => (
                <Select aria-invalid={true} data-testid="select">
                    <option>Test</option>
                </Select>
            ));
            const select = screen.getByTestId("select");
            errorClasses.forEach((c) => {
                expect(select.className).toContain(c);
            });
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: { select: "px-3 py-1.5 text-sm", arrow: "w-4 h-4" },
            md: { select: "px-4 py-2 text-base", arrow: "w-5 h-5" },
            lg: { select: "px-6 py-3 text-lg", arrow: "w-6 h-6" },
        } as const;

        Object.entries(sizeMap).forEach(([size, expected]) => {
            it(`applies correct classes for ${size} size`, () => {
                render(() => (
                    <Select size={size as any} data-testid={`select-${size}`}>
                        <option>Test</option>
                    </Select>
                ));
                const select = screen.getByTestId(`select-${size}`);
                expect(select.className).toContain(expected.select);
                // Arrow check is harder since it's a sibling, but we trust visual/class check on wrapper?
                // We can check sibling
                const wrapper = select.parentElement;
                const arrow = wrapper?.querySelector("div[aria-hidden='true']");
                expect(arrow?.className).toContain(expected.arrow);
            });
        });
    });

    describe("States", () => {
        it("is disabled when disabled prop is true", () => {
            render(() => (
                <Select disabled>
                    {" "}
                    <option>test</option>{" "}
                </Select>
            ));
            const select = screen.getByRole("combobox");
            expect(select).toBeDisabled();
            expect(select.className).toContain("cursor-not-allowed");
        });
    });

    describe("Interactions", () => {
        it("handles change events", () => {
            const handleChange = vi.fn();
            render(() => (
                <Select onChange={handleChange} data-testid="select">
                    <option value="1">1</option>
                    <option value="2">2</option>
                </Select>
            ));
            const select = screen.getByTestId("select");
            fireEvent.change(select, { target: { value: "2" } });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
});
