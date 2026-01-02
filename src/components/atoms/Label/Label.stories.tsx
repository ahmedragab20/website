import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Label } from "./Label";
import { Input } from "../Input/Input";

/**
 * Label component for form field labels.
 *
 * Provides consistent labeling with size variants and required indicator.
 * Always use labels with form inputs for accessibility.
 *
 * @example
 * ```tsx
 * <Label for="email" required>Email Address</Label>
 * ```
 */
const meta = {
    title: "Atoms/Label",
    component: Label,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the label",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        required: {
            control: "boolean",
            description: "Whether the field is required (shows asterisk)",
        },
        children: {
            control: "text",
            description: "Label text",
        },
        for: {
            control: "text",
            description: "ID of the associated form element",
        },
    },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    args: {
        children: "Label Text",
    },
};

export const WithInput: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-2 w-75">
            <Label {...args} for="input-example" />
            <Input id="input-example" value="" placeholder="Enter value" />
        </div>
    ),
    args: {
        children: "Email Address",
    },
    parameters: {
        docs: {
            description: {
                story: "Label associated with an input using the 'for' attribute. This creates proper accessibility relationships.",
            },
        },
    },
};

// Sizes
export const Small: Story = {
    args: {
        size: "sm",
        children: "Small Label",
    },
};

export const Medium: Story = {
    args: {
        size: "md",
        children: "Medium Label",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large Label",
    },
};

// Required indicator
export const Required: Story = {
    args: {
        children: "Required Field",
        required: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Required label shows an asterisk (*) to indicate the field is mandatory.",
            },
        },
    },
};

export const RequiredWithInput: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-2 w-75">
            <Label {...args} for="required-input" />
            <Input
                id="required-input"
                value=""
                placeholder="This field is required"
                required
            />
        </div>
    ),
    args: {
        children: "Email Address",
        required: true,
    },
};

// Composition
export const FormExample: Story = {
    render: () => (
        <form class="flex flex-col gap-4 w-75">
            <div class="flex flex-col gap-2">
                <Label for="form-name" required>
                    Full Name
                </Label>
                <Input
                    id="form-name"
                    value=""
                    placeholder="John Doe"
                    required
                />
            </div>
            <div class="flex flex-col gap-2">
                <Label for="form-email" required>
                    Email Address
                </Label>
                <Input
                    id="form-email"
                    type="email"
                    value=""
                    placeholder="you@example.com"
                    required
                />
            </div>
            <div class="flex flex-col gap-2">
                <Label for="form-phone">Phone Number</Label>
                <Input
                    id="form-phone"
                    type="tel"
                    value=""
                    placeholder="(555) 123-4567"
                />
            </div>
        </form>
    ),
    parameters: {
        docs: {
            description: {
                story: "Complete form example showing labels with different states (required and optional).",
            },
        },
    },
};
