import { splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { tv } from "tailwind-variants";

const text = tv({
    base: "",
    variants: {
        size: {
            xs: "text-xs",
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            "3xl": "text-3xl",
            "4xl": "text-4xl",
            "5xl": "text-5xl",
        },
        weight: {
            normal: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        },
        color: {
            main: "text-fg-main",
            muted: "text-fg-muted",
            accent: "text-accent",
        },
        font: {
            sans: "font-sans",
            mono: "font-mono",
        },
    },
    defaultVariants: {
        size: "base",
        weight: "normal",
        color: "main",
        font: "sans",
    },
});

export interface TextProps {
    as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children: JSX.Element;
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: "main" | "muted" | "accent";
    font?: "sans" | "mono";
    class?: string;
    "aria-label"?: string;
}

export function Text(props: TextProps) {
    const [local, others] = splitProps(props, [
        "children",
        "size",
        "weight",
        "color",
        "font",
        "class",
        "as",
    ]);

    return (
        <Dynamic
            component={local.as || "p"}
            class={text({
                size: local.size,
                weight: local.weight,
                color: local.color,
                font: local.font,
                class: local.class,
            })}
            aria-label={others["aria-label"]}
            {...others}
        >
            {local.children}
        </Dynamic>
    );
}
