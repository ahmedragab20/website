import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { NotificationProvider, useNotification } from "./NotificationProvider";
import { Button } from "../../atoms/Button";
import { Alert, Text } from "../../atoms";
import XMark from "../../icons/XMark";

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

const meta = {
    title: "Molecules/Notification",
    component: NotificationProvider,
    parameters: {
        layout: "padded",
        a11y: {
            test: "todo",
            config: {
                rules: [
                    {
                        id: "color-contrast",
                        enabled: true,
                    },
                ],
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        defaultDuration: {
            control: "number",
            description: "Default auto-dismiss duration in milliseconds.",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "10000" },
            },
        },
        defaultPersisted: {
            control: "boolean",
            description: "Default persisted state for notifications.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        limit: {
            control: "number",
            description:
                "Maximum number of visible notifications in the stack.",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "5" },
            },
        },
    },
    decorators: [
        (Story, context) => (
            // eslint-disable-next-line solid/no-proxy-apis
            <NotificationProvider closeIcon={<XMark />} {...context.args}>
                <div class="min-h-100 w-full p-6 relative flex flex-col items-start gap-4">
                    <Story />
                </div>
            </NotificationProvider>
        ),
    ],
} satisfies Meta<typeof NotificationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The simplest form of a notification, providing a title and description.
 */
export const Basic: Story = {
    render: () => {
        const { addNotification } = useNotification();
        return (
            <Button
                onClick={() =>
                    addNotification({
                        title: "Primary Notification",
                        description: "This is an informational message.",
                    })
                }
                color="accent"
            >
                Show Basic Notification
            </Button>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Notifications provide brief, non-interruptive feedback. This is a basic example using the default settings.",
            },
        },
    },
};

/**
 * Notifications support multiple semantic variants to convey different states.
 */
export const SemanticVariants: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-wrap gap-4">
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Heads up!",
                            description:
                                "Informational message provides context.",
                            variant: "accent",
                        })
                    }
                    color="accent"
                >
                    Accent
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Success",
                            description: "Operation completed successfully.",
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
                            description:
                                "Please review this action before proceeding.",
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
                            description:
                                "Something went wrong. Please try again.",
                            variant: "error",
                        })
                    }
                    color="error"
                >
                    Error
                </Button>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Different variants (`accent`, `success`, `warning`, `error`) help convey the nature of the message visually. Choose the appropriate visual treatment depending on the context of the notification.",
            },
        },
    },
};

/**
 * Notifications can automatically dismiss after a duration, or persist until manually closed.
 */
export const DurationAndPersistence: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-wrap gap-4">
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Quick Dismiss",
                            description:
                                "This notification dismisses in 2 seconds.",
                            duration: 2000,
                        })
                    }
                    variant="outline"
                >
                    Quick (2s)
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Normal Duration",
                            description:
                                "This notification will auto-dismiss after 5 seconds.",
                            variant: "success",
                            duration: 5000,
                        })
                    }
                    variant="outline"
                >
                    Normal (5s)
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Persisted",
                            description:
                                "This notification stays visible until it is manually closed.",
                            persisted: true,
                        })
                    }
                    variant="outline"
                >
                    Persisted
                </Button>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Control how long notifications stay visible on the screen via the `duration` parameter. Auto-dismissing notifications show a progress bar and can be temporarily paused by hovering. By default, auto-dismissal durations apply unless the `persisted` flag makes the notification stay indefinitely.",
            },
        },
    },
};

/**
 * Custom JSX can be rendered inside notifications for more complex content.
 */
export const CustomContent: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-wrap gap-4">
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Title Only Alert",
                        })
                    }
                    variant="outline"
                >
                    Title Only
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            description:
                                "This notification features a description and no title.",
                        })
                    }
                    variant="outline"
                >
                    Description Only
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            children: (
                                <div class="flex items-center gap-3 py-2">
                                    <div class="h-10 w-10 shrink-0 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                                        !
                                    </div>
                                    <div class="flex flex-col">
                                        <h4 class="font-semibold text-sm m-0 p-0 text-accent">
                                            Custom Profile Alert
                                        </h4>
                                        <p class="text-xs text-fg-muted m-0 p-0 mt-1">
                                            Your profile is 80% complete.
                                            Continue setting up.
                                        </p>
                                    </div>
                                </div>
                            ),
                        })
                    }
                    variant="outline"
                >
                    Custom JSX Payload
                </Button>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Notifications can accommodate basic text fields (`title`, `description`) or fully custom layouts using the `children` parameter.",
            },
        },
    },
};

/**
 * Showcases how multiple notifications interact and stack on top of each other.
 */
export const StackingBehavior: Story = {
    render: () => {
        const { addNotification } = useNotification();

        return (
            <div class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    <Button
                        onClick={() => {
                            let count = 0;
                            const interval = setInterval(() => {
                                count++;
                                addNotification({
                                    title: `Notification ${count}`,
                                    description:
                                        "Notifications visually stack as they arrive.",
                                    duration: 8000,
                                    variant: [
                                        "accent",
                                        "success",
                                        "warning",
                                        "error",
                                    ][count % 4] as any,
                                });
                                if (count >= 5) clearInterval(interval);
                            }, 300);
                        }}
                    >
                        Trigger Rapid Sequence
                    </Button>
                    <Button
                        onClick={() => {
                            for (let i = 1; i <= 6; i++) {
                                addNotification({
                                    title: `Persisted Message ${i}`,
                                    description:
                                        "Testing scroll and max-visible behavior when populated quickly.",
                                    persisted: true,
                                });
                            }
                        }}
                        variant="outline"
                    >
                        Add Multiple Persisted
                    </Button>
                </div>
                <Alert class="max-w-md mt-2" color="warning" variant="subtle">
                    <Text as="p" color="main" class="text-sm">
                        Click the stack or use the keyboard (Enter/Space) when
                        focused to expand the list.
                    </Text>
                </Alert>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "When multiple notifications are triggered simultaneously, they stack visually. Interacting with the stack by clicking or pressing Enter/Space when focused expands them into a full list.",
            },
        },
    },
};
