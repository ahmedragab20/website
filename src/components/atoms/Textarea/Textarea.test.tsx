import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
    describe("Rendering", () => {
        it("renders with value", () => {
            render(() => <Textarea value="test value" />);
            const textarea = screen.getByDisplayValue("test value");
            expect(textarea).toBeInTheDocument();
        });

        it("renders with placeholder", () => {
            render(() => <Textarea value="" placeholder="Enter text..." />);
            expect(
                screen.getByPlaceholderText("Enter text...")
            ).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Textarea value="" class="custom-class" />
            ));
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("custom-class");
        });

        it("renders with id", () => {
            render(() => <Textarea id="test-textarea" value="" />);
            expect(screen.getByRole("textbox")).toHaveAttribute(
                "id",
                "test-textarea"
            );
        });

        it("renders with default rows when not specified", () => {
            render(() => <Textarea value="" />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).not.toHaveAttribute("rows");
        });

        it("renders with custom rows", () => {
            render(() => <Textarea value="" rows={5} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("rows", "5");
        });

        it("renders with cols attribute", () => {
            render(() => <Textarea value="" cols={40} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("cols", "40");
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
                    <Textarea value="" size={size as any} />
                ));
                const textarea = container.querySelector("textarea");
                expectedClasses.split(" ").forEach((cls) => {
                    expect(textarea?.className).toContain(cls);
                });
            });
        });
    });

    describe("Resize Options", () => {
        const resizeMap = {
            none: "resize-none",
            vertical: "resize-y",
            horizontal: "resize-x",
            both: "resize",
        } as const;

        Object.entries(resizeMap).forEach(([resize, expectedClass]) => {
            it(`applies correct resize classes for ${resize} resize`, () => {
                const { container } = render(() => (
                    <Textarea value="" resize={resize as any} />
                ));
                const textarea = container.querySelector("textarea");
                expect(textarea?.className).toContain(expectedClass);
            });
        });

        it("uses default resize (none) when not specified", () => {
            const { container } = render(() => <Textarea value="" />);
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("resize-none");
        });
    });

    describe("States", () => {
        it("is disabled when disabled prop is true", () => {
            render(() => <Textarea value="" disabled />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeDisabled();
            expect(textarea.className).toContain("opacity-50");
        });

        it("applies error state when aria-invalid is true", () => {
            const { container } = render(() => (
                <Textarea value="" aria-invalid={true} />
            ));
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("border-error");
        });

        it("applies error state classes correctly", () => {
            const { container } = render(() => (
                <Textarea value="" aria-invalid={true} />
            ));
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("focus:ring-error");
        });

        it("applies disabled state classes correctly", () => {
            const { container } = render(() => <Textarea value="" disabled />);
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("bg-tertiary");
        });
    });

    describe("Interactions", () => {
        it("calls onInput when value changes", () => {
            const handleInput = vi.fn();
            render(() => <Textarea value="" onInput={handleInput} />);
            const textarea = screen.getByRole("textbox");
            fireEvent.input(textarea, { target: { value: "new value" } });
            expect(handleInput).toHaveBeenCalledWith("new value");
        });

        it("calls onChange when value changes", () => {
            const handleChange = vi.fn();
            render(() => <Textarea value="" onChange={handleChange} />);
            const textarea = screen.getByRole("textbox");
            fireEvent.change(textarea, { target: { value: "new value" } });
            expect(handleChange).toHaveBeenCalledWith("new value");
        });

        it("updates value reactively", () => {
            const TestComponent = () => {
                const [value, setValue] = createSignal("");
                return (
                    <Textarea
                        value={value()}
                        onInput={(v) => setValue(v)}
                        placeholder="Type here"
                    />
                );
            };
            render(() => <TestComponent />);
            const textarea = screen.getByPlaceholderText(
                "Type here"
            ) as HTMLTextAreaElement;
            fireEvent.input(textarea, { target: { value: "test" } });
            expect(textarea.value).toBe("test");
        });
    });

    describe("HTML Attributes", () => {
        it("supports required attribute", () => {
            render(() => <Textarea value="" required />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeRequired();
        });

        it("supports readonly attribute", () => {
            render(() => <Textarea value="readonly" readonly />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("readonly");
        });

        it("supports rows attribute", () => {
            render(() => <Textarea value="" rows={4} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("rows", "4");
        });

        it("supports cols attribute", () => {
            render(() => <Textarea value="" cols={50} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("cols", "50");
        });

        it("supports minlength attribute", () => {
            render(() => <Textarea value="" minlength={10} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("minlength", "10");
        });

        it("supports maxlength attribute", () => {
            render(() => <Textarea value="" maxlength={100} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("maxlength", "100");
        });

        it("supports wrap attribute", () => {
            render(() => <Textarea value="" wrap="hard" />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("wrap", "hard");
        });

        it("supports autocomplete attribute", () => {
            render(() => <Textarea value="" autocomplete="off" />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("autocomplete", "off");
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => (
                <Textarea
                    value=""
                    aria-label="Message"
                    aria-describedby="message-help"
                />
            ));
            const textarea = screen.getByLabelText("Message");
            expect(textarea).toHaveAttribute(
                "aria-describedby",
                "message-help"
            );
        });

        it("supports aria-invalid for error states", () => {
            render(() => <Textarea value="" aria-invalid={true} />);
            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("aria-invalid", "true");
        });

        it("supports aria-label for screen readers", () => {
            render(() => <Textarea value="" aria-label="Enter your message" />);
            const textarea = screen.getByLabelText("Enter your message");
            expect(textarea).toBeInTheDocument();
        });
    });

    describe("Default Values", () => {
        it("uses default size (md) when not specified", () => {
            const { container } = render(() => <Textarea value="" />);
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("px-4 py-2");
        });

        it("uses default resize (none) when not specified", () => {
            const { container } = render(() => <Textarea value="" />);
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).toContain("resize-none");
        });

        it("uses default state when not disabled or invalid", () => {
            const { container } = render(() => <Textarea value="" />);
            const textarea = container.querySelector("textarea");
            expect(textarea?.className).not.toContain("opacity-50");
            expect(textarea?.className).not.toContain("border-error");
        });
    });

    describe("Edge Cases", () => {
        it("handles empty value correctly", () => {
            render(() => <Textarea value="" />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
            expect(textarea.value).toBe("");
        });

        it("handles long text content", () => {
            const longText = "a".repeat(1000);
            render(() => <Textarea value={longText} />);
            const textarea = screen.getByDisplayValue(
                longText
            ) as HTMLTextAreaElement;
            expect(textarea.value).toBe(longText);
        });

        it("handles multiline text content", () => {
            const multilineText = "Line 1\nLine 2\nLine 3";
            render(() => <Textarea value={multilineText} />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
            expect(textarea.value).toBe(multilineText);
        });

        it("handles special characters in value", () => {
            const specialText = "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
            render(() => <Textarea value={specialText} />);
            const textarea = screen.getByDisplayValue(
                specialText
            ) as HTMLTextAreaElement;
            expect(textarea.value).toBe(specialText);
        });
    });
});
