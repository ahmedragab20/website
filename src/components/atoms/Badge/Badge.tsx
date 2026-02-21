import { splitProps, type JSX, Show } from "solid-js";
import { tv } from "tailwind-variants";
import X from "../../icons/XMark";

const badge = tv({
    base: "inline-flex gap-x-3 items-center justify-between font-medium border transition-colors cursor-default max-w-fit",
    variants: {
        variant: {
            solid: "border-transparent",
            subtle: "border-transparent",
            outline: "bg-transparent",
        },
        color: {
            accent: "",
            success: "",
            warning: "",
            error: "",
        },
        size: {
            sm: "px-2 py-1.5 text-xs rounded-xl",
            md: "px-2.5 py-1.5 text-sm rounded-xl",
            lg: "px-3 py-2 text-base rounded-2xl",
        },
        interactive: {
            true: "cursor-pointer hover:opacity-90",
            false: "",
        },
    },
    compoundVariants: [
        // Accent
        {
            variant: "solid",
            color: "accent",
            class: "bg-accent text-primary",
        },
        {
            variant: "subtle",
            color: "accent",
            class: "bg-accent/20 text-accent",
        },
        {
            variant: "outline",
            color: "accent",
            class: "border-accent text-accent",
        },

        // Success
        {
            variant: "solid",
            color: "success",
            class: "bg-success text-primary",
        },
        {
            variant: "subtle",
            color: "success",
            class: "bg-success/20 text-success",
        },
        {
            variant: "outline",
            color: "success",
            class: "border-success text-success",
        },

        // Warning
        {
            variant: "solid",
            color: "warning",
            class: "bg-warning text-primary",
        },
        {
            variant: "subtle",
            color: "warning",
            class: "bg-warning/20 text-warning",
        },
        {
            variant: "outline",
            color: "warning",
            class: "border-warning text-warning",
        },

        // Error
        {
            variant: "solid",
            color: "error",
            class: "bg-error text-primary",
        },
        {
            variant: "subtle",
            color: "error",
            class: "bg-error/20 text-error",
        },
        {
            variant: "outline",
            color: "error",
            class: "border-error text-error",
        },
    ],
    defaultVariants: {
        variant: "solid",
        color: "accent",
        size: "md",
        interactive: false,
    },
});

const badgeCloseButton = tv({
    base: "inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-current rounded-full",
    variants: {
        variant: {
            solid: "hover:bg-fg-main/10",
            subtle: "hover:bg-current/20",
            outline: "hover:bg-current/20",
        },
        color: {
            accent: "",
            success: "",
            warning: "",
            error: "",
        },
        size: {
            sm: "h-4 w-4 p-0.5 [&>svg]:h-3 [&>svg]:w-3 rounded-md",
            md: "h-5 w-5 p-0.5 [&>svg]:h-3.5 [&>svg]:w-3.5 rounded-lg",
            lg: "h-6 w-6 p-1 [&>svg]:h-4 [&>svg]:w-4 rounded-lg",
        },
    },
    defaultVariants: {
        variant: "solid",
        color: "accent",
        size: "md",
    },
});

export interface BadgeProps {
    children?: JSX.Element;
    variant?: "solid" | "subtle" | "outline";
    color?: "accent" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg";
    class?: string;
    onDismiss?: () => void;
    dismissIcon?: JSX.Element;
    onClick?: () => void;
    "aria-label"?: string;
}

export function Badge(props: BadgeProps) {
    const [local, others] = splitProps(props, [
        "children",
        "variant",
        "color",
        "size",
        "class",
        "onDismiss",
        "dismissIcon",
        "onClick",
        "aria-label",
    ]);

    return (
        <div
            class={badge({
                variant: local.variant,
                color: local.color,
                size: local.size,
                interactive: !!local.onClick,
                class: local.class,
            })}
            onClick={() => local.onClick?.()}
            role={local.onClick ? "button" : undefined}
            tabIndex={local.onClick ? 0 : undefined}
            aria-label={local["aria-label"]}
            {...others}
        >
            {local.children}
            <Show when={local.onDismiss}>
                <button
                    type="button"
                    class={badgeCloseButton({
                        variant: local.variant,
                        color: local.color,
                        size: local.size,
                        class: "border-none",
                    })}
                    onClick={(e) => {
                        e.stopPropagation();
                        local.onDismiss?.();
                    }}
                    aria-label="Dismiss"
                >
                    {local.dismissIcon || (
                        // hardcoded SVG are prefered to reduce dependencies
                        <X />
                    )}
                </button>
            </Show>
        </div>
    );
}
