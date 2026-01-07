import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { PinInput } from "./PinInput";

describe("PinInput", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders correct number of input fields", () => {
            const value = ["", "", "", "", "", ""];
            render(() => <PinInput value={value} onChange={() => {}} />);

            const inputs = screen.getAllByRole("textbox");
            expect(inputs).toHaveLength(6);
        });

        it("renders custom length", () => {
            const value = ["", "", ""];
            render(() => (
                <PinInput length={4} value={value} onChange={() => {}} />
            ));

            const inputs = screen.getAllByRole("textbox");
            expect(inputs).toHaveLength(4);
        });

        it("renders with custom aria-label", () => {
            const value = ["", "", ""];
            render(() => (
                <PinInput
                    value={value}
                    onChange={() => {}}
                    aria-label="Verification code"
                />
            ));

            expect(
                screen.getByLabelText("Verification code")
            ).toBeInTheDocument();
        });
    });

    describe("Input Behavior", () => {
        it("accepts numeric input", () => {
            const value = ["", "", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            fireEvent.input(inputs[0], { target: { value: "5" } });

            expect(handleChange).toHaveBeenCalledWith(["5", "", ""]);
        });

        it("rejects non-numeric input", () => {
            const value = ["", "", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            fireEvent.input(inputs[0], { target: { value: "abc" } });

            // Should only accept empty string (numeric chars filtered out)
            expect(handleChange).toHaveBeenCalledWith(["", "", ""]);
        });

        it("auto-focuses next input on entry", () => {
            const value = ["", "", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            inputs[0].focus();
            fireEvent.input(inputs[0], { target: { value: "5" } });

            // Next input should be focused
            expect(inputs[1]).toHaveFocus();
        });

        it("handles backspace correctly", () => {
            const value = ["1", "2", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            inputs[1].focus();
            fireEvent.keyDown(inputs[1], { key: "Backspace" });

            expect(handleChange).toHaveBeenCalledWith(["1", "", ""]);
            expect(inputs[1]).toHaveFocus();
        });

        it("handles keyboard navigation", () => {
            const value = ["", "", ""];
            render(() => <PinInput value={value} onChange={() => {}} />);

            const inputs = screen.getAllByRole("textbox");
            inputs[0].focus();

            // Arrow right
            fireEvent.keyDown(inputs[0], { key: "ArrowRight" });
            expect(inputs[1]).toHaveFocus();

            // Arrow left
            fireEvent.keyDown(inputs[1], { key: "ArrowLeft" });
            expect(inputs[0]).toHaveFocus();

            // Home key
            fireEvent.keyDown(inputs[1], { key: "Home" });
            expect(inputs[0]).toHaveFocus();

            // End key
            fireEvent.keyDown(inputs[0], { key: "End" });
            expect(inputs[2]).toHaveFocus();
        });
    });

    describe("Paste Functionality", () => {
        it("handles paste with numbers", () => {
            const value = ["", "", "", "", "", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            inputs[0].focus();

            const pasteEvent = new Event("paste", {
                bubbles: true,
                cancelable: true,
            } as EventInit);
            Object.assign(pasteEvent, {
                clipboardData: {
                    getData: () => "1234",
                },
            });

            fireEvent(inputs[0], pasteEvent);

            // Verify final state instead of call count
            expect(handleChange).toHaveBeenCalledWith([
                "1",
                "2",
                "3",
                "4",
                "",
                "",
            ]);
        });

        it("filters non-numeric characters from paste", () => {
            const value = ["", "", "", "", "", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            inputs[0].focus();

            const pasteEvent = new Event("paste", {
                bubbles: true,
                cancelable: true,
            } as EventInit);
            Object.assign(pasteEvent, {
                clipboardData: {
                    getData: () => "a1b2c3",
                },
            });

            fireEvent(inputs[0], pasteEvent);

            // Verify final state - default length is 6
            expect(handleChange).toHaveBeenCalledWith([
                "1",
                "2",
                "3",
                "",
                "",
                "",
            ]);
        });

        it("limits paste to pin length", () => {
            const value = ["", "", "", "", "", ""];
            const handleChange = vi.fn();
            render(() => <PinInput value={value} onChange={handleChange} />);

            const inputs = screen.getAllByRole("textbox");
            inputs[0].focus();

            const pasteEvent = new Event("paste", {
                bubbles: true,
                cancelable: true,
            } as EventInit);
            Object.assign(pasteEvent, {
                clipboardData: {
                    getData: () => "1234567",
                },
            });

            fireEvent(inputs[0], pasteEvent);

            // Verify final state - should truncate to pin length (6)
            expect(handleChange).toHaveBeenCalledWith([
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
            ]);
        });
    });

    describe("States", () => {
        it("applies disabled state", () => {
            const value = ["", "", ""];
            render(() => (
                <PinInput value={value} onChange={() => {}} disabled />
            ));

            const inputs = screen.getAllByRole("textbox");
            inputs.forEach((input) => {
                expect(input).toBeDisabled();
            });
        });

        it("applies error state", () => {
            const value = ["", "", ""];
            render(() => <PinInput value={value} onChange={() => {}} error />);

            const container = screen.getByRole("group");
            expect(container).toHaveAttribute("aria-invalid", "true");
        });

        it("applies completed state", () => {
            const value = ["1", "2", "3"];
            render(() => <PinInput value={value} onChange={() => {}} />);

            const inputs = screen.getAllByRole("textbox");
            // Should have filled attributes when fields are filled
            expect(inputs[0]).toHaveAttribute("data-filled", "true");
            expect(inputs[1]).toHaveAttribute("data-filled", "true");
            expect(inputs[2]).toHaveAttribute("data-filled", "true");
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            const value = ["", "", ""];
            render(() => (
                <PinInput
                    value={value}
                    onChange={() => {}}
                    aria-label="Enter PIN"
                    aria-describedby="pin-help"
                    length={3}
                />
            ));

            const container = screen.getByRole("group");
            expect(container).toHaveAttribute("aria-label", "Enter PIN");
            expect(container).toHaveAttribute("aria-describedby", "pin-help");

            const inputs = screen.getAllByRole("textbox");
            expect(inputs[0]).toHaveAttribute("aria-label", "Digit 1 of 3");
            expect(inputs[1]).toHaveAttribute("aria-label", "Digit 2 of 3");
            expect(inputs[2]).toHaveAttribute("aria-label", "Digit 3 of 3");
        });

        it("sets aria-invalid on empty inputs", () => {
            const value = ["1", "", "3"];
            render(() => <PinInput value={value} onChange={() => {}} />);

            const inputs = screen.getAllByRole("textbox");
            expect(inputs[0]).toHaveAttribute("aria-invalid", "false");
            expect(inputs[1]).toHaveAttribute("aria-invalid", "true");
            expect(inputs[2]).toHaveAttribute("aria-invalid", "false");
        });

        it("uses appropriate input mode", () => {
            const value = ["", "", ""];
            render(() => <PinInput value={value} onChange={() => {}} />);

            const inputs = screen.getAllByRole("textbox");
            inputs.forEach((input) => {
                expect(input).toHaveAttribute("inputmode", "numeric");
                expect(input).toHaveAttribute("pattern", "[0-9]*");
                expect(input).toHaveAttribute("maxlength", "1");
            });
        });
    });

    describe("Variants", () => {
        const sizeMap = {
            sm: "w-10 h-10 text-sm",
            md: "w-12 h-12 text-lg",
            lg: "w-14 h-14 text-xl",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClasses]) => {
            it(`applies correct classes for ${size} size`, () => {
                const value = ["", "", ""];
                const { container } = render(() => (
                    <PinInput
                        value={value}
                        onChange={() => {}}
                        size={size as any}
                    />
                ));

                const inputs = container.querySelectorAll("input");
                expectedClasses.split(" ").forEach((cls) => {
                    expect(inputs[0]).toHaveClass(cls);
                });
            });
        });
    });

    describe("Callbacks", () => {
        it("calls onComplete when all fields are filled", () => {
            const value = ["1", "2", ""];
            const handleChange = vi.fn();
            const handleComplete = vi.fn();
            render(() => (
                <PinInput
                    value={value}
                    onChange={handleChange}
                    onComplete={handleComplete}
                />
            ));

            const inputs = screen.getAllByRole("textbox");

            // Fill last input
            fireEvent.input(inputs[2], { target: { value: "3" } });

            expect(handleComplete).toHaveBeenCalledWith(["1", "2", "3"]);
        });

        it("calls onComplete on paste that fills all fields", () => {
            const value = ["", "", ""];
            const handleComplete = vi.fn();
            render(() => (
                <PinInput
                    value={value}
                    onChange={() => {}}
                    onComplete={handleComplete}
                />
            ));

            const inputs = screen.getAllByRole("textbox");
            inputs[0].focus();

            const pasteEvent = new Event("paste", {
                bubbles: true,
                cancelable: true,
            } as EventInit);
            Object.assign(pasteEvent, {
                clipboardData: {
                    getData: () => "123",
                },
            });

            fireEvent(inputs[0], pasteEvent);

            expect(handleComplete).toHaveBeenCalledWith(["1", "2", "3"]);
        });
    });
});
