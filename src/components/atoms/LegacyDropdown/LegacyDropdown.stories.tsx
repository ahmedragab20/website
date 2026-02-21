import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { LegacyDropdown } from "./LegacyDropdown";
import { Button } from "../Button";

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
        closeOnOutsideClick: {
            control: "boolean",
            description: "Close when clicking outside",
        },
    },
} satisfies Meta<typeof LegacyDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const MenuContent = () => (
    <div class="flex flex-col p-1">
        <button class="text-left w-full px-2 py-1.5 text-sm hover:bg-ui-active rounded">
            Profile
        </button>
        <button class="text-left w-full px-2 py-1.5 text-sm hover:bg-ui-active rounded">
            Settings
        </button>
        <div class="h-px bg-ui-border my-1" />
        <button class="text-left w-full px-2 py-1.5 text-sm text-error hover:bg-ui-active rounded">
            Logout
        </button>
    </div>
);

export const Default: Story = {
    args: {
        trigger: <Button>Open Menu</Button>,
        children: <MenuContent />,
    },
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

export const Controlled: Story = {
    render: (args: any) => {
        // Pseudo-controlled for storybook (args usually passed down)
        return (
            <LegacyDropdown
                trigger={<Button>Controlled</Button>}
                placement="bottom-start"
                {...args}
            >
                <div>
                    <div class="p-2">Content</div>
                </div>
            </LegacyDropdown>
        );
    },
    args: {
        open: true,
        closeOnOutsideClick: false,
    },
};
