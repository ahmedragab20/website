import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { NotificationProvider, useNotification } from "./NotificationProvider";
import { Button } from "../../atoms/Button";

// Mock Icon for Close
const CloseIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const NotificationDemo = () => {
    const { addNotification } = useNotification();

    return (
        <div class="flex flex-col gap-4 p-4 items-start">
            <div class="flex flex-wrap gap-2">
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Success",
                            description: "Action completed successfully",
                            placement: "top-right",
                            duration: 3000,
                            variant: "success",
                        })
                    }
                    color="success"
                >
                    Top Right (Success)
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "Error Occurred",
                            description: "Something went wrong",
                            placement: "top-left",
                            variant: "error",
                        })
                    }
                    color="error"
                >
                    Top Left (Error)
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "New Message",
                            description: "You have received a new message",
                            placement: "bottom-right",
                            variant: "info",
                        })
                    }
                >
                    Bottom Right (Info)
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "System Update",
                            description: "Update available",
                            placement: "bottom-left",
                            variant: "warning",
                        })
                    }
                    color="warning"
                >
                    Bottom Left (Warning)
                </Button>
            </div>

            <div class="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    onClick={() =>
                        addNotification({
                            title: "Persisted Notification",
                            description: "This will stay until you close it",
                            persisted: true,
                            placement: "top-right",
                            variant: "info",
                        })
                    }
                >
                    Persisted
                </Button>
                <Button
                    variant="outline"
                    onClick={() =>
                        addNotification({
                            children: (
                                <div class="flex items-center gap-3 p-4">
                                    <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                        !
                                    </div>
                                    <div>
                                        <h4 class="font-bold">
                                            Custom Content
                                        </h4>
                                        <p class="text-xs opacity-75">
                                            With fully custom JSX!
                                        </p>
                                    </div>
                                </div>
                            ),
                            placement: "top-right",
                        })
                    }
                >
                    Custom Children
                </Button>
            </div>
            <div class="mt-8">
                <h3 class="font-bold mb-2">Stack Test</h3>
                <Button
                    onClick={() => {
                        let count = 0;
                        const interval = setInterval(() => {
                            addNotification({
                                title: `Stack Item ${++count}`,
                                description:
                                    "Watch them stack up! Hover to pause timeout.",
                                placement: "bottom-right",
                                duration: 5000,
                                variant: "info",
                            });
                            if (count >= 5) clearInterval(interval);
                        }, 300);
                    }}
                >
                    Trigger 5 Rapidly
                </Button>
            </div>
            <div class="mt-8">
                <h3 class="font-bold mb-2">Test Features</h3>
                <div class="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            addNotification({
                                title: "Hover to Pause",
                                description:
                                    "Hover over this notification to pause the timeout",
                                placement: "top-right",
                                duration: 8000,
                                variant: "warning",
                            })
                        }
                    >
                        Test Hover Pause
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            addNotification({
                                title: "Keyboard Focus",
                                description:
                                    "Tab to this notification and focus to pause",
                                placement: "top-left",
                                duration: 6000,
                                variant: "success",
                            })
                        }
                    >
                        Test Focus Pause
                    </Button>
                </div>
            </div>
        </div>
    );
};

const meta = {
    title: "Molecules/Notification",
    component: NotificationProvider,
    tags: ["autodocs"],
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

export const Default: Story = {
    render: () => <NotificationDemo />,
};
