# Design System Guide for LLMs

This document serves as a comprehensive guide for AI agents and developers to understand and properly implement the application's design system. **Always refer to this guide when generating new code to ensure consistency and adherence to design principles.**

## Table of Contents

1. [Core Principles](#core-principles)
2. [Theme System](#theme-system)
3. [Color Tokens](#color-tokens)
4. [Typography](#typography)
5. [Component Patterns](#component-patterns)
6. [Best Practices](#best-practices)
7. [Code Examples](#code-examples)

---

## Core Principles

### 1. **Theme-Aware Design**

- All colors MUST use design system tokens, never hardcoded hex values
- Colors automatically adapt to the active theme (nordfox, nightfox, carbonfox, dayfox)
- Default theme is **nordfox**

### 2. **Utility-First Approach**

- Use Tailwind utility classes that map to CSS variables
- NEVER use arbitrary values like `bg-[var(--color-primary)]`
- ALWAYS use semantic utility classes like `bg-primary`, `text-fg-main`, `border-ui-border`

### 3. **Consistency**

- Follow established patterns for spacing, typography, and component structure
- Maintain visual hierarchy using the defined type scale
- Ensure accessibility with proper contrast ratios (handled by theme colors)

---

## Theme System

### Available Themes

The application supports four themes that can be switched dynamically:

1. **nordfox** (default) - Nord-inspired color scheme
2. **nightfox** - Dark blue-tinted theme
3. **carbonfox** - Carbon-inspired dark theme
4. **dayfox** - Light theme

### Theme Implementation

Themes are applied via the `data-theme` attribute on the `<html>` element:

```html
<html data-theme="nordfox"></html>
```

**Important**: When generating code, you should NOT manually set `data-theme`. The theme system handles this automatically through:

- `ThemeToggle` component for user switching
- `Layout.astro` initialization script for persistence

---

## Color Tokens

### Primary Colors (Backgrounds)

| Token               | Utility Class  | Usage                             |
| ------------------- | -------------- | --------------------------------- |
| `--color-primary`   | `bg-primary`   | Main page background              |
| `--color-secondary` | `bg-secondary` | Elevated surfaces, cards, panels  |
| `--color-tertiary`  | `bg-tertiary`  | Code blocks, deep nested surfaces |

### Foreground Colors (Text)

| Token              | Utility Class   | Usage                         |
| ------------------ | --------------- | ----------------------------- |
| `--color-fg-main`  | `text-fg-main`  | Primary text content          |
| `--color-fg-muted` | `text-fg-muted` | Secondary text, labels, hints |

### Accent Color

| Token            | Utility Class              | Usage                                         |
| ---------------- | -------------------------- | --------------------------------------------- |
| `--color-accent` | `bg-accent`, `text-accent` | Interactive elements, links, highlights, CTAs |

### Syntax Colors (Code Highlighting)

| Token                     | Utility Class                                | Usage             |
| ------------------------- | -------------------------------------------- | ----------------- |
| `--color-syntax-keyword`  | `bg-syntax-keyword`, `text-syntax-keyword`   | Keywords in code  |
| `--color-syntax-string`   | `bg-syntax-string`, `text-syntax-string`     | Strings in code   |
| `--color-syntax-function` | `bg-syntax-function`, `text-syntax-function` | Functions in code |
| `--color-syntax-number`   | `bg-syntax-number`, `text-syntax-number`     | Numbers in code   |
| `--color-syntax-comment`  | `bg-syntax-comment`, `text-syntax-comment`   | Comments in code  |

### UI Colors (Borders & States)

| Token               | Utility Class      | Usage               |
| ------------------- | ------------------ | ------------------- |
| `--color-ui-border` | `border-ui-border` | Borders, dividers   |
| `--color-ui-active` | `bg-ui-active`     | Active/hover states |
| `--color-ui-gutter` | `bg-ui-gutter`     | Sidebars, gutters   |

### ❌ WRONG - Never Do This

```html
<!-- DON'T use arbitrary values -->
<div class="bg-[var(--color-primary)] text-[var(--color-fg-main)]">
    <div style="background-color: #1d2021; color: #e5e9f0;"></div>
</div>
```

### ✅ CORRECT - Always Do This

```html
<!-- DO use utility classes -->
<div class="bg-primary text-fg-main">
    <div class="bg-secondary border border-ui-border"></div>
</div>
```

---

## Typography

### Font Families

#### Sans Serif (Body Text)

- **Font**: Google Sans
- **Usage**: Body text, UI elements, headings
- **Classes**: `font-sans` (default)
- **CSS Variable**: `var(--font-sans)`

#### Monospace (Code)

- **Font**: DankMono
- **Usage**: Code blocks, technical content, inline code
- **Classes**: `font-mono`
- **CSS Variable**: `var(--font-mono)`

### Type Scale

| Element     | Class                    | Usage                 |
| ----------- | ------------------------ | --------------------- |
| Heading 1   | `text-5xl font-bold`     | Page titles           |
| Heading 2   | `text-4xl font-bold`     | Section titles        |
| Heading 3   | `text-3xl font-bold`     | Subsection titles     |
| Heading 4   | `text-2xl font-semibold` | Card titles           |
| Heading 5   | `text-xl font-semibold`  | Small section headers |
| Heading 6   | `text-lg font-medium`    | Minor headers         |
| Body        | `text-base`              | Default body text     |
| Small       | `text-sm`                | Captions, metadata    |
| Extra Small | `text-xs`                | Fine print, labels    |

### Typography Examples

```html
<h1 class="text-5xl font-bold">Main Title</h1>
<h2 class="text-3xl font-bold mb-4">Section Title</h2>

<p class="text-base text-fg-main">Regular paragraph text</p>
<p class="text-sm text-fg-muted">Secondary information</p>

<code class="font-mono text-sm">inline code</code>
<pre class="font-mono text-sm"><code>code block</code></pre>
```

---

## Component Patterns

### Cards

```html
<div class="p-6 rounded-lg bg-secondary border border-ui-border">
    <h3 class="text-xl font-semibold mb-2 text-accent">Card Title</h3>
    <p class="text-sm text-fg-muted">Card content goes here</p>
</div>
```

### Buttons

```html
<!-- Primary Button -->
<button
    class="px-4 py-2 rounded bg-accent text-primary font-medium hover:opacity-90 transition-opacity"
>
    Primary Action
</button>

<!-- Secondary Button -->
<button
    class="px-4 py-2 rounded border border-ui-border hover:bg-tertiary transition-colors"
>
    Secondary Action
</button>

<!-- Text Button -->
<button
    class="px-4 py-2 rounded text-accent hover:bg-tertiary transition-colors"
>
    Text Action
</button>
```

### Form Inputs

```html
<div>
    <label class="block text-sm font-medium mb-2">Input Label</label>
    <input
        type="text"
        placeholder="Enter text..."
        class="w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent"
    />
</div>

<div>
    <label class="block text-sm font-medium mb-2">Textarea</label>
    <textarea
        placeholder="Enter text..."
        rows="3"
        class="w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
    ></textarea>
</div>
```

### Headers/Navigation

```html
<header
    class="sticky top-0 z-50 border-b border-ui-border bg-secondary/80 backdrop-blur-sm"
>
    <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Page Title</h1>
        </div>
    </div>
</header>
```

### Sections

```html
<section class="mb-16">
    <h2 class="text-3xl font-bold mb-8 pb-4 border-b border-ui-border">
        Section Title
    </h2>
</section>
```

---

## Best Practices

### 1. **Always Use Design Tokens**

✅ **DO:**

```html
<div class="bg-secondary text-fg-main border border-ui-border"></div>
```

❌ **DON'T:**

```html
<div class="bg-[var(--color-secondary)]" style="color: #e5e9f0;"></div>
```

### 2. **Maintain Spacing Consistency**

Use Tailwind's spacing scale:

- `p-4`, `p-6`, `p-8` for padding
- `mb-4`, `mb-6`, `mb-8`, `mb-16` for margins
- `gap-4`, `gap-6` for grid/flex gaps

### 3. **Use Semantic Color Names**

✅ **DO:**

```html
<div class="bg-secondary text-fg-main">
    <button class="bg-accent text-primary"></button>
</div>
```

❌ **DON'T:**

```html
<div class="bg-gray-800 text-white">
    <button class="bg-blue-500 text-black"></button>
</div>
```

### 4. **Responsive Design**

Always consider responsive breakpoints:

```html
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="text-sm md:text-base"></div>
</div>
```

### 5. **Never Use Fixed Colors**

**CRITICAL RULE**: Never use fixed color names like `black`, `white`, `gray`, `red`, `blue`, etc. in any context. This applies to:

- Text colors (`text-black`, `text-white`, `text-gray-500`)
- Background colors (`bg-black`, `bg-white`, `bg-gray-100`)
- Border colors (`border-black`, `border-white`, `border-gray-300`)
- Opacity overlays (`bg-black/20`, `bg-white/10`)
- Hover/focus states (`hover:bg-black/10`, `hover:text-white`)
- Any other color application

✅ **DO:**

```html
<!-- Use semantic tokens for all color needs -->
<div class="bg-primary text-fg-main border-ui-border">
    <button class="hover:bg-fg-main/10 text-accent">Click</button>
    <div class="bg-secondary/80 backdrop-blur">Overlay</div>
</div>
```

❌ **DON'T:**

```html
<!-- Never use fixed colors -->
<div class="bg-gray-900 text-white border-gray-700">
    <button class="hover:bg-black/20 text-blue-500">Click</button>
    <div class="bg-white/10 backdrop-blur">Overlay</div>
</div>
```

**Why?** Fixed colors break theme compatibility. All components must work seamlessly across all themes (dark and light). Using semantic tokens ensures proper contrast and visual consistency regardless of the active theme.

### 6. **Accessibility**

- Use proper heading hierarchy (h1 → h2 → h3)
- Ensure sufficient color contrast (handled by theme colors)
- Use semantic HTML elements
- Include proper ARIA labels when needed

### 7. **Theme Compatibility**

All components MUST work across all themes. Test that:

- Text remains readable in all themes
- Borders and dividers are visible
- Interactive states (hover, focus) are clear
- Color combinations maintain proper contrast

### 8. **Prefer Dictionary Maps Over Switch Statements**

When mapping values or handling conditional logic, prefer dictionary object maps over switch statements for better maintainability and performance.

✅ **DO:**

```typescript
const sizeMap = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
} as const;

const className = sizeMap[size] || sizeMap.md;
```

❌ **DON'T:**

```typescript
let className: string;
switch (size) {
    case "sm":
        className = "px-3 py-1.5 text-sm";
        break;
    case "md":
        className = "px-4 py-2 text-base";
        break;
    case "lg":
        className = "px-6 py-3 text-lg";
        break;
    default:
        className = "px-4 py-2 text-base";
}
```

**Benefits:**

- More concise and readable
- Easier to maintain and extend
- Better TypeScript inference with `as const`
- Can be used directly in expressions
- No fall-through bugs

---

### 9. **Strict Component Colors**

Components offering color variants must strictly use the following set of semantic colors:

- `accent` (Brand color, default action)
- `success` (Positive action)
- `warning` (Cautionary action)
- `error` (Destructive action)

**NEVER** use `neutral` or `primary` as color prop values.

❌ **DON'T:**

```tsx
<Chip color="neutral" />
<Button color="primary" />
```

✅ **DO:**

```tsx
<Chip color="accent" />
<Button color="success" />
```

---

## Code Examples

### Complete Component Example

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout>
    <div class="min-h-screen bg-primary text-fg-main">
        <header
            class="sticky top-0 z-50 border-b border-ui-border bg-secondary/80 backdrop-blur-sm"
        >
            <div class="container mx-auto px-6 py-4">
                <h1 class="text-2xl font-bold">Page Title</h1>
            </div>
        </header>

        <main class="container mx-auto px-6 py-12 max-w-7xl">
            <section class="mb-16">
                <h2
                    class="text-3xl font-bold mb-8 pb-4 border-b border-ui-border"
                >
                    Section Title
                </h2>

                <div class="grid md:grid-cols-2 gap-6">
                    <div
                        class="p-6 rounded-lg bg-secondary border border-ui-border"
                    >
                        <h3 class="text-xl font-semibold mb-2 text-accent">
                            Card Title
                        </h3>
                        <p class="text-sm text-fg-muted">
                            Card content description
                        </p>
                    </div>
                </div>
            </section>
        </main>
    </div>
</Layout>
```

### Form Example

```html
<form class="space-y-4 max-w-md">
    <div>
        <label class="block text-sm font-medium mb-2 text-fg-main">
            Email
        </label>
        <input
            type="email"
            class="w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="your@email.com"
        />
    </div>

    <button
        type="submit"
        class="w-full px-4 py-2 rounded bg-accent text-primary font-medium hover:opacity-90 transition-opacity"
    >
        Submit
    </button>
</form>
```

### Code Block Example

```html
<div class="p-6 rounded-lg bg-tertiary border border-ui-border">
    <pre class="font-mono text-sm overflow-x-auto">
        <code>
            <span class="text-syntax-keyword">const</span> 
            <span class="text-syntax-function">example</span> = 
            <span class="text-syntax-string">"Hello"</span>;
        </code>
    </pre>
</div>
```

---

## Quick Reference

### Most Common Patterns

```html
<!-- Container -->
<div class="container mx-auto px-6 py-12">
    <!-- Card -->
    <div class="p-6 rounded-lg bg-secondary border border-ui-border">
        <!-- Button Primary -->
        <button class="px-4 py-2 rounded bg-accent text-primary font-medium">
            <!-- Button Secondary -->
            <button
                class="px-4 py-2 rounded border border-ui-border hover:bg-tertiary"
            >
                <!-- Heading -->
                <h2 class="text-3xl font-bold mb-4">
                    <!-- Body Text -->
                    <p class="text-base text-fg-main">
                        <!-- Muted Text -->
                    </p>

                    <p class="text-sm text-fg-muted">
                        <!-- Section Divider -->
                    </p>

                    <div class="border-b border-ui-border mb-8 pb-4"></div>
                </h2>
            </button>
        </button>
    </div>
</div>
```

---

## File Locations

- **Design Tokens**: `src/assets/design/tokens.css`
- **Design System Documentation**: `src/pages/design-system.astro`
- **Theme Toggle Component**: `src/components/ThemeToggle.tsx`
- **Layout**: `src/layouts/Layout.astro`

---

## Reminders for LLMs

1. **NEVER** use hardcoded colors (hex codes, rgb values)
2. **NEVER** use fixed color names (`black`, `white`, `gray`, `red`, `blue`, etc.) in ANY context - including text, backgrounds, borders, opacity overlays, or hover/focus states
3. **ALWAYS** use utility classes (`bg-primary`, not `bg-[var(--color-primary)]`)
4. **ALWAYS** ensure components work across all themes
5. **ALWAYS** use semantic color names from the design system
6. **ALWAYS** follow the typography scale
7. **ALWAYS** maintain consistent spacing using Tailwind utilities
8. **ALWAYS** test that text is readable in all themes
9. **ALWAYS** prefer dictionary object maps over switch statements for value mapping
10. **NEVER** write useless comments that just describe what the code already shows (e.g., `// icon` above an `<Icon>` component)
11. **ALWAYS** restrict component color props to: "accent", "success", "warning", "error". NEVER use "primary" or "neutral".

---

## Questions?

If you're unsure about which color or utility to use:

1. Check `src/pages/design-system.astro` for visual examples
2. Review `src/assets/design/tokens.css` for available tokens
3. Look at existing components for patterns
4. When in doubt, use `bg-secondary` for containers and `text-fg-main` for text

**Remember**: The design system is theme-aware. Your code should automatically adapt to theme changes without modification.
