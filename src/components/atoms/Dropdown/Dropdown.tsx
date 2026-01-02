import {
    splitProps,
    type JSX,
    createSignal,
    onMount,
    onCleanup,
    createContext,
    useContext,
    createEffect,
    type ParentProps,
} from "solid-js";
import { tv } from "tailwind-variants";

const dropdown = tv({
    base: "rounded-lg bg-secondary border border-ui-border shadow-lg min-w-[200px] p-1 z-50",
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

    const popoverId = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
    const [isOpen, setIsOpen] = createSignal(false);
    const placement = () => local.placement || "bottom-start";

    let triggerRef: HTMLElement | undefined;
    let popoverRef: HTMLDivElement | undefined;

    const setTriggerRef = (el: HTMLElement | undefined) => {
        triggerRef = el;
        if (el) {
            el.setAttribute("popoverTarget", popoverId);
            el.setAttribute("popoverTargetAction", "toggle");
        }
    };

    const setPopoverRef = (el: HTMLDivElement | undefined) => {
        popoverRef = el;
    };

    const updatePosition = () => {
        if (!triggerRef || !popoverRef) return;

        const triggerRect = triggerRef.getBoundingClientRect();
        const popoverRect = popoverRef.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spacing = 8;

        const place = placement();
        let pos: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
        } = {};

        // Calculate initial position based on placement
        if (place.startsWith("bottom")) {
            pos.top = `${triggerRect.bottom + spacing}px`;
            if (place === "bottom-start") {
                pos.left = `${triggerRect.left}px`;
            } else {
                pos.right = `${viewportWidth - triggerRect.right}px`;
            }
        } else {
            pos.bottom = `${viewportHeight - triggerRect.top + spacing}px`;
            if (place === "top-start") {
                pos.left = `${triggerRect.left}px`;
            } else {
                pos.right = `${viewportWidth - triggerRect.right}px`;
            }
        }

        // Adjust for horizontal viewport boundaries
        const computedLeft = place.endsWith("start")
            ? triggerRect.left
            : viewportWidth - triggerRect.right;
        const popoverWidth = popoverRect.width;

        if (computedLeft + popoverWidth > viewportWidth - spacing) {
            pos.left = `${viewportWidth - popoverWidth - spacing}px`;
            pos.right = undefined;
        }
        if (computedLeft < spacing) {
            pos.left = `${spacing}px`;
            pos.right = undefined;
        }

        // Adjust for vertical viewport boundaries
        const popoverHeight = popoverRect.height;

        if (place.startsWith("bottom")) {
            const top = triggerRect.bottom + spacing;
            if (top + popoverHeight > viewportHeight - spacing) {
                // Flip to top if there's not enough space below
                const newTop = triggerRect.top - popoverHeight - spacing;
                if (newTop >= spacing) {
                    pos.top = `${newTop}px`;
                    pos.bottom = undefined;
                } else {
                    // If flipping doesn't work, constrain to viewport
                    pos.top = `${spacing}px`;
                    pos.bottom = undefined;
                }
            }
        } else {
            const bottom = viewportHeight - triggerRect.top + spacing;
            if (bottom + popoverHeight > viewportHeight - spacing) {
                // Flip to bottom if there's not enough space above
                const newBottom =
                    viewportHeight -
                    triggerRect.bottom -
                    popoverHeight -
                    spacing;
                if (newBottom >= spacing) {
                    pos.bottom = `${newBottom}px`;
                    pos.top = undefined;
                } else {
                    // If flipping doesn't work, constrain to viewport
                    pos.bottom = `${spacing}px`;
                    pos.top = undefined;
                }
            }
        }

        // Apply CSS custom properties
        Object.entries(pos).forEach(([key, value]) => {
            if (value !== undefined) {
                popoverRef!.style.setProperty(`--dropdown-${key}`, value);
            } else {
                popoverRef!.style.removeProperty(`--dropdown-${key}`);
            }
        });
    };

    const handleClick = () => {
        if (popoverRef && typeof popoverRef.togglePopover === "function") {
            popoverRef.togglePopover();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            handleClick();
        }
    };

    const handleToggle = (e: ToggleEvent) => {
        setIsOpen(e.newState === "open");
        local.onOpenChange?.(e.newState === "open");
        if (e.newState === "open") {
            requestAnimationFrame(() => {
                updatePosition();
                requestAnimationFrame(updatePosition);
            });
        }
    };

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen() && popoverRef) {
            popoverRef.hidePopover();
            setIsOpen(false);
            local.onOpenChange?.(false);
        }
    };

    createEffect(() => {
        if (isOpen() && triggerRef && popoverRef) {
            updatePosition();
        }
    });

    onMount(() => {
        if (popoverRef) {
            popoverRef.addEventListener(
                "toggle",
                handleToggle as EventListener
            );
        }
        document.addEventListener("keydown", handleEscape);

        const handleResize = () => {
            if (isOpen() && triggerRef && popoverRef) {
                updatePosition();
            }
        };

        const handleScroll = () => {
            if (isOpen() && triggerRef && popoverRef) {
                updatePosition();
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, true);

        onCleanup(() => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll, true);
        });
    });

    onCleanup(() => {
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
                style={{
                    position: "fixed",
                    top: "var(--dropdown-top, auto)",
                    bottom: "var(--dropdown-bottom, auto)",
                    left: "var(--dropdown-left, auto)",
                    right: "var(--dropdown-right, auto)",
                }}
            >
                {local.children}
            </div>
        </DropdownContext.Provider>
    );
}
