import {
    splitProps,
    type JSX,
    onMount,
    onCleanup,
    type ParentProps,
    createUniqueId,
} from "solid-js";
import { tv } from "tailwind-variants";

// CSS for anchor positioning and fallback
const tooltipCSS = `
/* Fallback for browsers that don't support anchor positioning */
[data-tooltip-popover] {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    width: max-content;
    max-width: 90vw;
}

@supports (position-anchor: --foo) {
    [data-tooltip-popover] {
        position: fixed;
        transform: none;
        inset: auto;
        margin: 0;
        
        position-anchor: var(--tooltip-anchor-name);
        position-visibility: anchors-visible; 
    }

    /* Top Placement */
    [data-tooltip-placement="top"][data-tooltip-popover] {
        bottom: anchor(top);
        left: anchor(center);
        translate: -50% 0;
        margin-bottom: 8px; /* Spacing */
    }

    [data-tooltip-placement="top-start"][data-tooltip-popover] {
        bottom: anchor(top);
        left: anchor(left);
        margin-bottom: 8px;
    }

    [data-tooltip-placement="top-end"][data-tooltip-popover] {
        bottom: anchor(top);
        right: anchor(right);
        margin-bottom: 8px;
    }

    /* Bottom Placement */
    [data-tooltip-placement="bottom"][data-tooltip-popover] {
        top: anchor(bottom);
        left: anchor(center);
        translate: -50% 0;
        margin-top: 8px;
    }

    [data-tooltip-placement="bottom-start"][data-tooltip-popover] {
        top: anchor(bottom);
        left: anchor(left);
        margin-top: 8px;
    }

    [data-tooltip-placement="bottom-end"][data-tooltip-popover] {
        top: anchor(bottom);
        right: anchor(right);
        margin-top: 8px;
    }

    /* Left Placement */
    [data-tooltip-placement="left"][data-tooltip-popover] {
        right: anchor(left);
        top: anchor(center);
        translate: 0 -50%;
        margin-right: 8px;
    }

    [data-tooltip-placement="left-start"][data-tooltip-popover] {
        right: anchor(left);
        top: anchor(top);
        margin-right: 8px;
    }

    [data-tooltip-placement="left-end"][data-tooltip-popover] {
        right: anchor(left);
        bottom: anchor(bottom);
        margin-right: 8px;
    }

    /* Right Placement */
    [data-tooltip-placement="right"][data-tooltip-popover] {
        left: anchor(right);
        top: anchor(center);
        translate: 0 -50%;
        margin-left: 8px;
    }

    [data-tooltip-placement="right-start"][data-tooltip-popover] {
        left: anchor(right);
        top: anchor(top);
        margin-left: 8px;
    }

    [data-tooltip-placement="right-end"][data-tooltip-popover] {
        left: anchor(right);
        bottom: anchor(bottom);
        margin-left: 8px;
    }
}
`;

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

        // Inject styles once
        if (!document.getElementById("tooltip-anchor-styles")) {
            const styleElement = document.createElement("style");
            styleElement.id = "tooltip-anchor-styles";
            styleElement.textContent = tooltipCSS;
            document.head.appendChild(styleElement);
        }
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
