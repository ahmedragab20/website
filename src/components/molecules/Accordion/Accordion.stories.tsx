import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "./Accordion";

const ChevronDown = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4 h-4 shrink-0 text-fg-muted"
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/**
 * Accordion component built with native `<details>` and `<summary>` elements.
 *
 * Supports single and multiple expansion modes, controlled and uncontrolled state,
 * and full keyboard navigation. Uses CSS-only styling with no animations for instant feedback.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Question?</AccordionTrigger>
 *     <AccordionContent>Answer.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
const meta = {
    title: "Molecules/Accordion",
    component: Accordion,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
    argTypes: {
        type: {
            control: "radio",
            options: ["single", "multiple"],
            description:
                "Determines whether one or multiple items can be opened at the same time.",
            table: {
                defaultValue: { summary: "single" },
            },
        },
        collapsible: {
            control: "boolean",
            description:
                "When type is 'single', allows closing content when clicking trigger for an open item.",
        },
        disabled: {
            control: "boolean",
            description:
                "When true, prevents the user from interacting with the accordion.",
        },
        onValueChange: {
            control: false,
            description: "Callback fired when the accordion value changes.",
        },
    },
    args: {
        onValueChange: fn(),
    },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args: Story["args"]) => (
        <Accordion {...args} class="w-150">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    Is it accessible?
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern and uses
                    semantic HTML elements.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    Is it styled?
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that match the design
                    system's aesthetic.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    Can I customize it?
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    Yes. You can customize the styling using Tailwind classes
                    and control the behavior with props.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    args: {
        type: "single",
        collapsible: true,
        defaultValue: "item-1",
    },
    parameters: {
        docs: {
            description: {
                story: "Default accordion in single mode with one item open by default. Click any item to expand it, and click again to collapse (collapsible mode).",
            },
        },
    },
};

export const MultipleOpen: Story = {
    render: (args: Story["args"]) => (
        <Accordion {...args} class="w-150">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    First Item
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    This is the first item's content. In multiple mode, you can
                    have several items open simultaneously.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    Second Item
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    This is the second item's content. Notice how both items can
                    remain open at the same time.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    Third Item
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    This is the third item's content. All three can be open
                    together in multiple mode.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    args: {
        type: "multiple",
        defaultValue: ["item-1", "item-2"],
    },
    parameters: {
        docs: {
            description: {
                story: "Accordion in multiple mode allows several items to be open at the same time. This is useful for FAQ sections where users may want to compare multiple answers.",
            },
        },
    },
};

export const DisabledItem: Story = {
    render: (args: Story["args"]) => (
        <Accordion {...args} class="w-150">
            <AccordionItem value="item-1" disabled>
                <AccordionTrigger>
                    Disabled Item
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    This content cannot be accessed because the item is
                    disabled.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    Enabled Item
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    This content can be accessed normally. Try clicking the
                    disabled item above - it won't respond.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    args: {
        type: "single",
        collapsible: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Individual accordion items can be disabled. Disabled items have reduced opacity and cannot be interacted with. The aria-disabled attribute is set for accessibility.",
            },
        },
    },
};

export const NonCollapsible: Story = {
    render: (args: Story["args"]) => (
        <Accordion {...args} class="w-150">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    Always One Open
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    In non-collapsible single mode, at least one item must
                    always be open.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    Click to Switch
                    <ChevronDown />
                </AccordionTrigger>
                <AccordionContent>
                    Clicking another item will close the currently open item and
                    open the new one.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
    args: {
        type: "single",
        collapsible: false,
        defaultValue: "item-1",
    },
    parameters: {
        docs: {
            description: {
                story: "When collapsible is false in single mode, one item must always remain open. Clicking the open item won't close it.",
            },
        },
    },
};
