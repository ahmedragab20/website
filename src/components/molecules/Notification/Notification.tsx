import {
    Show,
    createEffect,
    onCleanup,
    createSignal,
    type JSX,
} from "solid-js";
import type { NotificationData, NotificationVariant } from "./types";
import { Button } from "../../atoms/Button";

// Default close icon fallback
const DefaultCloseIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
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
);

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
    let isDestroyed = false;

    const getVariantClasses = (variant?: NotificationVariant) => {
        const baseClasses = "notification-item shadow-lg border-s-4";
        const variantClasses = {
            info: "border-s-blue-500 border border-blue-200 bg-blue-50 text-blue-900",
            success:
                "border-s-green-500 border border-green-200 bg-green-50 text-green-900",
            warning:
                "border-s-yellow-500 border border-yellow-200 bg-yellow-50 text-yellow-900",
            error: "border-s-red-500 border border-red-200 bg-red-50 text-red-900",
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
        if (isDestroyed) return;
        setIsExiting(true);
        setTimeout(() => {
            if (!isDestroyed) {
                props.onDismiss();
            }
        }, 300);
    };

    const pauseProgress = () => {
        if (!isPaused() && !props.data.persisted && !isDestroyed) {
            pausedAt = Date.now();
            setIsPaused(true);
        }
    };

    const resumeProgress = () => {
        if (isPaused() && !props.data.persisted && pausedAt && !isDestroyed) {
            startTime += Date.now() - pausedAt;
            pausedAt = null;
            setIsPaused(false);
        }
    };

    // Progress indicator and auto-dismiss logic
    createEffect(() => {
        if (props.data.duration && !props.data.persisted && !isDestroyed) {
            startTime = Date.now();
            const duration = props.data.duration;
            const interval = 50;

            progressInterval = setInterval(() => {
                if (isDestroyed || isPaused()) return;

                const elapsed = pausedAt
                    ? pausedAt - startTime
                    : Date.now() - startTime;
                const remaining = Math.max(0, duration - elapsed);
                const progressPercent = (remaining / duration) * 100;

                if (!isDestroyed) {
                    setProgress(progressPercent);
                }

                if (remaining <= 0 && !isDestroyed) {
                    clearInterval(progressInterval);
                    handleDismiss();
                }
            }, interval) as unknown as number;

            onCleanup(() => {
                isDestroyed = true;
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
            aria-label={
                props.data.title ||
                `Notification: ${props.data.variant || "info"}`
            }
            data-notification-id={props.data.id}
            onMouseEnter={pauseProgress}
            onMouseLeave={resumeProgress}
            onFocus={pauseProgress}
            onBlur={resumeProgress}
            tabIndex={0}
            dir="auto"
        >
            <Show
                when={props.data.children}
                fallback={
                    <div class="p-4 pe-12">
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
                <div class="absolute bottom-0 inset-inline-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
                    <div
                        class="progress-bar h-full opacity-30 transition-all ease-linear"
                        style={{
                            width: `${progress()}%`,
                            transition: isPaused()
                                ? "none"
                                : "width 50ms linear",
                        }}
                    />
                </div>
            </Show>

            {/* Close button for all notification types */}
            <div
                class="absolute top-3 inset-inline-end-3 z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="text"
                    size="sm"
                    class="h-6 w-6 min-h-0 min-w-0 flex items-center justify-center opacity-60 hover:opacity-100 focus:opacity-100 transition-all duration-200 hover:scale-110"
                    onClick={handleDismiss}
                    aria-label={`Close ${props.data.title ? props.data.title : "notification"}`}
                >
                    {props.closeIcon || <DefaultCloseIcon />}
                </Button>
            </div>
        </div>
    );
}
