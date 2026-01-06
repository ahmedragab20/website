import {
    Show,
    createEffect,
    onCleanup,
    createSignal,
    type JSX,
} from "solid-js";
import type { NotificationData, NotificationVariant } from "./types";
import { Button } from "../../atoms/Button";

interface NotificationProps {
    data: NotificationData;
    onDismiss: () => void;
    onExpand: () => void;
    isFront: boolean;
    closeIcon?: JSX.Element;
}

export function Notification(props: NotificationProps) {
    const [progress, setProgress] = createSignal(100);
    const [isPaused, setIsPaused] = createSignal(false);
    const [isExiting, setIsExiting] = createSignal(false);
    let progressInterval: number | undefined;
    let startTime: number;
    let pausedAt: number | null = null;

    const getVariantClasses = (variant?: NotificationVariant) => {
        const baseClasses = "notification-item shadow-lg";
        const variantClasses = {
            info: "border border-blue-200 bg-blue-50 text-blue-900",
            success: "border border-green-200 bg-green-50 text-green-900",
            warning: "border border-yellow-200 bg-yellow-50 text-yellow-900",
            error: "border border-red-200 bg-red-50 text-red-900",
        };
        return `${baseClasses} ${variantClasses[variant || "info"]}`;
    };

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
        setTimeout(() => {
            props.onDismiss();
        }, 300); // Match exit animation duration
    };

    const pauseProgress = () => {
        if (!isPaused() && !props.data.persisted) {
            pausedAt = Date.now();
            setIsPaused(true);
        }
    };

    const resumeProgress = () => {
        if (isPaused() && !props.data.persisted && pausedAt) {
            startTime += Date.now() - pausedAt;
            pausedAt = null;
            setIsPaused(false);
        }
    };

    // Progress indicator and auto-dismiss logic
    createEffect(() => {
        if (props.data.duration && !props.data.persisted) {
            startTime = Date.now();
            const duration = props.data.duration;
            const interval = 50; // Update every 50ms

            progressInterval = setInterval(() => {
                if (!isPaused()) {
                    const elapsed = pausedAt
                        ? pausedAt - startTime
                        : Date.now() - startTime;
                    const remaining = Math.max(0, duration - elapsed);
                    const progressPercent = (remaining / duration) * 100;

                    setProgress(progressPercent);

                    if (remaining <= 0) {
                        clearInterval(progressInterval);
                        handleDismiss();
                    }
                }
            }, interval) as unknown as number;

            onCleanup(() => {
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
            });
        }
    });

    return (
        <div
            class={`${getVariantClasses(props.data.variant)} ${isExiting() ? "exiting" : ""}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
            aria-label={props.data.title || "Notification"}
            data-notification-id={props.data.id}
            onMouseEnter={pauseProgress}
            onMouseLeave={resumeProgress}
            onFocus={pauseProgress}
            onBlur={resumeProgress}
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
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
                    <div
                        class="h-full bg-current opacity-30 transition-all duration-50"
                        style={{ width: `${progress()}%` }}
                    />
                </div>
            </Show>

            {/* Close button for all notification types */}
            <div
                class="absolute top-2 right-2 z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="text"
                    size="sm"
                    class="p-1! h-6 w-6 min-h-0 min-w-0 flex items-center justify-center opacity-60 hover:opacity-100 focus:opacity-100"
                    onClick={handleDismiss}
                    aria-label={`Close ${props.data.title ? props.data.title : "notification"}`}
                >
                    {props.closeIcon}
                </Button>
            </div>
        </div>
    );
}
