import { type JSX, onMount, createSignal, Show } from "solid-js";
import { Dropdown, type DropdownProps } from "./Dropdown";

export interface DropdownBridgeProps extends Omit<
    DropdownProps,
    "trigger" | "children"
> {
    /**
     * The ID of the trigger element container.
     * The Astro component will render the trigger slot into this container.
     */
    triggerId: string;
    /**
     * Dropdown items as children.
     */
    children: JSX.Element;
}

/**
 * Bridge component that wraps Dropdown to accept trigger via a container ID.
 * This allows Astro slots to be passed as the trigger prop.
 *
 * The Astro component renders the trigger slot into a container with the given ID,
 * and this component moves that element into the Dropdown's trigger wrapper.
 */
export function DropdownBridge(props: DropdownBridgeProps) {
    const [triggerElement, setTriggerElement] =
        createSignal<HTMLElement | null>(null);

    onMount(() => {
        if (typeof document === "undefined") return;

        // Find the trigger container by ID
        const container = document.getElementById(props.triggerId);
        if (container) {
            // Get the first child element (the trigger) from the container
            const trigger = container.firstElementChild as HTMLElement;
            if (trigger) {
                setTriggerElement(trigger);
            }
        }
    });

    if (typeof document === "undefined") {
        return (
            <div style={{ display: "none" }} aria-hidden="true">
                {/* SSR placeholder - will be replaced on client */}
            </div>
        );
    }

    return (
        <Show when={triggerElement()}>
            {(trigger) => (
                <Dropdown
                    {...props}
                    trigger={
                        <div
                            ref={(el) => {
                                // Move the trigger element from Astro into this wrapper
                                const actualTrigger = trigger();
                                if (
                                    actualTrigger &&
                                    el &&
                                    actualTrigger.parentNode
                                ) {
                                    // Move the element (removes it from original location)
                                    el.appendChild(actualTrigger);
                                }
                            }}
                        />
                    }
                >
                    {props.children}
                </Dropdown>
            )}
        </Show>
    );
}
