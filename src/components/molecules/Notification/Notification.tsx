/** eslint-disable solid/reactivity */
import {
    Show,
    createEffect,
    createSignal,
    createUniqueId,
    onCleanup,
    type JSX,
} from "solid-js";
import { tv } from "tailwind-variants";
import type { NotificationData } from "./types";
import { Button } from "../../atoms/Button";
import XMark from "../../icons/XMark";

interface NotificationProps {
    data: NotificationData;
    onDismiss?: () => void;
    onExpand?: () => void;
    onHeight?: (height: number) => void;
    stackIndex?: number;
    offset?: number;
    isExpanded?: boolean;
    closeIcon?: JSX.Element;
}

const notificationStyles = tv({
    base: [
        "absolute bottom-0 w-full rounded-xl overflow-hidden",
        "border shadow-lg",
        "cursor-pointer select-none",
        "transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:shadow-xl focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-accent focus-visible:outline-offset-2",
    ],
    variants: {
        variant: {
            accent: "bg-secondary border-ui-border [&_h4]:text-accent [&_p]:text-fg-muted",
            success:
                "bg-secondary border-success/30 [&_h4]:text-success [&_p]:text-fg-muted",
            warning:
                "bg-secondary border-warning/30 [&_h4]:text-warning [&_p]:text-fg-muted",
            error: "bg-secondary border-error/30 [&_h4]:text-error [&_p]:text-fg-muted",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const progressBarStyles = tv({
    base: "absolute bottom-0 left-0 right-0 h-1 bg-fg-main/5",
    variants: {
        variant: {
            accent: "",
            success: "",
            warning: "",
            error: "",
        },
    },
});

const progressFillStyles = tv({
    base: "h-full transition-all duration-100 ease-linear",
    variants: {
        variant: {
            accent: "bg-accent",
            success: "bg-success",
            warning: "bg-warning",
            error: "bg-error",
        },
    },
});

export function Notification(props: NotificationProps) {
    const id = createUniqueId();
    // eslint-disable-next-line solid/reactivity
    const notificationId = props.data?.id || id;
    const [progress, setProgress] = createSignal(100);
    const [isPaused, setIsPaused] = createSignal(false);
    const [lastStackIndex, setLastStackIndex] = createSignal(0);
    let el: HTMLDivElement | undefined;

    createEffect(() => {
        if (props.stackIndex !== -1) {
            setLastStackIndex(props.stackIndex!);
        }
    });

    createEffect(() => {
        if (typeof window === "undefined") return;
        const domEl = el;
        if (!domEl || !props.onHeight) return;

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    props.onHeight?.(
                        entry.target.getBoundingClientRect().height
                    );
                }
            });

            observer.observe(domEl);
            onCleanup(() => observer.disconnect());
        }

        props.onHeight(domEl.getBoundingClientRect().height);
    });

    const isTop = () => props.stackIndex === 0;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (isTop() && !props.isExpanded) {
            props.onExpand?.();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (isTop() && !props.isExpanded) {
                props.onExpand?.();
            }
        }
    };

    createEffect(() => {
        if (typeof window === "undefined") return;
        if (
            !props.data.duration ||
            props.data.persisted ||
            props.data.isExiting
        )
            return;

        let intervalId: number;
        let lastTick = Date.now();
        let remaining = props.data.duration;
        const duration = props.data.duration;

        const tick = () => {
            if (isPaused()) {
                lastTick = Date.now(); // Keep updating lastTick so remaining doesn't drop
                return;
            }

            const now = Date.now();
            remaining -= now - lastTick;
            lastTick = now;

            const progressPercent = Math.max(0, (remaining / duration) * 100);
            setProgress(progressPercent);

            if (remaining <= 0) {
                window.clearInterval(intervalId);
                props.onDismiss?.();
            }
        };

        intervalId = window.setInterval(tick, 50);

        onCleanup(() => {
            if (typeof window !== "undefined") {
                window.clearInterval(intervalId);
            }
        });
    });

    const getStyle = () => {
        const isExiting = props.data.isExiting;
        const index = isExiting
            ? lastStackIndex()
            : Math.max(0, props.stackIndex!);

        if (props.isExpanded && !isExiting) {
            const yOffset = props.offset;
            return {
                transform: `translate3d(0, -${yOffset}px, 0)`,
                opacity: 1,
                "pointer-events": "auto",
                "z-index": 100 - index,
            };
        }

        const MAX_STACK = 3;
        const isAboveMax = index >= MAX_STACK;

        const offsetPerItem = 14;
        const scalePerItem = 0.05;

        let visualIndex = isAboveMax ? MAX_STACK : index;
        const yOffset = visualIndex * offsetPerItem;
        const scale = 1 - visualIndex * scalePerItem;
        const opacity = isAboveMax ? 0 : 1;

        let transform = `translate3d(0, -${yOffset}px, 0) scale(${scale})`;

        if (isExiting) {
            transform = `translate3d(100%, -${yOffset}px, 0) scale(${scale * 0.9})`;
            return {
                transform,
                opacity: 0,
                "pointer-events": "none",
                "z-index": 100 - index,
            };
        }

        return {
            transform,
            opacity,
            "z-index": 100 - index,
            "pointer-events": isTop() ? "auto" : "none", // Only top item is interactable when stacked
        };
    };

    return (
        <div
            ref={el}
            class={notificationStyles({ variant: props.data.variant })}
            style={getStyle() as JSX.CSSProperties}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            aria-label={props.data.title || "Notification"}
            data-notification-id={notificationId}
            tabIndex={0}
        >
            <div class="flex items-start gap-3 p-4">
                {/* Icon based on variant could go here */}

                <div class="flex-1 min-w-0">
                    <Show when={props.data.title}>
                        <h4
                            class="text-sm font-semibold mb-1 leading-none"
                            id={`notification-title-${notificationId}`}
                        >
                            {props.data.title}
                        </h4>
                    </Show>
                    <Show when={props.data.description}>
                        <p
                            class="text-sm leading-relaxed"
                            id={`notification-desc-${notificationId}`}
                        >
                            {props.data.description}
                        </p>
                    </Show>
                    <Show when={props.data.children}>
                        <div class="pt-1">{props.data.children}</div>
                    </Show>
                </div>

                <div
                    class="shrink-0 ms-auto -mt-1 -me-1" // Use ms-auto and -me-1 for logical margins
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="text"
                        size="sm"
                        class="h-6 w-6 p-0 rounded-full hover:bg-fg-main/10 flex items-center justify-center"
                        onClick={() => props.onDismiss?.()}
                        aria-label={`Close ${props.data.title || "notification"}`}
                    >
                        {props.closeIcon || <XMark />}
                    </Button>
                </div>
            </div>

            {/* Progress indicator */}
            <Show when={props.data.duration && !props.data.persisted}>
                <div class={progressBarStyles({ variant: props.data.variant })}>
                    <div
                        class={progressFillStyles({
                            variant: props.data.variant,
                        })}
                        style={{ width: `${progress()}%` }}
                    />
                </div>
            </Show>
        </div>
    );
}
