import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Input } from "./Input";

describe("Input", () => {
    describe("Rendering", () => {
        it("renders with value", () => {
            render(() => <Input value="test value" />);
            const input = screen.getByDisplayValue("test value");
            expect(input).toBeInTheDocument();
        });

        it("renders with placeholder", () => {
            render(() => <Input value="" placeholder="Enter text..." />);
            expect(
                screen.getByPlaceholderText("Enter text...")
            ).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Input value="" class="custom-class" />
            ));
            const input = container.querySelector("input");
            expect(input?.className).toContain("custom-class");
        });

        it("renders with id", () => {
            render(() => <Input id="test-input" value="" />);
            expect(screen.getByRole("textbox")).toHaveAttribute(
                "id",
                "test-input"
            );
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClasses]) => {
            it(`applies correct classes for ${size} size`, () => {
                const { container } = render(() => (
                    <Input value="" size={size as any} />
                ));
                const input = container.querySelector("input");
                expectedClasses.split(" ").forEach((cls) => {
                    expect(input?.className).toContain(cls);
                });
            });
        });
    });

    describe("States", () => {
        it("is disabled when disabled prop is true", () => {
            render(() => <Input value="" disabled />);
            const input = screen.getByRole("textbox");
            expect(input).toBeDisabled();
            expect(input.className).toContain("opacity-50");
        });

        it("applies error state when aria-invalid is true", () => {
            const { container } = render(() => (
                <Input value="" aria-invalid={true} />
            ));
            const input = container.querySelector("input");
            expect(input?.className).toContain("border-red-600");
        });

        it("applies error state classes correctly", () => {
            const { container } = render(() => (
                <Input value="" aria-invalid={true} />
            ));
            const input = container.querySelector("input");
            expect(input?.className).toContain("focus:ring-red-600");
        });
    });

    describe("Interactions", () => {
        it("calls onInput when value changes", () => {
            const handleInput = vi.fn();
            render(() => <Input value="" onInput={handleInput} />);
            const input = screen.getByRole("textbox");
            fireEvent.input(input, { target: { value: "new value" } });
            expect(handleInput).toHaveBeenCalledWith("new value");
        });

        it("calls onChange when value changes", () => {
            const handleChange = vi.fn();
            render(() => <Input value="" onChange={handleChange} />);
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "new value" } });
            expect(handleChange).toHaveBeenCalledWith("new value");
        });

        it("updates value reactively", () => {
            const TestComponent = () => {
                const [value, setValue] = createSignal("");
                return (
                    <Input
                        value={value()}
                        onInput={(v) => setValue(v)}
                        placeholder="Type here"
                    />
                );
            };
            render(() => <TestComponent />);
            const input = screen.getByPlaceholderText(
                "Type here"
            ) as HTMLInputElement;
            fireEvent.input(input, { target: { value: "test" } });
            expect(input.value).toBe("test");
        });
    });

    describe("HTML Attributes", () => {
        it("supports required attribute", () => {
            render(() => <Input value="" required />);
            const input = screen.getByRole("textbox");
            expect(input).toBeRequired();
        });

        it("supports readonly attribute", () => {
            render(() => <Input value="readonly" readonly />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("readonly");
        });

        it("supports type attribute", () => {
            render(() => <Input type="email" value="" />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("type", "email");
        });

        it("defaults to text type when not specified", () => {
            render(() => <Input value="" />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("type", "text");
        });

        it("supports min and max attributes", () => {
            render(() => <Input type="number" value="5" min="0" max="10" />);
            const input = screen.getByRole("spinbutton");
            expect(input).toHaveAttribute("min", "0");
            expect(input).toHaveAttribute("max", "10");
        });

        it("supports pattern attribute", () => {
            render(() => <Input value="" pattern="[0-9]*" />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("pattern", "[0-9]*");
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => (
                <Input
                    value=""
                    aria-label="Email address"
                    aria-describedby="email-help"
                />
            ));
            const input = screen.getByLabelText("Email address");
            expect(input).toHaveAttribute("aria-describedby", "email-help");
        });

        it("supports aria-invalid for error states", () => {
            render(() => <Input value="" aria-invalid={true} />);
            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("aria-invalid", "true");
        });
    });

    describe("Default Values", () => {
        it("uses default size (md) when not specified", () => {
            const { container } = render(() => <Input value="" />);
            const input = container.querySelector("input");
            expect(input?.className).toContain("px-4 py-2");
        });

        it("uses default state when not disabled or invalid", () => {
            const { container } = render(() => <Input value="" />);
            const input = container.querySelector("input");
            expect(input?.className).not.toContain("opacity-50");
            expect(input?.className).not.toContain("border-red-600");
        });
    });
});
