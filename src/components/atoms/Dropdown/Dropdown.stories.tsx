import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Dropdown, DropdownItem } from "./Dropdown";
import { Button } from "../Button";

/**
 * Dropdown component using the Popover API.
 *
 * **Note:** This component relies on the **CSS Anchor Positioning API** for precise positioning relative to the trigger.
 * In browsers that do not support this API (e.g., Safari, Firefox), a fallback strategy is used where the dropdown appears fixed in the center of the screen (dialog-style).
 *
 * Provides a menu that appears on top of other content.
 * Supports keyboard navigation and accessibility features.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<Button>Open Menu</Button>}>
 *   <DropdownItem>Item 1</DropdownItem>
 *   <DropdownItem>Item 2</DropdownItem>
 * </Dropdown>
 * ```
 */
const meta = {
    title: "Atoms/Dropdown",
    component: Dropdown,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the dropdown menu",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        placement: {
            control: "select",
            options: ["bottom-start", "bottom-end", "top-start", "top-end"],
            description: "Placement of the dropdown relative to trigger",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "bottom-start" },
            },
        },
    },
    args: {
        onOpenChange: fn(),
    },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} trigger={<Button>Open Menu</Button>}>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Basic dropdown menu with default styling and behavior.",
            },
        },
    },
};

export const WithActions: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} trigger={<Button>Actions</Button>}>
            <DropdownItem onClick={() => alert("Edit clicked")}>
                Edit
            </DropdownItem>
            <DropdownItem onClick={() => alert("Share clicked")}>
                Share
            </DropdownItem>
            <DropdownItem
                variant="danger"
                onClick={() => alert("Delete clicked")}
            >
                Delete
            </DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Dropdown with action items that trigger callbacks when clicked.",
            },
        },
    },
};

export const WithDisabledItem: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} trigger={<Button>Menu</Button>}>
            <DropdownItem>Available</DropdownItem>
            <DropdownItem disabled>Disabled Item</DropdownItem>
            <DropdownItem>Another Available</DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Dropdown with a disabled menu item that cannot be clicked.",
            },
        },
    },
};

export const DangerVariant: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} trigger={<Button>Options</Button>}>
            <DropdownItem>Normal Action</DropdownItem>
            <DropdownItem variant="danger">Dangerous Action</DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Dropdown item with danger variant styling for destructive actions.",
            },
        },
    },
};

export const Small: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} size="sm" trigger={<Button>Small Menu</Button>}>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Small size dropdown with compact text.",
            },
        },
    },
};

export const Medium: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} size="md" trigger={<Button>Medium Menu</Button>}>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Medium size dropdown (default).",
            },
        },
    },
};

export const Large: Story = {
    render: (args: Story["args"]) => (
        <Dropdown {...args} size="lg" trigger={<Button>Large Menu</Button>}>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
            <DropdownItem>Item 3</DropdownItem>
        </Dropdown>
    ),
    parameters: {
        docs: {
            description: {
                story: "Large size dropdown with larger text.",
            },
        },
    },
};

export const InContext: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 w-75">
            <div class="p-6 rounded-lg bg-secondary border border-ui-border">
                <h3 class="text-lg font-semibold mb-4">User Menu</h3>
                <Dropdown {...args} trigger={<Button>User Options</Button>}>
                    <DropdownItem>View Profile</DropdownItem>
                    <DropdownItem>Account Settings</DropdownItem>
                    <DropdownItem>Preferences</DropdownItem>
                    <DropdownItem variant="danger">Sign Out</DropdownItem>
                </Dropdown>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Dropdown used in a real-world context within a card component.",
            },
        },
    },
};
