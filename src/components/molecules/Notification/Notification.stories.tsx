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
                        })
                    }
                    color="error" // Button color
                >
                    Top Left (Error)
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "New Message",
                            description: "You have received a new message",
                            placement: "bottom-right",
                        })
                    }
                >
                    Bottom Right
                </Button>
                <Button
                    onClick={() =>
                        addNotification({
                            title: "System Update",
                            description: "Update available",
                            placement: "bottom-left",
                        })
                    }
                >
                    Bottom Left
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
                                description: "Watch them stack up!",
                                placement: "bottom-right",
                                duration: 5000,
                            });
                            if (count >= 5) clearInterval(interval);
                        }, 300);
                    }}
                >
                    Trigger 5 Rapidly
                </Button>
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
