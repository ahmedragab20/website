import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";

const button = tv({
    base: "px-4 py-2 rounded font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent",
    variants: {
        variant: {
            solid: "",
            subtle: "",
            text: "bg-transparent",
            outline: "border-2 bg-transparent",
        },
        color: {
            primary: "",
            accent: "",
            success: "",
            warning: "",
            error: "",
        },
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
        state: {
            default: "",
            disabled: "!opacity-50 cursor-not-allowed",
        },
    },
    compoundVariants: [
        // Solid variant with colors
        {
            variant: "solid",
            color: "accent",
            class: "bg-accent text-primary hover:opacity-90",
        },
        {
            variant: "solid",
            color: "primary",
            class: "bg-primary text-fg-main border border-ui-border hover:bg-secondary",
        },
        {
            variant: "solid",
            color: "success",
            class: "bg-success text-primary hover:opacity-90",
        },
        {
            variant: "solid",
            color: "warning",
            class: "bg-warning text-primary hover:opacity-90",
        },
        {
            variant: "solid",
            color: "error",
            class: "bg-error text-primary hover:opacity-90",
        },
        // Subtle variant with colors
        {
            variant: "subtle",
            color: "accent",
            class: "bg-accent/20 text-accent hover:bg-accent/30",
        },
        {
            variant: "subtle",
            color: "success",
            class: "bg-success/20 text-success hover:bg-success/30",
        },
        {
            variant: "subtle",
            color: "warning",
            class: "bg-warning/20 text-warning hover:bg-warning/30",
        },
        {
            variant: "subtle",
            color: "error",
            class: "bg-error/20 text-error hover:bg-error/30",
        },
        // Text variant with colors
        {
            variant: "text",
            color: "accent",
            class: "text-accent hover:bg-accent/10",
        },
        {
            variant: "text",
            color: "success",
            class: "text-success hover:bg-success/10",
        },
        {
            variant: "text",
            color: "warning",
            class: "text-warning hover:bg-warning/10",
        },
        {
            variant: "text",
            color: "error",
            class: "text-error hover:bg-error/10",
        },
        // Outline variant with colors
        {
            variant: "outline",
            color: "accent",
            class: "border-accent text-accent hover:bg-accent/10",
        },
        {
            variant: "outline",
            color: "success",
            class: "border-success text-success hover:bg-success/10",
        },
        {
            variant: "outline",
            color: "warning",
            class: "border-warning text-warning hover:bg-warning/10",
        },
        {
            variant: "outline",
            color: "error",
            class: "border-error text-error hover:bg-error/10",
        },
    ],
    defaultVariants: {
        variant: "solid",
        color: "accent",
        size: "md",
        state: "default",
    },
});

export interface ButtonProps {
    children: JSX.Element;
    variant?: "solid" | "subtle" | "text" | "outline";
    color?: "primary" | "accent" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    class?: string;
    "aria-label"?: string;
}

export function Button(props: ButtonProps) {
    const [local, others] = splitProps(props, [
        "children",
        "variant",
        "color",
        "size",
        "disabled",
        "onClick",
        "class",
        "aria-label",
    ]);

    const buttonState = () => {
        if (local.disabled) return "disabled";
        return "default";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
            e.preventDefault();
            local.onClick?.();
        }
    };

    return (
        <button
            class={button({
                variant: local.variant,
                color: local.color,
                size: local.size,
                state: buttonState(),
                class: `inline-flex items-center gap-2 ${local.class || ""}`,
            })}
            type={others.type || "button"}
            disabled={local.disabled}
            onClick={() => local.onClick?.()}
            onKeyDown={handleKeyDown}
            aria-label={local["aria-label"]}
            aria-disabled={local.disabled}
            {...others}
        >
            {local.children}
        </button>
    );
}
