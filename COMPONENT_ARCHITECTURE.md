# Component Architecture Guide for LLMs

This document complements `DESIGN_SYSTEM.md` and provides architectural patterns, conventions, and best practices for building components in this codebase. **Always refer to this guide when generating component code.**

## Table of Contents

1. [Architecture Patterns](#architecture-patterns)
2. [File Structure](#file-structure)
3. [SolidJS Best Practices](#solidjs-best-practices)
4. [Component Patterns](#component-patterns)
5. [TypeScript Conventions](#typescript-conventions)
6. [Accessibility Standards](#accessibility-standards)
7. [Icon Usage](#icon-usage)
8. [Native HTML Elements](#native-html-elements-with-modern-apis)
9. [Performance Guidelines](#performance-guidelines)
10. [Testing Requirements](#testing-requirements)
11. [Code Examples](#code-examples)

---

## Prerequisites

### Required Dependencies

Make sure the following packages are installed:

```bash
pnpm add tailwind-variants @lucide/astro
```

- **`tailwind-variants`**: Provides better type-safe variant management for Tailwind CSS classes
- **`@lucide/astro`**: Icon library for Astro projects (always use Lucide icons, never custom SVG or other icon libraries)

---

## Architecture Patterns

### Atomic Design Pattern

Components should be organized following Atomic Design principles:

```
src/components/
├── atoms/          # Basic building blocks (Button, Input, Label, Icon)
├── molecules/      # Simple combinations (FormField, Card, Badge)
├── organisms/      # Complex components (Header, Form, Navigation)
└── templates/      # Page-level layouts (if needed)
```

**Atomic Levels:**

1. **Atoms** - Smallest, indivisible components
    - Examples: `Button`, `Input`, `Label`, `Icon`, `Text`
    - No dependencies on other components
    - Highly reusable
    - Single responsibility

2. **Molecules** - Simple combinations of atoms
    - Examples: `FormField` (Label + Input), `Card` (Container + Content), `Badge` (Text + Background)
    - Composed of 2-5 atoms
    - Still reusable but more specific

3. **Organisms** - Complex components combining molecules/atoms
    - Examples: `Header` (Logo + Navigation + ThemeToggle), `Form` (multiple FormFields + Button)
    - Business logic may be present
    - Less reusable, more context-specific

### Compound Components Pattern

For complex, composable components, use the Compound Components pattern:

```typescript
// Example: Card component with compound parts
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>
    <Card.Action>Action</Card.Action>
  </Card.Footer>
</Card>
```

**Benefits:**

- Flexible composition
- Better prop drilling control
- Clearer component hierarchy
- Easier to maintain

**Implementation Pattern:**

```typescript
// Card.tsx
export function Card(props: CardProps) {
  return <div class="card-base">{props.children}</div>;
}

Card.Header = function CardHeader(props: CardHeaderProps) {
  return <header class="card-header">{props.children}</header>;
};

Card.Title = function CardTitle(props: CardTitleProps) {
  return <h3 class="card-title">{props.children}</h3>;
};

Card.Body = function CardBody(props: CardBodyProps) {
  return <div class="card-body">{props.children}</div>;
};

Card.Footer = function CardFooter(props: CardFooterProps) {
  return <footer class="card-footer">{props.children}</footer>;
};

Card.Action = function CardAction(props: CardActionProps) {
  return <button class="card-action">{props.children}</button>;
};
```

---

## File Structure

### Component File Organization

```
src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx          # Main component
│   │   ├── Button.test.tsx      # Unit tests (REQUIRED)
│   │   └── index.ts            # Barrel export
│   └── Input/
│       ├── Input.tsx
│       ├── Input.test.tsx      # Unit tests (REQUIRED)
│       └── index.ts
├── molecules/
│   ├── FormField/
│   │   ├── FormField.tsx
│   │   ├── FormField.test.tsx  # Unit tests (REQUIRED)
│   │   └── index.ts
│   └── Card/
│       ├── Card.tsx
│       ├── Card.test.tsx       # Unit tests (REQUIRED)
│       └── index.ts
└── organisms/
    ├── Header/
    │   ├── Header.tsx
    │   ├── Header.test.tsx     # Unit tests (REQUIRED)
    │   └── index.ts
    └── Navigation/
        ├── Navigation.tsx
        ├── Navigation.test.tsx # Unit tests (REQUIRED)
        └── index.ts
```

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `FormField.tsx`)
- **Files**: Match component name exactly
- **Props interfaces**: `ComponentNameProps` (e.g., `ButtonProps`)
- **Types**: PascalCase with descriptive names
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects

### Barrel Exports

Always use barrel exports (`index.ts`) for cleaner imports:

```typescript
// atoms/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

Usage:

```typescript
import { Button } from "@/components/atoms/Button";
```

---

## SolidJS Best Practices

### 1. Signal Usage

✅ **DO:**

```typescript
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  );
}
```

❌ **DON'T:**

```typescript
// Don't use signals for static values
const [staticValue] = createSignal("never changes");

// Don't create signals unnecessarily
const [computed] = createSignal(props.value * 2); // Use createMemo instead
```

### 2. Memos and Effects

✅ **DO:**

```typescript
import { createMemo, createEffect, onCleanup } from 'solid-js';

function ExpensiveComponent(props: { items: Item[] }) {
  // Memoize expensive computations
  const sortedItems = createMemo(() =>
    props.items.sort((a, b) => a.name.localeCompare(b.name))
  );

  // Use effects for side effects
  createEffect(() => {
    console.log('Items changed:', sortedItems());
  });

  return <div>{/* render */}</div>;
}
```

### 3. Component Props

✅ **DO:**

```typescript
interface ButtonProps {
  children: JSX.Element;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  class?: string;
  'aria-label'?: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={`btn btn-${props.variant || 'primary'} ${props.class || ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props['aria-label']}
    >
      {props.children}
    </button>
  );
}
```

### 4. Lifecycle Management

✅ **DO:**

```typescript
import { onMount, onCleanup } from 'solid-js';

function ComponentWithCleanup() {
  let intervalId: number;

  onMount(() => {
    intervalId = setInterval(() => {
      // Do something
    }, 1000);
  });

  onCleanup(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return <div>Component</div>;
}
```

### 5. Direct DOM Manipulation (When Needed)

For performance-critical operations (like animations), use direct DOM manipulation:

✅ **DO:**

```typescript
function AnimatedComponent() {
  let elementRef: HTMLDivElement | undefined;

  const animate = () => {
    if (elementRef) {
      // Direct DOM manipulation for performance
      elementRef.style.transform = 'translateX(100px)';
    }
  };

  return <div ref={elementRef}>Content</div>;
}
```

### 6. Avoid Unnecessary Re-renders

✅ **DO:**

```typescript
// Use splitProps to separate reactive and non-reactive props
import { splitProps } from 'solid-js';

function Component(props: ComponentProps) {
  const [local, others] = splitProps(props, ['children', 'class']);

  // local props are reactive
  // others are non-reactive and can be spread
  return <div class={local.class} {...others}>{local.children}</div>;
}
```

---

## Component Patterns

### 1. Consistent API Pattern

**For consistent API across all components, use this pattern:**

- **`variant`** - Refers to the **shape/style** of the component (e.g., `solid`, `subtle`, `text`, `outline`, `ghost`)
- **`color`** - Separate prop for **color scheme** (e.g., `primary`, `accent`, `success`, `warning`, `error`)
- **`state`** - Separate prop for **interactive states** (e.g., `default`, `hover`, `active`, `disabled`)

✅ **DO:**

```typescript
interface ButtonProps {
  children: JSX.Element;
  variant?: 'solid' | 'subtle' | 'text' | 'outline';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  state?: 'default' | 'hover' | 'active' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
}

// Usage
<Button variant="solid" color="accent">Click me</Button>
<Button variant="subtle" color="success">Success</Button>
<Button variant="text" color="error">Delete</Button>
```

❌ **DON'T:**

```typescript
// Don't mix shape and color in variant
interface ButtonProps {
    variant?: "primary" | "secondary" | "success"; // ❌ Mixing shape and color
}
```

### 2. Tailwind Variants for Variant Management

**Always use `tailwind-variants` for better variant management:**

```typescript
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'px-4 py-2 rounded font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent',
  variants: {
    variant: {
      solid: '',
      subtle: 'bg-opacity-20',
      text: 'bg-transparent',
      outline: 'border-2 bg-transparent'
    },
    color: {
      primary: '',
      accent: '',
      success: '',
      warning: '',
      error: ''
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    },
    state: {
      default: '',
      disabled: 'opacity-50 cursor-not-allowed',
    }
  },
  compoundVariants: [
    // Solid variant with colors
    {
      variant: 'solid',
      color: 'accent',
      class: 'bg-accent text-primary hover:opacity-90'
    },
    {
      variant: 'solid',
      color: 'success',
      class: 'bg-green-600 text-white hover:bg-green-700'
    },
    // Subtle variant with colors
    {
      variant: 'subtle',
      color: 'accent',
      class: 'bg-accent/20 text-accent hover:bg-accent/30'
    },
    // Text variant with colors
    {
      variant: 'text',
      color: 'accent',
      class: 'text-accent hover:bg-accent/10'
    },
    // Outline variant with colors
    {
      variant: 'outline',
      color: 'accent',
      class: 'border-accent text-accent hover:bg-accent/10'
    }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'accent',
    size: 'md',
    state: 'default'
  }
});

export function Button(props: ButtonProps) {
  return (
    <button
      class={button({
        variant: props.variant,
        color: props.color,
        size: props.size,
        state: props.disabled ? 'disabled' : props.state,
        class: props.class
      })}
    >
      {props.children}
    </button>
  );
}
```

### 3. Controlled vs Uncontrolled

**Prefer controlled components** for better predictability:

✅ **DO:**

```typescript
interface InputProps {
  value: string;
  onInput: (value: string) => void;
}

function Input(props: InputProps) {
  return (
    <input
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  );
}
```

### 4. Composition over Configuration

✅ **DO:**

```typescript
// Flexible composition
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

❌ **DON'T:**

```typescript
// Rigid configuration
<Card title="Title" content="Content" showHeader={true} />
```

### 5. Polymorphic Components

For maximum flexibility, support polymorphic rendering:

```typescript
interface ButtonProps {
  as?: 'button' | 'a' | 'div';
  children: JSX.Element;
}

export function Button(props: ButtonProps) {
  const Component = props.as || 'button';

  return (
    <Component class="btn">
      {props.children}
    </Component>
  );
}
```

---

## TypeScript Conventions

### 1. Interface Definitions

✅ **DO:**

```typescript
// Use interfaces for component props
interface ButtonProps {
    children: JSX.Element;
    variant?: "solid" | "subtle";
    onClick?: () => void;
}

// Use types for unions, intersections, and computed types
type ButtonVariant = "solid" | "subtle";
type ButtonSize = "sm" | "md" | "lg";
```

### 2. Type Exports

Always export prop types for consumers:

```typescript
export interface ButtonProps {
    // ...
}

export function Button(props: ButtonProps) {
    // ...
}
```

### 3. Strict Type Safety

✅ **DO:**

```typescript
// Use const assertions for literal types
const themes = ["nordfox", "nightfox", "carbonfox", "dayfox"] as const;
type Theme = (typeof themes)[number];

// Use satisfies for type checking without widening
const config = {
    theme: "nordfox",
    colors: ["primary", "secondary"],
} satisfies Config;
```

---

## Accessibility Standards

### 1. Semantic HTML

✅ **DO:**

```typescript
// Use semantic elements
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

### 2. ARIA Attributes

✅ **DO:**

```typescript
<button
  aria-label="Close dialog"
  aria-expanded={isOpen()}
  aria-controls="dialog-id"
>
  Close
</button>
```

### 3. Keyboard Navigation

✅ **DO:**

```typescript
function Button(props: ButtonProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      props.onClick?.();
    }
  };

  return (
    <button
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
      tabIndex={props.disabled ? -1 : 0}
    >
      {props.children}
    </button>
  );
}
```

### 4. Focus Management

✅ **DO:**

```typescript
function Modal(props: ModalProps) {
  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    if (props.isOpen && dialogRef) {
      dialogRef.showModal();
      dialogRef.focus();
    }
  });

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title">
      {/* content */}
    </dialog>
  );
}
```

---

## Icon Usage

### Always Use Lucide Icons

**Always use Lucide icons from `@lucide/astro`**. Never use custom SVG icons or other icon libraries.

### Import Pattern

✅ **DO:**

```typescript
// In Astro files (.astro)
import { Salad, ChevronDown, X, Check } from "@lucide/astro";
```

### Usage Examples

#### In Astro Files

Lucide icons are used directly as components. They accept standard SVG props including `size`, `class`, `color`, `stroke-width`, and all standard HTML attributes.

```astro
---
import { Salad } from "@lucide/astro";
---

<!-- Direct usage with Tailwind classes -->
<Salad class="w-30 h-30" />

<!-- With size prop (number in pixels) -->
<Salad size={24} class="text-accent" />

<!-- In buttons - icons are part of children -->
<button class="flex items-center gap-2">
    <Salad size={16} class="text-accent" />
    <span>Menu</span>
</button>

<!-- Icon-only button (must have aria-label) -->
<button aria-label="Close" class="p-2 rounded hover:bg-tertiary">
    <X size={16} />
</button>
```

#### In SolidJS Components

For SolidJS components, icons should be passed as part of the `children` prop from the Astro parent. Components should accept `children` without special handling for icons.

```astro
---
import { Plus, X } from "@lucide/astro";
import { Button } from "@/components/atoms/Button";
---

<!-- Icons are part of children -->
<Button client:load>
    <Plus size={16} class="mr-2" />
    Add Item
</Button>

<!-- Icon-only button -->
<Button client:load aria-label="Close">
    <X size={16} />
</Button>
```

```typescript
// Button component accepts any children
export interface ButtonProps {
  children: JSX.Element; // Can include icons, text, or any content
  // ... other props
}

export function Button(props: ButtonProps) {
  return (
    <button class="inline-flex items-center gap-2">
      {props.children} {/* Icons are rendered as part of children */}
    </button>
  );
}
```

### Icon Sizing Guidelines

Lucide icons accept a `size` prop (number in pixels). Common sizes:

- **12px**: Inline with small text, badges
- **16px**: Buttons, form inputs, inline with body text
- **20px**: Default size, most common use case
- **24px**: Headings, prominent buttons
- **32px**: Hero sections, large CTAs

You can also use Tailwind classes for sizing:

```astro
<Salad class="w-5 h-5" />
<!-- 20px -->
<Salad class="w-6 h-6" />
<!-- 24px -->
```

### Accessibility with Icons

✅ **DO:**

```astro
<!-- Decorative icon (hidden from screen readers) -->
<button>
    <X size={16} aria-hidden="true" />
    <span class="sr-only">Close</span>
</button>

<!-- Icon with meaning (provide label) -->
<button aria-label="Delete item">
    <Trash2 size={16} aria-hidden="true" />
</button>

<!-- Icon-only button (must have aria-label) -->
<button aria-label="Close dialog">
    <X size={16} />
</button>
```

❌ **DON'T:**

```typescript
// Don't use custom SVG icons
<svg>...</svg>

// Don't use other icon libraries
import { Icon } from 'some-other-library';

// Don't forget accessibility for icon-only buttons
<button>
  <X size={16} />
</button>

// Don't create wrapper components for icons
// Use Lucide icons directly
```

### Common Icon Patterns

```astro
---
import { Plus, Trash2, Loader2, X, Check } from "@lucide/astro";
import { Button } from "@/components/atoms/Button";
---

<!-- Button with icon on left -->
<Button client:load>
    <Plus size={16} class="mr-2" />
    Add Item
</Button>

<!-- Button with icon on right -->
<Button client:load>
    Confirm
    <Check size={16} class="ml-2" />
</Button>

<!-- Icon-only button -->
<Button client:load aria-label="Delete">
    <Trash2 size={16} />
</Button>

<!-- Loading spinner -->
<Loader2 size={20} class="animate-spin" />

<!-- Status indicators -->
<div class="flex items-center gap-2">
    <Icon size="sm" color="success">
        <CheckCircle />
    </Icon>
    <span>Success</span>
</div>
```

---

## Native HTML Elements with Modern APIs

**Always prefer native HTML elements with modern APIs** over custom implementations:

#### Native Popover API

✅ **DO:**

```typescript
// Use native <popover> element for tooltips and poppers
function Tooltip(props: { children: JSX.Element; content: string }) {
  return (
    <>
      <button popoverTarget="tooltip-1" popoverTargetAction="toggle">
        {props.children}
      </button>
      <div
        id="tooltip-1"
        popover="auto"
        class="p-2 rounded bg-secondary border border-ui-border text-sm text-fg-main shadow-lg"
      >
        {props.content}
      </div>
    </>
  );
}

// Usage
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>
```

#### Native Select Styling

✅ **DO:**

```typescript
// Use native <select> with modern styling capabilities
function Select(props: SelectProps) {
  return (
    <select
      class="
        w-full px-4 py-2 rounded bg-primary border border-ui-border
        text-fg-main
        focus:outline-none focus:ring-2 focus:ring-accent
        appearance-none bg-[url('data:image/svg+xml;base64,...')] bg-no-repeat bg-right
      "
      style="background-position: right 0.5rem center; padding-right: 2.5rem;"
    >
      {props.children}
    </select>
  );
}

// Or use native select with Tailwind's appearance utilities
function Select(props: SelectProps) {
  return (
    <div class="relative">
      <select
        class="
          w-full px-4 py-2 pr-10 rounded bg-primary border border-ui-border
          text-fg-main appearance-none
          focus:outline-none focus:ring-2 focus:ring-accent
        "
      >
        {props.children}
      </select>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg class="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
```

#### Native Dialog API

✅ **DO:**

```typescript
// Use native <dialog> element
function Modal(props: ModalProps) {
  let dialogRef: HTMLDialogElement | undefined;

  const open = () => dialogRef?.showModal();
  const close = () => dialogRef?.close();

  return (
    <>
      <button onClick={open}>Open Modal</button>
      <dialog
        ref={dialogRef}
        class="rounded-lg bg-secondary border border-ui-border p-6 backdrop:bg-black/50"
      >
        <form method="dialog">
          <h2 class="text-2xl font-bold mb-4">{props.title}</h2>
          <p>{props.children}</p>
          <div class="mt-6 flex gap-2 justify-end">
            <button
              type="button"
              onClick={close}
              class="px-4 py-2 rounded border border-ui-border hover:bg-tertiary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-accent text-primary"
            >
              Confirm
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
```

#### Native Details/Summary

✅ **DO:**

```typescript
// Use native <details> element for accordions
function Accordion(props: AccordionProps) {
  return (
    <details class="border border-ui-border rounded-lg overflow-hidden">
      <summary class="px-4 py-3 bg-secondary cursor-pointer hover:bg-tertiary transition-colors list-none">
        <div class="flex items-center justify-between">
          <span class="font-semibold">{props.title}</span>
          <svg class="w-5 h-5 transition-transform details-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div class="px-4 py-3 bg-primary">
        {props.children}
      </div>
    </details>
  );
}
```

#### Native Form Validation

✅ **DO:**

```typescript
// Use native HTML5 validation
function FormField(props: FormFieldProps) {
  return (
    <div>
      <label for={props.id} class="block text-sm font-medium mb-2">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type}
        required={props.required}
        pattern={props.pattern}
        min={props.min}
        max={props.max}
        class="w-full px-4 py-2 rounded bg-primary border border-ui-border text-fg-main focus:outline-none focus:ring-2 focus:ring-accent invalid:border-accent"
      />
      <span class="text-sm text-fg-muted mt-1">
        {props.helpText}
      </span>
    </div>
  );
}
```

❌ **DON'T:**

```typescript
// Don't recreate native functionality with JS
<div onClick={toggle} data-open={isOpen()}>
  {/* Custom accordion - use <details> instead */}
</div>

// Don't use custom tooltip libraries when popover API is available
<div class="tooltip" data-tooltip="text">
  {/* Use <popover> instead */}
</div>
```

---

## Performance Guidelines

### 1. Lazy Loading

For large components, use lazy loading:

```typescript
import { lazy } from 'solid-js';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Memoization

Memoize expensive computations:

```typescript
const expensiveValue = createMemo(() => {
    return props.items.reduce((acc, item) => {
        // Expensive computation
        return acc + processItem(item);
    }, 0);
});
```

### 3. Event Delegation

For lists with many interactive elements:

```typescript
function ItemList(props: { items: Item[] }) {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const itemId = target.closest('[data-item-id]')?.getAttribute('data-item-id');
    if (itemId) {
      // Handle click
    }
  };

  return (
    <ul onClick={handleClick}>
      <For each={props.items}>
        {(item) => (
          <li data-item-id={item.id}>
            {item.name}
          </li>
        )}
      </For>
    </ul>
  );
}
```

### 4. Avoid Unnecessary Signals

Don't create signals for values that don't need reactivity:

```typescript
// ❌ DON'T
const [staticConfig] = createSignal({ theme: "nordfox" });

// ✅ DO
const staticConfig = { theme: "nordfox" as const };
```

---

## Testing Requirements

### Mandatory Unit Tests

**Every new component MUST include unit tests.** Tests should be written alongside the component implementation, not as an afterthought.

### Test File Naming

Test files should follow the pattern: `ComponentName.test.tsx` (or `.test.ts` for non-component files).

```
Button/
├── Button.tsx
├── Button.test.tsx  # Test file
└── index.ts
```

### Test Coverage Requirements

Tests should cover:

1. **Rendering** - Component renders without errors
2. **Props** - All props are properly applied and affect the component correctly
3. **Variants** - All variant combinations (variant, color, size, state) work as expected
4. **Interactions** - User interactions (clicks, keyboard events, form inputs) work correctly
5. **Accessibility** - ARIA attributes, keyboard navigation, and semantic HTML are correct
6. **Edge Cases** - Default values, missing props, disabled states, loading states

### Testing Best Practices

✅ **DO:**

```typescript
import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(() => <Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(() => <Button variant="outline">Test</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border-2');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(() => <Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(() => <Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
```

❌ **DON'T:**

```typescript
// Don't skip tests for "simple" components
// Don't test implementation details (internal state, private methods)
// Don't write tests that are too coupled to specific class names
// Don't forget to test accessibility features
```

### Testing Variants

When testing components with variants, use a dictionary map to test all combinations:

```typescript
const variantMap = {
  solid: 'bg-accent',
  subtle: 'bg-accent/20',
  text: 'bg-transparent',
  outline: 'border-2'
} as const;

describe('Button variants', () => {
  Object.entries(variantMap).forEach(([variant, expectedClass]) => {
    it(`applies correct classes for ${variant} variant`, () => {
      const { container } = render(() => (
        <Button variant={variant as any}>Test</Button>
      ));
      const button = container.querySelector('button');
      expect(button?.className).toContain(expectedClass);
    });
  });
});
```

### Testing Accessibility

Always test accessibility features:

```typescript
it('has proper ARIA attributes', () => {
  render(() => (
    <Button aria-label="Close dialog" disabled>
      Close
    </Button>
  ));
  const button = screen.getByLabelText('Close dialog');
  expect(button).toHaveAttribute('aria-disabled', 'true');
});

it('supports keyboard navigation', () => {
  const handleClick = vi.fn();
  render(() => <Button onClick={handleClick}>Submit</Button>);
  const button = screen.getByText('Submit');

  button.focus();
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});
```

### Testing Compound Components

For compound components, test each part:

```typescript
describe('Card compound components', () => {
  it('renders Card with all parts', () => {
    render(() => (
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
        </Card.Header>
        <Card.Body>Content</Card.Body>
        <Card.Footer>
          <Card.Action>Action</Card.Action>
        </Card.Footer>
      </Card>
    ));

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
```

### Test Organization

Organize tests using `describe` blocks:

```typescript
describe("Button", () => {
    describe("Rendering", () => {
        it("renders with text", () => {
            /* ... */
        });
        it("renders with icon", () => {
            /* ... */
        });
    });

    describe("Variants", () => {
        it("applies solid variant", () => {
            /* ... */
        });
        it("applies outline variant", () => {
            /* ... */
        });
    });

    describe("Interactions", () => {
        it("handles clicks", () => {
            /* ... */
        });
        it("handles keyboard events", () => {
            /* ... */
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            /* ... */
        });
        it("supports keyboard navigation", () => {
            /* ... */
        });
    });
});
```

### Running Tests

Tests should be runnable with your test runner (e.g., Vitest, Jest). Ensure tests pass before committing:

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

---

## Code Examples

### Complete Atom Example: Button (with tailwind-variants)

```typescript
// atoms/Button/Button.tsx
import { splitProps } from 'solid-js';
import { tv } from 'tailwind-variants';

// Note: For SolidJS components, icons should be passed as props from Astro parent
// or use @lucide/solid-js if available. Icons are passed directly without a wrapper.

const button = tv({
  base: 'px-4 py-2 rounded font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent',
  variants: {
    variant: {
      solid: '',
      subtle: '',
      text: 'bg-transparent',
      outline: 'border-2 bg-transparent'
    },
    color: {
      primary: '',
      accent: '',
      success: '',
      warning: '',
      error: ''
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    },
    state: {
      default: '',
      disabled: 'opacity-50 cursor-not-allowed',
    }
  },
  compoundVariants: [
    // Solid variant with colors
    {
      variant: 'solid',
      color: 'accent',
      class: 'bg-accent text-primary hover:opacity-90'
    },
    {
      variant: 'solid',
      color: 'primary',
      class: 'bg-primary text-fg-main border border-ui-border hover:bg-secondary'
    },
    {
      variant: 'solid',
      color: 'success',
      class: 'bg-green-600 text-white hover:bg-green-700'
    },
    {
      variant: 'solid',
      color: 'warning',
      class: 'bg-yellow-600 text-white hover:bg-yellow-700'
    },
    {
      variant: 'solid',
      color: 'error',
      class: 'bg-red-600 text-white hover:bg-red-700'
    },
    // Subtle variant with colors
    {
      variant: 'subtle',
      color: 'accent',
      class: 'bg-accent/20 text-accent hover:bg-accent/30'
    },
    {
      variant: 'subtle',
      color: 'success',
      class: 'bg-green-600/20 text-green-600 hover:bg-green-600/30'
    },
    {
      variant: 'subtle',
      color: 'warning',
      class: 'bg-yellow-600/20 text-yellow-600 hover:bg-yellow-600/30'
    },
    {
      variant: 'subtle',
      color: 'error',
      class: 'bg-red-600/20 text-red-600 hover:bg-red-600/30'
    },
    // Text variant with colors
    {
      variant: 'text',
      color: 'accent',
      class: 'text-accent hover:bg-accent/10'
    },
    {
      variant: 'text',
      color: 'success',
      class: 'text-green-600 hover:bg-green-600/10'
    },
    {
      variant: 'text',
      color: 'warning',
      class: 'text-yellow-600 hover:bg-yellow-600/10'
    },
    {
      variant: 'text',
      color: 'error',
      class: 'text-red-600 hover:bg-red-600/10'
    },
    // Outline variant with colors
    {
      variant: 'outline',
      color: 'accent',
      class: 'border-accent text-accent hover:bg-accent/10'
    },
    {
      variant: 'outline',
      color: 'success',
      class: 'border-green-600 text-green-600 hover:bg-green-600/10'
    },
    {
      variant: 'outline',
      color: 'warning',
      class: 'border-yellow-600 text-yellow-600 hover:bg-yellow-600/10'
    },
    {
      variant: 'outline',
      color: 'error',
      class: 'border-red-600 text-red-600 hover:bg-red-600/10'
    }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'accent',
    size: 'md',
    state: 'default'
  }
});

export interface ButtonProps {
  children: JSX.Element;
  variant?: 'solid' | 'subtle' | 'text' | 'outline';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: JSX.Element; // Lucide icon component (from @lucide/astro)
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  'aria-label'?: string;
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, [
    'children',
    'variant',
    'color',
    'size',
    'disabled',
    'icon',
    'iconPosition',
    'onClick',
    'class',
    'aria-label'
  ]);

  const buttonState = () => {
    if (local.disabled) return 'disabled';
    return 'default';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !local.disabled) {
      e.preventDefault();
      local.onClick?.();
    }
  };

  return (
    <button
      class={button({
        variant: local.variant,
        color: local.color,
        size: local.size,
        state: buttonState(),
        class: `inline-flex items-center gap-2 ${local.class || ''}`
      })}
      type={others.type || 'button'}
      disabled={local.disabled}
      onClick={local.onClick}
      onKeyDown={handleKeyDown}
      aria-label={local['aria-label']}
      aria-disabled={local.disabled}
      {...others}
    >
      {local.children}
    </button>
  );
}
```

**Usage Examples:**

```astro
---
// In Astro files, import icons from @lucide/astro
import { Plus, Trash2, Loader2, Check, X } from "@lucide/astro";
import { Button } from "@/components/atoms/Button";
---

<!-- Solid accent button (default) -->
<Button client:load>Click me</Button>

<!-- Button with icon on left - icons are part of children -->
<Button client:load>
    <Plus size={16} class="mr-2" />
    Add Item
</Button>

<!-- Button with icon on right -->
<Button client:load>
    Confirm
    <Check size={16} class="ml-2" />
</Button>

<!-- Subtle success button with icon -->
<Button client:load variant="subtle" color="success">
    <Check size={16} class="mr-2" />
    Success
</Button>

<!-- Text error button with icon -->
<Button client:load variant="text" color="error">
    <Trash2 size={16} class="mr-2" />
    Delete
</Button>

<!-- Icon-only button (must provide aria-label) -->
<Button client:load aria-label="Close">
    <X size={16} />
</Button>
```

**Note:** Components accept `children` without special handling. Icons from `@lucide/astro` are passed as part of the children prop, allowing flexible composition.

### Complete Molecule Example: FormField (Compound Component)

```typescript
// molecules/FormField/FormField.tsx
import { splitProps } from 'solid-js';

export interface FormFieldProps {
  children: JSX.Element;
  class?: string;
}

export interface FormFieldLabelProps {
  children: JSX.Element;
  for?: string;
  required?: boolean;
  class?: string;
}

export interface FormFieldInputProps {
  id?: string;
  type?: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-describedby'?: string;
  class?: string;
}

export interface FormFieldErrorProps {
  children: JSX.Element;
  id?: string;
  class?: string;
}

export interface FormFieldHelpProps {
  children: JSX.Element;
  id?: string;
  class?: string;
}

function FormFieldRoot(props: FormFieldProps) {
  return (
    <div class={`form-field ${props.class || ''}`}>
      {props.children}
    </div>
  );
}

function FormFieldLabel(props: FormFieldLabelProps) {
  return (
    <label
      for={props.for}
      class={`block text-sm font-medium mb-2 text-fg-main ${props.class || ''}`}
    >
      {props.children}
      {props.required && <span class="text-accent ml-1" aria-label="required">*</span>}
    </label>
  );
}

function FormFieldInput(props: FormFieldInputProps) {
  const [local, others] = splitProps(props, [
    'value',
    'onInput',
    'class'
  ]);

  return (
    <input
      id={local.id}
      type={others.type || 'text'}
      value={local.value}
      onInput={(e) => local.onInput(e.currentTarget.value)}
      class={`
        w-full px-4 py-2 rounded bg-primary border border-ui-border
        text-fg-main placeholder:text-fg-muted
        focus:outline-none focus:ring-2 focus:ring-accent
        ${local.class || ''}
      `.trim()}
      {...others}
    />
  );
}

function FormFieldError(props: FormFieldErrorProps) {
  return (
    <p
      id={props.id}
      class={`text-sm text-accent mt-1 ${props.class || ''}`}
      role="alert"
    >
      {props.children}
    </p>
  );
}

function FormFieldHelp(props: FormFieldHelpProps) {
  return (
    <p
      id={props.id}
      class={`text-sm text-fg-muted mt-1 ${props.class || ''}`}
    >
      {props.children}
    </p>
  );
}

export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Input: FormFieldInput,
  Error: FormFieldError,
  Help: FormFieldHelp
});
```

### Complete Atom Example: Tooltip (using Native Popover API)

```typescript
// atoms/Tooltip/Tooltip.tsx
import { splitProps } from 'solid-js';
import { tv } from 'tailwind-variants';

const tooltip = tv({
  base: 'p-2 rounded bg-secondary border border-ui-border text-sm text-fg-main shadow-lg',
  variants: {
    placement: {
      top: 'mb-2',
      bottom: 'mt-2',
      left: 'mr-2',
      right: 'ml-2'
    }
  },
  defaultVariants: {
    placement: 'top'
  }
});

export interface TooltipProps {
  children: JSX.Element;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  class?: string;
}

export function Tooltip(props: TooltipProps) {
  const [local, others] = splitProps(props, ['children', 'content', 'placement', 'class']);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <button
        popoverTarget={tooltipId}
        popoverTargetAction="toggle"
        class={local.class}
        aria-describedby={tooltipId}
        {...others}
      >
        {local.children}
      </button>
      <div
        id={tooltipId}
        popover="auto"
        class={tooltip({ placement: local.placement })}
        role="tooltip"
      >
        {local.content}
      </div>
    </>
  );
}
```

### Usage Example: FormField

```typescript
import { FormField } from '@/components/molecules/FormField';
import { createSignal } from 'solid-js';

function MyForm() {
  const [email, setEmail] = createSignal('');
  const [error, setError] = createSignal('');

  return (
    <FormField>
      <FormField.Label for="email" required>
        Email Address
      </FormField.Label>
      <FormField.Input
        id="email"
        type="email"
        value={email()}
        onInput={setEmail}
        placeholder="your@email.com"
        required
        aria-describedby={error() ? 'email-error' : 'email-help'}
      />
      {error() ? (
        <FormField.Error id="email-error">
          {error()}
        </FormField.Error>
      ) : (
        <FormField.Help id="email-help">
          We'll never share your email.
        </FormField.Help>
      )}
    </FormField>
  );
}
```

### Usage Example: Tooltip

```typescript
import { Tooltip } from '@/components/atoms/Tooltip';

function Example() {
  return (
    <Tooltip content="This is a helpful tooltip" placement="top">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

---

## Quick Reference Checklist

When creating a new component, ensure:

- [ ] Follows Atomic Design hierarchy (atom/molecule/organism)
- [ ] Uses Compound Components pattern if composable
- [ ] **Uses consistent API: `variant` for shape, `color` for color scheme, `state` for interactive states**
- [ ] **Uses `tailwind-variants` for variant management**
- [ ] **Always uses Lucide icons from `@lucide/astro` (never custom SVG or other icon libraries)**
- [ ] Implements proper TypeScript types and exports them
- [ ] Uses SolidJS best practices (signals, memos, effects)
- [ ] Follows design system tokens (no hardcoded colors)
- [ ] Implements accessibility (ARIA, keyboard navigation, semantic HTML)
- [ ] **Prefers native HTML elements with modern APIs (popover, dialog, details, select styling)**
- [ ] Uses proper file structure and naming conventions
- [ ] Includes barrel exports (index.ts)
- [ ] Handles cleanup in onCleanup when needed
- [ ] Optimizes for performance (memos, lazy loading when appropriate)
- [ ] **Includes unit tests (ComponentName.test.tsx) with comprehensive coverage**
- [ ] Tests cover rendering, props, variants, interactions, accessibility, and edge cases

---

## Questions?

If you're unsure about component architecture:

1. Check existing components for patterns
2. Review this guide for best practices
3. Refer to `DESIGN_SYSTEM.md` for styling guidelines
4. When in doubt, prefer simplicity and native solutions

**Remember**: The goal is to create maintainable, performant, accessible components that follow web standards and SolidJS best practices.
