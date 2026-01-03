import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import {
    Card,
    CardHeader,
    CardTitle,
    CardSubtitle,
    CardContent,
    CardFooter,
} from "./Card";

describe("Card", () => {
    describe("Rendering", () => {
        it("renders with children", () => {
            render(() => <Card>Card content</Card>);
            expect(screen.getByText("Card content")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Card class="custom-class">Test</Card>
            ));
            const div = container.querySelector("div");
            expect(div?.className).toContain("custom-class");
        });
    });

    describe("Padding Variants", () => {
        // Default is now none
        it("uses default padding (none) when not specified", () => {
            const { container } = render(() => <Card>Test</Card>);
            const div = container.querySelector("div");
            expect(div?.className).toContain("p-0");
        });

        const paddingMap = {
            none: "p-0",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        } as const;

        Object.entries(paddingMap).forEach(([padding, expectedClass]) => {
            it(`applies correct classes for ${padding} padding`, () => {
                const { container } = render(() => (
                    <Card padding={padding as any}>Test</Card>
                ));
                const div = container.querySelector("div");
                expect(div?.className).toContain(expectedClass);
            });
        });
    });

    describe("Elevation Variants", () => {
        it("applies flat elevation by default", () => {
            const { container } = render(() => <Card>Test</Card>);
            const div = container.querySelector("div");
            expect(div?.className).not.toContain("shadow-lg");
        });

        it("applies raised elevation when specified", () => {
            const { container } = render(() => (
                <Card elevation="raised">Test</Card>
            ));
            const div = container.querySelector("div");
            expect(div?.className).toContain("shadow-lg");
        });
    });

    describe("Sub-components", () => {
        it("renders CardHeader with correct classes", () => {
            const { container } = render(() => <CardHeader>Header</CardHeader>);
            const element = container.querySelector("div");
            expect(element).toHaveClass(
                "flex",
                "flex-col",
                "space-y-1.5",
                "p-6"
            );
        });

        it("renders CardTitle with correct classes", () => {
            render(() => <CardTitle>Title</CardTitle>);
            const title = screen.getByRole("heading", { level: 3 });
            expect(title).toBeInTheDocument();
            expect(title).toHaveClass("text-2xl", "font-semibold");
        });

        it("renders CardSubtitle with correct classes", () => {
            const { container } = render(() => (
                <CardSubtitle>Subtitle</CardSubtitle>
            ));
            const desc = container.querySelector("p");
            expect(desc).toBeInTheDocument();
            expect(desc).toHaveClass("text-sm", "text-fg-muted");
        });

        it("renders CardContent with correct classes", () => {
            const { container } = render(() => (
                <CardContent>Content</CardContent>
            ));
            const content = container.querySelector("div");
            expect(content).toBeInTheDocument();
            expect(content).toHaveClass("px-6");
        });

        it("renders CardFooter with correct classes", () => {
            const { container } = render(() => <CardFooter>Footer</CardFooter>);
            const footer = container.querySelector("div");
            expect(footer).toBeInTheDocument();
            expect(footer).toHaveClass("flex", "items-center", "p-6");
        });

        it("supports custom classes on sub-components", () => {
            render(() => <CardTitle class="text-red-500">Title</CardTitle>);
            const title = screen.getByRole("heading");
            expect(title).toHaveClass("text-red-500");
        });
    });
});
