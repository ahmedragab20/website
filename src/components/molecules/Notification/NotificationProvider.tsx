import {
    createSignal,
    createContext,
    useContext,
    For,
    Show,
    createEffect,
    createMemo,
    onMount,
    onCleanup,
    type JSX,
} from "solid-js";
import { createStore } from "solid-js/store";
import type {
    NotificationData,
    AddNotificationOptions,
    NotificationContextValue,
} from "./types";
import { Notification } from "./Notification";
import "./Notification.css";

const NotificationContext = createContext<NotificationContextValue>();

export interface NotificationProviderProps {
    children: JSX.Element;
    closeIcon?: JSX.Element;
    defaultDuration?: number;
    defaultPersisted?: boolean;
}

export function NotificationProvider(props: NotificationProviderProps) {
    const [notifications, setNotifications] = createStore<NotificationData[]>(
        []
    );
    const [isExpanded, setIsExpanded] = createSignal(false);
    let viewportRef: HTMLDivElement | undefined;

    const generateId = () => {
        return (
            Date.now().toString(36) + Math.random().toString(36).substring(2)
        );
    };

    const addNotification = (options: AddNotificationOptions) => {
        const id = generateId();

        const notification: NotificationData = {
            id,
            ...options,
            variant: options.variant || "info",
            duration: options.duration || 5000,
            persisted: options.persisted ?? false,
            isExiting: false,
        };

        setNotifications((prev) => [...prev, notification]);
        return id;
    };

    const removeNotification = (id: string) => {
        // Mark as exiting first
        setNotifications((n) => n.id === id, "isExiting", true);

        // Remove after animation (400ms to be safe)
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 400);
    };

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    // Calculate stack indices for stable animations
    // We iterate backwards (newest first) to assign stack positions (0 = top)
    const stackIndices = () => {
        const indices: Record<string, number> = {};
        let count = 0;
        // Access store directly
        const list = notifications;
        for (let i = list.length - 1; i >= 0; i--) {
            const item = list[i];
            if (!item.isExiting) {
                indices[item.id] = count++;
            } else {
                indices[item.id] = -1; // Exiting items
            }
        }
        return indices;
    };

    // Derived signal for performance
    const getStackIndices = createMemo(stackIndices);

    // Manage popover with SSR guard
    onMount(() => {
        if (typeof window === "undefined") return;

        const viewport = viewportRef;
        if (viewport && "showPopover" in viewport) {
            try {
                viewport.showPopover();
            } catch {
                // Fallback for browsers without Popover API
            }
        }

        onCleanup(() => {
            if (typeof window === "undefined") return;
            if (viewport && "hidePopover" in viewport) {
                try {
                    viewport.hidePopover();
                } catch {
                    // Ignore
                }
            }
        });
    });

    // Handle Escape key to collapse
    createEffect(() => {
        if (typeof window === "undefined") return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isExpanded()) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        onCleanup(() => {
            if (typeof document === "undefined") return;
            document.removeEventListener("keydown", handleKeyDown);
        });
    });

    // Handle click outside to collapse
    createEffect(() => {
        if (typeof window === "undefined") return;

        const handleClick = (e: MouseEvent) => {
            if (!isExpanded()) return;
            const viewport = viewportRef;
            if (viewport && !viewport.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("click", handleClick);

        onCleanup(() => {
            if (typeof document === "undefined") return;
            document.removeEventListener("click", handleClick);
        });
    });

    // Auto-collapse when no notifications
    createEffect(() => {
        if (notifications.length === 0 && isExpanded()) {
            setIsExpanded(false);
        }
    });

    return (
        <NotificationContext.Provider
            value={{ addNotification, removeNotification }}
        >
            {props.children}
            {/* ARIA live region for screen readers */}
            <div aria-live="polite" aria-atomic="true" class="sr-only">
                <For each={notifications}>
                    {(notification) => (
                        <div
                            role="status"
                            aria-label={`${notification.variant || "info"} notification`}
                        >
                            {notification.title && `${notification.title}. `}
                            {notification.description &&
                                `${notification.description}. `}
                            {notification.duration &&
                                !notification.persisted &&
                                `Auto-dismisses in ${Math.ceil(notification.duration / 1000)} seconds.`}
                        </div>
                    )}
                </For>
            </div>
            <Show when={notifications.length > 0}>
                <div
                    ref={(el) => (viewportRef = el)}
                    popover="manual"
                    class={`notification-viewport ${isExpanded() ? "expanded" : ""}`}
                    role={isExpanded() ? "dialog" : "region"}
                    aria-label={`Notifications${isExpanded() ? ", expanded view" : ""}`}
                    aria-expanded={isExpanded()}
                    aria-modal={isExpanded()}
                    onClick={(e) => {
                        // Only close if clicking the background in expanded state
                        if (isExpanded() && e.target === e.currentTarget) {
                            toggleExpanded();
                        }
                    }}
                >
                    <For each={notifications}>
                        {(notification) => (
                            <Notification
                                data={notification}
                                onDismiss={() =>
                                    removeNotification(notification.id)
                                }
                                onExpand={() => toggleExpanded()}
                                stackIndex={getStackIndices()[notification.id]}
                                isExpanded={isExpanded()}
                                closeIcon={props.closeIcon}
                            />
                        )}
                    </For>
                </div>
            </Show>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
}
