import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
    describe("Rendering", () => {
        it("renders with image source", () => {
            render(() => (
                <Avatar src="https://example.com/avatar.jpg" alt="John Doe" />
            ));

            const img = screen.getByAltText("John Doe");
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute(
                "src",
                "https://example.com/avatar.jpg"
            );
            expect(img).toHaveAttribute("loading", "lazy");
        });

        it("renders auto-calculated initials when no image is provided", () => {
            render(() => <Avatar alt="Jane Doe" />);

            expect(screen.getByText("JD")).toBeInTheDocument();
        });

        it("renders with custom initials", () => {
            render(() => <Avatar initials="CD" alt="Charlie Davis" />);

            expect(screen.getByText("CD")).toBeInTheDocument();
        });

        it("renders with fallback '?' for empty alt text", () => {
            render(() => <Avatar alt="" />);

            expect(screen.getByText("?")).toBeInTheDocument();
        });

        it("has role='img' for accessibility", () => {
            const { container } = render(() => <Avatar alt="Alice Brown" />);

            const element = container.querySelector('[role="img"]');
            expect(element).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has aria-label matching alt text", () => {
            const { container } = render(() => <Avatar alt="Charlie Davis" />);

            const element = container.querySelector('[role="img"]');
            expect(element).toHaveAttribute("aria-label", "Charlie Davis");
        });

        it("passes alt text to image element", () => {
            render(() => (
                <Avatar src="https://example.com/avatar.jpg" alt="Eve Foster" />
            ));

            expect(screen.getByAltText("Eve Foster")).toBeInTheDocument();
        });
    });

    describe("Initials Calculation", () => {
        it("calculates initials from single word", () => {
            render(() => <Avatar alt="John" />);

            expect(screen.getByText("J")).toBeInTheDocument();
        });

        it("calculates initials from two words", () => {
            render(() => <Avatar alt="John Doe" />);

            expect(screen.getByText("JD")).toBeInTheDocument();
        });

        it("calculates initials from three words (max 3 letters)", () => {
            render(() => <Avatar alt="John James King" />);

            expect(screen.getByText("JJK")).toBeInTheDocument();
        });

        it("limits initials to 3 letters even with more words", () => {
            render(() => <Avatar alt="John James King Smith" />);

            expect(screen.getByText("JJK")).toBeInTheDocument();
        });

        it("handles lowercase names", () => {
            render(() => <Avatar alt="jane doe" />);

            expect(screen.getByText("JD")).toBeInTheDocument();
        });

        it("handles names with extra whitespace", () => {
            render(() => <Avatar alt="  John   Doe  " />);

            expect(screen.getByText("JD")).toBeInTheDocument();
        });

        it("prefers custom initials over calculated ones", () => {
            render(() => <Avatar alt="Jane Doe" initials="JD" />);

            expect(screen.getByText("JD")).toBeInTheDocument();
        });
    });

    describe("Sizes", () => {
        it("applies correct size classes for small", () => {
            const { container } = render(() => <Avatar alt="Test" size="sm" />);

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/w-8/);
            expect(element?.className).toMatch(/h-8/);
            expect(element?.className).toMatch(/text-xs/);
        });

        it("applies correct size classes for medium (default)", () => {
            const { container } = render(() => <Avatar alt="Test" />);

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/w-10/);
            expect(element?.className).toMatch(/h-10/);
            expect(element?.className).toMatch(/text-sm/);
        });

        it("applies correct size classes for large", () => {
            const { container } = render(() => <Avatar alt="Test" size="lg" />);

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/w-12/);
            expect(element?.className).toMatch(/h-12/);
            expect(element?.className).toMatch(/text-base/);
        });
    });

    describe("Variants", () => {
        it("applies default variant classes", () => {
            const { container } = render(() => <Avatar alt="Test" />);

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/bg-secondary/);
            expect(element?.className).toMatch(/text-fg-main/);
            expect(element?.className).toMatch(/border/);
            expect(element?.className).toMatch(/border-ui-border/);
        });

        it("applies accent variant classes", () => {
            const { container } = render(() => (
                <Avatar alt="Test" variant="accent" />
            ));

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/bg-accent/);
            expect(element?.className).toMatch(/text-primary/);
        });

        it("applies muted variant classes", () => {
            const { container } = render(() => (
                <Avatar alt="Test" variant="muted" />
            ));

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/bg-ui-gutter/);
            expect(element?.className).toMatch(/text-fg-muted/);
        });
    });

    describe("Styling", () => {
        it("accepts custom class prop", () => {
            const { container } = render(() => (
                <Avatar alt="Test" class="custom-class" />
            ));

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/custom-class/);
        });

        it("has rounded-full for circular shape", () => {
            const { container } = render(() => <Avatar alt="Test" />);

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/rounded-full/);
        });

        it("has overflow-hidden to clip image", () => {
            const { container } = render(() => (
                <Avatar src="https://example.com/avatar.jpg" alt="Test" />
            ));

            const element = container.querySelector('[role="img"]');
            expect(element?.className).toMatch(/overflow-hidden/);
        });
    });

    describe("Image handling", () => {
        it("prefers image over initials when both provided", () => {
            const { container } = render(() => (
                <Avatar
                    src="https://example.com/avatar.jpg"
                    alt="Test"
                    initials="AB"
                />
            ));

            const img = container.querySelector("img");
            expect(img).toBeInTheDocument();
            expect(screen.queryByText("AB")).not.toBeInTheDocument();
        });

        it("uses object-cover for image", () => {
            render(() => (
                <Avatar src="https://example.com/avatar.jpg" alt="Test" />
            ));

            const img = screen.getByAltText("Test");
            expect(img.className).toMatch(/object-cover/);
        });
    });

    describe("HTML attributes", () => {
        it("spreads additional props to container", () => {
            const { container } = render(() => (
                <Avatar alt="Test" data-testid="avatar-container" />
            ));

            const element = container.querySelector(
                '[data-testid="avatar-container"]'
            );
            expect(element).toBeInTheDocument();
        });
    });
});
