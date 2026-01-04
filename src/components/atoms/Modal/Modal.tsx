import { createEffect, splitProps, type ParentProps } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";
import "./Modal.css";

const modal = tv({
    base: "modal-dialog flex-col rounded-lg shadow-xl p-0 max-w-lg w-full m-auto",
    variants: {
        size: {
            sm: "max-w-sm",
            md: "max-w-lg", // Default
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            full: "max-w-[95vw] h-[95vh]",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

const modalHeader = tv({
    base: "flex items-center justify-between p-6 border-b border-ui-border",
});

const modalTitle = tv({
    base: "text-lg font-semibold text-fg-main",
});

const modalBody = tv({
    base: "p-6 overflow-y-auto max-h-[70vh] flex-grow",
});

const modalFooter = tv({
    base: "flex items-center justify-end gap-4 p-6 border-t border-ui-border bg-secondary/50",
});

export interface ModalProps extends ParentProps {
    isOpen: boolean;
    onClose: () => void;
    size?: VariantProps<typeof modal>["size"];
    class?: string;
    closeOnOutsideClick?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
}

export function Modal(props: ModalProps) {
    const [local, others] = splitProps(props, [
        "children",
        "isOpen",
        "onClose",
        "size",
        "class",
        "closeOnOutsideClick",
    ]);

    let dialogRef: HTMLDialogElement | undefined;

    // Handle opening/closing based on isOpen prop
    createEffect(() => {
        if (!dialogRef) return;

        const dialog = dialogRef;
        if (local.isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    });

    // Handle interactions
    const handleMouseDown = (e: MouseEvent) => {
        if (local.closeOnOutsideClick === false || !dialogRef) return;

        // Check if click is outside the dialog (on the backdrop)
        // When clicking backdrop, the target is the dialog itself
        if (e.target === dialogRef) {
            // Check bounding rect to be sure (target check is usually enough for dialog)
            const rect = dialogRef.getBoundingClientRect();
            const isInDialog =
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width;

            if (!isInDialog) {
                local.onClose();
            }
        }
    };

    const handleCloseEvent = () => {
        // Sync external state if dialog closes natively (e.g. Esc)
        if (local.isOpen) {
            local.onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            class={modal({ size: local.size, class: local.class })}
            onClose={handleCloseEvent}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
            {...others}
        >
            {local.children}
        </dialog>
    );
}

export interface ModalHeaderProps extends ParentProps {
    class?: string;
}

export function ModalHeader(props: ModalHeaderProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <header class={modalHeader({ class: local.class })} {...others}>
            {local.children}
        </header>
    );
}

export interface ModalTitleProps extends ParentProps {
    class?: string;
    id?: string;
}

export function ModalTitle(props: ModalTitleProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <h2 class={modalTitle({ class: local.class })} {...others}>
            {local.children}
        </h2>
    );
}

export interface ModalBodyProps extends ParentProps {
    class?: string;
}

export function ModalBody(props: ModalBodyProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <div class={modalBody({ class: local.class })} {...others}>
            {local.children}
        </div>
    );
}

export interface ModalFooterProps extends ParentProps {
    class?: string;
}

export function ModalFooter(props: ModalFooterProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <footer class={modalFooter({ class: local.class })} {...others}>
            {local.children}
        </footer>
    );
}
