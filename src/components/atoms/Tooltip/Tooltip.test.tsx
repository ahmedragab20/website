import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Tooltip } from "./Tooltip";

vi.mock("../../hooks/usePopoverPosition", async (importOriginal) => {
    return {
        ...importOriginal(),
        supportsAnchorPositioning: vi.fn(() => true),
    };
});

describe("Tooltip", () => {
    beforeEach(() => {
        vi.useFakeTimers();

        // Mock Popover API
        HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
            this.classList.add(":popover-open");
            const event = new Event("toggle");
            // @ts-ignore
            event.newState = "open";
            // @ts-ignore
            event.oldState = "closed";
            this.dispatchEvent(event);
        });
        HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
            this.classList.remove(":popover-open");
            const event = new Event("toggle");
            // @ts-ignore
            event.newState = "closed";
            // @ts-ignore
            event.oldState = "open";
            this.dispatchEvent(event);
        });
        HTMLElement.prototype.togglePopover = vi.fn(function (
            this: HTMLElement
        ) {
            if (this.classList.contains(":popover-open")) {
                this.hidePopover();
                return true;
            } else {
                this.showPopover();
                return true;
            }
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
        // @ts-ignore
        delete HTMLElement.prototype.showPopover;
        // @ts-ignore
        delete HTMLElement.prototype.hidePopover;
        // @ts-ignore
        delete HTMLElement.prototype.togglePopover;
    });

    describe("Rendering", () => {
        it("sanity check: showPopover mock works", () => {
            const div = document.createElement("div");
            expect(typeof div.showPopover).toBe("function");
        });

        it("renders trigger element", () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Hover me</button>
                </Tooltip>
            ));
            expect(screen.getByText("Hover me")).toBeInTheDocument();
        });

        it("renders tooltip content", () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Hover me</button>
                </Tooltip>
            ));
            expect(screen.getByText("Tooltip text")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Tooltip content="Tooltip" class="custom-class">
                    <button>Hover</button>
                </Tooltip>
            ));
            const popover = container.querySelector('[popover="manual"]');
            expect(popover?.className).toContain("custom-class");
        });
    });

    describe("Interactions", () => {
        it("shows tooltip on mouse enter", () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Hover me</button>
                </Tooltip>
            ));

            const button = screen.getByText("Hover me");
            const trigger = button.parentElement!;
            const popover = document.querySelector(
                '[popover="manual"]'
            ) as HTMLElement;

            fireEvent.mouseEnter(trigger);
            vi.runAllTimers();

            expect(popover).toHaveClass(":popover-open");
        });

        it("hides tooltip on mouse leave", () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Hover me</button>
                </Tooltip>
            ));

            const button = screen.getByText("Hover me");
            const trigger = button.parentElement!;
            const popover = document.querySelector(
                '[popover="manual"]'
            ) as HTMLElement;

            fireEvent.mouseEnter(trigger);
            vi.runAllTimers();

            expect(popover).toHaveClass(":popover-open");

            fireEvent.mouseLeave(trigger);
            vi.runAllTimers();

            expect(popover).not.toHaveClass(":popover-open");
        });

        it("shows tooltip on focus", () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Focus me</button>
                </Tooltip>
            ));

            const button = screen.getByText("Focus me");
            const trigger = button.parentElement!;
            const popover = document.querySelector(
                '[popover="manual"]'
            ) as HTMLElement;

            fireEvent.focus(trigger);
            vi.runAllTimers();

            expect(popover).toHaveClass(":popover-open");
        });

        it("hides tooltip on blur", () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Focus me</button>
                </Tooltip>
            ));

            const button = screen.getByText("Focus me");
            const trigger = button.parentElement!;
            const popover = document.querySelector(
                '[popover="manual"]'
            ) as HTMLElement;

            fireEvent.focus(trigger);
            vi.runAllTimers();

            expect(popover).toHaveClass(":popover-open");

            fireEvent.blur(trigger);
            vi.runAllTimers();

            expect(popover).not.toHaveClass(":popover-open");
        });

        it("respects delay prop", () => {
            render(() => (
                <Tooltip content="Tooltip text" delay={500}>
                    <button>Hover me</button>
                </Tooltip>
            ));

            const button = screen.getByText("Hover me");
            const trigger = button.parentElement!;
            const popover = document.querySelector(
                '[popover="manual"]'
            ) as HTMLElement;

            fireEvent.mouseEnter(trigger);
            vi.advanceTimersByTime(250);

            expect(popover).not.toHaveClass(":popover-open");

            vi.advanceTimersByTime(300);

            expect(popover).toHaveClass(":popover-open");
        });
    });

    describe("Placements", () => {
        const placements = ["top", "bottom", "left", "right"] as const;

        placements.forEach((placement) => {
            it(`applies correct placement for ${placement}`, () => {
                const { container } = render(() => (
                    <Tooltip content="Tooltip" placement={placement}>
                        <button>Hover</button>
                    </Tooltip>
                ));
                const popover = container.querySelector('[popover="manual"]');
                expect(popover).toBeInTheDocument();
                // Placement is handled via CSS anchor positioning or data attributes
                expect(popover).toHaveAttribute(
                    "data-tooltip-placement",
                    placement
                );
            });
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => (
                <Tooltip content="Helpful tooltip">
                    <button>Hover me</button>
                </Tooltip>
            ));

            const triggerButton = screen.getByText("Hover me");
            const triggerWrapper = triggerButton.parentElement;
            const popoverId = triggerWrapper?.getAttribute("aria-describedby");
            expect(popoverId).toBeTruthy();

            const popover = document.getElementById(popoverId!);
            expect(popover).toHaveAttribute("role", "tooltip");
        });
    });

    describe("Default Values", () => {
        it("uses default placement (top) when not specified", () => {
            const { container } = render(() => (
                <Tooltip content="Tooltip">
                    <button>Hover</button>
                </Tooltip>
            ));
            const popover = container.querySelector('[popover="manual"]');
            expect(popover).toBeInTheDocument();
            expect(popover).toHaveAttribute("data-tooltip-placement", "top");
        });
    });
});
