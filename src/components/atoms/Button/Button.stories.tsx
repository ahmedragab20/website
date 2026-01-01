import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "./Button";

/**
 * Button component with multiple variants and sizes.
 *
 * Supports solid, subtle, text, and outline variants.
 * Includes built-in loading and disabled states.
 * Can display icons on the left or right side.
 *
 * @example
 * ```tsx
 * <Button variant="solid" color="accent">Click me</Button>
 * ```
 */
const meta = {
    title: "Atoms/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "subtle", "text", "outline"],
            description: "Visual style variant of the button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "solid" },
            },
        },
        color: {
            control: "select",
            options: ["primary", "accent", "success", "warning", "error"],
            description: "Color scheme of the button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "accent" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the button is disabled",
        },
        loading: {
            control: "boolean",
            description: "Shows loading spinner and disables interaction",
        },
        iconPosition: {
            control: "select",
            options: ["left", "right"],
            description: "Position of the icon relative to text",
        },
        children: {
            control: "text",
            description: "Button label text",
        },
        "aria-label": {
            control: "text",
            description: "Accessible label for screen readers",
        },
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary use cases
export const Primary: Story = {
    args: {
        variant: "solid",
        color: "accent",
        children: "Primary Button",
    },
    parameters: {
        docs: {
            description: {
                story: "Primary action button with solid accent styling. Use for the main action on a page or in a form.",
            },
        },
    },
};

export const Secondary: Story = {
    args: {
        variant: "outline",
        color: "accent",
        children: "Secondary Button",
    },
    parameters: {
        docs: {
            description: {
                story: "Secondary action button with outline styling. Use for less prominent actions.",
            },
        },
    },
};

export const Destructive: Story = {
    args: {
        variant: "solid",
        color: "error",
        children: "Delete",
    },
    parameters: {
        docs: {
            description: {
                story: "Destructive action button for dangerous operations like deleting or removing items.",
            },
        },
    },
};

// Variants
export const Solid: Story = {
    args: {
        variant: "solid",
        color: "accent",
        children: "Solid Button",
    },
};

export const Subtle: Story = {
    args: {
        variant: "subtle",
        color: "accent",
        children: "Subtle Button",
    },
};

export const Text: Story = {
    args: {
        variant: "text",
        color: "accent",
        children: "Text Button",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
        color: "accent",
        children: "Outline Button",
    },
};

// Colors
export const Accent: Story = {
    args: {
        variant: "solid",
        color: "accent",
        children: "Accent",
    },
};

export const Success: Story = {
    args: {
        variant: "solid",
        color: "success",
        children: "Success",
    },
};

export const Warning: Story = {
    args: {
        variant: "solid",
        color: "warning",
        children: "Warning",
    },
};

export const Error: Story = {
    args: {
        variant: "solid",
        color: "error",
        children: "Error",
    },
};

// Sizes
export const Small: Story = {
    args: {
        size: "sm",
        children: "Small Button",
    },
};

export const Medium: Story = {
    args: {
        size: "md",
        children: "Medium Button",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large Button",
    },
};

// States
export const Disabled: Story = {
    args: {
        children: "Disabled",
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled state prevents interaction and reduces opacity. The button is not clickable.",
            },
        },
    },
};

export const Loading: Story = {
    args: {
        children: "Loading",
        loading: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Loading state shows a spinner and disables the button. Use during async operations.",
            },
        },
    },
};

// With icons (using simple placeholder for Storybook)
export const WithIconLeft: Story = {
    args: {
        children: "Download",
        icon: (<span>⬇</span>) as any,
        iconPosition: "left",
    },
    parameters: {
        docs: {
            description: {
                story: "Button with icon on the left side. Icons should be passed as JSX elements from Lucide.",
            },
        },
    },
};

export const WithIconRight: Story = {
    args: {
        children: "Next",
        icon: (<span>→</span>) as any,
        iconPosition: "right",
    },
};

// Edge cases
export const LongText: Story = {
    args: {
        children:
            "This is a very long button label that might wrap to multiple lines",
    },
    parameters: {
        docs: {
            description: {
                story: "Button with long text to test wrapping behavior.",
            },
        },
    },
};

export const IconOnly: Story = {
    args: {
        icon: (<span>✕</span>) as any,
        "aria-label": "Close dialog",
        children: undefined,
    },
    parameters: {
        docs: {
            description: {
                story: "Icon-only button requires an aria-label for accessibility. The icon should be descriptive.",
            },
        },
        a11y: {
            config: {
                rules: [
                    {
                        id: "button-name",
                        enabled: true,
                    },
                ],
            },
        },
    },
};
