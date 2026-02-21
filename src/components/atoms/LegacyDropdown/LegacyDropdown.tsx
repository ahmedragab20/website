import {
    createSignal,
    createUniqueId,
    Show,
    splitProps,
    type JSX,
    type Component,
    onCleanup,
    onMount,
} from "solid-js";
import { Portal } from "solid-js/web";
import { tv } from "tailwind-variants";
import { usePopoverPosition } from "../../hooks/usePopoverPosition";

const dropdown = tv({
    base: "fixed z-50 min-w-[200px] overflow-auto max-h-[97svh] rounded-lg border border-ui-border bg-secondary p-1 shadow-lg text-fg-main",
    variants: {
        visible: {
            true: "opacity-100",
            false: "opacity-0 pointer-events-none",
        },
        size: {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
        },
    },
    defaultVariants: {
        visible: false,
        size: "md",
    },
});

export interface LegacyDropdownProps {
    /**
     * The element that triggers the dropdown.
     */
    trigger: JSX.Element;
    /**
     * The content of the dropdown menu.
     */
    children: JSX.Element;
    /**
     * The preferred placement of the dropdown.
     * @default "bottom-start"
     */
    placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
    /**
     * The size of the dropdown.
     */
    size?: "sm" | "md" | "lg";
    /**
     * Additional classes for the dropdown content.
     */
    class?: string;
    /**
     * Aria label.
     */
    "aria-label"?: string;
    /**
     * Controlled open state.
     */
    open?: boolean;
    /**
     * Callback when open state changes.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Close on click outside.
     * @default true
     */
    closeOnOutsideClick?: boolean;
}

export const LegacyDropdown: Component<LegacyDropdownProps> = (props) => {
    const [local, others] = splitProps(props, [
        "trigger",
        "children",
        "placement",
        "size",
        "class",
        "open",
        "onOpenChange",
        "closeOnOutsideClick",
    ]);

    const [isOpenState, setIsOpenState] = createSignal(false);
    const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [popoverRef, setPopoverRef] = createSignal<HTMLElement>();

    // Derived open state
    const isOpen = () => local.open ?? isOpenState();

    const placement = () => local.placement ?? "bottom-start";
    const closeOnOutsideClick = () => local.closeOnOutsideClick ?? true;

    const toggle = () => {
        const next = !isOpen();
        setIsOpenState(next);
        local.onOpenChange?.(next);
    };

    const close = () => {
        setIsOpenState(false);
        local.onOpenChange?.(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (!isOpen() || !closeOnOutsideClick()) return;

        const trigger = triggerRef();
        const popover = popoverRef();
        const target = e.target as Node;

        if (trigger?.contains(target) || popover?.contains(target)) {
            return;
        }

        close();
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
        if (!isOpen()) return;
        if (e.key === "Escape") {
            close();
        }
    };

    const handleTriggerKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            toggle();
        }
    };

    onMount(() => {
        if (typeof window !== "undefined") {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleDocumentKeyDown);
        }
    });

    onCleanup(() => {
        if (typeof window !== "undefined") {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleDocumentKeyDown);
        }
    });

    const dropdownId = `dropdown-${createUniqueId()}`;
    const triggerId = `trigger-${createUniqueId()}`;

    usePopoverPosition({
        triggerRef,
        popoverRef,
        placement,
        isOpen,
        spacing: 4,
    });

    return (
        <>
            <div
                ref={setTriggerRef}
                id={triggerId}
                class="inline-block"
                onClick={toggle}
                onKeyDown={handleTriggerKeyDown}
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={isOpen()}
                aria-controls={isOpen() ? dropdownId : undefined}
                {...others}
            >
                {local.trigger}
            </div>
            <Show when={isOpen() || popoverRef()}>
                <Portal>
                    <div
                        ref={setPopoverRef}
                        id={dropdownId}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby={triggerId}
                        data-dropdown-popover=""
                        data-dropdown-placement={placement()}
                        style={{
                            top: "var(--popover-top)",
                            left: "var(--popover-left)",
                            right: "var(--popover-right)",
                            bottom: "var(--popover-bottom)",
                        }}
                        class={dropdown({
                            size: local.size,
                            visible: isOpen(),
                            class: local.class,
                        })}
                    >
                        {local.children}
                    </div>
                </Portal>
            </Show>
        </>
    );
};
