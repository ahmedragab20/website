import {
    createSignal,
    createUniqueId,
    Show,
    splitProps,
    type JSX,
    type Component,
    onCleanup,
    onMount,
    createContext,
    useContext,
    type ParentProps,
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

const dropdownItem = tv({
    base: "px-4 py-2 text-fg-main hover:bg-ui-active transition-colors cursor-pointer flex items-center gap-2 rounded-sm",
    variants: {
        disabled: {
            true: "opacity-50 cursor-not-allowed",
            false: "",
        },
        variant: {
            default: "",
            danger: "text-error hover:bg-error/20",
        },
    },
    defaultVariants: {
        disabled: false,
        variant: "default",
    },
});

type LegacyDropdownContextValue = {
    close: () => void;
    isOpen: () => boolean;
};

const LegacyDropdownContext = createContext<LegacyDropdownContextValue>();

export interface LegacyDropdownItemProps {
    children: JSX.Element;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "default" | "danger";
    class?: string;
    "aria-label"?: string;
}

export function LegacyDropdownItem(props: LegacyDropdownItemProps) {
    const context = useContext(LegacyDropdownContext);
    if (!context) {
        throw new Error(
            "LegacyDropdownItem must be used within LegacyDropdown"
        );
    }

    const [local, others] = splitProps(props, [
        "children",
        "onClick",
        "disabled",
        "variant",
        "class",
    ]);

    const handleClick = () => {
        if (!local.disabled) {
            local.onClick?.();
            context.close();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
            e.preventDefault();
            local.onClick?.();
            context.close();
        }
    };

    return (
        <div
            role="menuitem"
            tabIndex={local.disabled ? -1 : 0}
            class={dropdownItem({
                disabled: local.disabled,
                variant: local.variant,
                class: local.class,
            })}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-disabled={local.disabled}
            aria-label={others["aria-label"]}
            {...others}
        >
            {local.children}
        </div>
    );
}

export interface LegacyDropdownProps extends ParentProps {
    /**
     * The element that triggers the dropdown.
     */
    trigger: JSX.Element;
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
     * Callback when open state changes.
     */
    onOpenChange?: (open: boolean) => void;
}

export const LegacyDropdown: Component<LegacyDropdownProps> = (props) => {
    const [local, others] = splitProps(props, [
        "trigger",
        "children",
        "placement",
        "size",
        "class",
        "onOpenChange",
    ]);

    const [isOpen, setIsOpen] = createSignal(false);
    const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [popoverRef, setPopoverRef] = createSignal<HTMLElement>();

    const placement = () => local.placement ?? "bottom-start";

    const toggle = () => {
        const next = !isOpen();
        setIsOpen(next);
        local.onOpenChange?.(next);
    };

    const close = () => {
        setIsOpen(false);
        local.onOpenChange?.(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (!isOpen()) return;

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

    const contextValue: LegacyDropdownContextValue = {
        close,
        isOpen,
    };

    return (
        <LegacyDropdownContext.Provider value={contextValue}>
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
        </LegacyDropdownContext.Provider>
    );
};
