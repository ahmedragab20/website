import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";

describe("Modal", () => {
    beforeEach(() => {
        // Mock HTMLDialogElement methods as they are not implemented in JSDOM
        HTMLDialogElement.prototype.showModal = vi.fn(function (
            this: HTMLDialogElement
        ) {
            this.setAttribute("open", "");
        });
        HTMLDialogElement.prototype.close = vi.fn(function (
            this: HTMLDialogElement
        ) {
            this.removeAttribute("open");
            this.dispatchEvent(new Event("close"));
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders children content", () => {
        render(() => (
            <Modal isOpen={true} onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>
        ));
        expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("does not show when isOpen is false (initially)", () => {
        render(() => (
            <Modal isOpen={false} onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>
        ));
        const dialog = screen.getByRole("dialog", { hidden: true });
        expect(dialog).not.toHaveAttribute("open");
    });

    it("shows when isOpen is true", () => {
        render(() => (
            <Modal isOpen={true} onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>
        ));
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("open");
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it("calls onClose when backdrop is clicked", () => {
        const onClose = vi.fn();
        render(() => (
            <Modal isOpen={true} onClose={onClose} closeOnOutsideClick={true}>
                <div style={{ width: "100px", height: "100px" }}>Content</div>
            </Modal>
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
            <Modal isOpen={true} onClose={onClose} closeOnOutsideClick={true}>
                <div style={{ width: "100px", height: "100px" }}>Content</div>
            </Modal>
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

    it("applies size classes", () => {
        const { container } = render(() => (
            <Modal isOpen={true} onClose={() => {}} size="lg">
                Content
            </Modal>
        ));
        const dialog = container.querySelector("dialog");
        expect(dialog?.className).toContain("max-w-2xl");
    });

    it("renders header, body, footer", () => {
        render(() => (
            <Modal isOpen={true} onClose={() => {}}>
                <ModalHeader>Header</ModalHeader>
                <ModalBody>Body</ModalBody>
                <ModalFooter>Footer</ModalFooter>
            </Modal>
        ));
        expect(screen.getByText("Header")).toBeInTheDocument();
        expect(screen.getByText("Body")).toBeInTheDocument();
        expect(screen.getByText("Footer")).toBeInTheDocument();
    });
});
