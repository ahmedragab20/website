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

                {/* Footer */}
                <footer class="text-center text-fg-muted text-sm border-t border-ui-border pt-8">
                    <p>
                        Design System • {new Date().getFullYear()} • Built with
                        SolidJS & Tailwind CSS
                    </p>
                </footer>
            </div>
        </div>
    ),
};

export const NativeBehaviors: Story = {
    render: () => (
        <div class="min-h-screen bg-primary text-fg-main p-8 font-sans">
            <div class="container mx-auto max-w-6xl space-y-12">
                {/* Header */}
                <header class="flex flex-col gap-4">
                    <h1 class="text-4xl font-bold tracking-tight">
                        Native Behavior Enhancements
                    </h1>
                    <p class="text-fg-muted text-lg leading-relaxed max-w-3xl">
                        Interactive demonstrations of all native-like behaviors
                        automatically applied across all themes. These
                        enhancements provide better accessibility, platform
                        integration, and user experience.
                    </p>
                    <div class="w-full md:w-auto">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Scrollbar Demo */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        1. Native Scrollbars
                    </h2>
                    <p class="text-fg-muted">
                        Theme-aware scrollbar styling that adapts to each color
                        scheme.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-4 h-48 overflow-auto">
                        <div class="space-y-2">
                            {Array.from({ length: 20 }, (_, i) => (
                                <p class="text-fg-main">
                                    Scroll line {i + 1} - The scrollbar adapts
                                    to the current theme colors using
                                    --color-ui-active and --color-secondary.
                                </p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Focus Indicators */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        2. Focus Indicators
                    </h2>
                    <p class="text-fg-muted">
                        Accessible focus-visible outlines using accent colors.
                        Try tabbing through these elements.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <button class="px-4 py-2 bg-accent text-primary rounded-lg font-medium">
                            Focusable Button
                        </button>
                        <input
                            type="text"
                            placeholder="Focus me with Tab"
                            class="px-4 py-2 bg-secondary border border-ui-border rounded-lg"
                        />
                        <a
                            href="#"
                            class="px-4 py-2 bg-secondary border border-ui-border rounded-lg inline-block"
                        >
                            Focusable Link
                        </a>
                    </div>
                </section>

                {/* Link States */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        3. Link Styling
                    </h2>
                    <p class="text-fg-muted">
                        Theme-aware link states with smooth transitions.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-3">
                        <p>
                            <a href="#" class="underline">
                                Default link
                            </a>{" "}
                            - Uses accent color
                        </p>
                        <p>
                            <a href="#visited" class="underline">
                                Visited link
                            </a>{" "}
                            - Uses syntax-keyword color
                        </p>
                        <p>
                            Hover over links to see the smooth underline
                            transition
                        </p>
                    </div>
                </section>

                {/* Form Controls */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        4. Form Controls
                    </h2>
                    <p class="text-fg-muted">
                        Native form controls with accent color theming.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-4">
                        <div class="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="checkbox-demo"
                                class="w-5 h-5"
                            />
                            <label for="checkbox-demo" class="cursor-pointer">
                                Checkbox with accent color
                            </label>
                        </div>
                        <div class="flex items-center gap-3">
                            <input
                                type="radio"
                                id="radio-demo"
                                name="radio"
                                class="w-5 h-5"
                            />
                            <label for="radio-demo" class="cursor-pointer">
                                Radio button with accent color
                            </label>
                        </div>
                        <div class="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value="50"
                                class="flex-1"
                            />
                            <span class="text-fg-muted">Range slider</span>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Placeholder text (muted color)"
                                class="w-full px-4 py-2 bg-primary border border-ui-border rounded-lg"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                disabled
                                value="Disabled input (50% opacity)"
                                class="w-full px-4 py-2 bg-primary border border-ui-border rounded-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Text Selection & Caret */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        5. Text Selection & Caret
                    </h2>
                    <p class="text-fg-muted">
                        Custom selection color and caret color using theme
                        tokens.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-4">
                        <p class="text-fg-main select-text">
                            Select this text to see the custom selection color
                            (accent background with primary text). The selection
                            adapts to each theme automatically.
                        </p>
                        <input
                            type="text"
                            value="Click here to see the caret color"
                            class="w-full px-4 py-2 bg-primary border border-ui-border rounded-lg"
                        />
                    </div>
                </section>

                {/* Mark Highlighting */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        6. Mark/Highlight Styling
                    </h2>
                    <p class="text-fg-muted">
                        Theme-aware text highlighting using the warning color.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6">
                        <p class="text-fg-main">
                            This is a paragraph with{" "}
                            <mark>highlighted text</mark> that uses the warning
                            color from the current theme. The{" "}
                            <mark>mark element</mark> automatically adapts to
                            all themes.
                        </p>
                    </div>
                </section>

                {/* Autofill Styling */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        7. Autofill Styling
                    </h2>
                    <p class="text-fg-muted">
                        Browser autofill that respects theme colors.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6">
                        <form class="space-y-3">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email (try autofill)"
                                autocomplete="email"
                                class="w-full px-4 py-2 bg-primary border border-ui-border rounded-lg"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password (try autofill)"
                                autocomplete="current-password"
                                class="w-full px-4 py-2 bg-primary border border-ui-border rounded-lg"
                            />
                        </form>
                    </div>
                </section>

                {/* Typography Features */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        8. Enhanced Typography
                    </h2>
                    <p class="text-fg-muted">
                        Optimized font rendering with kerning and ligatures.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-4">
                        <p class="text-2xl text-fg-main">
                            WAVE Typography fi fl ffi ffl
                        </p>
                        <p class="text-fg-muted text-sm">
                            Font features enabled: kerning, ligatures,
                            antialiasing
                        </p>
                        <div class="font-mono text-sm">
                            <code>0123456789 - Tabular nums for alignment</code>
                        </div>
                    </div>
                </section>

                {/* Accessibility Features */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        9. Accessibility Features
                    </h2>
                    <div class="space-y-6">
                        <div class="bg-secondary border border-ui-border rounded-lg p-6">
                            <h3 class="font-bold mb-2">Reduced Motion</h3>
                            <p class="text-fg-muted text-sm">
                                Respects prefers-reduced-motion setting.
                                Animations are reduced to 0.01ms for users who
                                prefer reduced motion.
                            </p>
                        </div>
                        <div class="bg-secondary border border-ui-border rounded-lg p-6">
                            <h3 class="font-bold mb-2">High Contrast Mode</h3>
                            <p class="text-fg-muted text-sm">
                                Adapts to prefers-contrast: high by increasing
                                border widths and using stronger border colors.
                            </p>
                        </div>
                        <div class="bg-secondary border border-ui-border rounded-lg p-6">
                            <h3 class="font-bold mb-2">Touch Targets</h3>
                            <p class="text-fg-muted text-sm mb-3">
                                On touch devices, interactive elements have a
                                minimum size of 44x44px for better
                                accessibility.
                            </p>
                            <button class="px-3 py-1 bg-accent text-primary rounded text-sm">
                                Small button (auto-sized on touch)
                            </button>
                        </div>
                    </div>
                </section>

                {/* Color Scheme Detection */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        10. Color Scheme Detection
                    </h2>
                    <p class="text-fg-muted">
                        Automatic light/dark color scheme detection for native
                        form controls.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6">
                        <p class="text-fg-main mb-4">
                            The CSS color-scheme property is automatically set
                            based on the theme. This ensures native form
                            controls, scrollbars, and other browser UI elements
                            match the theme.
                        </p>
                        <div class="flex gap-4 flex-wrap">
                            <select class="px-4 py-2 bg-primary border border-ui-border rounded-lg">
                                <option>Native select (themed)</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                            <input
                                type="date"
                                class="px-4 py-2 bg-primary border border-ui-border rounded-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Print Styles */}
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                        11. Print Optimization
                    </h2>
                    <p class="text-fg-muted">
                        Print-friendly styles that convert to black and white.
                    </p>
                    <div class="bg-secondary border border-ui-border rounded-lg p-6">
                        <p class="text-fg-main">
                            Try printing this page (Cmd/Ctrl + P). The print
                            styles automatically convert the theme to a clean
                            black-on-white layout with proper link colors.
                        </p>
                    </div>
                </section>

                {/* Summary */}
                <section class="bg-accent/10 border border-accent/30 rounded-lg p-6">
                    <h2 class="text-2xl font-bold mb-4">
                        ✨ All Enhancements Active
                    </h2>
                    <div class="grid md:grid-cols-2 gap-3 text-sm">
                        <div>✅ Smooth theme transitions</div>
                        <div>✅ Native scrollbars</div>
                        <div>✅ Focus indicators</div>
                        <div>✅ Link states</div>
                        <div>✅ Form control theming</div>
                        <div>✅ Text selection</div>
                        <div>✅ Caret color</div>
                        <div>✅ Mark highlighting</div>
                        <div>✅ Autofill styling</div>
                        <div>✅ Enhanced typography</div>
                        <div>✅ Reduced motion support</div>
                        <div>✅ High contrast mode</div>
                        <div>✅ Touch target optimization</div>
                        <div>✅ Color scheme detection</div>
                        <div>✅ Print optimization</div>
                        <div>✅ Backdrop effects</div>
                    </div>
                </section>

                {/* Footer */}
                <footer class="text-center text-fg-muted text-sm border-t border-ui-border pt-8">
                    <p>
                        All enhancements work automatically across 50+ themes •
                        Zero configuration required
                    </p>
                </footer>
            </div>
        </div>
    ),
};

export const HighContrastAccessibility: Story = {
    render: () => (
        <>
            <style>
                {`
                    /* Force high-contrast mode for accessibility testing */
                    @media (prefers-contrast: no-preference) {
                        :root {
                            /* Override to simulate high-contrast mode */
                            --high-contrast-override: true;
                        }
                        
                        /* Apply high-contrast styles */
                        * {
                            border-width: 2px !important;
                        }
                        
                        .border {
                            border-color: var(--color-fg-main) !important;
                        }
                        
                        button, input, select, textarea {
                            border: 2px solid var(--color-fg-main) !important;
                        }
                        
                        a {
                            text-decoration: underline !important;
                            text-decoration-thickness: 2px !important;
                        }
                    }
                `}
            </style>
            <div class="min-h-screen bg-primary text-fg-main p-8 font-sans">
                <div class="container mx-auto max-w-6xl space-y-12">
                    {/* Header */}
                    <header class="flex flex-col gap-4">
                        <h1 class="text-4xl font-bold tracking-tight">
                            High Contrast Accessibility Testing
                        </h1>
                        <p class="text-fg-muted text-lg leading-relaxed max-w-3xl">
                            This page simulates high-contrast mode to test
                            accessibility features. All borders are enhanced,
                            links are underlined, and contrast is maximized for
                            better visibility.
                        </p>
                        <div class="w-full md:w-auto">
                            <ThemeToggle />
                        </div>
                    </header>

                    {/* High Contrast Info */}
                    <section class="bg-accent/10 border border-accent rounded-lg p-6 space-y-4">
                        <h2 class="text-2xl font-bold">
                            🔍 High Contrast Mode Active
                        </h2>
                        <div class="space-y-2 text-fg-main">
                            <p>
                                <strong>What's different:</strong>
                            </p>
                            <ul class="list-disc list-inside space-y-1 ml-4">
                                <li>
                                    All borders are 2px thick for better
                                    visibility
                                </li>
                                <li>
                                    Border colors use foreground color for
                                    maximum contrast
                                </li>
                                <li>Links are underlined with 2px thickness</li>
                                <li>Form controls have enhanced borders</li>
                            </ul>
                        </div>
                    </section>

                    {/* Color Swatches with High Contrast */}
                    <ColorSection title="Color Palette - High Contrast">
                        <ColorSwatch
                            name="Primary"
                            variable="--color-primary"
                            description="Main background color"
                        />
                        <ColorSwatch
                            name="Foreground Main"
                            variable="--color-fg-main"
                            description="Primary text color"
                        />
                        <ColorSwatch
                            name="Accent"
                            variable="--color-accent"
                            description="Brand accent color"
                        />
                        <ColorSwatch
                            name="Success"
                            variable="--color-success"
                            description="Success states"
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

                    {/* Interactive Elements */}
                    <section class="space-y-4">
                        <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                            Interactive Elements
                        </h2>
                        <p class="text-fg-muted">
                            Test keyboard navigation and focus indicators with
                            enhanced contrast.
                        </p>
                        <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-4">
                            <div class="flex flex-wrap gap-4">
                                <button class="px-4 py-2 bg-accent text-primary rounded-lg font-medium">
                                    Primary Button
                                </button>
                                <button class="px-4 py-2 bg-secondary border border-ui-border rounded-lg font-medium">
                                    Secondary Button
                                </button>
                                <button
                                    disabled
                                    class="px-4 py-2 bg-secondary border border-ui-border rounded-lg font-medium opacity-50"
                                >
                                    Disabled Button
                                </button>
                            </div>
                            <div class="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Text input with enhanced border"
                                    class="w-full px-4 py-2 bg-primary border border-ui-border rounded-lg"
                                />
                                <div class="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="hc-checkbox"
                                        class="w-5 h-5"
                                    />
                                    <label
                                        for="hc-checkbox"
                                        class="cursor-pointer"
                                    >
                                        Checkbox with enhanced border
                                    </label>
                                </div>
                                <div class="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="hc-radio"
                                        name="hc-radio"
                                        class="w-5 h-5"
                                    />
                                    <label
                                        for="hc-radio"
                                        class="cursor-pointer"
                                    >
                                        Radio button with enhanced border
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Links and Navigation */}
                    <section class="space-y-4">
                        <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                            Links and Navigation
                        </h2>
                        <p class="text-fg-muted">
                            All links are underlined with enhanced thickness for
                            better visibility.
                        </p>
                        <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-3">
                            <p>
                                <a href="#" class="text-accent">
                                    Default link with underline
                                </a>
                            </p>
                            <p>
                                <a href="#visited" class="text-accent">
                                    Visited link with underline
                                </a>
                            </p>
                            <p>
                                This is a paragraph with{" "}
                                <a href="#inline" class="text-accent">
                                    inline link
                                </a>{" "}
                                that has enhanced underline thickness.
                            </p>
                        </div>
                    </section>

                    {/* Text Content */}
                    <section class="space-y-4">
                        <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                            Text Content Hierarchy
                        </h2>
                        <div class="bg-secondary border border-ui-border rounded-lg p-6 space-y-4">
                            <h1 class="text-4xl font-bold">Heading 1</h1>
                            <h2 class="text-3xl font-bold">Heading 2</h2>
                            <h3 class="text-2xl font-bold">Heading 3</h3>
                            <p class="text-base text-fg-main leading-relaxed">
                                Regular paragraph text with proper line height
                                and spacing. The high contrast mode ensures
                                maximum readability by enhancing all visual
                                boundaries.
                            </p>
                            <p class="text-sm text-fg-muted">
                                Small text for captions and secondary
                                information, still maintaining good contrast
                                ratios.
                            </p>
                        </div>
                    </section>

                    {/* Status Messages */}
                    <section class="space-y-4">
                        <h2 class="text-2xl font-bold border-b border-ui-border pb-2">
                            Status Messages
                        </h2>
                        <div class="space-y-4">
                            <div class="bg-success/10 border border-success rounded-lg p-4">
                                <p class="text-fg-main font-medium">
                                    ✓ Success: Operation completed successfully
                                </p>
                            </div>
                            <div class="bg-warning/10 border border-warning rounded-lg p-4">
                                <p class="text-fg-main font-medium">
                                    ⚠ Warning: Please review before continuing
                                </p>
                            </div>
                            <div class="bg-error/10 border border-error rounded-lg p-4">
                                <p class="text-fg-main font-medium">
                                    ✕ Error: Something went wrong
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Accessibility Checklist */}
                    <section class="bg-accent/10 border border-accent rounded-lg p-6">
                        <h2 class="text-2xl font-bold mb-4">
                            ✓ Accessibility Features Tested
                        </h2>
                        <div class="grid md:grid-cols-2 gap-3 text-sm">
                            <div>✅ Enhanced border visibility (2px)</div>
                            <div>✅ Maximum contrast borders</div>
                            <div>✅ Underlined links (2px)</div>
                            <div>✅ Clear focus indicators</div>
                            <div>✅ Readable text hierarchy</div>
                            <div>✅ Distinct interactive elements</div>
                            <div>✅ Status color differentiation</div>
                            <div>✅ Form control visibility</div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer class="text-center text-fg-muted text-sm border-t border-ui-border pt-8">
                        <p>
                            High Contrast Mode • Accessibility Testing • WCAG
                            Compliance
                        </p>
                    </footer>
                </div>
            </div>
        </>
    ),
};
