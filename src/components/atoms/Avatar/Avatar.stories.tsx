import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Avatar } from "./Avatar";

/**
 * Avatar component for displaying user profile pictures with automatic initial calculation.
 *
 * Supports both image-based and text-based (auto-calculated initials) representations
 * with multiple size and color variants.
 *
 * @example
 * ```tsx
 * <Avatar src="https://example.com/avatar.jpg" alt="John Doe" />
 * <Avatar alt="Jane Doe" />
 * ```
 */
const meta = {
    title: "Atoms/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        src: {
            control: "text",
            description: "URL of the avatar image",
        },
        alt: {
            control: "text",
            description:
                "Alternative text for the avatar (required for accessibility). Used to auto-calculate initials if not provided.",
        },
        initials: {
            control: "text",
            description:
                "Optional custom initials. If not provided, auto-calculated from alt text (max 3 letters).",
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the avatar",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        variant: {
            control: "select",
            options: ["default", "accent", "muted"],
            description: "Color variant of the avatar",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "default" },
            },
        },
        class: {
            control: false,
            description: "Additional CSS classes",
        },
    },
    args: {},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        alt: "John Doe",
    },
};

export const WithImage: Story = {
    args: {
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Profile picture",
    },
};

export const CustomInitials: Story = {
    args: {
        alt: "Jane Doe",
        initials: "JD",
    },
    parameters: {
        docs: {
            description: {
                story: "Avatar with custom initials explicitly provided instead of auto-calculated.",
            },
        },
    },
};

export const Accent: Story = {
    args: {
        alt: "Eve Foster",
        variant: "accent",
    },
};

export const Muted: Story = {
    args: {
        alt: "Grace Hunter",
        variant: "muted",
    },
};

export const Sizes: Story = {
    render: () => (
        <div class="flex items-center gap-4">
            <Avatar alt="Small Avatar" size="sm" />
            <Avatar alt="Medium Avatar" size="md" />
            <Avatar alt="Large Avatar" size="lg" />
        </div>
    ),
    args: {
        variant: "default",
    },
};

export const Variants: Story = {
    render: () => (
        <div class="flex gap-4">
            <Avatar alt="Default" variant="default" />
            <Avatar alt="Accent" variant="accent" />
            <Avatar alt="Muted" variant="muted" />
        </div>
    ),
    args: {
        size: "md",
    },
};

export const Group: Story = {
    render: () => (
        <div class="space-y-1">
            <div class="flex gap-2 [&>div]:-me-4 [&>div]:shadow-inner mx-auto">
                <Avatar src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <Avatar src="https://images.unsplash.com/photo-1678282955936-426bbe7a9693?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                <Avatar alt="Ahmed Ragab" />
                <Avatar src="https://images.unsplash.com/photo-1740102074734-ba03d00a8796?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            <p class="text-fg-muted text-xs">
                <i>
                    All Pictures are from{" "}
                    <a href="https://unsplash.com/">Unsplash</a>.
                </i>
            </p>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Multiple avatars displayed together. Initials are automatically calculated from alt text.",
            },
        },
    },
};

export const InUserCard: Story = {
    render: () => (
        <div class="p-6 rounded-lg bg-secondary border border-ui-border w-[300px]">
            <div class="flex gap-4">
                <Avatar alt="John Doe" size="lg" />
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-fg-main">John Doe</h3>
                    <p class="text-sm text-fg-muted">Product Designer</p>
                    <p class="text-xs text-fg-muted mt-2">
                        Passionate about creating beautiful and accessible
                        designs.
                    </p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Avatar used within a user information card component.",
            },
        },
    },
};
