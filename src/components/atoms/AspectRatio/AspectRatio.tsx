import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";

const aspectRatio = tv({
    base: "overflow-hidden",
    variants: {
        ratio: {
            square: "aspect-square",
            video: "aspect-video",
            "4/3": "aspect-[4/3]",
            "3/2": "aspect-[3/2]",
            "16/10": "aspect-[16/10]",
            "21/9": "aspect-[21/9]",
        },
    },
    defaultVariants: {
        ratio: "square",
    },
});

export type AspectRatioRatio =
    | "square"
    | "video"
    | "4/3"
    | "3/2"
    | "16/10"
    | "21/9";

export interface AspectRatioProps {
    /**
     * The aspect ratio to maintain
     * @default "square"
     */
    ratio?: AspectRatioRatio;
    /**
     * The content to display within the aspect ratio container
     */
    children: JSX.Element;
    /**
     * CSS class name
     */
    class?: string;
}

export function AspectRatio(props: AspectRatioProps) {
    const [local, others] = splitProps(props, ["children", "ratio", "class"]);

    return (
        <div
            class={aspectRatio({ ratio: local.ratio, class: local.class })}
            {...others}
        >
            {local.children}
        </div>
    );
}
