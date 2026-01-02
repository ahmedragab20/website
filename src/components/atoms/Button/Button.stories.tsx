import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "./Button";

/**
 * Button component with multiple variants and sizes.
 *
 * Supports solid, subtle, text, and outline variants.
 * Includes built-in disabled state.
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
            options: ["solid", "subtle", "text", "outline", "link"],
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
        children: {
            control: "text",
            description: "Button label text",
        },
        "aria-label": {
            control: "text",
            description: "Accessible label for screen readers",
        },
        href: {
            control: "text",
            description:
                "URL to navigate to. When provided, renders as an anchor tag instead of a button.",
        },
        target: {
            control: "select",
            options: ["_blank", "_self", "_parent", "_top"],
            description: "Target attribute for links",
        },
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Link: Story = {
    args: {
        variant: "link",
        color: "accent",
        children: "Link Button",
        href: "#",
    },
    parameters: {
        docs: {
            description: {
                story: "Link variant styled as a text link with underline on hover. Use for navigation actions.",
            },
        },
    },
};

export const LinkAsAnchor: Story = {
    args: {
        variant: "solid",
        color: "accent",
        children: "Button as Link",
        href: "/example",
    },
    parameters: {
        docs: {
            description: {
                story: "Any button variant can be rendered as a link by providing an href prop. The component automatically renders as an anchor tag.",
            },
        },
    },
};

export const ExternalLink: Story = {
    args: {
        variant: "link",
        color: "accent",
        children: "External Link",
        href: "https://example.com",
        target: "_blank",
    },
    parameters: {
        docs: {
            description: {
                story: "External link with target='_blank' automatically includes rel='noopener noreferrer' for security.",
            },
        },
    },
};
