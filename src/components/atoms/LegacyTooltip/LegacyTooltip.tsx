import {
    createSignal,
    createUniqueId,
    Show,
    splitProps,
    type JSX,
    type Component,
    onCleanup,
    type ParentProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { tv } from "tailwind-variants";
import {
    usePopoverPosition,
    type Placement,
} from "../../hooks/usePopoverPosition";

const tooltip = tv({
    base: "fixed z-50 rounded px-3 py-2 text-sm font-medium shadow-lg transition-opacity duration-200 border border-ui-border bg-tertiary text-fg-main max-w-xs",
    variants: {
        visible: {
            true: "opacity-100",
            false: "opacity-0 pointer-events-none",
        },
        placement: {
            top: "",
            "top-start": "",
            "top-end": "",
            bottom: "",
            "bottom-start": "",
            "bottom-end": "",
            left: "",
            "left-start": "",
            "left-end": "",
            right: "",
            "right-start": "",
            "right-end": "",
        },
    },
    defaultVariants: {
        visible: false,
        placement: "top",
    },
});

export interface LegacyTooltipProps extends ParentProps {
    /**
     * The content to display inside the tooltip.
     */
    content: JSX.Element | string;
    /**
     * The preferred placement of the tooltip.
     * @default "top"
     */
    placement?: Placement;
    /**
     * Additional classes for the tooltip content.
     */
    class?: string;
    /**
     * Aria label.
     */
    "aria-label"?: string;
    /**
     * Delay in milliseconds before showing the tooltip.
     * @default 0
     */
    delay?: number;
    /**
     * Controlled open state.
     */
    open?: boolean;
    /**
     * Callback when open state changes.
     */
    onOpenChange?: (open: boolean) => void;
}

export const LegacyTooltip: Component<LegacyTooltipProps> = (props) => {
    const [local, others] = splitProps(props, [
        "children",
        "content",
        "placement",
        "class",
        "open",
        "onOpenChange",
        "delay",
    ]);

    const [isOpenState, setIsOpenState] = createSignal(false);
    const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [popoverRef, setPopoverRef] = createSignal<HTMLElement>();

    // Derived open state (controlled or uncontrolled)
    const isOpen = () => local.open ?? isOpenState();

    const placement = () => local.placement ?? "top";
    const delay = () => local.delay ?? 0;

    let showTimeout: number | undefined;

    const clearTimeouts = () => {
        if (typeof window !== "undefined") {
            window.clearTimeout(showTimeout);
        }
    };

    const handleMouseEnter = () => {
        clearTimeouts();
        const currentDelay = delay();
        showTimeout = window.setTimeout(() => {
            setIsOpenState(true);
            local.onOpenChange?.(true);
        }, currentDelay);
    };

    const handleMouseLeave = () => {
        clearTimeouts();
        setIsOpenState(false);
        local.onOpenChange?.(false);
    };

    const handleFocus = () => {
        clearTimeouts();
        setIsOpenState(true);
        local.onOpenChange?.(true);
    };

    const handleBlur = () => {
        clearTimeouts();
        setIsOpenState(false);
        local.onOpenChange?.(false);
    };

    onCleanup(() => {
        clearTimeouts();
    });

    const tooltipId = `tooltip-${createUniqueId()}`;

    usePopoverPosition({
        triggerRef,
        popoverRef,
        placement,
        isOpen,
        spacing: 8,
    });

    return (
        <>
            <div
                ref={setTriggerRef}
                class={`inline-block ${local.class || ""}`.trim()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-describedby={isOpen() ? tooltipId : undefined}
                data-testid="tooltip-trigger"
                {...others}
            >
                {local.children}
            </div>
            <Show when={isOpen() || popoverRef()}>
                <Portal>
                    <div
                        ref={setPopoverRef}
                        id={tooltipId}
                        role="tooltip"
                        data-tooltip-popover=""
                        data-tooltip-placement={placement()}
                        style={{
                            top: "var(--popover-top)",
                            left: "var(--popover-left)",
                            right: "var(--popover-right)",
                            bottom: "var(--popover-bottom)",
                        }}
                        class={tooltip({
                            placement: placement(),
                            visible: isOpen(),
                            class: local.class,
                        })}
                    >
                        {local.content}
                    </div>
                </Portal>
            </Show>
        </>
    );
};
