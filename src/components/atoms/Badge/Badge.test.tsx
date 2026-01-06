import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders children correctly", () => {
        render(() => <Badge>Test Badge</Badge>);
        expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("applies variant classes", () => {
        render(() => (
            <Badge variant="outline" color="accent">
                Test
            </Badge>
        ));
        const badge = screen.getByText("Test");
        expect(badge).toHaveClass("border-accent");
    });

    it("renders dismiss button when onDismiss is provided", () => {
        const onDismiss = vi.fn();
        render(() => <Badge onDismiss={onDismiss}>Dismissible</Badge>);
        const button = screen.getByLabelText("Dismiss");
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(onDismiss).toHaveBeenCalled();
    });

    it("does not render dismiss button when onDismiss is missing", () => {
        render(() => <Badge>Not Dismissible</Badge>);
        expect(screen.queryByLabelText("Dismiss")).not.toBeInTheDocument();
    });

    it("handles click interaction", () => {
        const onClick = vi.fn();
        render(() => <Badge onClick={onClick}>Clickable</Badge>);
        const badge = screen.getByRole("button", { name: /clickable/i }); // Using accessible name from text content

        fireEvent.click(badge);
        expect(onClick).toHaveBeenCalled();
    });
});
