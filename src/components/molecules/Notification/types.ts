import type { JSX } from "solid-js";

/**
 * Notification variant types for semantic coloring
 */
export type NotificationVariant = "info" | "success" | "warning" | "error";

/**
 * Notification data structure
 */
export interface NotificationData {
    /** Unique identifier for the notification */
    id: string;
    /** Optional title text */
    title?: string;
    /** Optional description text */
    description?: string;
    /** Optional custom JSX content */
    children?: JSX.Element;
    /** Auto-dismiss duration in milliseconds (default: 10000) */
    duration?: number;
    /** If true, notification won't auto-dismiss */
    persisted?: boolean;
    /** Visual variant (default: "info") */
    variant?: NotificationVariant;
}

/**
 * Options for adding a new notification
 */
export type AddNotificationOptions = Omit<NotificationData, "id">;

/**
 * Context value for notification system
 */
export interface NotificationContextValue {
    /** Add a new notification and return its ID */
    addNotification: (options: AddNotificationOptions) => string;
    /** Remove a notification by ID */
    removeNotification: (id: string) => void;
}
