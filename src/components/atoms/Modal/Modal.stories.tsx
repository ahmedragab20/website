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

const ModalWrapper = (props: any) => {
    const [isOpen, setIsOpen] = createSignal(false);

    return (
        <div class="p-24 flex justify-center items-center">
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
