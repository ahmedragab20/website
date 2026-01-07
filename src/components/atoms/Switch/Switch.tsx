import {
    splitProps,
    createSignal,
    createEffect,
    createMemo,
    type JSX,
} from "solid-js";
import { tv } from "tailwind-variants";

export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    name?: string;
    size?: "sm" | "md" | "lg";
    "aria-label"?: string;
    class?: string;
}

const switchStyles = tv({
    slots: {
        wrapper: "inline-flex items-center select-none",
        track: "relative transition-colors duration-200 ease-in-out rounded-full flex-shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        knob: "absolute top-1/2 transform -translate-y-1/2 bg-fg-main rounded-full shadow transition-transform duration-200 ease-in-out",
    },
    variants: {
        size: {
            sm: {
                track: "w-9 h-5",
                knob: "w-4 h-4 left-0.5",
            },
            md: {
                track: "w-11 h-6",
                knob: "w-5 h-5 left-0.5",
            },
            lg: {
                track: "w-14 h-8",
                knob: "w-6 h-6 left-0.5",
            },
        },
        checked: {
            true: {
                track: "bg-accent",
            },
            false: {
                track: "bg-tertiary border border-ui-border",
            },
        },
        disabled: {
            true: {
                wrapper: "opacity-50 cursor-not-allowed",
            },
            false: {
                wrapper: "cursor-pointer",
            },
        },
    },
    compoundVariants: [
        {
            checked: true,
            size: "sm",
            class: {
                knob: "translate-x-3",
            },
        },
        {
            checked: true,
            size: "md",
            class: {
                knob: "translate-x-5",
            },
        },
        {
            checked: true,
            size: "lg",
            class: {
                knob: "translate-x-6",
            },
        },
    ],
    defaultVariants: {
        size: "md",
        checked: false,
        disabled: false,
    },
});

export function Switch(
    props: SwitchProps & JSX.HTMLAttributes<HTMLDivElement>
) {
    const [local, others] = splitProps(props, [
        "checked",
        "defaultChecked",
        "onChange",
        "disabled",
        "id",
        "name",
        "size",
        "aria-label",
        "class",
    ]);

    const isControlled = () => typeof local.checked === "boolean";
    const [internalChecked, setInternalChecked] = createSignal<boolean>(
        !!local.defaultChecked
    );

    // Sync controlled prop
    createEffect(() => {
        if (isControlled()) setInternalChecked(!!local.checked);
    });

    const toggle = (next?: boolean) => {
        if (local.disabled) return;
        const newState = typeof next === "boolean" ? next : !internalChecked();
        if (!isControlled()) setInternalChecked(newState);
        local.onChange?.(newState);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (local.disabled) return;
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
        }
    };

    // Memoize styles to properly track reactive dependencies
    const styles = createMemo(() =>
        switchStyles({
            size: local.size,
            checked: internalChecked(),
            disabled: !!local.disabled,
        })
    );

    return (
        <div
            {...others}
            class={styles().wrapper({ class: local.class })}
            role="switch"
            aria-checked={internalChecked()}
            aria-disabled={local.disabled}
            tabIndex={local.disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            onClick={() => toggle()}
            id={local.id}
            aria-label={local["aria-label"]}
        >
            {/* Hidden native input for form compatibility */}
            <input
                type="checkbox"
                class="sr-only"
                checked={internalChecked()}
                onChange={(e) => toggle((e.target as HTMLInputElement).checked)}
                name={local.name}
                disabled={local.disabled}
            />

            <div class={styles().track()} aria-hidden>
                <span class={styles().knob()} />
            </div>
        </div>
    );
}

export default Switch;
