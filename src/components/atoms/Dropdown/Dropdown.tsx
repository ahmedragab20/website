import {
    splitProps,
    type JSX,
    createSignal,
    onMount,
    onCleanup,
    createContext,
    useContext,
    createUniqueId,
    type ParentProps,
} from "solid-js";
import { tv } from "tailwind-variants";
import {
    usePopoverPosition,
    supportsAnchorPositioning,
    type Placement as PopoverPlacement,
} from "../../hooks/usePopoverPosition";

// CSS for anchor positioning (only used when supported)
const anchorPositioningCSS = `
[data-dropdown-anchor] {
    position: fixed;
}

[data-dropdown-placement="bottom-start"][data-dropdown-anchor] {
    position-anchor: var(--dropdown-anchor-name);
    top: anchor(var(--dropdown-anchor-name) bottom) + 8px;
    left: anchor(var(--dropdown-anchor-name) left);
}

[data-dropdown-placement="bottom-end"][data-dropdown-anchor] {
    position-anchor: var(--dropdown-anchor-name);
    top: anchor(var(--dropdown-anchor-name) bottom) + 8px;
    right: calc(100vw - anchor(var(--dropdown-anchor-name) right));
}

[data-dropdown-placement="top-start"][data-dropdown-anchor] {
    position-anchor: var(--dropdown-anchor-name);
    bottom: calc(100vh - anchor(var(--dropdown-anchor-name) top) + 8px);
    left: anchor(var(--dropdown-anchor-name) left);
}

[data-dropdown-placement="top-end"][data-dropdown-anchor] {
    position-anchor: var(--dropdown-anchor-name);
    bottom: calc(100vh - anchor(var(--dropdown-anchor-name) top) + 8px);
    right: calc(100vw - anchor(var(--dropdown-anchor-name) right));
}
`;

const dropdown = tv({
    base: "overflow-auto max-h-[97svh] rounded-lg bg-secondary border border-ui-border shadow-lg min-w-[200px] p-1 z-50",
    variants: {
        size: {
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
        },
    },
    defaultVariants: {
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

type DropdownContextValue = {
    popoverId: string;
    isOpen: () => boolean;
};

const DropdownContext = createContext<DropdownContextValue>();

export interface DropdownItemProps {
    children: JSX.Element;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "default" | "danger";
    class?: string;
    "aria-label"?: string;
}

export interface DropdownProps extends ParentProps {
    trigger: JSX.Element;
    size?: "sm" | "md" | "lg";
    placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
    class?: string;
    "aria-label"?: string;
    onOpenChange?: (open: boolean) => void;
}

export function DropdownItem(props: DropdownItemProps) {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error("DropdownItem must be used within Dropdown");
    }

    const [local, others] = splitProps(props, [
        "children",
        "onClick",
        "disabled",
        "variant",
        "class",
    ]);

    const handleClick = () => {
        if (typeof document === "undefined") return;
        if (!local.disabled) {
            local.onClick?.();
            const popover = document.getElementById(
                context.popoverId
            ) as HTMLElement;
            if (popover && typeof popover.hidePopover === "function") {
                popover.hidePopover();
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (typeof document === "undefined") return;
        if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
            e.preventDefault();
            local.onClick?.();
            const popover = document.getElementById(
                context.popoverId
            ) as HTMLElement;
            if (popover && typeof popover.hidePopover === "function") {
                popover.hidePopover();
            }
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

export function Dropdown(props: DropdownProps) {
    const [local] = splitProps(props, [
        "trigger",
        "children",
        "size",
        "placement",
        "class",
        "onOpenChange",
    ]);

    const popoverId = createUniqueId();
    const [isOpen, setIsOpen] = createSignal(false);
    const placement = () => local.placement || "bottom-start";
    const supportsAnchor = supportsAnchorPositioning();
    const anchorName = `--dropdown-anchor-${popoverId}`;
    let styleElement: HTMLStyleElement | undefined;

    let triggerRef: HTMLElement | undefined;
    let popoverRef: HTMLDivElement | undefined;

    const setTriggerRef = (el: HTMLElement | undefined) => {
        triggerRef = el;
        if (el) {
            el.setAttribute("popoverTarget", popoverId);
            el.setAttribute("popoverTargetAction", "toggle");
            if (supportsAnchor) {
                (el.style as any).anchorName = anchorName;
                (el.style as any).setProperty(
                    "--dropdown-anchor-name",
                    anchorName
                );
            }
        }
    };

    const setPopoverRef = (el: HTMLDivElement | undefined) => {
        popoverRef = el;
    };

    // Use JS positioning as fallback when CSS Anchor Positioning is not supported
    if (!supportsAnchor) {
        usePopoverPosition({
            triggerRef: () => triggerRef,
            popoverRef: () => popoverRef,
            placement: () => placement() as PopoverPlacement,
            isOpen,
            spacing: 8,
        });
    }

    const handleClick = () => {
        if (typeof window === "undefined") return;
        if (popoverRef && typeof popoverRef.togglePopover === "function") {
            popoverRef.togglePopover();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (typeof window === "undefined") return;
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            handleClick();
        }
    };

    const handleToggle = (e: ToggleEvent) => {
        setIsOpen(e.newState === "open");
        local.onOpenChange?.(e.newState === "open");
    };

    const handleEscape = (e: KeyboardEvent) => {
        if (typeof window === "undefined") return;
        if (e.key === "Escape" && isOpen() && popoverRef) {
            popoverRef.hidePopover();
            setIsOpen(false);
            local.onOpenChange?.(false);
        }
    };

    onMount(() => {
        if (typeof window === "undefined" || typeof document === "undefined")
            return;

        if (popoverRef) {
            popoverRef.addEventListener(
                "toggle",
                handleToggle as EventListener
            );
        }
        document.addEventListener("keydown", handleEscape);

        // Inject anchor positioning CSS if supported
        if (
            supportsAnchor &&
            !document.getElementById("dropdown-anchor-styles")
        ) {
            styleElement = document.createElement("style");
            styleElement.id = "dropdown-anchor-styles";
            styleElement.textContent = anchorPositioningCSS;
            document.head.appendChild(styleElement);
        }
    });

    onCleanup(() => {
        if (typeof window === "undefined") return;

        if (popoverRef) {
            popoverRef.removeEventListener(
                "toggle",
                handleToggle as EventListener
            );
        }
        document.removeEventListener("keydown", handleEscape);
    });

    const contextValue: DropdownContextValue = {
        popoverId: popoverId,
        isOpen,
    };

    // Generate styles for popover
    const getPopoverStyles = () => {
        if (!supportsAnchor) {
            return {
                position: "fixed" as const,
                top: "var(--popover-top, auto)",
                bottom: "var(--popover-bottom, auto)",
                left: "var(--popover-left, auto)",
                right: "var(--popover-right, auto)",
            };
        }

        return {
            "--dropdown-anchor-name": anchorName,
        } as Record<string, string>;
    };

    return (
        <DropdownContext.Provider value={contextValue}>
            <div
                ref={setTriggerRef}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen()}
                aria-haspopup="true"
                style={{ display: "inline-block" }}
            >
                {local.trigger}
            </div>
            <div
                ref={setPopoverRef}
                id={popoverId}
                popover="auto"
                class={dropdown({
                    size: local.size,
                    class: local.class,
                })}
                role="menu"
                aria-orientation="vertical"
                data-dropdown-anchor={supportsAnchor ? "" : undefined}
                data-dropdown-placement={
                    supportsAnchor ? placement() : undefined
                }
                style={getPopoverStyles()}
            >
                {local.children}
            </div>
        </DropdownContext.Provider>
    );
}
