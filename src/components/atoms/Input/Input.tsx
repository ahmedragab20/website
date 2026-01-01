import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

const input = tv({
    base: "w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all",
    variants: {
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
        state: {
            default: "",
            error: "border-red-600 focus:ring-red-600",
            disabled: "opacity-50 cursor-not-allowed bg-tertiary",
        },
    },
    defaultVariants: {
        size: "md",
        state: "default",
    },
});

export interface InputProps {
    id?: string;
    type?: string;
    value: string;
    onInput?: (value: string) => void;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
    min?: string | number;
    max?: string | number;
    step?: string | number;
    pattern?: string;
    autocomplete?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    class?: string;
}

export function Input(props: InputProps) {
    const [local, others] = splitProps(props, [
        "value",
        "onInput",
        "onChange",
        "disabled",
        "size",
        "class",
    ]);

    const inputState = () => {
        if (local.disabled) return "disabled";
        if (others["aria-invalid"]) return "error";
        return "default";
    };

    const handleInput = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        local.onInput?.(target.value);
        local.onChange?.(target.value);
    };

    return (
        <input
            id={others.id}
            type={others.type || "text"}
            value={local.value}
            onInput={handleInput}
            onChange={handleInput}
            placeholder={others.placeholder}
            required={others.required}
            disabled={local.disabled}
            readonly={others.readonly}
            min={others.min}
            max={others.max}
            step={others.step}
            pattern={others.pattern}
            autocomplete={others.autocomplete}
            aria-label={others["aria-label"]}
            aria-describedby={others["aria-describedby"]}
            aria-invalid={others["aria-invalid"]}
            class={input({
                size: local.size || "md",
                state: inputState(),
                class: local.class,
            })}
            {...others}
        />
    );
}
