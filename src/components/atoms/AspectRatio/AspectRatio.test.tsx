import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { AspectRatio } from "./AspectRatio";

describe("AspectRatio", () => {
    describe("Rendering", () => {
        it("renders children", () => {
            render(() => <AspectRatio>Content</AspectRatio>);
            expect(screen.getByText("Content")).toBeTruthy();
        });

        it("renders with div element", () => {
            const { container } = render(() => (
                <AspectRatio>Content</AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div).toBeTruthy();
        });

        it("renders with multiple children", () => {
            render(() => (
                <AspectRatio>
                    <span>Content 1</span>
                    <span>Content 2</span>
                </AspectRatio>
            ));
            expect(screen.getByText("Content 1")).toBeTruthy();
            expect(screen.getByText("Content 2")).toBeTruthy();
        });
    });

    describe("Variants", () => {
        const ratios = [
            "square",
            "video",
            "4/3",
            "3/2",
            "16/10",
            "21/9",
        ] as const;
        const ratioClassMap = {
            square: "aspect-square",
            video: "aspect-video",
            "4/3": "aspect-[4/3]",
            "3/2": "aspect-[3/2]",
            "16/10": "aspect-[16/10]",
            "21/9": "aspect-[21/9]",
        };

        ratios.forEach((ratio) => {
            it(`renders with ratio="${ratio}"`, () => {
                const { container } = render(() => (
                    <AspectRatio ratio={ratio}>Content</AspectRatio>
                ));
                const div = container.querySelector("div");
                expect(div?.classList.contains(ratioClassMap[ratio])).toBe(
                    true
                );
            });
        });
    });

    describe("Default Variant", () => {
        it("applies square ratio by default", () => {
            const { container } = render(() => (
                <AspectRatio>Content</AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.classList.contains("aspect-square")).toBe(true);
        });
    });

    describe("CSS Classes", () => {
        it("applies overflow-hidden base class", () => {
            const { container } = render(() => (
                <AspectRatio>Content</AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.classList.contains("overflow-hidden")).toBe(true);
        });

        it("accepts custom class prop", () => {
            const { container } = render(() => (
                <AspectRatio class="custom-class">Content</AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.classList.contains("custom-class")).toBe(true);
        });

        it("combines custom class with variant classes", () => {
            const { container } = render(() => (
                <AspectRatio ratio="video" class="custom-class">
                    Content
                </AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.classList.contains("custom-class")).toBe(true);
            expect(div?.classList.contains("aspect-video")).toBe(true);
            expect(div?.classList.contains("overflow-hidden")).toBe(true);
        });
    });

    describe("HTML Attributes", () => {
        it("passes through HTML attributes", () => {
            const { container } = render(() => (
                <AspectRatio data-testid="aspect-ratio">Content</AspectRatio>
            ));
            const div = container.querySelector('[data-testid="aspect-ratio"]');
            expect(div).toBeTruthy();
        });

        it("accepts aria attributes", () => {
            const { container } = render(() => (
                <AspectRatio aria-label="Image container">Content</AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.getAttribute("aria-label")).toBe("Image container");
        });

        it("accepts role attribute", () => {
            const { container } = render(() => (
                // @ts-expect-error: AspectRatioProps does not include HTML attributes, but they are spread
                <AspectRatio role="img">Content</AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.getAttribute("role")).toBe("img");
        });
    });

    describe("Type Safety", () => {
        it("accepts JSX.Element children", () => {
            render(() => (
                <AspectRatio>
                    <img src="test.jpg" alt="test" />
                </AspectRatio>
            ));
            expect(true).toBe(true);
        });

        it("handles nested components", () => {
            const NestedComponent = () => <div>Nested</div>;
            render(() => (
                <AspectRatio>
                    <NestedComponent />
                </AspectRatio>
            ));
            expect(screen.getByText("Nested")).toBeTruthy();
        });
    });

    describe("Accessibility", () => {
        it("supports semantic role", () => {
            const { container } = render(() => (
                // @ts-expect-error: AspectRatioProps does not include HTML attributes, but they are spread
                <AspectRatio role="img" aria-label="Product image">
                    Content
                </AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.getAttribute("role")).toBe("img");
            expect(div?.getAttribute("aria-label")).toBe("Product image");
        });

        it("maintains accessibility with multiple children", () => {
            const { container } = render(() => (
                <AspectRatio aria-label="Video player">
                    <video>Video</video>
                    <button>Play</button>
                </AspectRatio>
            ));
            const div = container.querySelector("div");
            expect(div?.getAttribute("aria-label")).toBe("Video player");
        });
    });
});
