import {
    splitProps,
    type JSX,
    onMount,
    onCleanup,
    type ParentProps,
    createUniqueId,
} from "solid-js";
import { tv } from "tailwind-variants";
import {
    generateAnchorCSS,
    injectStyles,
} from "../../../utils/style/anchor-positioning";

const tooltip = tv({
    base: "px-3 py-2 rounded bg-tertiary border border-ui-border text-fg-main text-sm shadow-lg z-50 max-w-xs",
    variants: {
        placement: {
            top: "",
            "top-start": "",
            "top-end": "",
            bottom: "",
            "bottom-start": "",
            "bottom-end": "",
            left: "",
            "left-start": "",
            "left-end": "",
            right: "",
            "right-start": "",
            "right-end": "",
        },
    },
    defaultVariants: {
        placement: "top",
    },
});

type Placement =
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";

export interface TooltipProps extends ParentProps {
    content: JSX.Element | string;
    placement?: Placement;
    class?: string;
    "aria-label"?: string;
    delay?: number;
}

export function Tooltip(props: TooltipProps) {
    const [local, others] = splitProps(props, [
        "content",
        "children",
        "placement",
        "class",
        "delay",
    ]);

    const placement = () => local.placement || "top";
    const popoverId = createUniqueId();
    const anchorName = `--tooltip-anchor-${popoverId}`;

    let popoverRef: HTMLDivElement | undefined;
    let timeoutId: number | undefined;

    const showTooltip = () => {
        if (popoverRef && typeof popoverRef.showPopover === "function") {
            try {
                // Ensure popover is not already open to avoid errors if logic overlaps
                if (!popoverRef.matches(":popover-open")) {
                    popoverRef.showPopover();
                }
            } catch {
                // Ignore transient errors
            }
        }
    };

    const hideTooltip = () => {
        if (popoverRef && typeof popoverRef.hidePopover === "function") {
            try {
                popoverRef.hidePopover();
            } catch {
                // Ignore transient errors
            }
        }
    };

    const handleMouseEnter = () => {
        if (typeof window === "undefined") return;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
            showTooltip();
        }, local.delay || 0);
    };

    const handleMouseLeave = () => {
        if (typeof window === "undefined") return;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        hideTooltip();
    };

    const handleFocus = () => {
        showTooltip();
    };

    const handleBlur = () => {
        hideTooltip();
    };

    onMount(() => {
        if (typeof window === "undefined" || typeof document === "undefined")
            return;

        const css = generateAnchorCSS({
            namespace: "tooltip",
            baseStyles: "width: max-content; max-width: 90vw;",
        });
        injectStyles("tooltip-anchor-styles", css);
    });

    onCleanup(() => {
        if (typeof window === "undefined") return;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    });

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-describedby={popoverId}
                class={local.class}
                style={{ "anchor-name": anchorName, display: "inline-block" }}
                {...others}
            >
                {local.children}
            </div>
            <div
                ref={(el) => (popoverRef = el)}
                id={popoverId}
                popover="manual"
                class={tooltip({
                    placement: placement(),
                    class: local.class,
                })}
                role="tooltip"
                data-tooltip-popover=""
                data-tooltip-placement={placement()}
                style={{ "--tooltip-anchor-name": anchorName }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {local.content}
            </div>
        </>
    );
}
