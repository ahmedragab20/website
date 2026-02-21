import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
    variant?: "default" | "error";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}

const selectStyles = tv({
    slots: {
        wrapper:
            "relative inline-block text-fg-main has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
        select: [
            "w-full appearance-none rounded bg-primary border text-fg-main",
            "focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200",
            "placeholder:text-fg-muted",
            "disabled:cursor-not-allowed disabled:bg-tertiary",
        ],
        arrow: "pointer-events-none absolute top-1/2 -translate-y-1/2 text-fg-muted",
    },
    variants: {
        size: {
            sm: {
                select: "px-3 py-1.5 text-sm pr-8",
                arrow: "right-2.5 w-4 h-4",
            },
            md: {
                select: "px-4 py-2 text-base pr-10",
                arrow: "right-3 w-5 h-5",
            },
            lg: {
                select: "px-6 py-3 text-lg pr-12",
                arrow: "right-4 w-6 h-6",
            },
        },
        variant: {
            default: {
                select: "border-ui-border",
            },
            error: {
                select: "border-error focus:ring-error",
            },
        },
        fullWidth: {
            true: {
                wrapper: "w-full",
            },
            false: {
                wrapper: "w-auto",
            },
        },
    },
    defaultVariants: {
        size: "md",
        variant: "default",
        fullWidth: false,
    },
});

export function Select(props: SelectProps) {
    const [local, others] = splitProps(props, [
        "class",
        "children",
        "variant",
        "size",
        "fullWidth",
        "disabled",
        "aria-invalid",
    ]);

    const styles = () =>
        selectStyles({
            size: local.size,
            variant:
                local["aria-invalid"] || local.variant === "error"
                    ? "error"
                    : "default",
            fullWidth: local.fullWidth,
        });

    return (
        <div class={styles().wrapper({ class: local.class })}>
            <select
                class={styles().select()}
                disabled={local.disabled}
                aria-invalid={local["aria-invalid"]}
                {...others}
            >
                {local.children}
            </select>
            <div class={styles().arrow()} aria-hidden="true">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-full h-full"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </div>
    );
}
