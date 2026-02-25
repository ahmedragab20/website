import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { LegacyTooltip } from "./LegacyTooltip";
import { Button } from "../Button";

/**
 * LegacyTooltip component using a custom positioning engine.
 *
 * Provides a text label that appears on hover or focus.
 *
 * @example
 * ```tsx
 * <LegacyTooltip content="Additional information">
 *   <Button>Hover me</Button>
 * </LegacyTooltip>
 * ```
 */
const meta = {
    title: "Atoms/LegacyTooltip",
    component: LegacyTooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        placement: {
            control: "select",
            options: [
                "top",
                "bottom",
                "left",
                "right",
                "top-start",
                "top-end",
                "bottom-start",
                "bottom-end",
            ],
            description: "Tooltip placement",
            table: {
                defaultValue: { summary: "top" },
            },
        },
        delay: {
            control: "number",
            description: "Delay before showing tooltip in ms",
        },
    },
} satisfies Meta<typeof LegacyTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        content: "This is a tooltip",
        children: <Button>Hover me</Button>,
    },
};

export const Placements: Story = {
    render: () => (
        <div class="grid grid-cols-2 gap-8 p-12">
            <LegacyTooltip content="Top tooltip" placement="top">
                <Button>Top</Button>
            </LegacyTooltip>
            <LegacyTooltip content="Bottom tooltip" placement="bottom">
                <Button>Bottom</Button>
            </LegacyTooltip>
            <LegacyTooltip content="Left tooltip" placement="left">
                <Button>Left</Button>
            </LegacyTooltip>
            <LegacyTooltip content="Right tooltip" placement="right">
                <Button>Right</Button>
            </LegacyTooltip>
        </div>
    ),
};

export const WithDelay: Story = {
    args: {
        content: "Delayed tooltip",
        delay: 500,
        children: <Button>Hover (500ms delay)</Button>,
        placement: "bottom",
    },
};

export const LongContent: Story = {
    args: {
        content: (
            <div class="max-w-[200px] text-center">
                This needs to be informative and helpful to the user.
            </div>
        ),
        children: <Button>Long Content</Button>,
        placement: "right",
    },
};
