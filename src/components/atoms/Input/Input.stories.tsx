import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Input } from "./Input";
import { Label } from "../Label/Label";

/**
 * Input component for text entry and form controls.
 *
 * Supports multiple input types, sizes, and states.
 * Includes built-in error and disabled states.
 * Fully accessible with ARIA support.
 *
 * @example
 * ```tsx
 * <Input value={value()} onInput={(v) => setValue(v)} placeholder="Enter text" />
 * ```
 */
const meta = {
    title: "Atoms/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: [
                "text",
                "email",
                "password",
                "number",
                "tel",
                "url",
                "search",
            ],
            description: "Input type",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "text" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the input",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the input is disabled",
        },
        required: {
            control: "boolean",
            description: "Whether the input is required",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text",
        },
        value: {
            control: "text",
            description: "Input value",
        },
        "aria-label": {
            control: "text",
            description: "Accessible label for screen readers",
        },
        "aria-invalid": {
            control: "boolean",
            description: "Whether the input has an error",
        },
    },
    args: {
        value: "",
        onInput: fn(),
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Input
                {...args}
                value={value()}
                onInput={(v) => {
                    setValue(v);
                    args?.onInput?.(v);
                }}
            />
        );
    },
    args: {
        placeholder: "Enter text",
    },
};

export const WithLabel: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="input-1">Email Address</Label>
                <Input
                    {...args}
                    id="input-1"
                    value={value()}
                    onInput={(v) => {
                        setValue(v);
                        args?.onInput?.(v);
                    }}
                />
            </div>
        );
    },
    args: {
        type: "email",
        placeholder: "you@example.com",
    },
    parameters: {
        docs: {
            description: {
                story: "Input with associated label. Always use labels for accessibility.",
            },
        },
    },
};

// Input types
export const Text: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        type: "text",
        placeholder: "Enter your name",
    },
};

export const Email: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        type: "email",
        placeholder: "email@example.com",
    },
};

export const Password: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        type: "password",
        placeholder: "Enter password",
    },
};

export const Number: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        type: "number",
        placeholder: "0",
        min: 0,
        max: 100,
    },
};

// Sizes
export const Small: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        size: "sm",
        placeholder: "Small input",
    },
};

export const Medium: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        size: "md",
        placeholder: "Medium input",
    },
};

export const Large: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return <Input {...args} value={value()} onInput={(v) => setValue(v)} />;
    },
    args: {
        size: "lg",
        placeholder: "Large input",
    },
};

// States
export const Disabled: Story = {
    args: {
        value: "Disabled input",
        disabled: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled input prevents user interaction and shows reduced opacity.",
            },
        },
    },
};

export const Required: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="required-input" required>
                    Required Field
                </Label>
                <Input
                    {...args}
                    id="required-input"
                    value={value()}
                    onInput={(v) => setValue(v)}
                    required
                />
            </div>
        );
    },
    args: {
        placeholder: "This field is required",
    },
};

export const Error: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="error-input">Email Address</Label>
                <Input
                    {...args}
                    id="error-input"
                    value={value()}
                    onInput={(v) => setValue(v)}
                    aria-invalid={true}
                    aria-describedby="error-message"
                />
                <span id="error-message" class="text-xs text-error">
                    Please enter a valid email address
                </span>
            </div>
        );
    },
    args: {
        type: "email",
        placeholder: "invalid-email",
        "aria-invalid": true,
    },
    parameters: {
        docs: {
            description: {
                story: "Input in error state. Use aria-invalid and aria-describedby for accessibility.",
            },
        },
    },
};

// Composition
export const InForm: Story = {
    render: () => {
        const [email, setEmail] = createSignal("");
        const [password, setPassword] = createSignal("");
        return (
            <form
                class="flex flex-col gap-4 w-75"
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Form submitted!");
                }}
            >
                <div class="flex flex-col gap-2">
                    <Label for="form-email" required>
                        Email
                    </Label>
                    <Input
                        id="form-email"
                        type="email"
                        value={email()}
                        onInput={setEmail}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="form-password" required>
                        Password
                    </Label>
                    <Input
                        id="form-password"
                        type="password"
                        value={password()}
                        onInput={setPassword}
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    class="px-4 py-2 rounded border-none bg-accent text-primary cursor-pointer"
                >
                    Submit
                </button>
            </form>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Input components used in a form context. Shows proper labeling and structure.",
            },
        },
    },
};
