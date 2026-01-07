import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { NotificationProvider, useNotification } from "./NotificationProvider";

// Helper component to test the hook
function TestComponent() {
    const { addNotification, removeNotification } = useNotification();

    return (
        <div>
            <button
                onClick={() =>
                    addNotification({
                        title: "Test",
                        description: "Description",
                    })
                }
            >
                Add Notification
            </button>
            <button onClick={() => removeNotification("test-id")}>
                Remove Notification
            </button>
        </div>
    );
}

describe("NotificationProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Rendering", () => {
        it("renders children", () => {
            render(() => (
                <NotificationProvider>
                    <div>Test Child</div>
                </NotificationProvider>
            ));

            expect(screen.getByText("Test Child")).toBeInTheDocument();
        });

        it("provides notification context", () => {
            render(() => (
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            ));

            expect(screen.getByText("Add Notification")).toBeInTheDocument();
        });
    });

    describe("Adding Notifications", () => {
        it("adds notification when addNotification is called", () => {
            render(() => (
                <NotificationProvider closeIcon={<span>×</span>}>
                    <TestComponent />
                </NotificationProvider>
            ));

            const addButton = screen.getByText("Add Notification");
            addButton.click();

            expect(screen.getByText("Test")).toBeInTheDocument();
            expect(screen.getByText("Description")).toBeInTheDocument();
        });

        it("returns notification ID", () => {
            let notificationId: string | undefined;

            function TestIdComponent() {
                const { addNotification } = useNotification();

                return (
                    <button
                        onClick={() => {
                            notificationId = addNotification({
                                title: "Test",
                            });
                        }}
                    >
                        Add
                    </button>
                );
            }

            render(() => (
                <NotificationProvider closeIcon={<span>×</span>}>
                    <TestIdComponent />
                </NotificationProvider>
            ));

            screen.getByText("Add").click();

            expect(notificationId).toBeDefined();
            expect(typeof notificationId).toBe("string");
        });

        it("uses default duration when not specified", () => {
            render(() => (
                <NotificationProvider
                    defaultDuration={3000}
                    closeIcon={<span>×</span>}
                >
                    <TestComponent />
                </NotificationProvider>
            ));

            const addButton = screen.getByText("Add Notification");
            addButton.click();

            // Notification should be added
            expect(screen.getByText("Test")).toBeInTheDocument();
        });

        it("uses default persisted when not specified", () => {
            render(() => (
                <NotificationProvider
                    defaultPersisted={true}
                    closeIcon={<span>×</span>}
                >
                    <TestComponent />
                </NotificationProvider>
            ));

            const addButton = screen.getByText("Add Notification");
            addButton.click();

            expect(screen.getByText("Test")).toBeInTheDocument();
        });
    });

    describe("Removing Notifications", () => {
        it("removes notification when removeNotification is called", () => {
            vi.useFakeTimers();
            let notificationId: string | undefined;

            function TestRemoveComponent() {
                const { addNotification, removeNotification } =
                    useNotification();

                return (
                    <div>
                        <button
                            onClick={() => {
                                notificationId = addNotification({
                                    title: "Test",
                                });
                            }}
                        >
                            Add
                        </button>
                        <button
                            onClick={() => {
                                if (notificationId) {
                                    removeNotification(notificationId);
                                }
                            }}
                        >
                            Remove
                        </button>
                    </div>
                );
            }

            render(() => (
                <NotificationProvider closeIcon={<span>×</span>}>
                    <TestRemoveComponent />
                </NotificationProvider>
            ));

            screen.getByText("Add").click();
            expect(screen.getByText("Test")).toBeInTheDocument();

            screen.getByText("Remove").click();

            // Advance past the exit animation duration (400ms)
            vi.advanceTimersByTime(500);

            expect(screen.queryByText("Test")).not.toBeInTheDocument();
            vi.useRealTimers();
        });
    });

    describe("Multiple Notifications", () => {
        it("displays multiple notifications", () => {
            function TestMultipleComponent() {
                const { addNotification } = useNotification();

                return (
                    <button
                        onClick={() => {
                            addNotification({ title: "First" });
                            addNotification({ title: "Second" });
                            addNotification({ title: "Third" });
                        }}
                    >
                        Add Multiple
                    </button>
                );
            }

            render(() => (
                <NotificationProvider closeIcon={<span>×</span>}>
                    <TestMultipleComponent />
                </NotificationProvider>
            ));

            screen.getByText("Add Multiple").click();

            expect(screen.getByText("First")).toBeInTheDocument();
            expect(screen.getByText("Second")).toBeInTheDocument();
            expect(screen.getByText("Third")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("provides ARIA live region for screen readers", () => {
            const { container } = render(() => (
                <NotificationProvider closeIcon={<span>×</span>}>
                    <TestComponent />
                </NotificationProvider>
            ));

            const liveRegion = container.querySelector("[aria-live='polite']");
            expect(liveRegion).toBeInTheDocument();
        });

        it("announces notifications to screen readers", () => {
            render(() => (
                <NotificationProvider closeIcon={<span>×</span>}>
                    <TestComponent />
                </NotificationProvider>
            ));

            screen.getByText("Add Notification").click();

            const status = screen.getByRole("status");
            expect(status).toBeInTheDocument();
        });
    });

    describe("Error Handling", () => {
        it("throws error when useNotification is used outside provider", () => {
            // Suppress console.error for this test
            const originalError = console.error;
            console.error = vi.fn();

            expect(() => {
                render(() => <TestComponent />);
            }).toThrow(
                "useNotification must be used within a NotificationProvider"
            );

            console.error = originalError;
        });
    });
});
