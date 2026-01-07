import { createMemo, splitProps } from "solid-js";
import { tv } from "tailwind-variants";

function extractInitials(text: string): string {
    if (!text) return "?";
    const parts = text.trim().split(/\s+/);
    return parts
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 3)
        .join("");
}

const avatar = tv({
    base: "flex items-center justify-center font-medium rounded-full overflow-hidden shrink-0",
    variants: {
        size: {
            sm: "w-8 h-8 text-xs",
            md: "w-10 h-10 text-sm",
            lg: "w-12 h-12 text-base",
        },
        variant: {
            default: "bg-secondary border border-ui-border text-fg-main",
            accent: "bg-accent text-primary",
            muted: "bg-ui-gutter text-fg-muted",
        },
    },
    defaultVariants: {
        size: "md",
        variant: "default",
    },
});

export interface AvatarProps {
    src?: string;
    alt?: string;
    /** Optional custom initials to display if no image is provided. If not provided, initials are auto-calculated from alt text (max 3 letters). */
    initials?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "accent" | "muted";
    class?: string;
}

export function Avatar(allProps: AvatarProps) {
    const [local, others] = splitProps(allProps, [
        "src",
        "alt",
        "initials",
        "size",
        "variant",
        "class",
    ]);

    const getDisplayInitials = createMemo(
        () => local.initials || extractInitials(local.alt ?? "")
    );

    return (
        <div
            class={avatar({
                size: local.size,
                variant: local.variant,
                class: local.class,
            })}
            role="img"
            aria-label={local.alt}
            {...others}
        >
            {local.src ? (
                <img
                    src={local.src}
                    alt={local.alt ?? "Avatar"}
                    class="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <span class="font-semibold">{getDisplayInitials()}</span>
            )}
        </div>
    );
}
