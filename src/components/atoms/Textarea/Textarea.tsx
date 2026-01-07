import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

const textarea = tv({
    base: "w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none",
    variants: {
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
        state: {
            default: "",
            error: "border-error focus:ring-error",
            disabled: "opacity-50 cursor-not-allowed bg-tertiary",
        },
        resize: {
            none: "resize-none",
            vertical: "resize-y",
            horizontal: "resize-x",
            both: "resize",
        },
    },
    defaultVariants: {
        size: "md",
        state: "default",
        resize: "none",
    },
});

export interface TextareaProps {
    id?: string;
    value: string;
    onInput?: (value: string) => void;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
    rows?: number;
    cols?: number;
    resize?: "none" | "vertical" | "horizontal" | "both";
    minlength?: number;
    maxlength?: number;
    wrap?: "hard" | "soft" | "off";
    autocomplete?: string;
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    class?: string;
}

export function Textarea(props: TextareaProps) {
    const [local, others] = splitProps(props, [
        "value",
        "onInput",
        "onChange",
        "disabled",
        "size",
        "resize",
        "class",
    ]);

    const textareaState = () => {
        if (local.disabled) return "disabled";
        if (others["aria-invalid"]) return "error";
        return "default";
    };

    const handleInput = (e: Event) => {
        const target = e.currentTarget as HTMLTextAreaElement;
        local.onInput?.(target.value);
        local.onChange?.(target.value);
    };

    return (
        <textarea
            id={others.id}
            value={local.value}
            onInput={handleInput}
            onChange={handleInput}
            placeholder={others.placeholder}
            required={others.required}
            disabled={local.disabled}
            readonly={others.readonly}
            rows={others.rows}
            cols={others.cols}
            minlength={others.minlength}
            maxlength={others.maxlength}
            wrap={others.wrap}
            autocomplete={others.autocomplete}
            aria-label={others["aria-label"]}
            aria-describedby={others["aria-describedby"]}
            aria-invalid={others["aria-invalid"]}
            class={textarea({
                size: local.size || "md",
                state: textareaState(),
                resize: local.resize || "none",
                class: local.class,
            })}
            {...others}
        />
    );
}
