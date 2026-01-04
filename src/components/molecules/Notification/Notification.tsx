import { Show, type JSX } from "solid-js";
import type { NotificationData } from "./types";
import { Button } from "../../atoms/Button";

interface NotificationProps {
    data: NotificationData;
    onDismiss: () => void;
    onExpand: () => void;
    isFront: boolean;
    closeIcon?: JSX.Element;
}

export function Notification(props: NotificationProps) {
    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (props.isFront) {
            props.onExpand();
        }
    };

    return (
        <div
            class="notification-item bg-bg-card border border-ui-border shadow-lg"
            onClick={handleClick}
            role="alert"
        >
            <Show
                when={props.data.children}
                fallback={
                    <div class="p-4 pr-10">
                        <Show when={props.data.title}>
                            <h4 class="text-sm font-semibold text-fg-main mb-1">
                                {props.data.title}
                            </h4>
                        </Show>
                        <Show when={props.data.description}>
                            <p class="text-sm text-fg-muted">
                                {props.data.description}
                            </p>
                        </Show>
                    </div>
                }
            >
                {props.data.children}
            </Show>

            <Show when={props.data.persisted}>
                <div
                    class="absolute top-2 right-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="text"
                        size="sm"
                        class="p-1! h-6 w-6 min-h-0 min-w-0 flex items-center justify-center text-fg-muted hover:text-fg-main"
                        onClick={props.onDismiss}
                        aria-label="Close notification"
                    >
                        {props.closeIcon}
                    </Button>
                </div>
            </Show>
        </div>
    );
}
