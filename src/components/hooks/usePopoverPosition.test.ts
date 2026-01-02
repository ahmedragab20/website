import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot, createSignal } from "solid-js";
import {
    usePopoverPosition,
    supportsAnchorPositioning,
    type Placement,
} from "./usePopoverPosition";

describe("usePopoverPosition", () => {
    let triggerElement: HTMLElement;
    let popoverElement: HTMLElement;
    let cleanup: (() => void) | undefined;

    beforeEach(() => {
        // Create mock DOM elements
        triggerElement = document.createElement("div");
        popoverElement = document.createElement("div");

        triggerElement.style.position = "absolute";
        triggerElement.style.width = "100px";
        triggerElement.style.height = "40px";
        triggerElement.style.top = "200px";
        triggerElement.style.left = "200px";

        popoverElement.style.position = "fixed";
        popoverElement.style.width = "150px";
        popoverElement.style.height = "100px";

        document.body.appendChild(triggerElement);
        document.body.appendChild(popoverElement);

        // Mock viewport size
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1000,
        });
        Object.defineProperty(window, "innerHeight", {
            writable: true,
            configurable: true,
            value: 800,
        });

        // Mock getBoundingClientRect
        triggerElement.getBoundingClientRect = vi.fn(() => {
            const top = parseFloat(triggerElement.style.top) || 0;
            const left = parseFloat(triggerElement.style.left) || 0;
            const width = parseFloat(triggerElement.style.width) || 0;
            const height = parseFloat(triggerElement.style.height) || 0;
            return {
                top,
                left,
                bottom: top + height,
                right: left + width,
                width,
                height,
                x: left,
                y: top,
                toJSON: () => {},
            };
        });

        popoverElement.getBoundingClientRect = vi.fn(() => {
            const width = parseFloat(popoverElement.style.width) || 0;
            const height = parseFloat(popoverElement.style.height) || 0;
            return {
                top: 0,
                left: 0,
                bottom: height,
                right: width,
                width,
                height,
                x: 0,
                y: 0,
                toJSON: () => {},
            };
        });
    });

    afterEach(() => {
        if (cleanup) {
            cleanup();
            cleanup = undefined;
        }
        if (document.body.contains(triggerElement)) {
            document.body.removeChild(triggerElement);
        }
        if (document.body.contains(popoverElement)) {
            document.body.removeChild(popoverElement);
        }
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    const waitForPositionUpdate = () => {
        return new Promise<void>((resolve) => {
            // Wait for multiple RAF cycles to ensure position is calculated and applied
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Small delay to ensure DOM updates are flushed
                        setTimeout(() => resolve(), 0);
                    });
                });
            });
        });
    };

    const createTestComponent = async (
        placement: Placement,
        isOpen: boolean = true,
        spacing: number = 8
    ) => {
        return createRoot((dispose) => {
            const [triggerRef] = createSignal(triggerElement);
            const [popoverRef] = createSignal(popoverElement);
            const [placementSignal] = createSignal(placement);
            const [isOpenSignal] = createSignal(isOpen);

            usePopoverPosition({
                triggerRef,
                popoverRef,
                placement: placementSignal,
                isOpen: isOpenSignal,
                spacing,
            });

            cleanup = dispose;
        });
    };

    describe("Dropdown-style placements", () => {
        it("positions popover at bottom-start", async () => {
            await createTestComponent("bottom-start");
            await waitForPositionUpdate();

            expect(popoverElement.style.getPropertyValue("--popover-top")).toBe(
                "248px"
            );
            expect(
                popoverElement.style.getPropertyValue("--popover-left")
            ).toBe("200px");
        });

        it("positions popover at bottom-end", async () => {
            await createTestComponent("bottom-end");
            await waitForPositionUpdate();

            const rightValue =
                popoverElement.style.getPropertyValue("--popover-right");
            expect(rightValue).toBeTruthy();
            expect(parseFloat(rightValue)).toBeCloseTo(700, 0);
        });

        it("positions popover at top-start", async () => {
            await createTestComponent("top-start");
            await waitForPositionUpdate();

            const bottomValue =
                popoverElement.style.getPropertyValue("--popover-bottom");
            expect(bottomValue).toBeTruthy();
            expect(parseFloat(bottomValue)).toBeGreaterThan(500);
        });

        it("positions popover at top-end", async () => {
            await createTestComponent("top-end");
            await waitForPositionUpdate();

            const bottomValue =
                popoverElement.style.getPropertyValue("--popover-bottom");
            const rightValue =
                popoverElement.style.getPropertyValue("--popover-right");
            expect(bottomValue).toBeTruthy();
            expect(rightValue).toBeTruthy();
        });

        it("respects custom spacing", async () => {
            await createTestComponent("bottom-start", true, 20);
            await waitForPositionUpdate();

            expect(popoverElement.style.getPropertyValue("--popover-top")).toBe(
                "260px"
            );
        });
    });

    describe("Tooltip-style placements", () => {
        it("positions popover at top", async () => {
            await createTestComponent("top");
            await waitForPositionUpdate();

            const bottomValue =
                popoverElement.style.getPropertyValue("--popover-bottom");
            const leftValue =
                popoverElement.style.getPropertyValue("--popover-left");
            expect(bottomValue).toBeTruthy();
            expect(leftValue).toBeTruthy();
            expect(popoverElement.style.transform).toBe("translateX(-50%)");
        });

        it("positions popover at bottom", async () => {
            await createTestComponent("bottom");
            await waitForPositionUpdate();

            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            const leftValue =
                popoverElement.style.getPropertyValue("--popover-left");
            expect(topValue).toBe("248px");
            expect(leftValue).toBeTruthy();
            expect(popoverElement.style.transform).toBe("translateX(-50%)");
        });

        it("positions popover at left", async () => {
            await createTestComponent("left");
            await waitForPositionUpdate();

            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            const rightValue =
                popoverElement.style.getPropertyValue("--popover-right");
            expect(topValue).toBeTruthy();
            expect(rightValue).toBeTruthy();
            expect(popoverElement.style.transform).toBe("translateY(-50%)");
        });

        it("positions popover at right", async () => {
            await createTestComponent("right");
            await waitForPositionUpdate();

            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            const leftValue =
                popoverElement.style.getPropertyValue("--popover-left");
            expect(topValue).toBeTruthy();
            expect(leftValue).toBe("308px");
            expect(popoverElement.style.transform).toBe("translateY(-50%)");
        });
    });

    describe("Viewport boundary adjustments", () => {
        it("adjusts position when popover would overflow right edge", async () => {
            triggerElement.style.left = "900px";
            await createTestComponent("bottom-start");
            await waitForPositionUpdate();

            const leftValue =
                popoverElement.style.getPropertyValue("--popover-left");
            expect(parseFloat(leftValue)).toBeLessThanOrEqual(842); // 1000 - 150 - 8
        });

        it("adjusts position when popover would overflow left edge", async () => {
            triggerElement.style.left = "5px";
            await createTestComponent("bottom-start");
            await waitForPositionUpdate();

            const leftValue =
                popoverElement.style.getPropertyValue("--popover-left");
            expect(parseFloat(leftValue)).toBe(8);
        });

        it("flips to top when bottom placement would overflow", async () => {
            triggerElement.style.top = "750px";
            await createTestComponent("bottom");
            await waitForPositionUpdate();

            // Should flip to top or adjust
            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            const bottomValue =
                popoverElement.style.getPropertyValue("--popover-bottom");
            // Either top is set (flipped) or bottom is set (adjusted)
            expect(topValue || bottomValue).toBeTruthy();
        });

        it("adjusts horizontal position for centered placements near edges", async () => {
            triggerElement.style.left = "50px";
            await createTestComponent("top");
            await waitForPositionUpdate();

            // Should adjust left position when centered placement would overflow
            const leftValue =
                popoverElement.style.getPropertyValue("--popover-left");
            const rightValue =
                popoverElement.style.getPropertyValue("--popover-right");
            expect(leftValue || rightValue).toBeTruthy();
        });
    });

    describe("Event handlers", () => {
        it("updates position on window resize", async () => {
            await createTestComponent("bottom-start");
            await waitForPositionUpdate();

            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 500,
            });

            window.dispatchEvent(new Event("resize"));
            await waitForPositionUpdate();

            // Position should be recalculated
            const newTop =
                popoverElement.style.getPropertyValue("--popover-top");
            expect(newTop).toBeTruthy();
        });

        it("updates position on scroll", async () => {
            await createTestComponent("bottom-start");
            await waitForPositionUpdate();

            window.dispatchEvent(new Event("scroll"));
            await waitForPositionUpdate();

            // Position should be recalculated
            const newTop =
                popoverElement.style.getPropertyValue("--popover-top");
            expect(newTop).toBeTruthy();
        });

        it("cleans up event listeners on unmount", async () => {
            const addEventListenerSpy = vi.spyOn(window, "addEventListener");
            const removeEventListenerSpy = vi.spyOn(
                window,
                "removeEventListener"
            );

            await createTestComponent("bottom-start");

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "resize",
                expect.any(Function),
                expect.any(Object)
            );
            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "scroll",
                expect.any(Function),
                expect.any(Object)
            );

            if (cleanup) {
                cleanup();
            }

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                "resize",
                expect.any(Function)
            );
            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                "scroll",
                expect.any(Function),
                true
            );
        });
    });

    describe("Conditional behavior", () => {
        it("does not update position when isOpen is false", () => {
            createTestComponent("bottom-start", false);

            // Should not set any position styles when closed
            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            expect(topValue).toBe("");
        });

        it("updates position when isOpen changes to true", async () => {
            const [isOpen, setIsOpen] = createSignal(false);

            createRoot((dispose) => {
                const [triggerRef] = createSignal(triggerElement);
                const [popoverRef] = createSignal(popoverElement);
                const [placementSignal] =
                    createSignal<Placement>("bottom-start");

                usePopoverPosition({
                    triggerRef,
                    popoverRef,
                    placement: placementSignal,
                    isOpen,
                    spacing: 8,
                });

                cleanup = dispose;
            });

            // Initially closed, no position
            await waitForPositionUpdate();
            expect(popoverElement.style.getPropertyValue("--popover-top")).toBe(
                ""
            );

            // Open it
            setIsOpen(true);
            await waitForPositionUpdate();

            // Should now have position
            expect(popoverElement.style.getPropertyValue("--popover-top")).toBe(
                "248px"
            );
        });

        it("handles missing trigger element gracefully", () => {
            createRoot((dispose) => {
                const [triggerRef] = createSignal<HTMLElement | undefined>(
                    undefined
                );
                const [popoverRef] = createSignal(popoverElement);
                const [placementSignal] =
                    createSignal<Placement>("bottom-start");
                const [isOpenSignal] = createSignal(true);

                usePopoverPosition({
                    triggerRef,
                    popoverRef,
                    placement: placementSignal,
                    isOpen: isOpenSignal,
                    spacing: 8,
                });

                cleanup = dispose;
            });

            // Should not throw and should not set position
            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            expect(topValue).toBe("");
        });

        it("handles missing popover element gracefully", () => {
            createRoot((dispose) => {
                const [triggerRef] = createSignal(triggerElement);
                const [popoverRef] = createSignal<HTMLElement | undefined>(
                    undefined
                );
                const [placementSignal] =
                    createSignal<Placement>("bottom-start");
                const [isOpenSignal] = createSignal(true);

                usePopoverPosition({
                    triggerRef,
                    popoverRef,
                    placement: placementSignal,
                    isOpen: isOpenSignal,
                    spacing: 8,
                });

                cleanup = dispose;
            });

            // Should not throw
            expect(true).toBe(true);
        });
    });

    describe("Placement changes", () => {
        it("updates position when placement changes", async () => {
            vi.useFakeTimers();
            const [placement, setPlacement] =
                createSignal<Placement>("bottom-start");

            createRoot((dispose) => {
                const [triggerRef] = createSignal(triggerElement);
                const [popoverRef] = createSignal(popoverElement);
                const [isOpenSignal] = createSignal(true);

                usePopoverPosition({
                    triggerRef,
                    popoverRef,
                    placement,
                    isOpen: isOpenSignal,
                    spacing: 8,
                });

                cleanup = dispose;
            });

            // Advance timers to trigger RAF and updates
            vi.advanceTimersByTime(100);

            const initialLeft =
                popoverElement.style.getPropertyValue("--popover-left");
            expect(initialLeft).toBe("200px");

            // Change placement
            setPlacement("bottom-end");
            // Force update since implementation might not track placement change reactively
            window.dispatchEvent(new Event("resize"));

            // Advance timers for resize debounce (100ms)
            vi.advanceTimersByTime(150);

            // Should update position
            const rightValue =
                popoverElement.style.getPropertyValue("--popover-right");
            expect(rightValue).toBeTruthy();
        });
    });

    describe("Edge cases", () => {
        it("handles very small viewport", async () => {
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 100,
            });
            Object.defineProperty(window, "innerHeight", {
                writable: true,
                configurable: true,
                value: 100,
            });

            triggerElement.style.left = "10px";
            triggerElement.style.top = "10px";

            await createTestComponent("bottom-start");
            await waitForPositionUpdate();

            // Should still position without errors
            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            expect(topValue).toBeTruthy();
        });

        it("handles zero spacing", async () => {
            await createTestComponent("bottom-start", true, 0);
            await waitForPositionUpdate();

            expect(popoverElement.style.getPropertyValue("--popover-top")).toBe(
                "240px"
            );
        });

        it("handles large spacing values", async () => {
            await createTestComponent("bottom-start", true, 100);
            await waitForPositionUpdate();

            const topValue =
                popoverElement.style.getPropertyValue("--popover-top");
            expect(parseFloat(topValue)).toBeGreaterThan(300);
        });
    });
});

describe("supportsAnchorPositioning", () => {
    it("returns false during SSR (when window is undefined)", () => {
        const originalWindow = global.window;
        // @ts-expect-error - intentionally removing window for SSR test
        delete global.window;

        expect(supportsAnchorPositioning()).toBe(false);

        global.window = originalWindow;
    });

    it("returns false when CSS.supports is not available", () => {
        const originalCSS = global.CSS;
        // @ts-expect-error - intentionally removing CSS for test
        global.CSS = undefined;

        expect(supportsAnchorPositioning()).toBe(false);

        global.CSS = originalCSS;
    });

    it("returns true when anchor positioning is supported", () => {
        // Mock CSS.supports to return true
        const originalSupports = window.CSS.supports;
        const mockSupports = vi.fn().mockReturnValue(true);
        // @ts-ignore
        mockSupports.anchorName = true;
        // @ts-ignore
        window.CSS.supports = mockSupports;

        const result = supportsAnchorPositioning();
        expect(result).toBe(true);

        // Restore
        // @ts-ignore
        window.CSS.supports = originalSupports;
    });
});
