import {
    createSignal,
    createContext,
    useContext,
    For,
    Show,
    createMemo,
    createEffect,
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
        const duration = options.duration ?? props.defaultDuration ?? 3000;
        const persisted = options.persisted ?? props.defaultPersisted ?? false;

        const notification: NotificationData = {
            id,
            ...options,
            placement,
            duration,
            persisted,
        };

        setNotifications((prev) => [...prev, notification]);

        if (!notification.persisted) {
            // Use window.setTimeout if client, but simple setTimeout is fine in almost all JS envs
            // Cleaning up timeout on remove is tricky unless we store the handle.
            // For simplicity in this scope, we let it fire and if id doesn't exist, removeNotification does nothing.
            setTimeout(() => {
                // Check if it still exists handled by filter logic
                removeNotification(id);
            }, duration);
        }

        return id;
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const toggleExpand = (placement: NotificationPlacement) => {
        setExpanded((prev) => ({ ...prev, [placement]: !prev[placement] }));
    };

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
                                // Close stack when mouse leaves? Or click outside?
                                // User requirement: "clicking on the shown notification... shown in a list"
                                // Doesn't specify how to collapse. Usually toggle on click again or click away.
                                // I'll stick to toggle for now via the items, or clicking background (if added).
                                onClick={() => {
                                    if (expanded()[placement])
                                        toggleExpand(placement);
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
