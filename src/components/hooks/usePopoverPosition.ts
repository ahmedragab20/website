import {
    onMount,
    onCleanup,
    createEffect,
    untrack,
    type Accessor,
} from "solid-js";

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

type Position = {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
};

type Rect = {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};

type ViewportDimensions = {
    width: number;
    height: number;
};

type PositionContext = {
    triggerRect: Rect;
    popoverRect: Rect;
    viewport: ViewportDimensions;
    spacing: number;
};

const getViewportDimensions = (): ViewportDimensions => {
    if (typeof window === "undefined") {
        return { width: 0, height: 0 };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
};

const isDropdownPlacement = (placement: Placement): boolean => {
    return (
        placement === "bottom-start" ||
        placement === "bottom-end" ||
        placement === "top-start" ||
        placement === "top-end"
    );
};

const isBottomPlacement = (placement: Placement): boolean => {
    return placement.startsWith("bottom");
};

const isStartPlacement = (placement: Placement): boolean => {
    return placement.endsWith("start");
};

const calculateDropdownPosition = (
    placement: Placement,
    context: PositionContext
): Position => {
    const { triggerRect, viewport, spacing } = context;
    const pos: Position = {};
    const isBottom = isBottomPlacement(placement);
    const isStart = isStartPlacement(placement);

    if (isBottom) {
        pos.top = `${triggerRect.bottom + spacing}px`;
        if (isStart) {
            pos.left = `${triggerRect.left}px`;
        } else {
            pos.right = `${viewport.width - triggerRect.right}px`;
        }
    } else {
        pos.bottom = `${viewport.height - triggerRect.top + spacing}px`;
        if (isStart) {
            pos.left = `${triggerRect.left}px`;
        } else {
            pos.right = `${viewport.width - triggerRect.right}px`;
        }
    }

    return pos;
};

const adjustDropdownHorizontal = (
    placement: Placement,
    pos: Position,
    context: PositionContext
): Position => {
    const { triggerRect, popoverRect, viewport, spacing } = context;
    const isStart = isStartPlacement(placement);
    const computedLeft = isStart
        ? triggerRect.left
        : viewport.width - triggerRect.right;

    if (computedLeft + popoverRect.width > viewport.width - spacing) {
        return {
            ...pos,
            left: `${viewport.width - popoverRect.width - spacing}px`,
            right: undefined,
        };
    }

    if (computedLeft < spacing) {
        return {
            ...pos,
            left: `${spacing}px`,
            right: undefined,
        };
    }

    return pos;
};

const adjustDropdownVertical = (
    placement: Placement,
    pos: Position,
    context: PositionContext
): Position => {
    const { triggerRect, popoverRect, viewport, spacing } = context;
    const isBottom = isBottomPlacement(placement);

    if (isBottom) {
        const top = triggerRect.bottom + spacing;
        if (top + popoverRect.height > viewport.height - spacing) {
            const newTop = triggerRect.top - popoverRect.height - spacing;
            if (newTop >= spacing) {
                return {
                    ...pos,
                    top: `${newTop}px`,
                    bottom: undefined,
                };
            }
            return {
                ...pos,
                top: `${spacing}px`,
                bottom: undefined,
            };
        }
    } else {
        const bottom = viewport.height - triggerRect.top + spacing;
        if (bottom + popoverRect.height > viewport.height - spacing) {
            const newBottom =
                viewport.height -
                triggerRect.bottom -
                popoverRect.height -
                spacing;
            if (newBottom >= spacing) {
                return {
                    ...pos,
                    bottom: `${newBottom}px`,
                    top: undefined,
                };
            }
            return {
                ...pos,
                bottom: `${spacing}px`,
                top: undefined,
            };
        }
    }

    return pos;
};

const calculateDropdownPositionComplete = (
    placement: Placement,
    context: PositionContext
): Position => {
    const initialPos = calculateDropdownPosition(placement, context);
    const horizontalAdjusted = adjustDropdownHorizontal(
        placement,
        initialPos,
        context
    );
    return adjustDropdownVertical(placement, horizontalAdjusted, context);
};

const checkTooltipFit = (
    placement: "top" | "bottom" | "left" | "right",
    context: PositionContext
): boolean => {
    const { triggerRect, popoverRect, viewport, spacing } = context;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
        case "top": {
            const halfWidth = popoverRect.width / 2;
            return (
                triggerCenterX - halfWidth >= 0 &&
                triggerCenterX + halfWidth <= viewport.width &&
                triggerRect.top - popoverRect.height - spacing >= 0
            );
        }
        case "bottom": {
            const halfWidth = popoverRect.width / 2;
            return (
                triggerCenterX - halfWidth >= 0 &&
                triggerCenterX + halfWidth <= viewport.width &&
                triggerRect.bottom + popoverRect.height + spacing <=
                    viewport.height
            );
        }
        case "left": {
            const halfHeight = popoverRect.height / 2;
            return (
                triggerCenterY - halfHeight >= 0 &&
                triggerCenterY + halfHeight <= viewport.height &&
                triggerRect.left - popoverRect.width - spacing >= 0
            );
        }
        case "right": {
            const halfHeight = popoverRect.height / 2;
            return (
                triggerCenterY - halfHeight >= 0 &&
                triggerCenterY + halfHeight <= viewport.height &&
                triggerRect.right + popoverRect.width + spacing <=
                    viewport.width
            );
        }
    }
};

const calculateTooltipPosition = (
    placement: "top" | "bottom" | "left" | "right",
    context: PositionContext
): Position => {
    const { triggerRect, viewport, spacing } = context;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    switch (placement) {
        case "top":
            return {
                bottom: `${viewport.height - triggerRect.top + spacing}px`,
                left: `${triggerCenterX}px`,
                transform: "translateX(-50%)",
            };
        case "bottom":
            return {
                top: `${triggerRect.bottom + spacing}px`,
                left: `${triggerCenterX}px`,
                transform: "translateX(-50%)",
            };
        case "left":
            return {
                top: `${triggerCenterY}px`,
                right: `${viewport.width - triggerRect.left + spacing}px`,
                transform: "translateY(-50%)",
            };
        case "right":
            return {
                top: `${triggerCenterY}px`,
                left: `${triggerRect.right + spacing}px`,
                transform: "translateY(-50%)",
            };
    }
};

const findBestTooltipPlacement = (
    preferredPlacement: "top" | "bottom" | "left" | "right",
    context: PositionContext
): {
    placement: "top" | "bottom" | "left" | "right";
    position: Position;
} => {
    const tooltipPlacements: readonly ("top" | "bottom" | "left" | "right")[] =
        ["top", "bottom", "left", "right"];

    const placementOrder = [
        preferredPlacement,
        ...tooltipPlacements.filter((pl) => pl !== preferredPlacement),
    ];

    for (const placement of placementOrder) {
        if (checkTooltipFit(placement, context)) {
            return {
                placement,
                position: calculateTooltipPosition(placement, context),
            };
        }
    }

    return {
        placement: preferredPlacement,
        position: calculateTooltipPosition(preferredPlacement, context),
    };
};

const adjustTooltipBoundaries = (
    placement: "top" | "bottom" | "left" | "right",
    pos: Position,
    context: PositionContext
): Position => {
    const { triggerRect, popoverRect, viewport, spacing } = context;
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    if (placement === "top" || placement === "bottom") {
        const halfWidth = popoverRect.width / 2;

        if (triggerCenterX - halfWidth < spacing) {
            return {
                ...pos,
                left: `${spacing}px`,
                transform: undefined,
            };
        }

        if (triggerCenterX + halfWidth > viewport.width - spacing) {
            return {
                ...pos,
                right: `${spacing}px`,
                left: undefined,
                transform: undefined,
            };
        }
    } else {
        const halfHeight = popoverRect.height / 2;

        if (triggerCenterY - halfHeight < spacing) {
            return {
                ...pos,
                top: `${spacing}px`,
                transform: undefined,
            };
        }

        if (triggerCenterY + halfHeight > viewport.height - spacing) {
            return {
                ...pos,
                bottom: `${spacing}px`,
                top: undefined,
                transform: undefined,
            };
        }
    }

    return pos;
};

const calculateTooltipPositionComplete = (
    preferredPlacement: "top" | "bottom" | "left" | "right",
    context: PositionContext
): Position => {
    const result = findBestTooltipPlacement(preferredPlacement, context);
    return adjustTooltipBoundaries(result.placement, result.position, context);
};

const calculatePosition = (
    placement: Placement,
    context: PositionContext
): Position => {
    if (isDropdownPlacement(placement)) {
        return calculateDropdownPositionComplete(placement, context);
    }

    if (
        placement !== "top" &&
        placement !== "bottom" &&
        placement !== "left" &&
        placement !== "right"
    ) {
        return {};
    }

    return calculateTooltipPositionComplete(placement, context);
};

const positionsEqual = (
    pos1: Position | null,
    pos2: Position | null
): boolean => {
    if (pos1 === null && pos2 === null) return true;
    if (pos1 === null || pos2 === null) return false;

    const keys1 = Object.keys(pos1) as Array<keyof Position>;
    const keys2 = Object.keys(pos2) as Array<keyof Position>;

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => pos1[key] === pos2[key]);
};

const getKeysToUpdate = (
    newPos: Position,
    oldPos: Position | null
): Set<keyof Position> => {
    const keys = new Set<keyof Position>();
    Object.keys(newPos).forEach((key) => keys.add(key as keyof Position));
    if (oldPos) {
        Object.keys(oldPos).forEach((key) => keys.add(key as keyof Position));
    }
    return keys;
};

const applyPositionToDOM = (
    popover: HTMLElement,
    pos: Position,
    oldPos: Position | null
): void => {
    const style = popover.style;
    const keysToUpdate = getKeysToUpdate(pos, oldPos);

    for (const key of keysToUpdate) {
        const value = pos[key];
        if (value !== undefined) {
            if (key === "transform") {
                style.transform = value;
            } else {
                style.setProperty(`--popover-${key}`, value);
            }
        } else {
            if (key === "transform") {
                style.transform = "";
            } else {
                style.removeProperty(`--popover-${key}`);
            }
        }
    }
};

/**
 * Hook for positioning popover elements using JavaScript.
 * Used as a fallback when CSS Anchor Positioning is not supported.
 */
export function usePopoverPosition(options: UsePopoverPositionOptions) {
    const { triggerRef, popoverRef, placement, isOpen, spacing = 8 } = options;

    // Mutable state for RAF and position caching (necessary for performance)
    let rafId: number | null = null;
    let lastPosition: Position | null = null;

    const updatePosition = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
            rafId = null;

            if (typeof window === "undefined") return;

            const trigger = untrack(triggerRef);
            const popover = untrack(popoverRef);
            if (!trigger || !popover) return;

            const triggerRect = trigger.getBoundingClientRect();
            const popoverRect = popover.getBoundingClientRect();
            const viewport = getViewportDimensions();
            const place = untrack(placement);

            const context: PositionContext = {
                triggerRect: {
                    left: triggerRect.left,
                    top: triggerRect.top,
                    right: triggerRect.right,
                    bottom: triggerRect.bottom,
                    width: triggerRect.width,
                    height: triggerRect.height,
                },
                popoverRect: {
                    left: popoverRect.left,
                    top: popoverRect.top,
                    right: popoverRect.right,
                    bottom: popoverRect.bottom,
                    width: popoverRect.width,
                    height: popoverRect.height,
                },
                viewport,
                spacing,
            };

            const newPosition = calculatePosition(place, context);

            if (!positionsEqual(newPosition, lastPosition)) {
                applyPositionToDOM(popover, newPosition, lastPosition);
                lastPosition = { ...newPosition };
            }
        });
    };

    createEffect(() => {
        if (isOpen() && triggerRef() && popoverRef()) {
            updatePosition();
        } else {
            lastPosition = null;
        }
    });

    onMount(() => {
        if (typeof window === "undefined") return;

        let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

        const handleResize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (
                    untrack(isOpen) &&
                    untrack(triggerRef) &&
                    untrack(popoverRef)
                ) {
                    updatePosition();
                }
            }, 100);
        };

        const handleScroll = () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (
                    untrack(isOpen) &&
                    untrack(triggerRef) &&
                    untrack(popoverRef)
                ) {
                    updatePosition();
                }
            }, 16);
        };

        window.addEventListener("resize", handleResize, { passive: true });
        window.addEventListener("scroll", handleScroll, {
            passive: true,
            capture: true,
        });

        onCleanup(() => {
            if (typeof window === "undefined") return;

            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            if (resizeTimeout) clearTimeout(resizeTimeout);
            if (scrollTimeout) clearTimeout(scrollTimeout);

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
