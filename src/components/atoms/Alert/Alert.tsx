import { splitProps, type JSX, Show } from "solid-js";
import { tv } from "tailwind-variants";
import X from "../../icons/x";

const alert = tv({
    base: "flex gap-3 p-4 rounded-lg border transition-all",
    variants: {
        variant: {
            solid: "",
            subtle: "",
            outline: "bg-transparent",
        },
        color: {
            accent: "",
            success: "",
            warning: "",
            error: "",
        },
        size: {
            sm: "p-3 text-sm",
            md: "p-4 text-base",
            lg: "p-6 text-lg",
        },
    },
    compoundVariants: [
        // Accent
        {
            variant: "solid",
            color: "accent",
            class: "bg-accent text-primary border-accent",
        },
        {
            variant: "subtle",
            color: "accent",
            class: "bg-accent/20 text-accent border-accent/30",
        },
        {
            variant: "outline",
            color: "accent",
            class: "bg-primary text-accent border-accent",
        },

        // Success
        {
            variant: "solid",
            color: "success",
            class: "bg-success text-primary border-success",
        },
        {
            variant: "subtle",
            color: "success",
            class: "bg-success/20 text-success border-success/30",
        },
        {
            variant: "outline",
            color: "success",
            class: "bg-primary text-success border-success",
        },

        // Warning
        {
            variant: "solid",
            color: "warning",
            class: "bg-warning text-primary border-warning",
        },
        {
            variant: "subtle",
            color: "warning",
            class: "bg-warning/20 text-warning border-warning/30",
        },
        {
            variant: "outline",
            color: "warning",
            class: "bg-primary text-warning border-warning",
        },

        // Error
        {
            variant: "solid",
            color: "error",
            class: "bg-error text-primary border-error",
        },
        {
            variant: "subtle",
            color: "error",
            class: "bg-error/20 text-error border-error/30",
        },
        {
            variant: "outline",
            color: "error",
            class: "bg-primary text-error border-error",
        },
    ],
    defaultVariants: {
        variant: "solid",
        color: "accent",
        size: "md",
    },
});

const alertCloseButton = tv({
    base: "inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent focus:ring-current rounded-md",
    variants: {
        variant: {
            solid: "hover:bg-fg-main/10",
            subtle: "hover:bg-current/20",
            outline: "hover:bg-current/20",
        },
        size: {
            sm: "h-4 w-4 p-0.5 [&>svg]:h-3 [&>svg]:w-3",
            md: "h-5 w-5 p-0.5 [&>svg]:h-3.5 [&>svg]:w-3.5",
            lg: "h-6 w-6 p-1 [&>svg]:h-4 [&>svg]:w-4",
        },
    },
    defaultVariants: {
        variant: "solid",
        size: "md",
    },
});

export interface AlertProps {
    children: JSX.Element;
    title?: string;
    variant?: "solid" | "subtle" | "outline";
    color?: "accent" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg";
    class?: string;
    onDismiss?: () => void;
    dismissIcon?: JSX.Element;
    "aria-label"?: string;
}

export function Alert(props: AlertProps) {
    const [local, others] = splitProps(props, [
        "children",
        "title",
        "variant",
        "color",
        "size",
        "class",
        "onDismiss",
        "dismissIcon",
        "aria-label",
    ]);

    return (
        <div
            class={alert({
                variant: local.variant,
                color: local.color,
                size: local.size,
                class: local.class,
            })}
            role="alert"
            aria-label={local["aria-label"]}
            {...others}
        >
            <div class="flex-1 min-w-0">
                <Show when={local.title}>
                    <div class="font-semibold mb-1">{local.title}</div>
                </Show>
                <div class="text-sm">{local.children}</div>
            </div>
            <Show when={local.onDismiss}>
                <button
                    type="button"
                    class={alertCloseButton({
                        variant: local.variant,
                        size: local.size,
                        class: "border-none bg-transparent",
                    })}
                    onClick={() => local.onDismiss?.()}
                    aria-label="Dismiss alert"
                >
                    {local.dismissIcon || <X />}
                </button>
            </Show>
        </div>
    );
}
