import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";
import { Icon } from "../Icon/Icon";

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
            disabled: "opacity-50 cursor-not-allowed",
            loading: "opacity-75 cursor-wait",
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
            class: "bg-green-600 text-white hover:bg-green-700",
        },
        {
            variant: "solid",
            color: "warning",
            class: "bg-yellow-600 text-white hover:bg-yellow-700",
        },
        {
            variant: "solid",
            color: "error",
            class: "bg-red-600 text-white hover:bg-red-700",
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
            class: "bg-green-600/20 text-green-600 hover:bg-green-600/30",
        },
        {
            variant: "subtle",
            color: "warning",
            class: "bg-yellow-600/20 text-yellow-600 hover:bg-yellow-600/30",
        },
        {
            variant: "subtle",
            color: "error",
            class: "bg-red-600/20 text-red-600 hover:bg-red-600/30",
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
            class: "text-green-600 hover:bg-green-600/10",
        },
        {
            variant: "text",
            color: "warning",
            class: "text-yellow-600 hover:bg-yellow-600/10",
        },
        {
            variant: "text",
            color: "error",
            class: "text-red-600 hover:bg-red-600/10",
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
            class: "border-green-600 text-green-600 hover:bg-green-600/10",
        },
        {
            variant: "outline",
            color: "warning",
            class: "border-yellow-600 text-yellow-600 hover:bg-yellow-600/10",
        },
        {
            variant: "outline",
            color: "error",
            class: "border-red-600 text-red-600 hover:bg-red-600/10",
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
    loading?: boolean;
    icon?: JSX.Element; // Lucide icon component (from @lucide/astro)
    iconPosition?: "left" | "right";
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
        "loading",
        "icon",
        "iconPosition",
        "onClick",
        "class",
        "aria-label",
    ]);

    const buttonState = () => {
        if (local.disabled) return "disabled";
        if (local.loading) return "loading";
        return "default";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (
            (e.key === "Enter" || e.key === " ") &&
            !local.disabled &&
            !local.loading
        ) {
            e.preventDefault();
            local.onClick?.();
        }
    };

    const iconSizeMap = {
        sm: "sm",
        md: "md",
        lg: "lg",
    } as const;

    const iconSize = () => iconSizeMap[local.size || "md"];

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
            disabled={local.disabled || local.loading}
            onClick={local.onClick}
            onKeyDown={handleKeyDown}
            aria-label={local["aria-label"]}
            aria-disabled={local.disabled || local.loading}
            {...others}
        >
            {local.loading ? (
                <>
                    {local.icon ? (
                        <Icon
                            size={iconSize()}
                            class="animate-spin"
                            aria-hidden={true}
                        >
                            {local.icon}
                        </Icon>
                    ) : (
                        <span
                            class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    {local.children}
                </>
            ) : (
                <>
                    {local.icon && local.iconPosition !== "right" && (
                        <Icon size={iconSize()} aria-hidden={true}>
                            {local.icon}
                        </Icon>
                    )}
                    {local.children}
                    {local.icon && local.iconPosition === "right" && (
                        <Icon size={iconSize()} aria-hidden={true}>
                            {local.icon}
                        </Icon>
                    )}
                </>
            )}
        </button>
    );
}
