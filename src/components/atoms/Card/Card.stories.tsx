import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Card } from "./Card";
import { Text } from "../Text/Text";
import { Button } from "../Button/Button";

/**
 * Card component for containing related content.
 *
 * Provides a container with optional padding and elevation.
 * Use cards to group related information and create visual hierarchy.
 *
 * @example
 * ```tsx
 * <Card padding="md">
 *   <Text>Card content</Text>
 * </Card>
 * ```
 */
const meta = {
    title: "Atoms/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        padding: {
            control: "select",
            options: ["none", "sm", "md", "lg"],
            description: "Internal padding of the card",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        elevation: {
            control: "select",
            options: ["flat", "raised"],
            description: "Visual elevation of the card",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "flat" },
            },
        },
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    args: {
        children: (
            <Text>
                This is a basic card with default padding and flat elevation.
            </Text>
        ),
    },
};

export const WithContent: Story = {
    args: {
        children: (
            <div class="flex flex-col gap-3">
                <Text as="h3" size="lg" weight="semibold">
                    Card Title
                </Text>
                <Text color="muted">
                    This card contains a title and some body text. Cards are
                    useful for grouping related content together.
                </Text>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: "Card with structured content including a title and body text.",
            },
        },
    },
};

// Padding variants
export const NoPadding: Story = {
    args: {
        padding: "none",
        children: (
            <div class="p-4">
                <Text>
                    Card with no padding. Content must handle its own spacing.
                </Text>
            </div>
        ),
    },
};

export const SmallPadding: Story = {
    args: {
        padding: "sm",
        children: <Text>Card with small padding (16px).</Text>,
    },
};

export const MediumPadding: Story = {
    args: {
        padding: "md",
        children: <Text>Card with medium padding (24px).</Text>,
    },
};

export const LargePadding: Story = {
    args: {
        padding: "lg",
        children: <Text>Card with large padding (32px).</Text>,
    },
};

// Elevation
export const Flat: Story = {
    args: {
        elevation: "flat",
        children: <Text>Flat card with no shadow.</Text>,
    },
};

export const Raised: Story = {
    args: {
        elevation: "raised",
        children: <Text>Raised card with shadow for depth.</Text>,
    },
    parameters: {
        docs: {
            description: {
                story: "Raised elevation adds a shadow to create visual depth and separation from the background.",
            },
        },
    },
};

// Composition examples
export const WithButton: Story = {
    args: {
        children: (
            <div class="flex flex-col gap-4">
                <Text>
                    This card contains a button. Cards are often used as
                    containers for interactive content.
                </Text>
                <div class="flex gap-2">
                    <Button variant="solid" color="accent">
                        Primary Action
                    </Button>
                    <Button variant="outline" color="accent">
                        Secondary
                    </Button>
                </div>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: "Card containing buttons. Shows how cards work with interactive elements.",
            },
        },
    },
};

export const ComplexContent: Story = {
    args: {
        padding: "lg",
        elevation: "raised",
        children: (
            <div class="flex flex-col gap-4">
                <Text as="h2" size="xl" weight="bold">
                    Feature Card
                </Text>
                <Text color="muted">
                    Cards can contain complex layouts with multiple elements,
                    including headings, text, images, and interactive
                    components.
                </Text>
                <div class="h-[120px] bg-tertiary rounded-lg flex items-center justify-center">
                    <Text color="muted">Image placeholder</Text>
                </div>
                <Button variant="solid" color="accent">
                    Learn More
                </Button>
            </div>
        ),
    },
    parameters: {
        docs: {
            description: {
                story: "Complex card layout with multiple content types. Demonstrates card flexibility.",
            },
        },
    },
};
