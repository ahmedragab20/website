import type { StoryObj, Meta } from "storybook-solidjs-vite";
import ThemeToggle from "../components/app/ThemeToggle/ThemeToggle";

const meta: Meta = {
    title: "Design System/Overview",
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj;

const ColorSwatch = (props: {
    name: string;
    variable: string;
    description: string;
}) => (
    <div class="flex flex-col gap-2">
        <div
            class="h-24 w-full rounded-lg border border-ui-border shadow-sm transition-all duration-300"
            style={{ "background-color": `var(${props.variable})` }}
        />
        <div class="flex flex-col gap-0.5">
            <span class="font-mono text-sm font-bold text-fg-main">
                {props.name}
            </span>
            <span class="font-mono text-xs text-fg-muted">
                {props.variable}
            </span>
            <span class="text-xs text-fg-muted">{props.description}</span>
        </div>
    </div>
);

const ColorSection = (props: { title: string; children: any }) => (
    <section class="flex flex-col gap-8 mt-8">
        <h3 class="text-xl font-bold text-fg-main border-b border-ui-border pb-2">
            {props.title}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {props.children}
        </div>
    </section>
);

export const Showcase: Story = {
    render: () => (
        <div class="min-h-screen bg-primary text-fg-main transition-colors duration-300 p-8 font-sans">
            <div class="container mx-auto space-y-16 relative">
                {/* Header & Toggle */}
                <header class="flex flex-col md:flex-row gap-8 items-start justify-between">
                    <div class="flex flex-col gap-4 max-w-xl">
                        <h1 class="text-4xl font-bold tracking-tight">
                            Design System
                        </h1>
                        <p class="text-fg-muted text-lg leading-relaxed">
                            A showcase of the design tokens, including color
                            palettes, typography, and UI states. Use the toggle
                            to preview different themes.
                        </p>
                    </div>
                    <div class="w-full md:w-auto">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Base Colors */}
                <ColorSection title="Base Colors">
                    <ColorSwatch
                        name="Primary"
                        variable="--color-primary"
                        description="Main background color"
                    />
                    <ColorSwatch
                        name="Secondary"
                        variable="--color-secondary"
                        description="Secondary background / Surface"
                    />
                    <ColorSwatch
                        name="Tertiary"
                        variable="--color-tertiary"
                        description="Tertiary background / Hover states"
                    />
                </ColorSection>

                {/* Content Colors */}
                <ColorSection title="Content & Text">
                    <ColorSwatch
                        name="Foreground Main"
                        variable="--color-fg-main"
                        description="Primary text color"
                    />
                    <ColorSwatch
                        name="Foreground Muted"
                        variable="--color-fg-muted"
                        description="Secondary / Placeholder text"
                    />
                    <ColorSwatch
                        name="Accent"
                        variable="--color-accent"
                        description="Brand accent color"
                    />
                </ColorSection>

                {/* Status Colors */}
                <ColorSection title="Status Colors">
                    <ColorSwatch
                        name="Success"
                        variable="--color-success"
                        description="Success states and confirmations"
                    />
                    <ColorSwatch
                        name="Warning"
                        variable="--color-warning"
                        description="Warnings and alerts"
                    />
                    <ColorSwatch
                        name="Error"
                        variable="--color-error"
                        description="Errors and destructive actions"
                    />
                </ColorSection>

                {/* Syntax Highlighting */}
                <ColorSection title="Syntax Highlighting">
                    <ColorSwatch
                        name="Keyword"
                        variable="--color-syntax-keyword"
                        description="Language keywords"
                    />
                    <ColorSwatch
                        name="String"
                        variable="--color-syntax-string"
                        description="String literals"
                    />
                    <ColorSwatch
                        name="Function"
                        variable="--color-syntax-function"
                        description="Function definitions and calls"
                    />
                    <ColorSwatch
                        name="Number"
                        variable="--color-syntax-number"
                        description="Numeric literals"
                    />
                    <ColorSwatch
                        name="Comment"
                        variable="--color-syntax-comment"
                        description="Code comments"
                    />
                </ColorSection>

                {/* UI Elements */}
                <ColorSection title="UI Elements">
                    <ColorSwatch
                        name="Border"
                        variable="--color-ui-border"
                        description="Borders and dividers"
                    />
                    <ColorSwatch
                        name="Active"
                        variable="--color-ui-active"
                        description="Active states / Selections"
                    />
                    <ColorSwatch
                        name="Gutter"
                        variable="--color-ui-gutter"
                        description="Editor gutters / Panels"
                    />
                </ColorSection>

                {/* Typography Showcase */}
                <section class="flex flex-col gap-6">
                    <h3 class="text-xl font-bold text-fg-main border-b border-ui-border pb-2">
                        Typography
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div class="flex flex-col gap-4">
                            <span class="text-xs font-bold text-fg-muted uppercase tracking-wider">
                                Sans Serif (Google Sans)
                            </span>
                            <div class="flex flex-col gap-2">
                                <h1 class="text-4xl font-bold">Heading 1</h1>
                                <h2 class="text-3xl font-bold">Heading 2</h2>
                                <h3 class="text-2xl font-bold">Heading 3</h3>
                                <p class="text-base text-fg-main leading-relaxed">
                                    The quick brown fox jumps over the lazy dog.
                                    This is a sample paragraph demonstrating
                                    body text legibility and color contrast.
                                </p>
                                <p class="text-sm text-fg-muted">
                                    Small text for captions and secondary
                                    information.
                                </p>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <span class="text-xs font-bold text-fg-muted uppercase tracking-wider">
                                Monospace (Dank Mono)
                            </span>
                            <div class="bg-secondary p-6 rounded-xl border border-ui-border text-sm font-mono overflow-hidden">
                                <div class="flex gap-4">
                                    <div class="flex flex-col text-fg-muted select-none text-right">
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                        <span>5</span>
                                    </div>
                                    <pre class="flex flex-col">
                                        <code>
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-keyword)",
                                                }}
                                            >
                                                function
                                            </span>{" "}
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-function)",
                                                }}
                                            >
                                                calculateTotal
                                            </span>
                                            (items) {"{"}
                                        </code>
                                        <code>
                                            {"  "}
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-keyword)",
                                                }}
                                            >
                                                const
                                            </span>{" "}
                                            total = items.
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-function)",
                                                }}
                                            >
                                                reduce
                                            </span>
                                            ((sum, item) ={">"} {"{"}
                                        </code>
                                        <code>
                                            {"    "}
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-comment)",
                                                }}
                                            >
                                                // Add price to accumulator
                                            </span>
                                        </code>
                                        <code>
                                            {"    "}
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-keyword)",
                                                }}
                                            >
                                                return
                                            </span>{" "}
                                            sum + item.price;
                                        </code>
                                        <code>
                                            {"  "}
                                            {"}"},{" "}
                                            <span
                                                style={{
                                                    color: "var(--color-syntax-number)",
                                                }}
                                            >
                                                0
                                            </span>
                                            );
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    ),
};
