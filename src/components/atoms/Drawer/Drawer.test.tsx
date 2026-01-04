import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "./Drawer";

describe("Drawer", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders children content", () => {
        render(() => (
            <Drawer isOpen={true} onClose={() => {}}>
                <div>Drawer Content</div>
            </Drawer>
        ));
        expect(screen.getByText("Drawer Content")).toBeInTheDocument();
    });

    it("does not show when isOpen is false (initially)", () => {
        render(() => (
            <Drawer isOpen={false} onClose={() => {}}>
                <div>Drawer Content</div>
            </Drawer>
        ));
        const dialog = screen.getByRole("dialog", { hidden: true });
        expect(dialog).not.toHaveAttribute("open");
    });

    it("shows when isOpen is true", () => {
        render(() => (
            <Drawer isOpen={true} onClose={() => {}}>
                <div>Drawer Content</div>
            </Drawer>
        ));
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("open");
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it("calls onClose when backdrop is clicked", () => {
        const onClose = vi.fn();
        render(() => (
            <Drawer isOpen={true} onClose={onClose} closeOnOutsideClick={true}>
                <div style={{ width: "100px", height: "100px" }}>Content</div>
            </Drawer>
        ));

        const dialog = screen.getByRole("dialog");

        // Mock getBoundingClientRect
        vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
            top: 100,
            left: 100,
            width: 200,
            height: 200,
            right: 300,
            bottom: 300,
            x: 100,
            y: 100,
            toJSON: () => {},
        } as DOMRect);

        // Click outside (0, 0)
        fireEvent.click(dialog, { clientX: 0, clientY: 0 });
        expect(onClose).toHaveBeenCalled();
    });

    it("does not call onClose when content is clicked", () => {
        const onClose = vi.fn();
        render(() => (
            <Drawer isOpen={true} onClose={onClose} closeOnOutsideClick={true}>
                <div style={{ width: "100px", height: "100px" }}>Content</div>
            </Drawer>
        ));

        const dialog = screen.getByRole("dialog");

        // Mock getBoundingClientRect
        vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
            top: 100,
            left: 100,
            width: 200,
            height: 200,
            right: 300,
            bottom: 300,
            x: 100,
            y: 100,
            toJSON: () => {},
        } as DOMRect);

        // Click inside (150, 150)
        fireEvent.click(dialog, { clientX: 150, clientY: 150 });
        expect(onClose).not.toHaveBeenCalled();
    });

    it("applies placement attribute", () => {
        const { container } = render(() => (
            <Drawer isOpen={true} onClose={() => {}} placement="left">
                Content
            </Drawer>
        ));
        const dialog = container.querySelector("dialog");
        expect(dialog).toHaveAttribute("data-placement", "left");
    });

    it("applies correct size classes for side placement", () => {
        const { container } = render(() => (
            <Drawer
                isOpen={true}
                onClose={() => {}}
                placement="right"
                size="lg"
            >
                Content
            </Drawer>
        ));
        const dialog = container.querySelector("dialog");
        expect(dialog?.className).toContain("max-w-lg");
    });

    it("applies correct size classes for vertical placement", () => {
        const { container } = render(() => (
            <Drawer
                isOpen={true}
                onClose={() => {}}
                placement="bottom"
                size="sm"
            >
                Content
            </Drawer>
        ));
        const dialog = container.querySelector("dialog");
        expect(dialog?.className).toContain("max-h-[30vh]");
    });

    it("renders header, body, footer", () => {
        render(() => (
            <Drawer isOpen={true} onClose={() => {}}>
                <DrawerHeader>Header</DrawerHeader>
                <DrawerBody>Body</DrawerBody>
                <DrawerFooter>Footer</DrawerFooter>
            </Drawer>
        ));
        expect(screen.getByText("Header")).toBeInTheDocument();
        expect(screen.getByText("Body")).toBeInTheDocument();
        expect(screen.getByText("Footer")).toBeInTheDocument();
    });
});
