import {
    createSignal,
    createContext,
    useContext,
    For,
    Show,
    createMemo,
    createEffect,
    onCleanup,
    type JSX,
} from "solid-js";
import type {
    NotificationData,
    AddNotificationOptions,
    NotificationPlacement,
    NotificationContextValue,
} from "./types";
import { Notification } from "./Notification";
import "./Notification.css";

const NotificationContext = createContext<NotificationContextValue>();

export interface NotificationProviderProps {
    children: JSX.Element;
    closeIcon?: JSX.Element;
    defaultPlacement?: NotificationPlacement;
    defaultDuration?: number;
    defaultPersisted?: boolean;
}

export function NotificationProvider(props: NotificationProviderProps) {
    const [notifications, setNotifications] = createSignal<NotificationData[]>(
        []
    );
    const [expanded, setExpanded] = createSignal<
        Record<NotificationPlacement, boolean>
    >({
        "top-left": false,
        "top-right": false,
        "bottom-left": false,
        "bottom-right": false,
    });

    const generateId = () => {
        return (
            Date.now().toString(36) + Math.random().toString(36).substring(2)
        );
    };

    const addNotification = (options: AddNotificationOptions) => {
        const id = generateId();
        const placement =
            options.placement || props.defaultPlacement || "top-right";
        const duration = options.duration ?? props.defaultDuration ?? 10000;
        const persisted = options.persisted ?? props.defaultPersisted ?? false;

        const notification: NotificationData = {
            id,
            ...options,
            placement,
            duration,
            persisted,
        };

        setNotifications((prev) => [...prev, notification]);

        // Auto-dismiss is now handled in the Notification component itself
        // to properly support pause on hover

        return id;
    };

    const removeNotification = (id: string) => {
        // Add a small delay to allow exit animation to play
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 50);
    };

    const toggleExpand = (placement: NotificationPlacement) => {
        setExpanded((prev) => ({ ...prev, [placement]: !prev[placement] }));
    };

    const handleKeyDown = (
        e: KeyboardEvent,
        placement: NotificationPlacement
    ) => {
        const items = notifications().filter((n) => n.placement === placement);
        const currentIndex = items.findIndex(
            (item) =>
                document.activeElement
                    ?.closest(".notification-item")
                    ?.getAttribute("data-notification-id") === item.id
        );

        // Announce keyboard navigation to screen readers
        const announceNavigation = (direction: string, index: number) => {
            const announcement = `${items[index].title || items[index].description || `Notification ${index + 1}`}`;
            const announcer = document.getElementById("notification-announcer");
            if (announcer) {
                announcer.textContent = `${direction}: ${announcement}`;
            }
        };

        switch (e.key) {
            case "Escape":
                if (expanded()[placement]) {
                    toggleExpand(placement);
                    const firstNotification = document.querySelector(
                        `.notification-viewport[data-placement="${placement}"] .notification-item`
                    ) as HTMLElement;
                    firstNotification?.focus();
                }
                break;
            case "ArrowDown":
            case "ArrowRight":
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    const nextNotification = document.querySelector(
                        `.notification-viewport[data-placement="${placement}"] .notification-item[data-notification-id="${items[currentIndex + 1].id}"]`
                    ) as HTMLElement;
                    nextNotification?.focus();
                    announceNavigation("Next notification", currentIndex + 1);
                }
                break;
            case "ArrowUp":
            case "ArrowLeft":
                e.preventDefault();
                if (currentIndex > 0) {
                    const prevNotification = document.querySelector(
                        `.notification-viewport[data-placement="${placement}"] .notification-item[data-notification-id="${items[currentIndex - 1].id}"]`
                    ) as HTMLElement;
                    prevNotification?.focus();
                    announceNavigation(
                        "Previous notification",
                        currentIndex - 1
                    );
                }
                break;
            case "Home":
                e.preventDefault();
                const firstNotification = document.querySelector(
                    `.notification-viewport[data-placement="${placement}"] .notification-item[data-notification-id="${items[0]?.id}"]`
                ) as HTMLElement;
                firstNotification?.focus();
                announceNavigation("First notification", 0);
                break;
            case "End":
                e.preventDefault();
                const lastNotification = document.querySelector(
                    `.notification-viewport[data-placement="${placement}"] .notification-item[data-notification-id="${items[items.length - 1]?.id}"]`
                ) as HTMLElement;
                lastNotification?.focus();
                announceNavigation("Last notification", items.length - 1);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                toggleExpand(placement);
                break;
        }
    };

    const handleClickOutside = (
        e: MouseEvent,
        placement: NotificationPlacement
    ) => {
        const viewport = document.querySelector(
            `.notification-viewport[data-placement="${placement}"]`
        ) as HTMLElement;

        if (
            expanded()[placement] &&
            viewport &&
            !viewport.contains(e.target as Node)
        ) {
            toggleExpand(placement);
        }
    };

    // Global keyboard and click event handlers
    createEffect(() => {
        const placements: NotificationPlacement[] = [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
        ];

        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            placements.forEach((placement) => {
                if (expanded()[placement]) {
                    const viewport = document.querySelector(
                        `.notification-viewport[data-placement="${placement}"]`
                    ) as HTMLElement;
                    if (viewport && viewport.contains(document.activeElement)) {
                        handleKeyDown(e, placement);
                    }
                }
            });
        };

        const handleGlobalClick = (e: MouseEvent) => {
            placements.forEach((placement) => {
                handleClickOutside(e, placement);
            });
        };

        document.addEventListener("keydown", handleGlobalKeyDown);
        document.addEventListener("click", handleGlobalClick);

        onCleanup(() => {
            document.removeEventListener("keydown", handleGlobalKeyDown);
            document.removeEventListener("click", handleGlobalClick);
        });
    });

    const placements: NotificationPlacement[] = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
    ];

    return (
        <NotificationContext.Provider
            value={{ addNotification, removeNotification }}
        >
            {props.children}
            {/* Screen reader announcer for keyboard navigation */}
            <div
                id="notification-announcer"
                aria-live="polite"
                aria-atomic="true"
                class="sr-only"
            />
            {/* ARIA live region for screen readers */}
            <div aria-live="polite" aria-atomic="true" class="sr-only">
                <For each={notifications()}>
                    {(notification) => (
                        <div
                            role="status"
                            aria-label={`${notification.variant} notification`}
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
            <For each={placements}>
                {(placement) => {
                    const placementItems = createMemo(() =>
                        notifications().filter((n) => n.placement === placement)
                    );

                    createEffect(() => {
                        if (
                            placementItems().length === 0 &&
                            expanded()[placement]
                        ) {
                            setExpanded((prev) => ({
                                ...prev,
                                [placement]: false,
                            }));
                        }
                    });

                    // We wrap the list.
                    // To ensure "stack" animations work via CSS sibling selectors, we must maintain the DOM order.
                    // We append new notifications to the end of the array.
                    // So the LAST element is the NEWEST.
                    // CSS nth-last-child(1) targets the LAST element => NEWEST => Top of stack.
                    // This matches our CSS logic.

                    return (
                        <Show when={placementItems().length > 0}>
                            <div
                                ref={(el) => {
                                    if (
                                        el &&
                                        typeof el.showPopover === "function"
                                    ) {
                                        try {
                                            el.showPopover();
                                        } catch {
                                            // Ignore if already showing or other minor issues
                                        }
                                    }
                                }}
                                popover="manual"
                                class={`notification-viewport ${expanded()[placement] ? "expanded" : ""}`}
                                data-placement={placement}
                                role={
                                    expanded()[placement] ? "dialog" : "region"
                                }
                                aria-label={`Notifications ${placement.replace("-", " ")}${expanded()[placement] ? ", expanded view" : ""}`}
                                aria-expanded={expanded()[placement]}
                                aria-modal={expanded()[placement]}
                                aria-describedby={
                                    placementItems().length > 0
                                        ? `notification-list-${placement.replace("-", "")}`
                                        : undefined
                                }
                                onClick={(e) => {
                                    // Only close if clicking the background in expanded state
                                    if (
                                        expanded()[placement] &&
                                        e.target === e.currentTarget
                                    ) {
                                        toggleExpand(placement);
                                    }
                                }}
                            >
                                <For each={placementItems()}>
                                    {(notification) => (
                                        <Notification
                                            data={notification}
                                            onDismiss={() =>
                                                removeNotification(
                                                    notification.id
                                                )
                                            }
                                            onExpand={() =>
                                                toggleExpand(placement)
                                            }
                                            isFront={true}
                                            closeIcon={props.closeIcon}
                                        />
                                    )}
                                </For>
                            </div>
                        </Show>
                    );
                }}
            </For>
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
