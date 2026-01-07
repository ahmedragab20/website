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

## Native Token Usage

### Philosophy: Don't Reinvent the Wheel

The design system provides a comprehensive set of native CSS custom properties and Tailwind utility classes in `src/assets/design/tokens.css`. **Every new component MUST rely on these native presets** instead of creating custom values or duplicating existing functionality.

### Critical Rules

> [!CAUTION]
> **NEVER** create custom CSS variables, hardcoded values, or arbitrary Tailwind classes when native tokens exist. This is a **CRITICAL** violation of the design system.

1. **NEVER** use hardcoded values:
    - ❌ `color: #81a1c1;`
    - ❌ `padding: 12px;`
    - ❌ `font-size: 16px;`
    - ❌ `border-radius: 8px;`

2. **NEVER** use arbitrary Tailwind values:
    - ❌ `bg-[var(--color-primary)]`
    - ❌ `p-[12px]`
    - ❌ `text-[#81a1c1]`
    - ❌ `rounded-[8px]`

3. **NEVER** create custom CSS variables that duplicate tokens:
    - ❌ `--my-component-bg: var(--color-secondary);`
    - ❌ `--button-padding: 1rem;`

4. **ALWAYS** use native Tailwind utility classes:
    - ✅ `bg-primary`
    - ✅ `p-4`
    - ✅ `text-accent`
    - ✅ `rounded-lg`

### Available Native Tokens

#### Color Tokens

All color tokens automatically adapt to the active theme. **Use these exclusively for all color needs.**

**Background Colors:**

```
bg-primary       → Main page background
bg-secondary     → Elevated surfaces, cards, panels
bg-tertiary      → Code blocks, deep nested surfaces
```

**Foreground Colors (Text):**

```
text-fg-main     → Primary text content
text-fg-muted    → Secondary text, labels, hints
```

**Semantic Colors:**

```
bg-accent / text-accent       → Brand color, primary actions
bg-success / text-success     → Positive actions, success states
bg-warning / text-warning     → Cautionary actions, warnings
bg-error / text-error         → Destructive actions, errors
```

**Syntax Colors (Code Highlighting):**

```
text-syntax-keyword           → Keywords in code
text-syntax-string            → Strings in code
text-syntax-function          → Functions in code
text-syntax-number            → Numbers in code
text-syntax-comment           → Comments in code
```

**UI Colors:**

```
border-ui-border              → Borders, dividers
bg-ui-active                  → Active/hover states
bg-ui-gutter                  → Sidebars, gutters
```

#### Typography Tokens

**Font Families:**

```
font-sans        → Google Sans (default for UI)
font-mono        → DankMono (for code)
```

**Font Sizes:**

```
text-xs          → 0.75rem (12px)
text-sm          → 0.875rem (14px)
text-base        → 1rem (16px)
text-lg          → 1.125rem (18px)
text-xl          → 1.25rem (20px)
text-2xl         → 1.5rem (24px)
text-3xl         → 1.875rem (30px)
text-4xl         → 2.25rem (36px)
text-5xl         → 3rem (48px)
```

**Font Weights:**

```
font-normal      → 400
font-medium      → 500
font-semibold    → 600
font-bold        → 700
```

#### Spacing Tokens

**Padding & Margin:**

```
p-0 / m-0        → 0
p-1 / m-1        → 0.25rem (4px)
p-2 / m-2        → 0.5rem (8px)
p-3 / m-3        → 0.75rem (12px)
p-4 / m-4        → 1rem (16px)
p-6 / m-6        → 1.5rem (24px)
p-8 / m-8        → 2rem (32px)
p-12 / m-12      → 3rem (48px)
p-16 / m-16      → 4rem (64px)
```

**Gap (for Flexbox/Grid):**

```
gap-1            → 0.25rem (4px)
gap-2            → 0.5rem (8px)
gap-4            → 1rem (16px)
gap-6            → 1.5rem (24px)
gap-8            → 2rem (32px)
```

#### Border Radius Tokens

```
rounded-none     → 0
rounded-sm       → 0.125rem (2px)
rounded          → 0.25rem (4px)
rounded-md       → 0.375rem (6px)
rounded-lg       → 0.5rem (8px)
rounded-xl       → 0.75rem (12px)
rounded-2xl      → 1rem (16px)
rounded-full     → 9999px (perfect circle)
```

#### Shadow Tokens

```
shadow-sm        → Small shadow
shadow           → Default shadow
shadow-md        → Medium shadow
shadow-lg        → Large shadow
shadow-xl        → Extra large shadow
shadow-2xl       → 2X large shadow
```

#### Transition Tokens

```
transition-none              → No transition
transition-all               → All properties
transition-colors            → Color properties
transition-opacity           → Opacity
transition-transform         → Transform

duration-75                  → 75ms
duration-100                 → 100ms
duration-150                 → 150ms
duration-200                 → 200ms
duration-300                 → 300ms
duration-500                 → 500ms
duration-700                 → 700ms

ease-linear                  → Linear easing
ease-in                      → Ease in
ease-out                     → Ease out
ease-in-out                  → Ease in-out
```

#### Z-Index Tokens

```
z-0              → 0
z-10             → 10
z-20             → 20
z-30             → 30
z-40             → 40
z-50             → 50
z-auto           → auto
```

### Component Development Checklist

Before submitting any component, ensure it passes this checklist:

- [ ] **Colors**: Uses only design system color tokens (no hardcoded hex/rgb values)
- [ ] **Spacing**: Uses only design system spacing tokens (no hardcoded px/rem values)
- [ ] **Typography**: Uses only design system typography tokens (no hardcoded font sizes/weights)
- [ ] **Borders**: Uses only design system border tokens (no hardcoded border values)
- [ ] **Shadows**: Uses only design system shadow tokens (no custom box-shadow)
- [ ] **Transitions**: Uses only design system transition tokens (no custom timing)
- [ ] **No Custom Variables**: No CSS variables that duplicate existing tokens
- [ ] **No Arbitrary Values**: No arbitrary Tailwind values like `bg-[#hex]` or `p-[12px]`
- [ ] **Theme Compatible**: Component works correctly across all themes
- [ ] **Variants**: All component variants use token-based values

### Migration Patterns

#### ❌ Before (Hardcoded Values)

```tsx
// DON'T DO THIS
const buttonStyles = tv({
    base: "px-[16px] py-[8px] bg-[#81a1c1] text-[#1d2021] rounded-[8px]",
    variants: {
        size: {
            sm: "px-[12px] py-[6px] text-[14px]",
            md: "px-[16px] py-[8px] text-[16px]",
            lg: "px-[20px] py-[10px] text-[18px]",
        },
    },
});
```

#### ✅ After (Token-Based)

```tsx
// DO THIS
const buttonStyles = tv({
    base: "px-4 py-2 bg-accent text-primary rounded-lg",
    variants: {
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
    },
});
```

#### ❌ Before (Custom CSS Variables)

```css
/* DON'T DO THIS */
.my-component {
    --component-bg: var(--color-secondary);
    --component-padding: 1rem;
    background: var(--component-bg);
    padding: var(--component-padding);
}
```

#### ✅ After (Direct Token Usage)

```tsx
// DO THIS
<div className="bg-secondary p-4">{/* content */}</div>
```

### Enforcement

**Code Review Requirements:**

1. All PRs must pass token usage audit
2. No hardcoded values allowed in component files
3. No custom CSS variables that duplicate tokens
4. All components must work across all themes

**Automated Checks:**

Run these commands to audit token usage:

```bash
# Find hardcoded hex colors
grep -r "#[0-9a-fA-F]\{3,6\}" src/components --include="*.tsx" --include="*.css"

# Find arbitrary Tailwind values
grep -r "\[var(--" src/components --include="*.tsx"

# Find hardcoded pixel values in Tailwind
grep -r "px-\[" src/components --include="*.tsx"
```

All findings must be addressed before merging.

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
3. **NEVER** use arbitrary Tailwind values (`bg-[var(--color-primary)]`, `p-[12px]`, etc.)
4. **NEVER** create custom CSS variables that duplicate existing tokens
5. **ALWAYS** use utility classes (`bg-primary`, not `bg-[var(--color-primary)]`)
6. **ALWAYS** ensure components work across all themes
7. **ALWAYS** use semantic color names from the design system
8. **ALWAYS** follow the typography scale
9. **ALWAYS** maintain consistent spacing using Tailwind utilities
10. **ALWAYS** test that text is readable in all themes
11. **ALWAYS** prefer dictionary object maps over switch statements for value mapping
12. **NEVER** write useless comments that just describe what the code already shows (e.g., `// icon` above an `<Icon>` component)
13. **ALWAYS** restrict component color props to: "accent", "success", "warning", "error". NEVER use "primary" or "neutral".
14. **ALWAYS** refer to the [Native Token Usage](#native-token-usage) section before creating any component
15. **ALWAYS** pass the Component Development Checklist before submitting code

---

## Questions?

If you're unsure about which color or utility to use:

1. Check `src/pages/design-system.astro` for visual examples
2. Review `src/assets/design/tokens.css` for available tokens
3. Look at existing components for patterns
4. When in doubt, use `bg-secondary` for containers and `text-fg-main` for text

**Remember**: The design system is theme-aware. Your code should automatically adapt to theme changes without modification.
