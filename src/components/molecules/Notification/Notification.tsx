import {
    Show,
    createEffect,
    onCleanup,
    createSignal,
    type JSX,
} from "solid-js";
import { tv } from "tailwind-variants";
import type { NotificationData } from "./types";
import { Button } from "../../atoms/Button";

interface NotificationProps {
    data: NotificationData;
    onDismiss: () => void;
    onExpand: () => void;
    isFront: boolean;
    closeIcon?: JSX.Element;
}

const notificationStyles = tv({
    base: [
        "relative w-full rounded-lg shadow-lg",
        "border border-ui-border bg-secondary",
        "text-fg-main cursor-pointer overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl focus-visible:outline focus-visible:outline-2",
        "focus-visible:outline-accent focus-visible:outline-offset-2",
    ],
    variants: {
        variant: {
            info: "border-l-4 border-l-accent bg-accent/5",
            success: "border-l-4 border-l-success bg-success/5",
            warning: "border-l-4 border-l-warning bg-warning/5",
            error: "border-l-4 border-l-error bg-error/5",
        },
        isExiting: {
            true: "opacity-0 scale-95 translate-x-4",
            false: "opacity-100 scale-100 translate-x-0",
        },
    },
    defaultVariants: {
        variant: "info",
        isExiting: false,
    },
});

const progressBarStyles = tv({
    base: "absolute bottom-0 left-0 right-0 h-1 bg-fg-main/10",
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
            info: "bg-accent/30",
            success: "bg-success/30",
            warning: "bg-warning/30",
            error: "bg-error/30",
        },
    },
});

export function Notification(props: NotificationProps) {
    const [progress, setProgress] = createSignal(100);
    const [isExiting, setIsExiting] = createSignal(false);

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (props.isFront) {
            props.onExpand();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (props.isFront) {
                props.onExpand();
            }
        }
    };

    const handleDismiss = () => {
        setIsExiting(true);
        // Match CSS transition duration (300ms)
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                props.onDismiss();
            }, 300);
        } else {
            props.onDismiss();
        }
    };

    // Auto-dismiss logic with SSR guard
    createEffect(() => {
        if (typeof window === "undefined") return;
        if (!props.data.duration || props.data.persisted) return;

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
                handleDismiss();
            }
        }, interval);

        onCleanup(() => {
            if (typeof window !== "undefined") {
                window.clearInterval(intervalId);
            }
        });
    });

    const getVariantClass = () => {
        return notificationStyles({
            variant: props.data.variant,
            isExiting: isExiting(),
        });
    };

    const getProgressBarClass = () => {
        return progressBarStyles({ variant: props.data.variant });
    };

    const getProgressFillClass = () => {
        return progressFillStyles({ variant: props.data.variant });
    };

    return (
        <div
            class={getVariantClass()}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            aria-label={props.data.title || "Notification"}
            data-notification-id={props.data.id}
            data-is-front={props.isFront}
            tabIndex={0}
        >
            <Show
                when={props.data.children}
                fallback={
                    <div class="p-4 pr-10">
                        <Show when={props.data.title}>
                            <h4
                                class="text-sm font-semibold mb-1"
                                id={`notification-title-${props.data.id}`}
                            >
                                {props.data.title}
                            </h4>
                        </Show>
                        <Show when={props.data.description}>
                            <p
                                class="text-sm opacity-90"
                                id={`notification-desc-${props.data.id}`}
                            >
                                {props.data.description}
                            </p>
                        </Show>
                    </div>
                }
            >
                {props.data.children}
            </Show>

            {/* Progress indicator for auto-dismiss notifications */}
            <Show when={props.data.duration && !props.data.persisted}>
                <div class={getProgressBarClass()}>
                    <div
                        class={getProgressFillClass()}
                        style={{ width: `${progress()}%` }}
                    />
                </div>
            </Show>

            {/* Close button */}
            <div
                class="absolute top-2 right-2 z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="text"
                    size="sm"
                    class="p-1! h-6 w-6 min-h-0 min-w-0 flex items-center justify-center opacity-60 hover:opacity-100 focus:opacity-100 transition-opacity"
                    onClick={handleDismiss}
                    aria-label={`Close ${props.data.title ? props.data.title : "notification"}`}
                >
                    {props.closeIcon}
                </Button>
            </div>
        </div>
    );
}
