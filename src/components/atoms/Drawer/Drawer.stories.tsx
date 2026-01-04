import { createSignal } from "solid-js";
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
    Drawer,
    DrawerHeader,
    DrawerTitle,
    DrawerBody,
    DrawerFooter,
} from "./Drawer";
import { Button } from "../Button";

/**
 * Drawer component that slides in from any side of the screen.
 *
 * Supports `right`, `left`, `top`, and `bottom` placements.
 * Handles backdrop clicks and Escape key to close.
 *
 * @example
 * ```tsx
 * <Drawer isOpen={isOpen()} onClose={onClose} placement="right">
 *   <DrawerHeader>
 *     <DrawerTitle>Title</DrawerTitle>
 *   </DrawerHeader>
 *   <DrawerBody>Content</DrawerBody>
 *   <DrawerFooter>Footer</DrawerFooter>
 * </Drawer>
 * ```
 */
const meta = {
    title: "Atoms/Drawer",
    component: Drawer,
    parameters: {
        layout: "centered",
        docs: {
            story: {
                height: "600px", // Give iframe some space
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        placement: {
            control: "select",
            options: ["top", "right", "bottom", "left"],
            description: "Direction from which the drawer slides in",
            table: {
                defaultValue: { summary: "right" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl", "full"],
            description:
                "Size (width for side drawers, height for top/bottom drawers)",
            table: {
                defaultValue: { summary: "md" },
            },
        },
        closeOnOutsideClick: {
            control: "boolean",
            description:
                "Whether to close the drawer when clicking the backdrop",
            table: {
                defaultValue: { summary: "true" },
            },
        },
    },
    args: {
        onClose: fn(),
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Template component for stories
const DrawerDemo = (args: Story["args"]) => {
    const [isOpen, setIsOpen] = createSignal(false);

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>
                Open {args!.placement || "Right"} Drawer
            </Button>
            <Drawer
                {...args}
                isOpen={isOpen()}
                onClose={() => {
                    setIsOpen(false);
                    args!.onClose?.();
                }}
            >
                <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                    <p class="mb-4 text-fg-main">
                        This is the content of the drawer. It slides in from the{" "}
                        <strong>{args!.placement || "right"}</strong>.
                    </p>
                    <p class="text-fg-muted">
                        You can put any content here, including forms, text, or
                        other components.
                    </p>
                    <div class="h-[800px] w-full bg-tertiary/20 mt-4 rounded border border-dashed border-ui-border flex items-center justify-center text-fg-muted">
                        Scrollable content area (800px)
                    </div>
                </DrawerBody>
                <DrawerFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                </DrawerFooter>
            </Drawer>
        </div>
    );
};

export const Default: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "right",
    },
};

export const Left: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "left",
    },
};

export const Top: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "top",
    },
};

export const Bottom: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "bottom",
    },
};

export const SizeSmall: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "right",
        size: "sm",
    },
};

export const SizeLarge: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "right",
        size: "lg",
    },
};

export const SizeFull: Story = {
    render: (args: Story["args"]) => <DrawerDemo {...args} />,
    args: {
        placement: "right",
        size: "full",
    },
};
