import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Badge } from "./Badge";

/**
 * Badge component for displaying tags, filters, and selections.
 *
 * Supports multiple variants, sizes, colors, and dismissal.
 *
 * @example
 * ```tsx
 * <Badge variant="solid" color="accent" onDismiss={() => {}}>
 *   Tag Name
 * </Badge>
 * ```
 */
const meta = {
    title: "Atoms/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "subtle", "outline"],
            description: "Visual style variant of the badge",
        },
        color: {
            control: "select",
            options: ["accent", "success", "warning", "error"],
            description: "Color scheme of the badge",
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the badge",
        },
        children: {
            control: "text",
            description: "Badge content",
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
        onClick: undefined,
        variant: "solid",
        color: "accent",
        size: "md",
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Default Badge",
    },
};

export const Accent: Story = {
    args: {
        children: "Accent Badge",
        color: "accent",
    },
};

export const Success: Story = {
    args: {
        children: "Success Badge",
        color: "success",
    },
};

export const Warning: Story = {
    args: {
        children: "Warning Badge",
        color: "warning",
    },
};

export const Error: Story = {
    args: {
        children: "Error Badge",
        color: "error",
    },
};

export const Outline: Story = {
    args: {
        children: "Outline Badge",
        variant: "outline",
    },
};

export const Subtle: Story = {
    args: {
        children: "Subtle Badge",
        variant: "subtle",
    },
};

export const Dismissible: Story = {
    args: {
        children: "Dismiss Me",
        onDismiss: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Badges can be dismissed by providing an `onDismiss` callback. This renders a close button.",
            },
        },
    },
};

export const Interactive: Story = {
    args: {
        children: "Click Me",
        onClick: fn(),
        variant: "outline",
    },
    parameters: {
        docs: {
            description: {
                story: "Badges can be interactive like buttons by providing an `onClick` handler.",
            },
        },
    },
};

export const Sizes: Story = {
    render: (args: Story["args"]) => (
        <div class="flex items-center gap-4">
            <Badge {...args} size="sm">
                Small
            </Badge>
            <Badge {...args} size="md">
                Medium
            </Badge>
            <Badge {...args} size="lg">
                Large
            </Badge>
        </div>
    ),
    args: {
        variant: "solid",
        color: "accent",
    },
};

export const Colors: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-wrap gap-2">
            <Badge {...args} color="accent">
                Accent
            </Badge>
            <Badge {...args} color="success">
                Success
            </Badge>
            <Badge {...args} color="warning">
                Warning
            </Badge>
            <Badge {...args} color="error">
                Error
            </Badge>
        </div>
    ),
    args: {
        variant: "solid",
    },
};
