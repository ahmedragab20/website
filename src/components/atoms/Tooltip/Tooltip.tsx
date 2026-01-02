import {
    splitProps,
    type JSX,
    createSignal,
    onMount,
    onCleanup,
    type ParentProps,
} from "solid-js";
import { tv } from "tailwind-variants";
import {
    usePopoverPosition,
    supportsAnchorPositioning,
    type Placement as PopoverPlacement,
} from "../../hooks/usePopoverPosition";

// CSS for anchor positioning (only used when supported)
const anchorPositioningCSS = `
[data-tooltip-anchor] {
    position: fixed;
}

[data-tooltip-placement="top"][data-tooltip-anchor] {
    position-anchor: var(--tooltip-anchor-name);
    bottom: calc(100vh - anchor(var(--tooltip-anchor-name) top) + 8px);
    left: anchor(var(--tooltip-anchor-name) left);
    transform: translateX(-50%);
}

[data-tooltip-placement="bottom"][data-tooltip-anchor] {
    position-anchor: var(--tooltip-anchor-name);
    top: anchor(var(--tooltip-anchor-name) bottom) + 8px;
    left: anchor(var(--tooltip-anchor-name) left);
    transform: translateX(-50%);
}

[data-tooltip-placement="left"][data-tooltip-anchor] {
    position-anchor: var(--tooltip-anchor-name);
    top: anchor(var(--tooltip-anchor-name) top);
    right: calc(100vw - anchor(var(--tooltip-anchor-name) left) + 8px);
    transform: translateY(-50%);
}

[data-tooltip-placement="right"][data-tooltip-anchor] {
    position-anchor: var(--tooltip-anchor-name);
    top: anchor(var(--tooltip-anchor-name) top);
    left: anchor(var(--tooltip-anchor-name) right) + 8px;
    transform: translateY(-50%);
}
`;

const tooltip = tv({
    base: "px-3 py-2 rounded bg-tertiary border border-ui-border text-fg-main text-sm shadow-lg z-50 max-w-xs",
    variants: {
        placement: {
            top: "",
            bottom: "",
            left: "",
            right: "",
        },
    },
    defaultVariants: {
        placement: "top",
    },
});

type Placement = "top" | "bottom" | "left" | "right";

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

    const [isOpen, setIsOpen] = createSignal(false);
    const placement = () => local.placement || "top";
    const popoverId = `tooltip-${Math.random().toString(36).substring(2, 9)}`;
    const supportsAnchor = supportsAnchorPositioning();
    const anchorName = `--tooltip-anchor-${popoverId}`;
    let triggerRef: HTMLElement | undefined;
    let popoverRef: HTMLDivElement | undefined;
    let timeoutId: number | undefined;
    let styleElement: HTMLStyleElement | undefined;

    const setTriggerRef = (el: HTMLElement | undefined) => {
        triggerRef = el;
        if (el && supportsAnchor) {
            (el.style as any).anchorName = anchorName;
            (el.style as any).setProperty("--tooltip-anchor-name", anchorName);
        }
    };

    const setPopoverRef = (el: HTMLDivElement | undefined) => {
        popoverRef = el;
    };

    // Use JS positioning as fallback when CSS Anchor Positioning is not supported
    if (!supportsAnchor) {
        usePopoverPosition({
            triggerRef: () => triggerRef,
            popoverRef: () => popoverRef,
            placement: () => placement() as PopoverPlacement,
            isOpen,
            spacing: 8,
        });
    }

    const showTooltip = () => {
        if (popoverRef && typeof popoverRef.showPopover === "function") {
            popoverRef.showPopover();
            setIsOpen(true);
        }
    };

    const hideTooltip = () => {
        if (popoverRef && typeof popoverRef.hidePopover === "function") {
            popoverRef.hidePopover();
            setIsOpen(false);
        }
    };

    const handleMouseEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
            showTooltip();
        }, local.delay || 0);
    };

    const handleMouseLeave = () => {
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
        // Inject anchor positioning CSS if supported
        if (
            supportsAnchor &&
            !document.getElementById("tooltip-anchor-styles")
        ) {
            styleElement = document.createElement("style");
            styleElement.id = "tooltip-anchor-styles";
            styleElement.textContent = anchorPositioningCSS;
            document.head.appendChild(styleElement);
        }

        onCleanup(() => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        });
    });

    return (
        <>
            <div
                ref={setTriggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-describedby={popoverId}
                class={local.class}
                {...others}
            >
                {local.children}
            </div>
            <div
                ref={setPopoverRef}
                id={popoverId}
                popover="auto"
                class={tooltip({
                    placement: placement(),
                    class: local.class,
                })}
                role="tooltip"
                data-tooltip-anchor={supportsAnchor ? "" : undefined}
                data-tooltip-placement={
                    supportsAnchor ? placement() : undefined
                }
                style={
                    supportsAnchor
                        ? ({
                              "--tooltip-anchor-name": anchorName,
                          } as Record<string, string>)
                        : {
                              position: "fixed",
                              top: "var(--popover-top, auto)",
                              bottom: "var(--popover-bottom, auto)",
                              left: "var(--popover-left, auto)",
                              right: "var(--popover-right, auto)",
                              transform: "var(--popover-transform, none)",
                          }
                }
            >
                {local.content}
            </div>
        </>
    );
}
