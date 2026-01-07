import { splitProps, createSignal, For } from "solid-js";
import { tv } from "tailwind-variants";

const pinInput = tv({
    base: "flex items-center gap-2",
    variants: {
        size: {
            sm: "gap-1.5",
            md: "gap-2",
            lg: "gap-3",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

const pinInputField = tv({
    base: "w-12 h-12 text-center rounded bg-primary border border-ui-border text-fg-main font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all",
    variants: {
        size: {
            sm: "w-10 h-10 text-sm",
            md: "w-12 h-12 text-lg",
            lg: "w-14 h-14 text-xl",
        },
        state: {
            default: "",
            error: "border-error focus:ring-error",
            disabled: "opacity-50 cursor-not-allowed bg-tertiary",
            completed: "border-success bg-success/10",
        },
    },
    defaultVariants: {
        size: "md",
        state: "default",
    },
});

export interface PinInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    length?: number;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    error?: boolean;
    placeholder?: string;
    autocomplete?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    class?: string;
    onComplete?: (value: string[]) => void;
}

export function PinInput(props: PinInputProps) {
    const [local, _others] = splitProps(props, [
        "value",
        "onChange",
        "length",
        "size",
        "disabled",
        "error",
        "placeholder",
        "autocomplete",
        "class",
        "onComplete",
        "aria-label",
        "aria-describedby",
        "aria-invalid",
    ]);

    const inputRefs: HTMLInputElement[] = [];
    const [focusedIndex, setFocusedIndex] = createSignal<number>(-1);

    const pinLength = () => local.length || local.value.length || 6;

    const inputState = () => {
        if (local.disabled) return "disabled";
        if (local.error || props["aria-invalid"]) return "error";
        if (
            local.value.length === pinLength() &&
            local.value.every((v) => v !== "")
        )
            return "completed";
        return "default";
    };

    const handleInput = (index: number, e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const newValue = target.value.replace(/[^0-9]/g, "").slice(-1);

        const updatedValue = [...local.value];
        updatedValue[index] = newValue;

        local.onChange(updatedValue);

        // Auto-focus next input
        if (newValue && index < pinLength() - 1) {
            const nextIndex = index + 1;
            setFocusedIndex(nextIndex);
            inputRefs[nextIndex]?.focus();
            inputRefs[nextIndex]?.select();
        }

        // Call onComplete when all fields are filled
        if (
            updatedValue.length === pinLength() &&
            updatedValue.every((v) => v !== "")
        ) {
            local.onComplete?.(updatedValue);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent) => {
        const target = e.currentTarget as HTMLInputElement;

        switch (e.key) {
            case "Backspace":
                e.preventDefault();
                const updatedValue = [...local.value];

                if (target.value === "" && index > 0) {
                    // Move to previous input and clear it
                    const prevIndex = index - 1;
                    updatedValue[prevIndex] = "";
                    local.onChange(updatedValue);
                    setFocusedIndex(prevIndex);
                    inputRefs[prevIndex]?.focus();
                    inputRefs[prevIndex]?.select();
                } else {
                    // Clear current input
                    updatedValue[index] = "";
                    local.onChange(updatedValue);
                }
                break;

            case "ArrowLeft":
                e.preventDefault();
                if (index > 0) {
                    setFocusedIndex(index - 1);
                    inputRefs[index - 1]?.focus();
                }
                break;

            case "ArrowRight":
                e.preventDefault();
                if (index < pinLength() - 1) {
                    setFocusedIndex(index + 1);
                    inputRefs[index + 1]?.focus();
                }
                break;

            case "Home":
                e.preventDefault();
                setFocusedIndex(0);
                inputRefs[0]?.focus();
                break;

            case "End":
                e.preventDefault();
                setFocusedIndex(pinLength() - 1);
                inputRefs[pinLength() - 1]?.focus();
                break;

            case "v":
            case "V":
                if ((e.ctrlKey || e.metaKey) && !local.disabled) {
                    // Allow paste with Ctrl+V/Cmd+V
                    return;
                }
                break;

            default:
                // Only allow numbers, Tab, Enter, and Escape
                if (
                    !e.key.match(/^[0-9]$/) &&
                    !["Tab", "Enter", "Escape"].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey
                ) {
                    e.preventDefault();
                }
                break;
        }
    };

    const handlePaste = (index: number, e: ClipboardEvent) => {
        e.preventDefault();

        if (local.disabled) return;

        const pastedData = e.clipboardData?.getData("text") || "";
        const numericData = pastedData.replace(/[^0-9]/g, "");

        if (!numericData) return;

        // Create a copy of the current values
        const updatedValue = [...(local.value || [])];

        // Ensure array is at least pinLength
        while (updatedValue.length < pinLength()) {
            updatedValue.push("");
        }

        // Fill data starting from the paste index
        let dataIndex = 0;
        for (
            let i = index;
            i < pinLength() && dataIndex < numericData.length;
            i++
        ) {
            updatedValue[i] = numericData[dataIndex];
            dataIndex++;
        }

        local.onChange(updatedValue);

        // Calculate focus position (after the last pasted digit)
        const nextIndex = Math.min(index + numericData.length, pinLength() - 1);

        setFocusedIndex(nextIndex);
        inputRefs[nextIndex]?.focus();

        // If we filled the last digit, select it? Or just focus?
        // Existing behavior was select.
        inputRefs[nextIndex]?.select();

        // Call onComplete when all fields are filled
        if (
            updatedValue.length === pinLength() &&
            updatedValue.every((v) => v !== "")
        ) {
            local.onComplete?.(updatedValue);
        }
    };

    const handleFocus = (index: number) => {
        setFocusedIndex(index);
    };

    const handleBlur = () => {
        setFocusedIndex(-1);
    };

    return (
        <div
            data-pin-input=""
            class={pinInput({ size: local.size, class: local.class })}
            role="group"
            aria-label={local["aria-label"] || "PIN input"}
            aria-describedby={local["aria-describedby"]}
            aria-invalid={local.error || local["aria-invalid"]}
        >
            <For each={Array(pinLength()).fill(null)}>
                {(_, index) => (
                    <input
                        ref={(el) => (inputRefs[index()] = el)}
                        type="text"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="1"
                        autocomplete={local.autocomplete || "one-time-code"}
                        value={local.value[index()] || ""}
                        onInput={[handleInput, index()]}
                        onKeyDown={[handleKeyDown, index()]}
                        onFocus={[handleFocus, index()]}
                        onBlur={handleBlur}
                        onPaste={[handlePaste, index()]}
                        disabled={local.disabled}
                        placeholder={local.placeholder}
                        aria-label={`Digit ${index() + 1} of ${pinLength()}`}
                        aria-required="true"
                        aria-invalid={
                            local.error ||
                            local["aria-invalid"] ||
                            !local.value[index()]
                        }
                        class={pinInputField({
                            size: local.size,
                            state: inputState(),
                        })}
                        data-index={index()}
                        data-filled={!!local.value[index()]}
                        data-focused={focusedIndex() === index()}
                    />
                )}
            </For>
        </div>
    );
}
