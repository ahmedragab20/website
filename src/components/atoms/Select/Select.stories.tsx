import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Select } from "./Select";

/**
 * Select component for choosing from a list of options.
 *
 * Supports default and error variants, as well as multiple sizes.
 * Includes built-in disabled state and full-width option.
 *
 * @example
 * ```tsx
 * <Select variant="default" size="md">
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </Select>
 * ```
 */
const meta = {
    title: "Atoms/Select",
    component: Select,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "error"],
            description: "Visual style variant",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "default" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the select input",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        fullWidth: {
            control: "boolean",
            description: "Whether the select should take full width",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Disabled state",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        "aria-invalid": {
            control: "boolean",
            description: "Indicates the field has an error",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
    },
    args: {
        onChange: fn(),
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultChildren = (
    <>
        <option value="" disabled selected>
            Select an option
        </option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
    </>
);

export const Default: Story = {
    args: {
        children: defaultChildren,
    },
    parameters: {
        docs: {
            description: {
                story: "Default select component with standard styling.",
            },
        },
    },
};

export const Error: Story = {
    args: {
        variant: "error",
        children: defaultChildren,
    },
    parameters: {
        docs: {
            description: {
                story: "Error state indicating validation failure.",
            },
        },
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        children: defaultChildren,
    },
    parameters: {
        docs: {
            description: {
                story: "Compact size for dense interfaces.",
            },
        },
    },
};

export const Medium: Story = {
    args: {
        size: "md",
        children: defaultChildren,
    },
    parameters: {
        docs: {
            description: {
                story: "Standard size for most use cases.",
            },
        },
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: defaultChildren,
    },
    parameters: {
        docs: {
            description: {
                story: "Large size for prominent inputs.",
            },
        },
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: defaultChildren,
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled state prevents interaction.",
            },
        },
    },
};

export const FullWidth: Story = {
    args: {
        fullWidth: true,
        children: (
            <>
                <option>Full Width Option 1</option>
                <option>Full Width Option 2</option>
            </>
        ),
    },
    decorators: [
        (Story: any) => (
            <div class="w-96 p-4 border border-dashed border-ui-border">
                <Story />
            </div>
        ),
    ],
    parameters: {
        docs: {
            description: {
                story: "Full width variant fills its container.",
            },
        },
    },
};
