import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Notification } from "./Notification";
import type { NotificationData } from "./types";

describe("Notification", () => {
    const mockDismiss = vi.fn();
    // ...
    // deleted duplicate test

    const mockExpand = vi.fn();
    const mockCloseIcon = <span>×</span>;

    const createNotificationData = (
        overrides?: Partial<NotificationData>
    ): NotificationData => ({
        id: "test-id",
        title: "Test Title",
        description: "Test Description",
        variant: "accent",
        duration: 5000,
        persisted: false,
        ...overrides,
    });

    describe("Rendering", () => {
        it("renders with title and description", () => {
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            expect(screen.getByText("Test Title")).toBeInTheDocument();
            expect(screen.getByText("Test Description")).toBeInTheDocument();
        });

        it("renders with custom children", () => {
            const data = createNotificationData({
                children: <div>Custom Content</div>,
            });
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            expect(screen.getByText("Custom Content")).toBeInTheDocument();
        });

        it("renders close icon", () => {
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            expect(screen.getByText("×")).toBeInTheDocument();
        });
    });

    describe("Variants", () => {
        const variantMap = {
            accent: "border-ui-border",
            success: "border-success/30",
            warning: "border-warning/30",
            error: "border-error/30",
        } as const;

        Object.entries(variantMap).forEach(([variant, expectedClass]) => {
            it(`applies correct classes for ${variant} variant`, () => {
                const data = createNotificationData({
                    variant: variant as any,
                });
                const { container } = render(() => (
                    <Notification
                        data={data}
                        onDismiss={mockDismiss}
                        onExpand={mockExpand}
                        stackIndex={0}
                        isExpanded={false}
                        closeIcon={mockCloseIcon}
                    />
                ));

                const element = container.querySelector(
                    "[data-notification-id]"
                );
                expect(element?.className).toContain(expectedClass);
            });
        });
    });

    describe("Progress Bar", () => {
        it("shows progress bar for auto-dismiss notifications", () => {
            const data = createNotificationData({
                duration: 5000,
                persisted: false,
            });
            const { container } = render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const progressBar = container.querySelector(".bg-fg-main\\/5");
            expect(progressBar).toBeInTheDocument();
        });

        it("hides progress bar for persisted notifications", () => {
            const data = createNotificationData({
                duration: 5000,
                persisted: true,
            });
            const { container } = render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const progressBar = container.querySelector(".bg-fg-main\\/5");
            expect(progressBar).not.toBeInTheDocument();
        });

        it("hides progress bar when no duration", () => {
            const data = createNotificationData({
                duration: undefined,
            });
            const { container } = render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const progressBar = container.querySelector(".bg-fg-main\\/5");
            expect(progressBar).not.toBeInTheDocument();
        });
    });

    describe("Interactions", () => {
        it("calls onExpand when clicked and stackIndex is 0", () => {
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const notification = screen.getByRole("alert");
            notification.click();

            expect(mockExpand).toHaveBeenCalledTimes(1);
        });

        it("does not call onExpand when clicked and stackIndex is 1", () => {
            const localMockExpand = vi.fn();
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={localMockExpand}
                    stackIndex={1}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const notification = screen.getByRole("alert");
            notification.click();

            expect(localMockExpand).not.toHaveBeenCalled();
        });

        it("calls onDismiss when close button is clicked", () => {
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const closeButton = screen.getByRole("button", {
                name: /close/i,
            });
            closeButton.click();

            // Should be called immediately now
            expect(mockDismiss).toHaveBeenCalledTimes(1);
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const notification = screen.getByRole("alert");
            expect(notification).toHaveAttribute("aria-live", "polite");
            expect(notification).toHaveAttribute("aria-atomic", "true");
            expect(notification).toHaveAttribute("aria-label", "Test Title");
        });

        it("is keyboard accessible", () => {
            const data = createNotificationData();
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const notification = screen.getByRole("alert");
            expect(notification).toHaveAttribute("tabIndex", "0");
        });

        it("has accessible close button label", () => {
            const data = createNotificationData({ title: "Important" });
            render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const closeButton = screen.getByRole("button", {
                name: /Close Important/i,
            });
            expect(closeButton).toBeInTheDocument();
        });
    });

    describe("Default Values", () => {
        it("uses accent variant by default", () => {
            const data = createNotificationData({ variant: undefined });
            const { container } = render(() => (
                <Notification
                    data={data}
                    onDismiss={mockDismiss}
                    onExpand={mockExpand}
                    stackIndex={0}
                    isExpanded={false}
                    closeIcon={mockCloseIcon}
                />
            ));

            const element = container.querySelector("[data-notification-id]");
            expect(element?.className).toContain("border-ui-border");
        });
    });
});
