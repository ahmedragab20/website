import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { LegacyDropdown, LegacyDropdownItem } from "./LegacyDropdown";
import { Button } from "../Button";

/**
 * LegacyDropdown component using a custom positioning engine.
 *
 * Provides a menu that appears on click. Supports keyboard navigation.
 *
 * @example
 * ```tsx
 * <LegacyDropdown trigger={<Button>Open Menu</Button>}>
 *   <LegacyDropdownItem>Profile</LegacyDropdownItem>
 *   <LegacyDropdownItem>Settings</LegacyDropdownItem>
 *   <LegacyDropdownItem variant="danger">Logout</LegacyDropdownItem>
 * </LegacyDropdown>
 * ```
 */
const meta = {
    title: "Atoms/LegacyDropdown",
    component: LegacyDropdown,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        placement: {
            control: "select",
            options: ["bottom-start", "bottom-end", "top-start", "top-end"],
            description: "Dropdown placement",
            table: {
                defaultValue: { summary: "bottom-start" },
            },
        },
    },
} satisfies Meta<typeof LegacyDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const MenuContent = () => (
    <>
        <LegacyDropdownItem>Profile</LegacyDropdownItem>
        <LegacyDropdownItem>Settings</LegacyDropdownItem>
        <div class="h-px bg-ui-border my-1" />
        <LegacyDropdownItem variant="danger">Logout</LegacyDropdownItem>
    </>
);

export const Default: Story = {
    render: (args: Story["args"]) => (
        <LegacyDropdown trigger={<Button>Open Menu</Button>} {...args}>
            <MenuContent />
        </LegacyDropdown>
    ),
};

export const Placements: Story = {
    render: () => (
        <div class="flex gap-8 p-12">
            <LegacyDropdown
                trigger={<Button>Bottom Start</Button>}
                placement="bottom-start"
            >
                <MenuContent />
            </LegacyDropdown>
            <LegacyDropdown
                trigger={<Button>Top Start</Button>}
                placement="top-start"
            >
                <MenuContent />
            </LegacyDropdown>
        </div>
    ),
};
