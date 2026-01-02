import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@solidjs/testing-library";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Rendering", () => {
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
            const popover = container.querySelector('[popover="auto"]');
            expect(popover?.className).toContain("custom-class");
        });
    });

    describe("Interactions", () => {
        it("shows tooltip on mouse enter", async () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Hover me</button>
                </Tooltip>
            ));

            const trigger = screen.getByText("Hover me");
            const popover = document.querySelector(
                '[popover="auto"]'
            ) as HTMLElement;

            fireEvent.mouseEnter(trigger);
            vi.advanceTimersByTime(100);

            await waitFor(() => {
                expect(popover).toHaveClass(":popover-open");
            });
        });

        it("hides tooltip on mouse leave", async () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Hover me</button>
                </Tooltip>
            ));

            const trigger = screen.getByText("Hover me");
            const popover = document.querySelector(
                '[popover="auto"]'
            ) as HTMLElement;

            fireEvent.mouseEnter(trigger);
            vi.advanceTimersByTime(100);

            await waitFor(() => {
                expect(popover).toHaveClass(":popover-open");
            });

            fireEvent.mouseLeave(trigger);

            await waitFor(() => {
                expect(popover).not.toHaveClass(":popover-open");
            });
        });

        it("shows tooltip on focus", async () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Focus me</button>
                </Tooltip>
            ));

            const trigger = screen.getByText("Focus me");
            const popover = document.querySelector(
                '[popover="auto"]'
            ) as HTMLElement;

            fireEvent.focus(trigger);

            await waitFor(() => {
                expect(popover).toHaveClass(":popover-open");
            });
        });

        it("hides tooltip on blur", async () => {
            render(() => (
                <Tooltip content="Tooltip text">
                    <button>Focus me</button>
                </Tooltip>
            ));

            const trigger = screen.getByText("Focus me");
            const popover = document.querySelector(
                '[popover="auto"]'
            ) as HTMLElement;

            fireEvent.focus(trigger);

            await waitFor(() => {
                expect(popover).toHaveClass(":popover-open");
            });

            fireEvent.blur(trigger);

            await waitFor(() => {
                expect(popover).not.toHaveClass(":popover-open");
            });
        });

        it("respects delay prop", async () => {
            render(() => (
                <Tooltip content="Tooltip text" delay={500}>
                    <button>Hover me</button>
                </Tooltip>
            ));

            const trigger = screen.getByText("Hover me");
            const popover = document.querySelector(
                '[popover="auto"]'
            ) as HTMLElement;

            fireEvent.mouseEnter(trigger);
            vi.advanceTimersByTime(250);

            expect(popover).not.toHaveClass(":popover-open");

            vi.advanceTimersByTime(300);

            await waitFor(() => {
                expect(popover).toHaveClass(":popover-open");
            });
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
                const popover = container.querySelector('[popover="auto"]');
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

            const trigger = screen.getByText("Hover me");
            const popoverId = trigger.getAttribute("aria-describedby");
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
            const popover = container.querySelector('[popover="auto"]');
            expect(popover).toBeInTheDocument();
            expect(popover).toHaveAttribute("data-tooltip-placement", "top");
        });
    });
});
