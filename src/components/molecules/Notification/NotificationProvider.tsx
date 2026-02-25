import {
    createSignal,
    createContext,
    useContext,
    For,
    Show,
    createEffect,
    createMemo,
    onCleanup,
    type JSX,
} from "solid-js";
// eslint-disable-next-line solid/no-proxy-apis
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
    limit?: number;
}

export function NotificationProvider(props: NotificationProviderProps) {
    const [notifications, setNotifications] = createStore<NotificationData[]>(
        []
    );
    const [isExpanded, setIsExpanded] = createSignal(false);
    const [heights, setHeights] = createSignal<Record<string, number>>({});

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
            variant: options.variant || "accent",
            duration: options.duration || props.defaultDuration || 5000,
            persisted: options.persisted ?? props.defaultPersisted ?? false,
            isExiting: false,
        };

        setNotifications((prev) => [...prev, notification]);

        const limit = props.limit || 5;
        const activeItems = notifications.filter((n) => !n.isExiting);
        if (activeItems.length > limit) {
            const excess = activeItems.length - limit;
            let removedCount = 0;
            for (const n of activeItems) {
                if (!n.persisted) {
                    removeNotification(n.id!);
                    removedCount++;
                    if (removedCount >= excess) break;
                }
            }
        }

        return id;
    };

    const removeNotification = (id: string) => {
        setNotifications((n) => n.id === id, "isExiting", true);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setHeights((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }, 400);
    };

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    const stackState = createMemo(() => {
        const indices: Record<string, number> = {};
        const offsets: Record<string, number> = {};

        let count = 0;
        let cumulativeHeight = 0;
        const GAP = 12; // 12px gap

        for (let i = notifications.length - 1; i >= 0; i--) {
            const item = notifications[i];
            if (!item.isExiting) {
                indices[item.id!] = count++;
                offsets[item.id!] = cumulativeHeight;
                cumulativeHeight += (heights()[item.id!] || 0) + GAP;
            } else {
                indices[item.id!] = -1;
                offsets[item.id!] = 0;
            }
        }
        return { indices, offsets };
    });

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
                            aria-label={`${notification.variant || "accent"} notification`}
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
                    class="notification-viewport"
                    data-expanded={isExpanded()}
                    onMouseEnter={() => setIsExpanded(true)}
                    onMouseLeave={() => setIsExpanded(false)}
                    onFocusIn={() => setIsExpanded(true)}
                    onFocusOut={() => setIsExpanded(false)}
                    role="region"
                    aria-label="Notifications"
                >
                    <For each={notifications}>
                        {(notification) => (
                            <Notification
                                data={notification}
                                onDismiss={() =>
                                    removeNotification(notification.id!)
                                }
                                onExpand={() => toggleExpanded()}
                                onHeight={(h) =>
                                    setHeights((prev) => ({
                                        ...prev,
                                        [notification.id!]: h,
                                    }))
                                }
                                stackIndex={
                                    stackState().indices[notification.id!]
                                }
                                offset={stackState().offsets[notification.id!]}
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
