import { createEffect, splitProps, type ParentProps } from "solid-js";
import { tv, type VariantProps } from "tailwind-variants";
import "./Drawer.css";

const drawer = tv({
    base: "drawer-dialog flex-col shadow-xl p-0",
    variants: {
        placement: {
            right: "",
            left: "",
            top: "",
            bottom: "",
        },
        size: {
            sm: "",
            md: "",
            lg: "",
            xl: "",
            full: "",
        },
    },
    compoundVariants: [
        // Side placements (width control)
        { placement: ["left", "right"], size: "sm", class: "w-full max-w-sm" },
        { placement: ["left", "right"], size: "md", class: "w-full max-w-md" },
        { placement: ["left", "right"], size: "lg", class: "w-full max-w-lg" },
        { placement: ["left", "right"], size: "xl", class: "w-full max-w-2xl" },
        {
            placement: ["left", "right"],
            size: "full",
            class: "w-full max-w-[100vw]",
        },

        // Vertical placements (height control)
        {
            placement: ["top", "bottom"],
            size: "sm",
            class: "h-auto max-h-[30vh]",
        },
        {
            placement: ["top", "bottom"],
            size: "md",
            class: "h-auto max-h-[50vh]",
        },
        {
            placement: ["top", "bottom"],
            size: "lg",
            class: "h-auto max-h-[70vh]",
        },
        {
            placement: ["top", "bottom"],
            size: "xl",
            class: "h-auto max-h-[90vh]",
        },
        {
            placement: ["top", "bottom"],
            size: "full",
            class: "h-full max-h-[100vh]",
        },
    ],
    defaultVariants: {
        placement: "right",
        size: "md",
    },
});

const drawerHeader = tv({
    base: "flex items-center justify-between p-6 border-b border-ui-border",
});

const drawerTitle = tv({
    base: "text-lg font-semibold text-fg-main",
});

const drawerBody = tv({
    base: "p-6 overflow-y-auto flex-grow",
});

const drawerFooter = tv({
    base: "flex items-center justify-end gap-4 p-6 border-t border-ui-border bg-secondary/50",
});

export interface DrawerProps extends ParentProps {
    isOpen: boolean;
    onClose: () => void;
    placement?: VariantProps<typeof drawer>["placement"];
    size?: VariantProps<typeof drawer>["size"];
    class?: string;
    closeOnOutsideClick?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
}

export function Drawer(props: DrawerProps) {
    const [local, others] = splitProps(props, [
        "children",
        "isOpen",
        "onClose",
        "placement",
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

    const handleBackdropClick = (e: MouseEvent) => {
        e.stopPropagation();

        if (local.closeOnOutsideClick === false || !dialogRef) return;

        if (e.target === dialogRef) {
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
            class={drawer({
                placement: local.placement,
                size: local.size,
                class: local.class,
            })}
            data-placement={local.placement || "right"}
            onClose={handleCloseEvent}
            onClick={handleBackdropClick}
            {...others}
        >
            {local.children}
        </dialog>
    );
}

export interface DrawerHeaderProps extends ParentProps {
    class?: string;
}

export function DrawerHeader(props: DrawerHeaderProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <header class={drawerHeader({ class: local.class })} {...others}>
            {local.children}
        </header>
    );
}

export interface DrawerTitleProps extends ParentProps {
    class?: string;
    id?: string;
}

export function DrawerTitle(props: DrawerTitleProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <h2 class={drawerTitle({ class: local.class })} {...others}>
            {local.children}
        </h2>
    );
}

export interface DrawerBodyProps extends ParentProps {
    class?: string;
}

export function DrawerBody(props: DrawerBodyProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <div class={drawerBody({ class: local.class })} {...others}>
            {local.children}
        </div>
    );
}

export interface DrawerFooterProps extends ParentProps {
    class?: string;
}

export function DrawerFooter(props: DrawerFooterProps) {
    const [local, others] = splitProps(props, ["children", "class"]);
    return (
        <footer class={drawerFooter({ class: local.class })} {...others}>
            {local.children}
        </footer>
    );
}
