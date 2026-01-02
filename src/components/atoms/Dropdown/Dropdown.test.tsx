import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@solidjs/testing-library";
import { Dropdown, DropdownItem } from "./Dropdown";

describe("Dropdown", () => {
    beforeEach(() => {
        // Mock Popover API
        HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
            this.classList.add(":popover-open");
            const event = new Event("toggle");
            // @ts-ignore
            event.newState = "open";
            // @ts-ignore
            event.oldState = "closed";
            this.dispatchEvent(event);
        });
        HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
            this.classList.remove(":popover-open");
            const event = new Event("toggle");
            // @ts-ignore
            event.newState = "closed";
            // @ts-ignore
            event.oldState = "open";
            this.dispatchEvent(event);
        });
        HTMLElement.prototype.togglePopover = vi.fn(function (
            this: HTMLElement
        ) {
            if (this.classList.contains(":popover-open")) {
                this.hidePopover();
                return true;
            } else {
                this.showPopover();
                return true;
            }
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // @ts-ignore
        delete HTMLElement.prototype.showPopover;
        // @ts-ignore
        delete HTMLElement.prototype.hidePopover;
        // @ts-ignore
        delete HTMLElement.prototype.togglePopover;
    });

    describe("Rendering", () => {
        it("renders trigger button", () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));
            expect(screen.getByText("Open")).toBeInTheDocument();
        });

        it("renders dropdown content", () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                    <DropdownItem>Item 2</DropdownItem>
                </Dropdown>
            ));
            expect(screen.getByText("Item 1")).toBeInTheDocument();
            expect(screen.getByText("Item 2")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Dropdown trigger={<button>Open</button>} class="custom-class">
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));
            const popover = container.querySelector('[popover="auto"]');
            expect(popover?.className).toContain("custom-class");
        });
    });

    describe("Interactions", () => {
        it("toggles dropdown on trigger click", async () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));

            const trigger = screen.getByText("Open");
            const popover = document.querySelector(
                '[popover="auto"]'
            ) as HTMLElement;

            expect(popover).not.toHaveClass(":popover-open");

            fireEvent.click(trigger);

            await waitFor(() => {
                expect(popover).toHaveClass(":popover-open");
            });
        });

        it("calls onOpenChange when toggled", async () => {
            const handleOpenChange = vi.fn();
            render(() => (
                <Dropdown
                    trigger={<button>Open</button>}
                    onOpenChange={handleOpenChange}
                >
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));

            const trigger = screen.getByText("Open");
            fireEvent.click(trigger);

            await waitFor(() => {
                expect(handleOpenChange).toHaveBeenCalledWith(true);
            });
        });

        it("closes dropdown on Escape key", async () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));

            const trigger = screen.getByText("Open");
            fireEvent.click(trigger);

            await waitFor(() => {
                const popover = document.querySelector(
                    '[popover="auto"]'
                ) as HTMLElement;
                expect(popover).toHaveClass(":popover-open");
            });

            fireEvent.keyDown(document, { key: "Escape" });

            await waitFor(() => {
                const popover = document.querySelector(
                    '[popover="auto"]'
                ) as HTMLElement;
                expect(popover).not.toHaveClass(":popover-open");
            });
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClass]) => {
            it(`applies correct classes for ${size} size`, () => {
                const { container } = render(() => (
                    <Dropdown
                        trigger={<button>Open</button>}
                        size={size as any}
                    >
                        <DropdownItem>Item 1</DropdownItem>
                    </Dropdown>
                ));
                const popover = container.querySelector('[popover="auto"]');
                expect(popover?.className).toContain(expectedClass);
            });
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes on trigger", () => {
            const { container } = render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));

            const trigger = container.querySelector('[aria-haspopup="true"]');
            expect(trigger).toHaveAttribute("aria-haspopup", "true");
            expect(trigger).toHaveAttribute("aria-expanded", "false");
        });

        it("has proper role on popover", () => {
            const { container } = render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));

            const popover = container.querySelector('[popover="auto"]');
            expect(popover).toHaveAttribute("role", "menu");
            expect(popover).toHaveAttribute("aria-orientation", "vertical");
        });
    });

    describe("Default Values", () => {
        it("uses default size (md) when not specified", () => {
            const { container } = render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item 1</DropdownItem>
                </Dropdown>
            ));
            const popover = container.querySelector('[popover="auto"]');
            expect(popover?.className).toContain("text-base");
        });
    });
});

describe("DropdownItem", () => {
    describe("Rendering", () => {
        it("renders with children", () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item Content</DropdownItem>
                </Dropdown>
            ));
            expect(screen.getByText("Item Content")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem class="custom-class">Item</DropdownItem>
                </Dropdown>
            ));
            const item = container.querySelector('[role="menuitem"]');
            expect(item?.className).toContain("custom-class");
        });
    });

    describe("Interactions", () => {
        it("handles click events", () => {
            const handleClick = vi.fn();
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem onClick={handleClick}>Item</DropdownItem>
                </Dropdown>
            ));
            screen.getByText("Item").click();
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("does not call onClick when disabled", () => {
            const handleClick = vi.fn();
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem onClick={handleClick} disabled>
                        Disabled Item
                    </DropdownItem>
                </Dropdown>
            ));
            screen.getByText("Disabled Item").click();
            expect(handleClick).not.toHaveBeenCalled();
        });

        it("handles Enter key press", () => {
            const handleClick = vi.fn();
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem onClick={handleClick}>Item</DropdownItem>
                </Dropdown>
            ));
            const item = screen.getByText("Item");
            item.focus();
            fireEvent.keyDown(item, { key: "Enter" });
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("handles Space key press", () => {
            const handleClick = vi.fn();
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem onClick={handleClick}>Item</DropdownItem>
                </Dropdown>
            ));
            const item = screen.getByText("Item");
            item.focus();
            fireEvent.keyDown(item, { key: " " });
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe("Variants", () => {
        const variantMap = {
            default: "",
            danger: "text-error",
        } as const;

        Object.entries(variantMap).forEach(([variant, expectedClass]) => {
            it(`applies correct classes for ${variant} variant`, () => {
                const { container } = render(() => (
                    <Dropdown trigger={<button>Open</button>}>
                        <DropdownItem variant={variant as any}>
                            Item
                        </DropdownItem>
                    </Dropdown>
                ));
                const item = container.querySelector('[role="menuitem"]');
                if (expectedClass) {
                    expect(item?.className).toContain(expectedClass);
                }
            });
        });
    });

    describe("States", () => {
        it("is disabled when disabled prop is true", () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem disabled>Disabled</DropdownItem>
                </Dropdown>
            ));
            const item = screen.getByText("Disabled");
            expect(item).toHaveAttribute("aria-disabled", "true");
            expect(item).toHaveAttribute("tabIndex", "-1");
            expect(item.className).toContain("opacity-50");
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem aria-label="Delete item">Delete</DropdownItem>
                </Dropdown>
            ));
            const item = screen.getByLabelText("Delete item");
            expect(item).toBeInTheDocument();
        });

        it("has proper role", () => {
            const { container } = render(() => (
                <Dropdown trigger={<button>Open</button>}>
                    <DropdownItem>Item</DropdownItem>
                </Dropdown>
            ));
            const item = container.querySelector('[role="menuitem"]');
            expect(item).toBeInTheDocument();
        });
    });
});
