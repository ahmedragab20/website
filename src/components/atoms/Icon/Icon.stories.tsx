import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Icon } from "./Icon";

/**
 * Icon component for displaying Lucide icons.
 *
 * Wraps Lucide icon components with consistent sizing and coloring.
 * Icons should be passed as JSX elements from @lucide/astro or @lucide/solid-js.
 *
 * @example
 * ```tsx
 * <Icon size="md" color="accent">
 *   <Check />
 * </Icon>
 * ```
 */
const meta = {
    title: "Atoms/Icon",
    component: Icon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Size of the icon",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        color: {
            control: "select",
            options: [
                "default",
                "muted",
                "accent",
                "success",
                "warning",
                "error",
            ],
            description: "Color of the icon",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "default" },
            },
        },
        "aria-label": {
            control: "text",
            description: "Accessible label for decorative icons",
        },
        "aria-hidden": {
            control: "boolean",
            description: "Whether to hide icon from screen readers",
        },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage - using emoji placeholders for Storybook
const CheckIcon = () => <span class="text-inherit">✓</span>;
const XIcon = () => <span class="text-inherit">✕</span>;
const StarIcon = () => <span class="text-inherit">★</span>;
const HeartIcon = () => <span class="text-inherit">♥</span>;
const AlertIcon = () => <span class="text-inherit">⚠</span>;

export const Default: Story = {
    args: {
        children: <CheckIcon />,
    },
    parameters: {
        docs: {
            description: {
                story: "Default icon with medium size and default color. In production, use Lucide icons from @lucide/astro.",
            },
        },
    },
};

// Sizes
export const ExtraSmall: Story = {
    args: {
        size: "xs",
        children: <CheckIcon />,
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        children: <CheckIcon />,
    },
};

export const Medium: Story = {
    args: {
        size: "md",
        children: <CheckIcon />,
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: <CheckIcon />,
    },
};

export const ExtraLarge: Story = {
    args: {
        size: "xl",
        children: <CheckIcon />,
    },
};

// Colors
export const DefaultColor: Story = {
    args: {
        color: "default",
        children: <StarIcon />,
    },
};

export const Muted: Story = {
    args: {
        color: "muted",
        children: <StarIcon />,
    },
};

export const Accent: Story = {
    args: {
        color: "accent",
        children: <StarIcon />,
    },
};

export const Success: Story = {
    args: {
        color: "success",
        children: <CheckIcon />,
    },
};

export const Warning: Story = {
    args: {
        color: "warning",
        children: <AlertIcon />,
    },
};

export const Error: Story = {
    args: {
        color: "error",
        children: <XIcon />,
    },
};

// Accessibility
export const WithAriaLabel: Story = {
    args: {
        children: <CheckIcon />,
        "aria-label": "Check mark icon",
        "aria-hidden": false,
    },
    parameters: {
        docs: {
            description: {
                story: "Icon with aria-label for accessibility. Use when the icon conveys meaning without text.",
            },
        },
    },
};

export const Decorative: Story = {
    args: {
        children: <HeartIcon />,
        "aria-hidden": true,
    },
    parameters: {
        docs: {
            description: {
                story: "Decorative icon hidden from screen readers. Use when the icon is purely visual and doesn't add meaning.",
            },
        },
    },
};

// Composition examples
export const InButton: Story = {
    render: () => (
        <button class="inline-flex items-center gap-2 px-4 py-2 rounded border-none bg-accent text-primary cursor-pointer">
            <Icon size="sm" color="default" aria-hidden={true}>
                <CheckIcon />
            </Icon>
            <span>Save</span>
        </button>
    ),
    parameters: {
        docs: {
            description: {
                story: "Icon used within a button. The icon is decorative (aria-hidden) since the button text provides context.",
            },
        },
    },
};

export const StatusIcons: Story = {
    render: () => (
        <div class="flex gap-6 items-center">
            <div class="flex flex-col gap-2 items-center">
                <Icon size="lg" color="success">
                    <CheckIcon />
                </Icon>
                <span class="text-xs text-fg-muted">Success</span>
            </div>
            <div class="flex flex-col gap-2 items-center">
                <Icon size="lg" color="warning">
                    <AlertIcon />
                </Icon>
                <span class="text-xs text-fg-muted">Warning</span>
            </div>
            <div class="flex flex-col gap-2 items-center">
                <Icon size="lg" color="error">
                    <XIcon />
                </Icon>
                <span class="text-xs text-fg-muted">Error</span>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Icons used to represent different status states. Each icon uses appropriate semantic colors.",
            },
        },
    },
};

export const SizeComparison: Story = {
    render: () => (
        <div class="flex gap-4 items-center">
            <Icon size="xs">
                <StarIcon />
            </Icon>
            <Icon size="sm">
                <StarIcon />
            </Icon>
            <Icon size="md">
                <StarIcon />
            </Icon>
            <Icon size="lg">
                <StarIcon />
            </Icon>
            <Icon size="xl">
                <StarIcon />
            </Icon>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "All icon sizes displayed together for comparison.",
            },
        },
    },
};
