import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { NotificationProvider, useNotification } from "./NotificationProvider";
import { Button } from "../../atoms/Button";
import X from "../../icons/XMark";
import { Alert, Text } from "../../atoms";

/**
 * Notification system for displaying toast messages.
 *
 * Notifications appear in the bottom-right corner and stack when multiple are present.
 * Click the stack to expand into a scrollable list. Click outside to collapse.
 * Supports auto-dismiss with progress indicator and persisted notifications.
 *
 * @example
 * ```tsx
 * const { addNotification } = useNotification();
 *
 * addNotification({
 *   title: "Success!",
 *   description: "Your changes have been saved.",
 *   variant: "success",
 *   duration: 5000
 * });
 * ```
 */

const CloseIcon = () => <X />;

const NotificationDemo = () => {
    const { addNotification } = useNotification();

    return (
        <div class="flex flex-col gap-4 p-6 items-start min-h-screen">
            <div class="max-w-2xl">
                <h2 class="text-2xl font-bold mb-2">Notification System</h2>
                <Alert class="mb-2" color="warning" variant="subtle">
                    <Text as="p" color="main">
                        ⚠️ Still under development
                    </Text>
                </Alert>
                <p class="text-sm text-fg-muted mb-6">
                    Notifications always appear in the bottom-right corner. When
                    multiple notifications are present, they stack visually.
                    Click the stack to expand into a full list. Click outside or
                    press Escape to collapse.
                </p>
            </div>

            <div class="space-y-6 w-full max-w-2xl">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Variants</h3>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            onClick={() =>
                                addNotification({
                                    title: "Info Notification",
                                    description:
                                        "This is an informational message.",
                                    variant: "info",
                                })
                            }
                            color="accent"
                        >
                            Info
                        </Button>
                        <Button
                            onClick={() =>
                                addNotification({
                                    title: "Success!",
                                    description:
                                        "Operation completed successfully.",
                                    variant: "success",
                                })
                            }
                            color="success"
                        >
                            Success
                        </Button>
                        <Button
                            onClick={() =>
                                addNotification({
                                    title: "Warning",
                                    description: "Please review this action.",
                                    variant: "warning",
                                })
                            }
                            color="warning"
                        >
                            Warning
                        </Button>
                        <Button
                            onClick={() =>
                                addNotification({
                                    title: "Error",
                                    description: "Something went wrong.",
                                    variant: "error",
                                })
                            }
                            color="error"
                        >
                            Error
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-3">Behavior</h3>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                addNotification({
                                    title: "Auto-dismiss (5s)",
                                    description:
                                        "This notification will auto-dismiss after 5 seconds.",
                                    variant: "info",
                                    duration: 5000,
                                })
                            }
                        >
                            Auto-dismiss
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                addNotification({
                                    title: "Persisted",
                                    description:
                                        "This notification stays until manually closed.",
                                    variant: "info",
                                    persisted: true,
                                })
                            }
                        >
                            Persisted
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                addNotification({
                                    title: "Quick (2s)",
                                    description: "Auto-dismisses in 2 seconds.",
                                    variant: "success",
                                    duration: 2000,
                                })
                            }
                        >
                            Quick Dismiss
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-3">Custom Content</h3>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                addNotification({
                                    title: "Title Only",
                                    variant: "info",
                                })
                            }
                        >
                            Title Only
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                addNotification({
                                    description: "Description only, no title.",
                                    variant: "info",
                                })
                            }
                        >
                            Description Only
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                addNotification({
                                    children: (
                                        <div class="flex items-center gap-3 p-4">
                                            <div class="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                                                !
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-sm">
                                                    Custom JSX Content
                                                </h4>
                                                <p class="text-xs opacity-75">
                                                    Fully customizable
                                                    notification body with any
                                                    JSX.
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                    variant: "info",
                                })
                            }
                        >
                            Custom JSX
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-3">Stack Testing</h3>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            onClick={() => {
                                let count = 0;
                                const interval = setInterval(() => {
                                    addNotification({
                                        title: `Notification ${++count}`,
                                        description:
                                            "Watch them stack! Click to expand.",
                                        duration: 8000,
                                        variant: [
                                            "info",
                                            "success",
                                            "warning",
                                            "error",
                                        ][count % 4] as any,
                                    });
                                    if (count >= 5) clearInterval(interval);
                                }, 300);
                            }}
                        >
                            Add 5 Rapidly
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                for (let i = 1; i <= 10; i++) {
                                    addNotification({
                                        title: `Notification ${i}`,
                                        description: "Testing scroll behavior",
                                        variant: "info",
                                        persisted: true,
                                    });
                                }
                            }}
                        >
                            Add 10 Persisted
                        </Button>
                    </div>
                </div>
            </div>

            <div class="mt-auto pt-8 text-xs text-fg-muted">
                <p>
                    <strong>Tip:</strong> Hover over auto-dismiss notifications
                    to pause the countdown.
                </p>
                <p class="mt-1">
                    <strong>Note:</strong> In Storybook, fixed positioning may
                    be constrained by the iframe.
                </p>
            </div>
        </div>
    );
};

const meta = {
    title: "Molecules/Notification",
    component: NotificationProvider,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    argTypes: {
        defaultDuration: {
            control: "number",
            description: "Default auto-dismiss duration in milliseconds",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "10000" },
            },
        },
        defaultPersisted: {
            control: "boolean",
            description: "Default persisted state for notifications",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
    },
    decorators: [
        (Story) => (
            <NotificationProvider closeIcon={<CloseIcon />}>
                <Story />
            </NotificationProvider>
        ),
    ],
} satisfies Meta<typeof NotificationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive demo showcasing all notification features.
 * Try adding multiple notifications to see the stacking behavior.
 */
export const Default: Story = {
    render: () => <NotificationDemo />,
};

/**
 * Notification variants for different semantic meanings.
 */
export const Variants: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-col gap-4 p-6">
                <h3 class="text-lg font-semibold">Notification Variants</h3>
                <div class="flex gap-2">
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Info",
                                description: "Informational message",
                                variant: "info",
                            })
                        }
                    >
                        Info
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Success",
                                description: "Success message",
                                variant: "success",
                            })
                        }
                        color="success"
                    >
                        Success
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Warning",
                                description: "Warning message",
                                variant: "warning",
                            })
                        }
                        color="warning"
                    >
                        Warning
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Error",
                                description: "Error message",
                                variant: "error",
                            })
                        }
                        color="error"
                    >
                        Error
                    </Button>
                </div>
            </div>
        );
    },
};

/**
 * Auto-dismiss notifications with progress indicator.
 * Hover to pause the countdown.
 */
export const AutoDismiss: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-col gap-4 p-6">
                <h3 class="text-lg font-semibold">
                    Auto-dismiss Notifications
                </h3>
                <p class="text-sm text-fg-muted max-w-md">
                    These notifications automatically dismiss after the
                    specified duration. Hover over them to pause the countdown.
                </p>
                <div class="flex gap-2">
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Quick (2s)",
                                description: "Dismisses in 2 seconds",
                                variant: "info",
                                duration: 2000,
                            })
                        }
                    >
                        2 Seconds
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Normal (5s)",
                                description: "Dismisses in 5 seconds",
                                variant: "success",
                                duration: 5000,
                            })
                        }
                    >
                        5 Seconds
                    </Button>
                    <Button
                        onClick={() =>
                            addNotification({
                                title: "Long (10s)",
                                description: "Dismisses in 10 seconds",
                                variant: "warning",
                                duration: 10000,
                            })
                        }
                    >
                        10 Seconds
                    </Button>
                </div>
            </div>
        );
    },
};

/**
 * Persisted notifications that stay until manually closed.
 */
export const Persisted: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-col gap-4 p-6">
                <h3 class="text-lg font-semibold">Persisted Notifications</h3>
                <p class="text-sm text-fg-muted max-w-md">
                    These notifications remain visible until the user manually
                    closes them.
                </p>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Important Message",
                            description:
                                "This notification will stay until you close it.",
                            variant: "info",
                            persisted: true,
                        })
                    }
                >
                    Add Persisted Notification
                </Button>
            </div>
        );
    },
};
