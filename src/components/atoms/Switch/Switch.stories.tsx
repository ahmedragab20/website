import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Switch } from "./Switch";

/**
 * Switch component — accessible toggle that follows design system tokens and patterns.
 *
 * - Uses `role="switch"` and `aria-checked` for accessibility
 * - Supports controlled (`checked`) and uncontrolled (`defaultChecked`) usage
 * - Keyboard accessible (Space / Enter)
 * - Uses design tokens (`bg-accent`, `bg-ui-gutter`, `border-ui-border`, `text-fg-main`)
 *
 * @example
 * ```tsx
 * <Switch defaultChecked onChange={(v) => console.log(v)} aria-label="toggle" />
 * ```
 */
const meta = {
    title: "Atoms/Switch",
    component: Switch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the switch",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the switch is disabled",
        },
        defaultChecked: {
            control: "boolean",
            description: "Uncontrolled initial checked state",
        },
        checked: {
            control: "boolean",
            description: "Controlled checked state",
        },
        onChange: {
            action: "onChange",
            description: "Callback when the switch changes",
        },
        "aria-label": {
            control: "text",
            description: "Accessible label for screen readers",
        },
        name: {
            control: "text",
            description: "Name attribute for form compatibility",
        },
        class: {
            control: "text",
            description: "Additional classes to apply to the switch wrapper",
        },
    },
    args: {
        onChange: fn(),
        "aria-label": "switch",
    },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        defaultChecked: false,
    },
};

export const Checked: Story = {
    args: {
        defaultChecked: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Sizes: Story = {
    render: (args: Story["args"]) => (
        <div class="flex gap-4 items-center">
            <div class="flex flex-col items-center gap-2">
                <span class="text-sm text-fg-muted">Small</span>
                <Switch {...args} size="sm" />
            </div>
            <div class="flex flex-col items-center gap-2">
                <span class="text-sm text-fg-muted">Medium</span>
                <Switch {...args} size="md" />
            </div>
            <div class="flex flex-col items-center gap-2">
                <span class="text-sm text-fg-muted">Large</span>
                <Switch {...args} size="lg" />
            </div>
        </div>
    ),
};
