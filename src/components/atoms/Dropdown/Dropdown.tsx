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
import {
    generateAnchorCSS,
    injectStyles,
} from "../../../utils/style/anchor-positioning";
import { tv } from "tailwind-variants";

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
    const anchorName = `--dropdown-anchor-${popoverId}`;

    let popoverRef: HTMLDivElement | undefined;

    const handleClick = (_: MouseEvent) => {
        if (typeof document === "undefined") return;
        popoverRef?.togglePopover();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (typeof document === "undefined") return;
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            popoverRef?.togglePopover();
        }
    };

    const handleToggle = (e: ToggleEvent) => {
        setIsOpen(e.newState === "open");
        local.onOpenChange?.(e.newState === "open");
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

        const css = generateAnchorCSS({
            namespace: "dropdown",
            baseStyles: "width: max-content;",
        });
        injectStyles("dropdown-anchor-styles", css);
    });

    onCleanup(() => {
        if (typeof window === "undefined") return;

        if (popoverRef) {
            popoverRef.removeEventListener(
                "toggle",
                handleToggle as EventListener
            );
        }
    });

    const contextValue: DropdownContextValue = {
        popoverId: popoverId,
        isOpen,
    };

    return (
        <DropdownContext.Provider value={contextValue}>
            <div
                style={{ "anchor-name": anchorName, display: "inline-block" }}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={isOpen()}
            >
                {local.trigger}
            </div>
            <div
                ref={(el) => (popoverRef = el)}
                id={popoverId}
                popover="auto"
                class={dropdown({
                    size: local.size,
                    class: local.class,
                })}
                role="menu"
                aria-orientation="vertical"
                data-dropdown-popover=""
                data-dropdown-placement={placement()}
                style={{ "--dropdown-anchor-name": anchorName }}
            >
                {local.children}
            </div>
        </DropdownContext.Provider>
    );
}
