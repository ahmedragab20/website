import { onMount, onCleanup, createEffect, type Accessor } from "solid-js";

export type Placement =
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end"
    | "top"
    | "bottom"
    | "left"
    | "right";

export interface UsePopoverPositionOptions {
    triggerRef: Accessor<HTMLElement | undefined>;
    popoverRef: Accessor<HTMLElement | undefined>;
    placement: Accessor<Placement>;
    isOpen: Accessor<boolean>;
    spacing?: number;
}

/**
 * Hook for positioning popover elements using JavaScript.
 * Used as a fallback when CSS Anchor Positioning is not supported.
 *
 * @param options - Configuration options for positioning
 * @returns Cleanup function (automatically handled by SolidJS lifecycle)
 */
export function usePopoverPosition(options: UsePopoverPositionOptions) {
    const { triggerRef, popoverRef, placement, isOpen, spacing = 8 } = options;

    const updatePosition = () => {
        if (typeof window === "undefined") return;

        const trigger = triggerRef();
        const popover = popoverRef();
        if (!trigger || !popover) return;

        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const place = placement();
        let pos: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
            transform?: string;
        } = {};

        // Handle dropdown-style placements (bottom-start, bottom-end, top-start, top-end)
        if (
            place === "bottom-start" ||
            place === "bottom-end" ||
            place === "top-start" ||
            place === "top-end"
        ) {
            if (place.startsWith("bottom")) {
                pos.top = `${triggerRect.bottom + spacing}px`;
                if (place === "bottom-start") {
                    pos.left = `${triggerRect.left}px`;
                } else {
                    pos.right = `${viewportWidth - triggerRect.right}px`;
                }
            } else {
                pos.bottom = `${viewportHeight - triggerRect.top + spacing}px`;
                if (place === "top-start") {
                    pos.left = `${triggerRect.left}px`;
                } else {
                    pos.right = `${viewportWidth - triggerRect.right}px`;
                }
            }

            // Adjust for horizontal viewport boundaries
            const computedLeft = place.endsWith("start")
                ? triggerRect.left
                : viewportWidth - triggerRect.right;
            const popoverWidth = popoverRect.width;

            if (computedLeft + popoverWidth > viewportWidth - spacing) {
                pos.left = `${viewportWidth - popoverWidth - spacing}px`;
                pos.right = undefined;
            }
            if (computedLeft < spacing) {
                pos.left = `${spacing}px`;
                pos.right = undefined;
            }

            // Adjust for vertical viewport boundaries
            const popoverHeight = popoverRect.height;

            if (place.startsWith("bottom")) {
                const top = triggerRect.bottom + spacing;
                if (top + popoverHeight > viewportHeight - spacing) {
                    const newTop = triggerRect.top - popoverHeight - spacing;
                    if (newTop >= spacing) {
                        pos.top = `${newTop}px`;
                        pos.bottom = undefined;
                    } else {
                        pos.top = `${spacing}px`;
                        pos.bottom = undefined;
                    }
                }
            } else {
                const bottom = viewportHeight - triggerRect.top + spacing;
                if (bottom + popoverHeight > viewportHeight - spacing) {
                    const newBottom =
                        viewportHeight -
                        triggerRect.bottom -
                        popoverHeight -
                        spacing;
                    if (newBottom >= spacing) {
                        pos.bottom = `${newBottom}px`;
                        pos.top = undefined;
                    } else {
                        pos.bottom = `${spacing}px`;
                        pos.top = undefined;
                    }
                }
            }
        } else {
            // Handle tooltip-style placements (top, bottom, left, right)
            const placements: Placement[] = ["top", "bottom", "left", "right"];
            let bestPlacement = place;
            let fits = false;

            for (const p of [
                place,
                ...placements.filter((pl) => pl !== place),
            ]) {
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
                    // @ts-expect-error
                    bestPlacement = p;
                    pos = testPos;
                    break;
                }
            }

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
        }

        // Apply CSS custom properties
        Object.entries(pos).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === "transform") {
                    popover.style.transform = value;
                } else {
                    popover.style.setProperty(`--popover-${key}`, value);
                }
            } else {
                if (key === "transform") {
                    popover.style.transform = "";
                } else {
                    popover.style.removeProperty(`--popover-${key}`);
                }
            }
        });
    };

    createEffect(() => {
        if (isOpen() && triggerRef() && popoverRef()) {
            updatePosition();
        }
    });

    onMount(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            if (isOpen() && triggerRef() && popoverRef()) {
                updatePosition();
            }
        };

        const handleScroll = () => {
            if (isOpen() && triggerRef() && popoverRef()) {
                updatePosition();
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, true);

        onCleanup(() => {
            if (typeof window === "undefined") return;
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll, true);
        });
    });
}

/**
 * Checks if CSS Anchor Positioning is supported in the browser.
 * Returns false during SSR.
 */
export function supportsAnchorPositioning(): boolean {
    if (typeof window === "undefined") return false;
    return (
        typeof CSS !== "undefined" &&
        "anchorName" in CSS.supports &&
        CSS.supports("anchor-name", "--anchor")
    );
}
