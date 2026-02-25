import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";

const card = tv({
    base: "rounded-lg bg-secondary border border-ui-border",
    variants: {
        padding: {
            none: "p-0",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        },
        elevation: {
            flat: "",
            raised: "shadow-lg",
        },
    },
    defaultVariants: {
        padding: "md", // Default to none so sub-components handle spacing
        elevation: "flat",
    },
});

export interface CardProps {
    children: JSX.Element;
    padding?: "none" | "sm" | "md" | "lg";
    elevation?: "flat" | "raised";
    class?: string;
    "aria-label"?: string;
}

export function Card(props: CardProps) {
    const [local, others] = splitProps(props, [
        "children",
        "padding",
        "elevation",
        "class",
    ]);

    return (
        <div
            class={card({
                padding: local.padding,
                elevation: local.elevation,
                class: local.class,
            })}
            aria-label={others["aria-label"]}
            {...others}
        >
            {local.children}
        </div>
    );
}

const cardHeader = tv({
    base: "flex flex-col space-y-1.5 p-6",
});

export interface CardHeaderProps {
    children: JSX.Element;
    class?: string;
    [key: string]: any;
}

export function CardHeader(props: CardHeaderProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <div class={cardHeader({ class: local.class })} {...others}>
            {local.children}
        </div>
    );
}

const cardTitle = tv({
    base: "text-2xl font-semibold leading-none tracking-tight",
});

export interface CardTitleProps {
    children: JSX.Element;
    class?: string;
    [key: string]: any;
}

export function CardTitle(props: CardTitleProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <h3 class={cardTitle({ class: local.class })} {...others}>
            {local.children}
        </h3>
    );
}

const cardSubtitle = tv({
    base: "text-sm text-fg-muted",
});

export interface CardSubtitleProps {
    children: JSX.Element;
    class?: string;
    [key: string]: any;
}

export function CardSubtitle(props: CardSubtitleProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <p class={cardSubtitle({ class: local.class })} {...others}>
            {local.children}
        </p>
    );
}

const cardContent = tv({
    base: "px-6",
});

export interface CardContentProps {
    children: JSX.Element;
    class?: string;
    [key: string]: any;
}

export function CardContent(props: CardContentProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <div class={cardContent({ class: local.class })} {...others}>
            {local.children}
        </div>
    );
}

const cardFooter = tv({
    base: "flex items-center p-6",
});

export interface CardFooterProps {
    children: JSX.Element;
    class?: string;
    [key: string]: any;
}

export function CardFooter(props: CardFooterProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <div class={cardFooter({ class: local.class })} {...others}>
            {local.children}
        </div>
    );
}
