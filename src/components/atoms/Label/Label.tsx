import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";

const label = tv({
    base: "block text-sm font-medium text-fg-main",
    variants: {
        size: {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        },
        required: {
            true: "",
            false: "",
        },
    },
    defaultVariants: {
        size: "md",
        required: false,
    },
});

export interface LabelProps {
    for?: string;
    children: JSX.Element;
    required?: boolean;
    size?: "sm" | "md" | "lg";
    class?: string;
    "aria-label"?: string;
}

export function Label(props: LabelProps) {
    const [local, others] = splitProps(props, [
        "children",
        "required",
        "size",
        "class",
    ]);

    return (
        <label
            for={others.for}
            class={label({
                size: local.size,
                required: local.required || false,
                class: local.class,
            })}
            aria-label={others["aria-label"]}
            {...others}
        >
            {local.children}
            {local.required && (
                <span class="text-accent ml-1" aria-label="required">
                    *
                </span>
            )}
        </label>
    );
}
