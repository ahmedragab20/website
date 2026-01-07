import { createSignal, createEffect } from "solid-js";
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { PinInput, type PinInputProps } from "./PinInput";

const PinInputWithState = (props: PinInputProps) => {
    const [value, setValue] = createSignal<string[]>([]);

    createEffect(() => {
        setValue(props.value);
    });

    return (
        <PinInput
            {...props}
            value={value()}
            onChange={(v) => {
                setValue(v);
                props.onChange?.(v);
            }}
        />
    );
};

/**
 * Pin input component for entering verification codes or PINs.
 *
 * Features auto-focus navigation, paste support, and comprehensive accessibility.
 * Supports numeric input only with keyboard navigation.
 *
 * @example
 * ```tsx
 * const [value, setValue] = createSignal(Array(6).fill(""));
 *
 * <PinInput
 *   value={value()}
 *   onChange={setValue}
 *   length={6}
 *   onComplete={(pin) => console.log("Complete:", pin)}
 * />
 * ```
 */
const meta = {
    title: "Atoms/PinInput",
    component: PinInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: "object",
            description: "Array of input values",
            table: {
                type: { summary: "string[]" },
            },
        },
        length: {
            control: "number",
            description: "Number of input fields",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "6" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the input fields",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the pin input is disabled",
        },
        error: {
            control: "boolean",
            description: "Whether the pin input has an error state",
        },
        placeholder: {
            control: "text",
            description: "Placeholder character for empty inputs",
        },
        autocomplete: {
            control: "text",
            description: "Autocomplete attribute for inputs",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "one-time-code" },
            },
        },
    },
    args: {
        value: ["", "", "", "", "", ""],
        onChange: fn(),
        onComplete: fn(),
    },
    render: (args) => <PinInputWithState {...(args as PinInputProps)} />,
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    args: {
        value: ["", "", "", "", "", ""],
    },
};

// Different sizes
export const Small: Story = {
    args: {
        value: ["", "", "", ""],
        size: "sm",
        length: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Small pin input with 4 fields, ideal for mobile interfaces.",
            },
        },
    },
};

export const Large: Story = {
    args: {
        value: ["", "", "", "", "", ""],
        size: "lg",
    },
    parameters: {
        docs: {
            description: {
                story: "Large pin input fields for better visibility and accessibility.",
            },
        },
    },
};

// States
export const Disabled: Story = {
    args: {
        value: ["1", "2", "3", "", "", ""],
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled state prevents all user interaction with the pin input.",
            },
        },
    },
};

export const Error: Story = {
    args: {
        value: ["1", "2", "", "", "", ""],
        error: true,
        "aria-invalid": true,
    },
    parameters: {
        docs: {
            description: {
                story: "Error state with red border styling and aria-invalid attribute.",
            },
        },
    },
};

export const Completed: Story = {
    args: {
        value: ["1", "2", "3", "4", "5", "6"],
    },
    parameters: {
        docs: {
            description: {
                story: "Completed state when all fields are filled with valid values.",
            },
        },
    },
};

// Variants
export const FourDigits: Story = {
    args: {
        value: ["", "", "", ""],
        length: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Common 4-digit PIN format for short verification codes.",
            },
        },
    },
};

export const EightDigits: Story = {
    args: {
        value: ["", "", "", "", "", "", "", ""],
        length: 8,
    },
    parameters: {
        docs: {
            description: {
                story: "Extended 8-digit format for longer verification codes.",
            },
        },
    },
};

// Accessibility examples
export const WithAriaLabel: Story = {
    args: {
        value: ["", "", "", "", "", ""],
        "aria-label": "Enter your 6-digit verification code",
    },
    parameters: {
        docs: {
            description: {
                story: "Custom aria-label for better screen reader support.",
            },
        },
    },
};

export const WithDescription: Story = {
    args: {
        value: ["", "", "", ""],
        length: 4,
        "aria-label": "Security code",
        "aria-describedby": "pin-help",
    },
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-2">
            <PinInputWithState {...(args as PinInputProps)} />
            <p id="pin-help" class="text-sm text-fg-muted">
                Enter the 4-digit code sent to your phone
            </p>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Pin input with descriptive help text for context.",
            },
        },
    },
};

// Composition examples
export const InForm: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 w-[320px]">
            <div>
                <label class="block text-sm font-medium mb-2 text-fg-main">
                    Verification Code
                </label>
                <PinInputWithState
                    {...(args as PinInputProps)}
                    aria-label="Verification code"
                    aria-describedby="code-help"
                />
                <p id="code-help" class="text-sm text-fg-muted mt-2">
                    We've sent a 6-digit code to your email
                </p>
            </div>
            <button class="px-4 py-2 rounded bg-accent text-primary font-medium">
                Verify Code
            </button>
        </div>
    ),
    args: {
        length: 6,
    },
    parameters: {
        docs: {
            description: {
                story: "Pin input used within a verification form context.",
            },
        },
    },
};

export const WithCompletion: Story = {
    render: (args: Story["args"]) => {
        return (
            <div class="flex flex-col gap-4">
                <PinInputWithState {...(args as PinInputProps)} />
            </div>
        );
    },
    args: {
        length: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Pin input with completion callback that shows a success message.",
            },
        },
    },
};

// Interactive demo
export const Interactive: Story = {
    render: (args: Story["args"]) => {
        const [internalValue, setInternalValue] = createSignal(
            args?.value || []
        );
        createEffect(() => setInternalValue(args?.value || []));

        return (
            <div class="flex flex-col gap-4 items-center">
                <h3 class="text-lg font-semibold text-fg-main">
                    Try the Pin Input
                </h3>
                <p class="text-sm text-fg-muted text-center max-w-75">
                    Type numbers or paste a code. Use arrow keys to navigate,
                    Backspace to delete.
                </p>
                <PinInput
                    {...args}
                    value={internalValue()}
                    onChange={(v) => {
                        setInternalValue(v);
                        args.onChange?.(v);
                    }}
                />
                <div class="text-xs text-fg-muted text-center">
                    <p>• Auto-focus on input</p>
                    <p>• Paste support (Ctrl+V / Cmd+V)</p>
                    <p>• Keyboard navigation</p>
                    <p>• Screen reader friendly</p>
                </div>
            </div>
        );
    },
    args: {
        length: 6,
    },
    parameters: {
        docs: {
            description: {
                story: "Interactive demo showing all pin input features in action.",
            },
        },
    },
};

// Edge cases
export const PartiallyFilled: Story = {
    args: {
        value: ["1", "", "3", "", "", ""],
    },
    parameters: {
        docs: {
            description: {
                story: "Partially filled pin input showing mixed filled and empty states.",
            },
        },
    },
};

export const WithPlaceholder: Story = {
    args: {
        value: ["", "", "", ""],
        length: 4,
        placeholder: "0",
    },
    parameters: {
        docs: {
            description: {
                story: "Pin input with placeholder characters for empty fields.",
            },
        },
    },
};
