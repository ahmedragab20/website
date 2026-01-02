import {
    splitProps,
    type JSX,
    createSignal,
    onMount,
    onCleanup,
    createEffect,
    type ParentProps,
} from "solid-js";
import { tv } from "tailwind-variants";

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
    const [actualPlacement, setActualPlacement] = createSignal<Placement>(
        local.placement || "top"
    );
    const [popoverId] = createSignal(
        `tooltip-${Math.random().toString(36).substring(2, 9)}`
    );
    let triggerRef: HTMLElement | undefined;
    let popoverRef: HTMLDivElement | undefined;
    let timeoutId: number | undefined;

    const setTriggerRef = (el: HTMLElement | undefined) => {
        triggerRef = el;
    };

    const setPopoverRef = (el: HTMLDivElement | undefined) => {
        popoverRef = el;
    };

    const updatePosition = () => {
        if (!triggerRef || !popoverRef) return;

        const triggerRect = triggerRef.getBoundingClientRect();
        const popoverRect = popoverRef.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spacing = 8;

        const placements: Placement[] = ["top", "bottom", "left", "right"];
        const preferredPlacement = local.placement || "top";
        let bestPlacement = preferredPlacement;
        let pos: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
            transform?: string;
        } = {};

        // Try preferred placement first, then others
        for (const p of [
            preferredPlacement,
            ...placements.filter((pl) => pl !== preferredPlacement),
        ]) {
            let fits = false;
            let testPos: typeof pos = {};

            switch (p) {
                case "top":
                    testPos = {
                        bottom: `${viewportHeight - triggerRect.top + spacing}px`,
                        left: `${triggerRect.left + triggerRect.width / 2}px`,
                        transform: "translateX(-50%)",
                    };
                    fits =
                        triggerRect.left +
                            triggerRect.width / 2 -
                            popoverRect.width / 2 >=
                            0 &&
                        triggerRect.left +
                            triggerRect.width / 2 +
                            popoverRect.width / 2 <=
                            viewportWidth &&
                        triggerRect.top - popoverRect.height - spacing >= 0;
                    break;
                case "bottom":
                    testPos = {
                        top: `${triggerRect.bottom + spacing}px`,
                        left: `${triggerRect.left + triggerRect.width / 2}px`,
                        transform: "translateX(-50%)",
                    };
                    fits =
                        triggerRect.left +
                            triggerRect.width / 2 -
                            popoverRect.width / 2 >=
                            0 &&
                        triggerRect.left +
                            triggerRect.width / 2 +
                            popoverRect.width / 2 <=
                            viewportWidth &&
                        triggerRect.bottom + popoverRect.height + spacing <=
                            viewportHeight;
                    break;
                case "left":
                    testPos = {
                        top: `${triggerRect.top + triggerRect.height / 2}px`,
                        right: `${viewportWidth - triggerRect.left + spacing}px`,
                        transform: "translateY(-50%)",
                    };
                    fits =
                        triggerRect.top +
                            triggerRect.height / 2 -
                            popoverRect.height / 2 >=
                            0 &&
                        triggerRect.top +
                            triggerRect.height / 2 +
                            popoverRect.height / 2 <=
                            viewportHeight &&
                        triggerRect.left - popoverRect.width - spacing >= 0;
                    break;
                case "right":
                    testPos = {
                        top: `${triggerRect.top + triggerRect.height / 2}px`,
                        left: `${triggerRect.right + spacing}px`,
                        transform: "translateY(-50%)",
                    };
                    fits =
                        triggerRect.top +
                            triggerRect.height / 2 -
                            popoverRect.height / 2 >=
                            0 &&
                        triggerRect.top +
                            triggerRect.height / 2 +
                            popoverRect.height / 2 <=
                            viewportHeight &&
                        triggerRect.right + popoverRect.width + spacing <=
                            viewportWidth;
                    break;
            }

            if (fits) {
                bestPlacement = p;
                pos = testPos;
                break;
            }
        }

        setActualPlacement(bestPlacement);

        // Adjust for viewport boundaries
        if (bestPlacement === "top" || bestPlacement === "bottom") {
            const centerX = triggerRect.left + triggerRect.width / 2;
            const halfWidth = popoverRect.width / 2;

            if (centerX - halfWidth < spacing) {
                pos.left = `${spacing}px`;
                pos.transform = undefined;
            } else if (centerX + halfWidth > viewportWidth - spacing) {
                pos.right = `${spacing}px`;
                pos.left = undefined;
                pos.transform = undefined;
            }
        } else if (bestPlacement === "left" || bestPlacement === "right") {
            const centerY = triggerRect.top + triggerRect.height / 2;
            const halfHeight = popoverRect.height / 2;

            if (centerY - halfHeight < spacing) {
                pos.top = `${spacing}px`;
                pos.transform = undefined;
            } else if (centerY + halfHeight > viewportHeight - spacing) {
                pos.bottom = `${spacing}px`;
                pos.top = undefined;
                pos.transform = undefined;
            }
        }

        // Apply CSS custom properties
        Object.entries(pos).forEach(([key, value]) => {
            if (value !== undefined) {
                popoverRef!.style.setProperty(
                    key === "transform" ? "transform" : `--tooltip-${key}`,
                    value
                );
            }
        });
    };

    const showTooltip = () => {
        if (popoverRef && typeof popoverRef.showPopover === "function") {
            popoverRef.showPopover();
            setIsOpen(true);
            requestAnimationFrame(() => {
                updatePosition();
                requestAnimationFrame(updatePosition);
            });
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

    createEffect(() => {
        if (isOpen() && triggerRef && popoverRef) {
            updatePosition();
        }
    });

    onMount(() => {
        const handleResize = () => {
            if (isOpen() && triggerRef && popoverRef) {
                updatePosition();
            }
        };

        const handleScroll = () => {
            if (isOpen() && triggerRef && popoverRef) {
                updatePosition();
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, true);

        onCleanup(() => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll, true);
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
                aria-describedby={popoverId()}
                class={local.class}
                {...others}
            >
                {local.children}
            </div>
            <div
                ref={setPopoverRef}
                id={popoverId()}
                popover="auto"
                class={tooltip({
                    placement: actualPlacement(),
                    class: local.class,
                })}
                role="tooltip"
                style={{
                    position: "fixed",
                    top: "var(--tooltip-top, auto)",
                    bottom: "var(--tooltip-bottom, auto)",
                    left: "var(--tooltip-left, auto)",
                    right: "var(--tooltip-right, auto)",
                }}
            >
                {local.content}
            </div>
        </>
    );
}
