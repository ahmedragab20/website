import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Alert } from "./Alert";

/**
 * Alert component for displaying important messages to users.
 *
 * Supports multiple variants, colors, sizes, and dismissal.
 * Includes proper ARIA attributes for accessibility.
 *
 * @example
 * ```tsx
 * <Alert variant="solid" color="success" title="Success" onDismiss={() => {}}>
 *   Your changes have been saved successfully.
 * </Alert>
 * ```
 */
const meta = {
    title: "Atoms/Alert",
    component: Alert,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "subtle", "outline"],
            description: "Visual style variant of alert",
        },
        color: {
            control: "select",
            options: ["accent", "success", "warning", "error"],
            description: "Color scheme of alert",
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of alert",
        },
        title: {
            control: "text",
            description: "Optional title for the alert",
        },
        children: {
            control: "text",
            description: "Alert content/message",
        },
        onDismiss: {
            action: "dismissed",
            description: "Callback when dismiss button is clicked",
        },
        dismissIcon: {
            control: false,
            description: "Custom dismiss icon element",
        },
    },
    args: {
        variant: "solid",
        color: "accent",
        size: "md",
        children: "This is an alert message.",
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "This is the default alert message.",
    },
};

export const WithTitle: Story = {
    args: {
        title: "Alert Title",
        children: "This alert has a title and message content.",
    },
};

export const Accent: Story = {
    args: {
        title: "Information",
        children: "This is an informational alert to provide context.",
        color: "accent",
    },
};

export const Success: Story = {
    args: {
        title: "Success",
        children: "Your changes have been saved successfully.",
        color: "success",
    },
};

export const Warning: Story = {
    args: {
        title: "Warning",
        children: "Please review your input before proceeding.",
        color: "warning",
    },
};

export const Error: Story = {
    args: {
        title: "Error",
        children: "An error occurred while processing your request.",
        color: "error",
    },
};

export const Outline: Story = {
    args: {
        title: "Information",
        children: "This alert uses the outline variant.",
        variant: "outline",
        color: "accent",
    },
};

export const Subtle: Story = {
    args: {
        title: "Notice",
        children: "This is a subtle alert notification.",
        variant: "subtle",
        color: "accent",
    },
};

export const Dismissible: Story = {
    args: {
        title: "Dismissible Alert",
        children: "You can dismiss this alert by clicking the X button.",
        onDismiss: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Alerts can be dismissed by providing an `onDismiss` callback. This renders a close button.",
            },
        },
    },
};

export const Sizes: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 max-w-md">
            <Alert {...args} size="sm" title="Small Alert">
                This is a small alert with less padding.
            </Alert>
            <Alert {...args} size="md" title="Medium Alert">
                This is a medium alert with standard padding.
            </Alert>
            <Alert {...args} size="lg" title="Large Alert">
                This is a large alert with more padding and larger text.
            </Alert>
        </div>
    ),
    args: {
        color: "accent",
        variant: "solid",
    },
};

export const Colors: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 max-w-md">
            <Alert {...args} color="accent" title="Accent">
                This is an accent color alert for general information.
            </Alert>
            <Alert {...args} color="success" title="Success">
                This is a success alert for positive feedback.
            </Alert>
            <Alert {...args} color="warning" title="Warning">
                This is a warning alert for cautionary messages.
            </Alert>
            <Alert {...args} color="error" title="Error">
                This is an error alert for critical issues.
            </Alert>
        </div>
    ),
    args: {
        variant: "solid",
    },
};

export const Variants: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 max-w-md">
            <Alert {...args} variant="solid" title="Solid">
                Solid variant has filled background.
            </Alert>
            <Alert {...args} variant="subtle" title="Subtle">
                Subtle variant has transparent background.
            </Alert>
            <Alert {...args} variant="outline" title="Outline">
                Outline variant has border only.
            </Alert>
        </div>
    ),
    args: {
        color: "accent",
    },
};

export const InForm: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 w-96">
            <div class="space-y-2">
                <label class="block text-sm font-medium">Email Address</label>
                <input
                    type="email"
                    class="w-full px-3 py-2 border rounded bg-primary border-ui-border text-fg-main focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="your@email.com"
                />
            </div>
            <Alert {...args} variant="subtle" color="warning">
                Please enter a valid email address to continue.
            </Alert>
            <div class="flex gap-2">
                <button class="px-4 py-2 rounded bg-accent text-primary font-medium">
                    Submit
                </button>
                <button class="px-4 py-2 rounded border border-ui-border">
                    Cancel
                </button>
            </div>
        </div>
    ),
    args: {
        onDismiss: undefined,
    },
    parameters: {
        docs: {
            description: {
                story: "Alert shown in a form context to provide validation feedback.",
            },
        },
    },
};
