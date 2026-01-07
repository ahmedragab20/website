import {
    createSignal,
    createContext,
    useContext,
    splitProps,
    createUniqueId,
    type ParentProps,
    createMemo,
} from "solid-js";
import { tv } from "tailwind-variants";

type AccordionValue = string | string[];

interface AccordionContextValue {
    value: () => string[];
    toggle: (itemValue: string) => void;
    collapsible: () => boolean;
}

const AccordionContext = createContext<AccordionContextValue>();

interface AccordionItemContextValue {
    value: () => string;
    disabled: () => boolean;
    triggerId: string;
    contentId: string;
    isOpen: () => boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue>();

const accordion = tv({
    base: "w-full space-y-2",
});

const accordionItem = tv({
    base: "border border-ui-border rounded-lg bg-secondary",
    variants: {
        disabled: {
            true: "opacity-50 cursor-not-allowed",
            false: "",
        },
    },
    defaultVariants: {
        disabled: false,
    },
});

const accordionTrigger = tv({
    base: "flex flex-1 items-center justify-between w-full px-4 py-4 font-medium hover:bg-ui-active/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset list-none [&::-webkit-details-marker]:hidden cursor-pointer [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200",
    variants: {
        open: {
            true: "[&>svg]:rotate-180 rounded-t-lg",
            false: "rounded-lg",
        },
    },
    defaultVariants: {
        open: false,
    },
});

const accordionContent = tv({
    base: "grid text-sm overflow-hidden",
    variants: {
        open: {
            true: "grid-rows-[1fr] opacity-100",
            false: "grid-rows-[0fr] opacity-0",
        },
    },
    defaultVariants: {
        open: false,
    },
});

const accordionContentInner = tv({
    base: "min-h-0 py-3 px-4 text-fg-muted",
});

export interface AccordionProps extends ParentProps {
    type?: "single" | "multiple";
    value?: AccordionValue;
    defaultValue?: AccordionValue;
    onValueChange?: (value: AccordionValue) => void;
    collapsible?: boolean;
    class?: string;
    disabled?: boolean;
}

export function Accordion(props: AccordionProps) {
    const [local, others] = splitProps(props, [
        "type",
        "value",
        "defaultValue",
        "onValueChange",
        "collapsible",
        "class",
        "children",
        "disabled",
    ]);

    const [internalValue, setInternalValue] = createSignal<string[]>(
        local.defaultValue
            ? Array.isArray(local.defaultValue)
                ? local.defaultValue
                : [local.defaultValue]
            : []
    );

    const isControlled = createMemo(() => local.value !== undefined);

    const currentValue = createMemo(() => {
        if (isControlled()) {
            return Array.isArray(local.value) ? local.value! : [local.value!];
        }
        return internalValue();
    });

    const toggle = (itemValue: string) => {
        const current = currentValue();
        const type = local.type || "single";
        let next: string[] = [];

        if (type === "single") {
            if (current.includes(itemValue)) {
                if (local.collapsible || local.collapsible === undefined) {
                    next = [];
                } else {
                    next = [itemValue];
                }
            } else {
                next = [itemValue];
            }
        } else {
            if (current.includes(itemValue)) {
                next = current.filter((v) => v !== itemValue);
            } else {
                next = [...current, itemValue];
            }
        }

        if (!isControlled()) {
            setInternalValue(next);
        }

        local.onValueChange?.(type === "single" ? (next[0] ?? "") : next);
    };

    const context: AccordionContextValue = {
        value: currentValue,
        toggle,
        collapsible: () => local.collapsible ?? local.type === "single",
    };

    return (
        <AccordionContext.Provider value={context}>
            <div
                class={accordion({ class: local.class })}
                data-orientation="vertical"
                {...others}
            >
                {local.children}
            </div>
        </AccordionContext.Provider>
    );
}

export interface AccordionItemProps extends ParentProps {
    value: string;
    disabled?: boolean;
    class?: string;
}

function AccordionItem(props: AccordionItemProps) {
    const rootContext = useContext(AccordionContext);
    if (!rootContext) {
        throw new Error("AccordionItem must be used within Accordion");
    }

    const [local, others] = splitProps(props, [
        "value",
        "disabled",
        "class",
        "children",
    ]);

    const triggerId = `accordion-trigger-${createUniqueId()}`;
    const contentId = `accordion-content-${createUniqueId()}`;

    const isOpen = createMemo(() => rootContext.value().includes(local.value));

    const context: AccordionItemContextValue = {
        value: () => local.value,
        disabled: () => local.disabled ?? false,
        triggerId,
        contentId,
        isOpen,
    };

    return (
        <AccordionItemContext.Provider value={context}>
            <details
                class={accordionItem({
                    disabled: local.disabled,
                    class: local.class,
                })}
                open={isOpen()}
                {...others}
                onClick={(e) => {
                    e.preventDefault();
                }}
            >
                {local.children}
            </details>
        </AccordionItemContext.Provider>
    );
}

export interface AccordionTriggerProps extends ParentProps {
    class?: string;
}

function AccordionTrigger(props: AccordionTriggerProps) {
    const rootContext = useContext(AccordionContext);
    const itemContext = useContext(AccordionItemContext);

    if (!rootContext || !itemContext) {
        throw new Error(
            "AccordionTrigger must be used within Accordion and AccordionItem"
        );
    }

    const [local, others] = splitProps(props, ["class", "children"]);

    const isOpen = () => rootContext.value().includes(itemContext.value());

    const handleClick = (e: MouseEvent) => {
        e.preventDefault(); // Stop native toggle
        if (!itemContext.disabled()) {
            rootContext.toggle(itemContext.value());
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (itemContext.disabled()) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            rootContext.toggle(itemContext.value());
        }
    };

    return (
        <summary
            id={itemContext.triggerId}
            class={accordionTrigger({
                open: isOpen(),
                class: local.class,
            })}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen()}
            aria-controls={itemContext.contentId}
            aria-disabled={itemContext.disabled()}
            role="button"
            tabIndex={itemContext.disabled() ? -1 : 0}
            data-value={itemContext.value()}
            {...others}
        >
            {local.children}
        </summary>
    );
}

export interface AccordionContentProps extends ParentProps {
    class?: string;
}

function AccordionContent(props: AccordionContentProps) {
    const rootContext = useContext(AccordionContext);
    const itemContext = useContext(AccordionItemContext);

    if (!rootContext || !itemContext) {
        throw new Error(
            "AccordionContent must be used within Accordion and AccordionItem"
        );
    }

    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <div
            id={itemContext.contentId}
            role="region"
            aria-labelledby={itemContext.triggerId}
            class={accordionContent({
                open: itemContext.isOpen(),
                class: local.class,
            })}
            data-value={itemContext.value()}
            onClick={(e) => e.stopPropagation()}
            {...others}
        >
            <div class={accordionContentInner()}>{local.children}</div>
        </div>
    );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export { AccordionItem, AccordionTrigger, AccordionContent };
