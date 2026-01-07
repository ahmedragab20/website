import {
    Show,
    createEffect,
    createSignal,
    onCleanup,
    type JSX,
} from "solid-js";
import { tv } from "tailwind-variants";
import type { NotificationData } from "./types";
import { Button } from "../../atoms/Button";

interface NotificationProps {
    data: NotificationData;
    onDismiss: () => void;
    onExpand: () => void;
    stackIndex: number;
    isExpanded: boolean;
    closeIcon?: JSX.Element;
}

const notificationStyles = tv({
    base: [
        "relative w-full rounded-xl overflow-hidden",
        "border backdrop-blur-md shadow-lg",
        "cursor-pointer select-none",
        "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
        "hover:shadow-xl focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-accent focus-visible:outline-offset-2",
    ],
    variants: {
        variant: {
            info: "bg-secondary/95 border-ui-border text-fg-main",
            success: "bg-success/5 border-success/20 text-fg-main",
            warning: "bg-warning/5 border-warning/20 text-fg-main",
            error: "bg-error/5 border-error/20 text-fg-main",
        },
    },
    defaultVariants: {
        variant: "info",
    },
});

const progressBarStyles = tv({
    base: "absolute bottom-0 left-0 right-0 h-1 bg-fg-main/5",
    variants: {
        variant: {
            info: "",
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
            info: "bg-accent",
            success: "bg-success",
            warning: "bg-warning",
            error: "bg-error",
        },
    },
});

export function Notification(props: NotificationProps) {
    const [progress, setProgress] = createSignal(100);
    // Track the last valid stack index for smooth exit animations
    const [lastStackIndex, setLastStackIndex] = createSignal(0);

    createEffect(() => {
        if (props.stackIndex !== -1) {
            setLastStackIndex(props.stackIndex);
        }
    });

    const isTop = () => props.stackIndex === 0;

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (isTop() && !props.isExpanded) {
            props.onExpand();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (isTop() && !props.isExpanded) {
                props.onExpand();
            }
        }
    };

    // Auto-dismiss logic with SSR guard
    createEffect(() => {
        if (typeof window === "undefined") return;
        if (
            !props.data.duration ||
            props.data.persisted ||
            props.data.isExiting
        )
            return;

        const duration = props.data.duration;
        const startTime = Date.now();
        const interval = 50; // Update every 50ms

        const intervalId = window.setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const progressPercent = (remaining / duration) * 100;

            setProgress(progressPercent);

            if (remaining <= 0) {
                window.clearInterval(intervalId);
                props.onDismiss();
            }
        }, interval);

        onCleanup(() => {
            if (typeof window !== "undefined") {
                window.clearInterval(intervalId);
            }
        });
    });

    // Dynamic styles for stack animation
    const getStyle = () => {
        // Expanded state: no transforms, just normal flow
        if (props.isExpanded && !props.data.isExiting) {
            return {
                transform: "none",
                opacity: 1,
                "pointer-events": "auto",
            };
        }

        const isExiting = props.data.isExiting;
        // Use current index if valid, otherwise use last known index
        const index = isExiting ? lastStackIndex() : props.stackIndex;

        // Stack visual parameters
        const yOffset = isExiting ? index * 12 : index * 12; // 12px gap
        const scale = 1 - index * 0.05;
        const opacity = Math.max(0, 1 - index * 0.2);

        // CSS transforms
        let transform = `translateY(-${yOffset}px) scale(${scale})`;

        // Exit animation override
        if (isExiting) {
            transform = `translateY(-${yOffset}px) translateX(20px) scale(${scale * 0.9})`;
            return {
                transform,
                opacity: 0,
                "pointer-events": "none",
            };
        }

        // Hidden items deep in stack
        if (index > 2) {
            return {
                transform: `translateY(-${3 * 12}px) scale(${1 - 3 * 0.05})`,
                opacity: 0,
                "pointer-events": "none",
            };
        }

        return {
            transform,
            opacity,
        };
    };

    return (
        <div
            class={notificationStyles({ variant: props.data.variant })}
            style={getStyle() as JSX.CSSProperties}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            aria-label={props.data.title || "Notification"}
            data-notification-id={props.data.id}
            tabIndex={0}
        >
            <div class="flex items-start gap-3 p-4">
                {/* Icon based on variant could go here */}

                <div class="flex-1 min-w-0">
                    <Show when={props.data.title}>
                        <h4
                            class="text-sm font-semibold mb-1 leading-none"
                            id={`notification-title-${props.data.id}`}
                        >
                            {props.data.title}
                        </h4>
                    </Show>
                    <Show when={props.data.description}>
                        <p
                            class="text-sm opacity-90 leading-relaxed"
                            id={`notification-desc-${props.data.id}`}
                        >
                            {props.data.description}
                        </p>
                    </Show>
                    <Show when={props.data.children}>
                        <div class="pt-1">{props.data.children}</div>
                    </Show>
                </div>

                <div
                    class="shrink-0 -mr-1 -mt-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="text"
                        size="sm"
                        class="h-6 w-6 p-0 rounded-full hover:bg-fg-main/10"
                        onClick={() => props.onDismiss()}
                        aria-label={`Close ${props.data.title || "notification"}`}
                    >
                        {props.closeIcon || (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        )}
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
