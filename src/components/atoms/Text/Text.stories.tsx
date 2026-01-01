import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Text } from "./Text";

/**
 * Text component for typography and text styling.
 *
 * Provides consistent typography with size, weight, color, and font variants.
 * Can render as different semantic HTML elements (p, span, div, h1-h6).
 *
 * @example
 * ```tsx
 * <Text size="lg" weight="bold">Heading Text</Text>
 * ```
 */
const meta = {
    title: "Atoms/Text",
    component: Text,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        as: {
            control: "select",
            options: ["p", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
            description: "HTML element to render as",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "p" },
            },
        },
        size: {
            control: "select",
            options: [
                "xs",
                "sm",
                "base",
                "lg",
                "xl",
                "2xl",
                "3xl",
                "4xl",
                "5xl",
            ],
            description: "Font size",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "base" },
            },
        },
        weight: {
            control: "select",
            options: ["normal", "medium", "semibold", "bold"],
            description: "Font weight",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "normal" },
            },
        },
        color: {
            control: "select",
            options: ["main", "muted", "accent"],
            description: "Text color",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "main" },
            },
        },
        font: {
            control: "select",
            options: ["sans", "mono"],
            description: "Font family",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "sans" },
            },
        },
        children: {
            control: "text",
            description: "Text content",
        },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    args: {
        children: "Default text with base size and normal weight.",
    },
};

export const Paragraph: Story = {
    args: {
        as: "p",
        children:
            "This is a paragraph element. Use for body text and longer content blocks.",
    },
    parameters: {
        docs: {
            description: {
                story: "Text rendered as a paragraph element. Default semantic element for body text.",
            },
        },
    },
};

// Semantic elements
export const Heading1: Story = {
    args: {
        as: "h1",
        size: "4xl",
        weight: "bold",
        children: "Heading 1",
    },
};

export const Heading2: Story = {
    args: {
        as: "h2",
        size: "3xl",
        weight: "bold",
        children: "Heading 2",
    },
};

export const Heading3: Story = {
    args: {
        as: "h3",
        size: "2xl",
        weight: "semibold",
        children: "Heading 3",
    },
};

export const Span: Story = {
    args: {
        as: "span",
        children: "Inline span text",
    },
};

// Sizes
export const ExtraSmall: Story = {
    args: {
        size: "xs",
        children: "Extra small text (12px)",
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        children: "Small text (14px)",
    },
};

export const Base: Story = {
    args: {
        size: "base",
        children: "Base text (16px)",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large text (18px)",
    },
};

export const ExtraLarge: Story = {
    args: {
        size: "xl",
        children: "Extra large text (20px)",
    },
};

export const TwoXL: Story = {
    args: {
        size: "2xl",
        children: "2XL text (24px)",
    },
};

export const ThreeXL: Story = {
    args: {
        size: "3xl",
        children: "3XL text (30px)",
    },
};

export const FourXL: Story = {
    args: {
        size: "4xl",
        children: "4XL text (36px)",
    },
};

export const FiveXL: Story = {
    args: {
        size: "5xl",
        children: "5XL text (48px)",
    },
};

// Weights
export const Normal: Story = {
    args: {
        weight: "normal",
        children: "Normal weight text",
    },
};

export const Medium: Story = {
    args: {
        weight: "medium",
        children: "Medium weight text",
    },
};

export const Semibold: Story = {
    args: {
        weight: "semibold",
        children: "Semibold weight text",
    },
};

export const Bold: Story = {
    args: {
        weight: "bold",
        children: "Bold weight text",
    },
};

// Colors
export const Main: Story = {
    args: {
        color: "main",
        children: "Main text color (primary foreground)",
    },
};

export const Muted: Story = {
    args: {
        color: "muted",
        children: "Muted text color (secondary foreground)",
    },
    parameters: {
        docs: {
            description: {
                story: "Muted color for less prominent text like captions and helper text.",
            },
        },
    },
};

export const Accent: Story = {
    args: {
        color: "accent",
        children: "Accent text color",
    },
};

// Fonts
export const Sans: Story = {
    args: {
        font: "sans",
        children: "Sans-serif font (default)",
    },
};

export const Mono: Story = {
    args: {
        font: "mono",
        children: "Monospace font for code",
    },
    parameters: {
        docs: {
            description: {
                story: "Monospace font is useful for displaying code, technical content, or data that needs alignment.",
            },
        },
    },
};

// Composition examples
export const TypographyScale: Story = {
    render: () => (
        <div class="flex flex-col gap-4">
            <Text as="h1" size="4xl" weight="bold">
                Heading 1
            </Text>
            <Text as="h2" size="3xl" weight="bold">
                Heading 2
            </Text>
            <Text as="h3" size="2xl" weight="semibold">
                Heading 3
            </Text>
            <Text as="h4" size="xl" weight="semibold">
                Heading 4
            </Text>
            <Text as="p" size="base" weight="normal">
                Body text for paragraphs and longer content. This demonstrates
                the default text styling.
            </Text>
            <Text as="p" size="sm" color="muted">
                Small muted text for captions and helper information.
            </Text>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Complete typography scale showing different text sizes and weights in context.",
            },
        },
    },
};

export const WithCode: Story = {
    render: () => (
        <div class="flex flex-col gap-2">
            <Text>
                Use the{" "}
                <Text as="span" font="mono" color="accent">
                    Text
                </Text>{" "}
                component for consistent typography.
            </Text>
            <Text font="mono" size="sm" color="muted">
                const example = "inline code";
            </Text>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Text component with inline code styling using monospace font.",
            },
        },
    },
};
