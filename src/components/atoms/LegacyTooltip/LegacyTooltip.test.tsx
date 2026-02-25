import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@solidjs/testing-library";
import { LegacyTooltip } from "./LegacyTooltip";

describe("LegacyTooltip", () => {
    // We use real timers to avoid RAF mocking issues with useFakeTimers
    // and use waitFor for async expectations.

    it("renders trigger element", () => {
        render(() => (
            <LegacyTooltip content="Tooltip content">
                <button>Trigger</button>
            </LegacyTooltip>
        ));
        expect(screen.getByText("Trigger")).toBeInTheDocument();
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows tooltip on hover after delay", async () => {
        render(() => (
            <LegacyTooltip content="Tooltip content" delay={50}>
                <button>Trigger</button>
            </LegacyTooltip>
        ));

        const trigger = screen.getByTestId("tooltip-trigger");
        fireEvent.mouseEnter(trigger);

        // Should not be visible immediately
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

        // Wait for appearance
        await waitFor(
            () => {
                expect(screen.getByRole("tooltip")).toBeInTheDocument();
            },
            { timeout: 1000 }
        );

        expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });

    it("hides tooltip on mouse leave", async () => {
        render(() => (
            <LegacyTooltip content="Tooltip content" delay={0}>
                <button>Trigger</button>
            </LegacyTooltip>
        ));

        const trigger = screen.getByTestId("tooltip-trigger");
        fireEvent.mouseEnter(trigger);

        await waitFor(() => {
            expect(screen.getByRole("tooltip")).toBeVisible();
        });

        fireEvent.mouseLeave(trigger);

        await waitFor(() => {
            expect(screen.getByRole("tooltip")).toHaveClass("opacity-0");
        });
    });

    it("handles accessibility attributes", async () => {
        render(() => (
            <LegacyTooltip content="Info" delay={0}>
                <button>Trigger</button>
            </LegacyTooltip>
        ));

        const trigger = screen.getByTestId("tooltip-trigger");
        expect(trigger).not.toHaveAttribute("aria-describedby");

        fireEvent.mouseEnter(trigger);

        await waitFor(() => {
            expect(screen.getByRole("tooltip")).toBeInTheDocument();
        });

        const tooltip = screen.getByRole("tooltip");
        const id = tooltip.id;

        expect(trigger).toHaveAttribute("aria-describedby", id);
    });

    it("shows and hides tooltip on focus/blur", async () => {
        render(() => (
            <LegacyTooltip content="Focused Info" delay={0}>
                <button>Trigger</button>
            </LegacyTooltip>
        ));

        const trigger = screen.getByTestId("tooltip-trigger");

        // Focus
        fireEvent.focus(trigger);

        await waitFor(() => {
            expect(screen.getByRole("tooltip")).toBeVisible();
        });

        // Blur
        fireEvent.blur(trigger);

        await waitFor(() => {
            expect(screen.getByRole("tooltip")).toHaveClass("opacity-0");
        });
    });
});
