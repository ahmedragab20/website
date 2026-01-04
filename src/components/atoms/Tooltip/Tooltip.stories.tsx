import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

/**
 * Tooltip component using the Popover API with reactive placement.
 *
 * **Note:** This component relies on the **CSS Anchor Positioning API** for precise positioning relative to the trigger.
 * In browsers that do not support this API (e.g., Safari, Firefox), a fallback strategy is used where the tooltip appears fixed at the bottom of the screen (toast-style).
 *
 * Automatically adjusts position based on available viewport space.
 * Shows on hover or focus for accessibility.
 *
 * @example
 * ```tsx
 * <Tooltip content="Helpful tooltip text">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
const meta = {
    title: "Atoms/Tooltip",
    component: Tooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        content: {
            control: "text",
            description: "Tooltip content text or element",
            table: {
                type: { summary: "string | JSX.Element" },
            },
        },
        placement: {
            control: "select",
            options: ["top", "bottom", "left", "right"],
            description:
                "Preferred placement of the tooltip (auto-adjusts if needed)",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "top" },
            },
        },
        delay: {
            control: "number",
            description:
                "Delay in milliseconds before showing tooltip on hover",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "0" },
            },
        },
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args: Story["args"]) => (
        <Tooltip {...args} content="This is a helpful tooltip">
            <Button>Hover me</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Basic tooltip that appears on hover or focus. Position automatically adjusts to stay within viewport.",
            },
        },
    },
};

export const Top: Story = {
    render: (args: Story["args"]) => (
        <Tooltip {...args} content="Tooltip on top" placement="top">
            <Button>Hover me</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip positioned above the trigger element.",
            },
        },
    },
};

export const Bottom: Story = {
    render: (args: Story["args"]) => (
        <Tooltip {...args} content="Tooltip on bottom" placement="bottom">
            <Button>Hover me</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip positioned below the trigger element.",
            },
        },
    },
};

export const Left: Story = {
    render: (args: Story["args"]) => (
        <Tooltip {...args} content="Tooltip on left" placement="left">
            <Button>Hover me</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip positioned to the left of the trigger element.",
            },
        },
    },
};

export const Right: Story = {
    render: (args: Story["args"]) => (
        <Tooltip {...args} content="Tooltip on right" placement="right">
            <Button>Hover me</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip positioned to the right of the trigger element.",
            },
        },
    },
};

export const WithDelay: Story = {
    render: (args: Story["args"]) => (
        <Tooltip {...args} content="Delayed tooltip" delay={500}>
            <Button>Hover me (500ms delay)</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip with a 500ms delay before appearing. Useful to prevent tooltips from showing on quick mouse movements.",
            },
        },
    },
};

export const LongContent: Story = {
    render: (args: Story["args"]) => (
        <Tooltip
            {...args}
            content="This is a longer tooltip that demonstrates how the component handles extended text content. It will wrap appropriately and maintain proper positioning."
        >
            <Button>Hover for long tooltip</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip with longer content that wraps to multiple lines. Max width is constrained for readability.",
            },
        },
    },
};

export const WithRichContent: Story = {
    render: (args: Story["args"]) => (
        <Tooltip
            {...args}
            content={
                <div class="flex flex-col gap-1">
                    <span class="font-semibold">Rich Content</span>
                    <span class="text-xs text-fg-muted">
                        Tooltips can contain JSX elements
                    </span>
                </div>
            }
        >
            <Button>Hover me</Button>
        </Tooltip>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltip with rich content using JSX elements for more complex layouts.",
            },
        },
    },
};

export const InContext: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-6 w-[400px]">
            <div class="p-6 rounded-lg bg-secondary border border-ui-border">
                <div class="flex items-center gap-2 mb-4">
                    <h3 class="text-lg font-semibold">Form Field</h3>
                    <Tooltip
                        {...args}
                        content="Enter your full name as it appears on your ID"
                    >
                        <button
                            class="w-5 h-5 rounded-full bg-tertiary border border-ui-border flex items-center justify-center text-xs text-fg-muted hover:bg-ui-active transition-colors"
                            aria-label="Help"
                        >
                            ?
                        </button>
                    </Tooltip>
                </div>
                <input
                    type="text"
                    placeholder="Name"
                    class="w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>
            <div class="flex gap-2">
                <Tooltip {...args} content="Save your changes">
                    <Button>Save</Button>
                </Tooltip>
                <Tooltip {...args} content="Discard all changes">
                    <Button variant="outline">Cancel</Button>
                </Tooltip>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Tooltips used in a real-world context to provide helpful information for form fields and buttons.",
            },
        },
    },
};

export const EdgePositions: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-8 p-8">
            <div class="flex justify-between items-start">
                <Tooltip {...args} content="Top-left corner" placement="top">
                    <Button>Top Left</Button>
                </Tooltip>
                <Tooltip {...args} content="Top-right corner" placement="top">
                    <Button>Top Right</Button>
                </Tooltip>
            </div>
            <div class="flex justify-between items-end">
                <Tooltip
                    {...args}
                    content="Bottom-left corner"
                    placement="bottom"
                >
                    <Button>Bottom Left</Button>
                </Tooltip>
                <Tooltip
                    {...args}
                    content="Bottom-right corner"
                    placement="bottom"
                >
                    <Button>Bottom Right</Button>
                </Tooltip>
            </div>
        </div>
    ),
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                story: "Tooltips positioned near viewport edges demonstrate automatic position adjustment to stay within bounds.",
            },
        },
    },
};
