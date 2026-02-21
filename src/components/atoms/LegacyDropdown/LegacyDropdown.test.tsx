import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@solidjs/testing-library";
import { LegacyDropdown } from "./LegacyDropdown";

describe("LegacyDropdown", () => {
    it("renders trigger and hides content initially", () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>}>
                <div>Item 1</div>
            </LegacyDropdown>
        ));

        expect(screen.getByText("Menu")).toBeInTheDocument();
        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    });

    it("toggles content on trigger click", () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>}>
                <div>Item 1</div>
            </LegacyDropdown>
        ));

        const trigger = screen.getByText("Menu");
        fireEvent.click(trigger);

        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByRole("menu")).toHaveClass("opacity-100");

        fireEvent.click(trigger);
        // It stays mounted but hidden (opacity-0)
        expect(screen.getByRole("menu")).toHaveClass("opacity-0");
    });

    it("closes on outside click", async () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>}>
                <div>Item 1</div>
            </LegacyDropdown>
        ));

        const trigger = screen.getByText("Menu");
        fireEvent.click(trigger);
        expect(screen.getByRole("menu")).toHaveClass("opacity-100");

        // Click on document body (outside)
        fireEvent.mouseDown(document.body);

        await waitFor(() => {
            expect(screen.getByRole("menu")).toHaveClass("opacity-0");
        });
    });

    it("closes on Escape key", async () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>}>
                <div>Item 1</div>
            </LegacyDropdown>
        ));

        const trigger = screen.getByText("Menu");
        fireEvent.click(trigger);
        expect(screen.getByRole("menu")).toHaveClass("opacity-100");

        fireEvent.keyDown(document, { key: "Escape" });

        await waitFor(() => {
            expect(screen.getByRole("menu")).toHaveClass("opacity-0");
        });
    });

    it("does not close on click inside menu", () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>}>
                <div data-testid="item">Item 1</div>
            </LegacyDropdown>
        ));

        fireEvent.click(screen.getByText("Menu"));

        const item = screen.getByTestId("item");
        fireEvent.mouseDown(item); // Note: handler listens to mousedown

        expect(screen.getByRole("menu")).toHaveClass("opacity-100");
    });

    it("toggles content on trigger keyboard interaction", () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>}>
                <div>Item 1</div>
            </LegacyDropdown>
        ));

        const trigger = screen.getByText("Menu");

        // Open with Enter
        fireEvent.keyDown(trigger, { key: "Enter" });
        expect(screen.getByRole("menu")).toHaveClass("opacity-100");

        // Close with Space
        fireEvent.keyDown(trigger, { key: " " });
        expect(screen.getByRole("menu")).toHaveClass("opacity-0");

        // Open with ArrowDown
        fireEvent.keyDown(trigger, { key: "ArrowDown" });
        expect(screen.getByRole("menu")).toHaveClass("opacity-100");
    });

    it("controls open state via prop", () => {
        render(() => (
            <LegacyDropdown trigger={<button>Menu</button>} open={true}>
                <div>Item 1</div>
            </LegacyDropdown>
        ));

        expect(screen.getByRole("menu")).toHaveClass("opacity-100");
    });
});
