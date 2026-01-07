import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { createSignal } from "solid-js";
import { Textarea } from "./Textarea";
import { Label } from "../Label/Label";

/**
 * Textarea component for multi-line text input and form controls.
 *
 * Supports multiple sizes, resize behaviors, and states.
 * Includes built-in error and disabled states.
 * Fully accessible with ARIA support.
 *
 * @example
 * ```tsx
 * <Textarea value={value()} onInput={(v) => setValue(v)} placeholder="Enter your message" />
 * ```
 */
const meta = {
    title: "Atoms/Textarea",
    component: Textarea,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of textarea",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        resize: {
            control: "select",
            options: ["none", "vertical", "horizontal", "both"],
            description: "Resize behavior of textarea",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "none" },
            },
        },
        rows: {
            control: "number",
            description: "Number of visible text lines",
            table: {
                type: { summary: "number" },
            },
        },
        cols: {
            control: "number",
            description:
                "Visible width of textarea in average character widths",
            table: {
                type: { summary: "number" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether textarea is disabled",
        },
        required: {
            control: "boolean",
            description: "Whether textarea is required",
        },
        readonly: {
            control: "boolean",
            description: "Whether textarea is readonly",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text",
        },
        value: {
            control: "text",
            description: "Textarea value",
        },
        "aria-label": {
            control: "text",
            description: "Accessible label for screen readers",
        },
        "aria-invalid": {
            control: "boolean",
            description: "Whether textarea has an error",
        },
    },
    args: {
        value: "",
        onInput: fn(),
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea
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
        placeholder: "Enter your message...",
        rows: 4,
    },
};

export const WithLabel: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="textarea-1">Message</Label>
                <Textarea
                    {...args}
                    id="textarea-1"
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
        placeholder: "Type your message here...",
        rows: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Textarea with associated label. Always use labels for accessibility.",
            },
        },
    },
};

// Sizes
export const Small: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        size: "sm",
        placeholder: "Small textarea",
        rows: 3,
    },
};

export const Medium: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        size: "md",
        placeholder: "Medium textarea",
        rows: 4,
    },
};

export const Large: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        size: "lg",
        placeholder: "Large textarea",
        rows: 6,
    },
};

// Resize options
export const NoResize: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        resize: "none",
        placeholder: "Cannot resize this textarea",
        rows: 4,
    },
};

export const VerticalResize: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        resize: "vertical",
        placeholder: "Can resize vertically",
        rows: 4,
    },
};

export const HorizontalResize: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        resize: "horizontal",
        placeholder: "Can resize horizontally",
        rows: 4,
    },
};

export const BothResize: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        resize: "both",
        placeholder: "Can resize in both directions",
        rows: 4,
    },
};

// States
export const Disabled: Story = {
    args: {
        value: "This textarea is disabled",
        disabled: true,
        rows: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled textarea prevents user interaction and shows reduced opacity.",
            },
        },
    },
};

export const Readonly: Story = {
    args: {
        value: "This textarea is readonly but can be selected and copied",
        readonly: true,
        rows: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Readonly textarea allows selection and copying but prevents editing.",
            },
        },
    },
};

export const Required: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="required-textarea" required>
                    Required Field
                </Label>
                <Textarea
                    {...args}
                    id="required-textarea"
                    value={value()}
                    onInput={(v) => setValue(v)}
                    required
                />
            </div>
        );
    },
    args: {
        placeholder: "This field is required",
        rows: 4,
    },
};

export const Error: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="error-textarea">Message</Label>
                <Textarea
                    {...args}
                    id="error-textarea"
                    value={value()}
                    onInput={(v) => setValue(v)}
                    aria-invalid={true}
                    aria-describedby="error-message"
                />
                <span id="error-message" class="text-xs text-error">
                    Message must be at least 10 characters long
                </span>
            </div>
        );
    },
    args: {
        value: "Too short",
        "aria-invalid": true,
        rows: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Textarea in error state. Use aria-invalid and aria-describedby for accessibility.",
            },
        },
    },
};

// Content examples
export const WithPreFilledContent: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(
            args?.value ||
                "This is some pre-filled content.\n\nIt contains multiple lines and paragraphs.\n\nYou can edit this text as needed."
        );
        return (
            <Textarea {...args} value={value()} onInput={(v) => setValue(v)} />
        );
    },
    args: {
        rows: 8,
    },
    parameters: {
        docs: {
            description: {
                story: "Textarea with pre-filled multiline content.",
            },
        },
    },
};

export const WithCharacterCount: Story = {
    render: (args: Story["args"]) => {
        const [value, setValue] = createSignal(args?.value || "");
        const maxLength = 200;
        return (
            <div class="flex flex-col gap-2 w-75">
                <Label for="char-count-textarea">Description</Label>
                <Textarea
                    {...args}
                    id="char-count-textarea"
                    value={value()}
                    onInput={(v) => setValue(v)}
                    maxlength={maxLength}
                    aria-describedby="char-count"
                />
                <span id="char-count" class="text-sm text-fg-muted text-right">
                    {value().length}/{maxLength} characters
                </span>
            </div>
        );
    },
    args: {
        placeholder: "Enter a description (max 200 characters)",
        rows: 4,
    },
    parameters: {
        docs: {
            description: {
                story: "Textarea with character count. Uses maxlength attribute to enforce limit.",
            },
        },
    },
};

// Composition
export const InForm: Story = {
    render: () => {
        const [title, setTitle] = createSignal("");
        const [description, setDescription] = createSignal("");
        const [feedback, setFeedback] = createSignal("");

        return (
            <form
                class="flex flex-col gap-4 w-75"
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Form submitted!");
                }}
            >
                <div class="flex flex-col gap-2">
                    <Label for="form-title" required>
                        Title
                    </Label>
                    <Textarea
                        id="form-title"
                        value={title()}
                        onInput={setTitle}
                        placeholder="Enter title"
                        rows={2}
                        maxlength={100}
                        required
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="form-description" required>
                        Description
                    </Label>
                    <Textarea
                        id="form-description"
                        value={description()}
                        onInput={setDescription}
                        placeholder="Enter detailed description"
                        rows={5}
                        required
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="form-feedback">Feedback (optional)</Label>
                    <Textarea
                        id="form-feedback"
                        value={feedback()}
                        onInput={setFeedback}
                        placeholder="Any additional feedback?"
                        rows={3}
                        resize="vertical"
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
                story: "Multiple textarea components used in a form context. Shows different sizes and behaviors.",
            },
        },
    },
};
