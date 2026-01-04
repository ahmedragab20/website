import type { Meta, StoryObj } from "storybook-solidjs-vite";
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
} from "./Modal";
import { createSignal } from "solid-js";
import { fn } from "storybook/test";
import { Button } from "../Button";

/**
 * Modal component for displaying content in a layer above the page.
 *
 * Provides a container with structured sub-components: Header, Title, Body, and Footer.
 * Use modals for confirming actions, displaying complex forms, or showing detailed information.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen()} onClose={onClose}>
 *   <ModalHeader>
 *     <ModalTitle>Modal Title</ModalTitle>
 *   </ModalHeader>
 *   <ModalBody>
 *     <p>Modal content</p>
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button onClick={onClose}>Close</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
const meta = {
    title: "Atoms/Modal",
    component: Modal,
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl", "full"],
            description: "Size of the modal",
            table: {
                defaultValue: { summary: "md" },
            },
        },
        closeOnOutsideClick: {
            control: "boolean",
            description: "Whether to close the modal when clicking outside",
            table: {
                defaultValue: { summary: "false" },
            },
        },
    },
    args: {
        onClose: fn(),
        isOpen: false,
    },
    parameters: {
        layout: "center",
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for stories
const ModalWrapper = (props: any) => {
    const [isOpen, setIsOpen] = createSignal(false);

    // Sync with controls if needed, but for interactive demo we manage internal state
    // We can use createEffect to sync props.isOpen if we wanted, but usually Storybook
    // controls toggle the prop. However, Modal needs internal or external state to show.
    // Use the prop 'isOpen' from args to control initial state or override?
    // Better: let the user click the button.

    return (
        <div>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                {...props}
                isOpen={isOpen()}
                onClose={() => {
                    setIsOpen(false);
                    props.onClose?.();
                }}
            >
                <ModalHeader>
                    <ModalTitle>Modal Title</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p class="text-fg-main mb-4">
                        This is a modal dialog built with the native
                        &lt;dialog&gt; element.
                    </p>
                    <p class="text-fg-muted text-sm">
                        It is accessible and handles focus management
                        automatically.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="text" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsOpen(false)}>Confirm</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export const Default: Story = {
    render: (args: Story["args"]) => <ModalWrapper {...args} />,
    args: {
        size: "md",
        closeOnOutsideClick: true,
    },
};

export const Large: Story = {
    render: (args: Story["args"]) => <ModalWrapper {...args} />,
    args: {
        size: "lg",
        closeOnOutsideClick: true,
    },
};

export const Persistent: Story = {
    render: (args: Story["args"]) => <ModalWrapper {...args} />,
    args: {
        closeOnOutsideClick: false,
    },
    parameters: {
        docs: {
            description: {
                story: "Persistent modal effectively forces the user to choose an action.",
            },
        },
    },
};
