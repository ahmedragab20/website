import type { JSX } from "solid-js";

export type NotificationPlacement =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

export interface NotificationData {
    id: string;
    title?: string;
    description?: string;
    children?: JSX.Element;
    duration?: number;
    persisted?: boolean;
    placement: NotificationPlacement;
}

export type AddNotificationOptions = Omit<
    NotificationData,
    "id" | "placement"
> & {
    placement?: NotificationPlacement;
};

export interface NotificationContextValue {
    addNotification: (options: AddNotificationOptions) => string;
    removeNotification: (id: string) => void;
}
