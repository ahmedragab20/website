import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@solidjs/testing-library";
import { afterEach, vi, expect } from "vitest";

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
});

// Mock CSS.supports
if (typeof window !== "undefined") {
    const mockCSS = {
        supports: vi.fn().mockReturnValue(false),
        escape: (str: string) => str,
    };

    Object.defineProperty(window, "CSS", {
        writable: true,
        value: mockCSS,
    });

    // @ts-ignore
    globalThis.CSS = mockCSS;

    // Mock HTMLDialogElement
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

    HTMLDialogElement.prototype.show = vi.fn(function (
        this: HTMLDialogElement
    ) {
        this.setAttribute("open", "");
    });
}
