# Component Creation Guide for LLMs

This guide provides comprehensive instructions for creating new components in the design system. **Always follow this guide when generating new components to ensure consistency, quality, and maintainability.**

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Structure](#component-structure)
3. [Design System Adherence](#design-system-adherence)
4. [Implementation Patterns](#implementation-patterns)
5. [Testing Requirements](#testing-requirements)
6. [Storybook Documentation](#storybook-documentation)
7. [File Organization](#file-organization)
8. [Code Examples](#code-examples)
9. [Checklist](#checklist)

---

## Core Principles

### 1. **Design System First**
- **ALWAYS** prioritize design system tokens from `DESIGN_SYSTEM.md`
- **NEVER** use hardcoded colors, sizes, or spacing values
- **ALWAYS** use Tailwind utility classes that map to design tokens
- **ALWAYS** ensure components work across all themes (nordfox, nightfox, carbonfox, dayfox)

### 2. **Consistency**
- Follow established patterns for rounding, sizes, spacing, and component structure
- Maintain visual consistency with existing components
- Use the same naming conventions and file structure

### 3. **Quality Standards**
- Every component MUST have unit tests
- Every component MUST have Storybook documentation
- Every component MUST be accessible (WCAG 2.1 AA)
- Every component MUST follow TypeScript best practices

### 4. **Documentation**
- Stories document component behavior and visual states
- Tests verify component functionality and edge cases
- JSDoc comments explain component purpose and usage

---

## Component Structure

### Standard File Structure

Every component must follow this structure:

```
src/components/atoms/ComponentName/
├── ComponentName.tsx          # Component implementation
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook stories
└── index.ts                    # Exports
```

### File Naming Conventions

- **Component files**: `PascalCase.tsx` (e.g., `Button.tsx`, `Input.tsx`)
- **Test files**: `ComponentName.test.tsx`
- **Story files**: `ComponentName.stories.tsx`
- **Index files**: `index.ts` (lowercase)

---

## Design System Adherence

### Color Usage

**✅ ALWAYS DO:**
```tsx
// Use design system utility classes
<div class="bg-secondary text-fg-main border border-ui-border">
<button class="bg-accent text-primary hover:opacity-90">
```

**❌ NEVER DO:**
```tsx
// Don't use arbitrary values or hardcoded colors
<div class="bg-[var(--color-secondary)]" style="color: #e5e9f0;">
<button style="background-color: #88c0d0;">
```

### Size Standards

All components should follow these size conventions:

#### Component Sizes
- **Small (`sm`)**: `px-3 py-1.5 text-sm`
- **Medium (`md`)**: `px-4 py-2 text-base` (default)
- **Large (`lg`)**: `px-6 py-3 text-lg`

#### Spacing Scale
- **None**: `p-0` or no padding
- **Small**: `p-4` (16px)
- **Medium**: `p-6` (24px) - default for cards
- **Large**: `p-8` (32px)

#### Border Radius
- **Default**: `rounded` (4px)
- **Cards/Containers**: `rounded-lg` (8px)
- **Buttons/Inputs**: `rounded` (4px)

### Typography

Use the type scale from `DESIGN_SYSTEM.md`:
- Headings: `text-3xl font-bold`, `text-2xl font-semibold`, etc.
- Body: `text-base` (default)
- Small: `text-sm`
- Extra Small: `text-xs`

### Spacing Patterns

Use Tailwind spacing utilities consistently:
- Gaps: `gap-2`, `gap-4`, `gap-6`
- Margins: `mb-4`, `mb-6`, `mb-8`, `mb-16`
- Padding: `p-4`, `p-6`, `p-8`

---

## Implementation Patterns

### 1. Using `tailwind-variants` (tv)

**ALWAYS** use `tailwind-variants` for component styling:

```tsx
import { tv } from "tailwind-variants";

const component = tv({
    base: "base-classes-here",
    variants: {
        variant: {
            option1: "classes-for-option1",
            option2: "classes-for-option2",
        },
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
        state: {
            default: "",
            disabled: "opacity-50 cursor-not-allowed",
        },
    },
    compoundVariants: [
        {
            variant: "option1",
            size: "sm",
            class: "additional-classes",
        },
    ],
    defaultVariants: {
        variant: "option1",
        size: "md",
        state: "default",
    },
});
```

### 2. Using `splitProps` (SolidJS Pattern)

**ALWAYS** use `splitProps` to separate local props from HTML attributes:

```tsx
import { splitProps } from "solid-js";

export function Component(props: ComponentProps) {
    const [local, others] = splitProps(props, [
        "children",
        "variant",
        "size",
        "disabled",
        "class",
    ]);

    return (
        <div
            class={component({
                variant: local.variant,
                size: local.size,
                class: local.class,
            })}
            {...others}
        >
            {local.children}
        </div>
    );
}
```

### 3. Dictionary Maps Over Switch Statements

**ALWAYS** prefer dictionary object maps over switch statements:

```tsx
// ✅ DO: Use dictionary maps
const sizeMap = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
} as const;

// ❌ DON'T: Use switch statements
switch (size) {
    case "sm":
        className = "px-3 py-1.5 text-sm";
        break;
    // ...
}
```

### 4. TypeScript Interface Patterns

**ALWAYS** define clear TypeScript interfaces:

```tsx
export interface ComponentProps {
    children: JSX.Element;
    variant?: "option1" | "option2";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    class?: string;
    "aria-label"?: string;
    // Spread HTML attributes
    [key: string]: any;
}
```

### 5. Default Variants

**ALWAYS** provide sensible defaults in `defaultVariants`:

```tsx
defaultVariants: {
    variant: "option1", // Most common variant
    size: "md",         // Medium is standard
    state: "default",
}
```

### 6. Accessibility Patterns

**ALWAYS** include accessibility features:

```tsx
// ARIA attributes
<button
    aria-label={props["aria-label"]}
    aria-disabled={props.disabled}
    disabled={props.disabled}
>

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
        e.preventDefault();
        local.onClick?.();
    }
};
```

---

## Testing Requirements

### Test File Structure

Every component MUST have comprehensive unit tests covering:

1. **Rendering**
   - Renders with children
   - Renders with custom class
   - Renders with all props

2. **Variants**
   - All variant options apply correct classes
   - Use dictionary maps to test variants

3. **Sizes**
   - All size options apply correct classes
   - Default size works correctly

4. **States**
   - Disabled state
   - Error state (if applicable)
   - Loading state (if applicable)

5. **Interactions**
   - Click handlers
   - Keyboard events
   - Form submission (if applicable)

6. **Accessibility**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support

7. **Default Values**
   - Default props work correctly
   - Default variants apply

### Test Pattern Example

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Component } from "./Component";

describe("Component", () => {
    describe("Rendering", () => {
        it("renders with children", () => {
            render(() => <Component>Content</Component>);
            expect(screen.getByText("Content")).toBeInTheDocument();
        });

        it("renders with custom class", () => {
            const { container } = render(() => (
                <Component class="custom-class">Test</Component>
            ));
            const element = container.querySelector("div");
            expect(element?.className).toContain("custom-class");
        });
    });

    describe("Variants", () => {
        const variantMap = {
            variant1: "expected-class-1",
            variant2: "expected-class-2",
        } as const;

        Object.entries(variantMap).forEach(([variant, expectedClass]) => {
            it(`applies correct classes for ${variant} variant`, () => {
                const { container } = render(() => (
                    <Component variant={variant as any}>Test</Component>
                ));
                const element = container.querySelector("div");
                expect(element?.className).toContain(expectedClass);
            });
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClasses]) => {
            it(`applies correct classes for ${size} size`, () => {
                const { container } = render(() => (
                    <Component size={size as any}>Test</Component>
                ));
                const element = container.querySelector("div");
                expectedClasses.split(" ").forEach((cls) => {
                    expect(element?.className).toContain(cls);
                });
            });
        });
    });

    describe("States", () => {
        it("is disabled when disabled prop is true", () => {
            render(() => <Component disabled>Disabled</Component>);
            const element = screen.getByText("Disabled");
            expect(element).toBeDisabled();
            expect(element.className).toContain("opacity-50");
        });
    });

    describe("Interactions", () => {
        it("handles click events", () => {
            const handleClick = vi.fn();
            render(() => <Component onClick={handleClick}>Click</Component>);
            screen.getByText("Click").click();
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => (
                <Component aria-label="Test component">Content</Component>
            ));
            const element = screen.getByLabelText("Test component");
            expect(element).toBeInTheDocument();
        });
    });

    describe("Default Values", () => {
        it("uses default size (md) when not specified", () => {
            const { container } = render(() => <Component>Test</Component>);
            const element = container.querySelector("div");
            expect(element?.className).toContain("px-4 py-2");
        });
    });
});
```

### Testing Best Practices

1. **Use dictionary maps** for testing variants and sizes
2. **Test accessibility** with ARIA attributes and keyboard navigation
3. **Test edge cases** like empty values, long text, etc.
4. **Use `vi.fn()`** for mocking event handlers
5. **Use `createSignal`** for testing reactive behavior
6. **Test default values** to ensure sensible defaults

---

## Storybook Documentation

### Story File Structure

Every component MUST have Storybook stories following this pattern:

```tsx
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Component } from "./Component";

/**
 * Component description with usage examples.
 *
 * Supports multiple variants and sizes.
 * Includes built-in states.
 *
 * @example
 * ```tsx
 * <Component variant="option1" size="md">Content</Component>
 * ```
 */
const meta = {
    title: "Atoms/ComponentName",
    component: Component,
    parameters: {
        layout: "centered", // or "fullscreen" or "padded"
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["option1", "option2"],
            description: "Visual style variant",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "option1" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the component",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
    },
    args: {
        onClick: fn(), // For interactive components
    },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage
export const Default: Story = {
    args: {
        children: "Default content",
    },
};

// Variants
export const Variant1: Story = {
    args: {
        variant: "option1",
        children: "Variant 1",
    },
};

export const Variant2: Story = {
    args: {
        variant: "option2",
        children: "Variant 2",
    },
};

// Sizes
export const Small: Story = {
    args: {
        size: "sm",
        children: "Small",
    },
};

export const Medium: Story = {
    args: {
        size: "md",
        children: "Medium",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large",
    },
};

// States
export const Disabled: Story = {
    args: {
        disabled: true,
        children: "Disabled",
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled state prevents interaction and reduces opacity.",
            },
        },
    },
};

// Composition examples
export const InContext: Story = {
    render: (args: Story["args"]) => (
        <div class="flex flex-col gap-4 w-[300px]">
            <Component {...args}>In context example</Component>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Component used in a real-world context.",
            },
        },
    },
};
```

### Story Requirements

1. **JSDoc Comments**: Include component description and examples
2. **Autodocs**: Always include `tags: ["autodocs"]`
3. **ArgTypes**: Document all props with descriptions and defaults
4. **Story Variants**: Show all variants, sizes, and states
5. **Composition Stories**: Show component in context
6. **Descriptions**: Add story descriptions for complex examples
7. **Use `fn()`**: Use `fn()` from `storybook/test` for event handlers
8. **Tailwind Classes**: Always use Tailwind classes in story renders, never inline styles

### Story Best Practices

1. **Meaningful Names**: Use descriptive story names (e.g., `Primary`, `Destructive`, not `Variant1`)
2. **Use Cases**: Show real-world use cases, not just prop combinations
3. **Accessibility**: Document accessibility features in story descriptions
4. **Composition**: Show how components work together
5. **Edge Cases**: Document edge cases like long text, empty states, etc.

---

## File Organization

### Component Directory Structure

```
src/components/atoms/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook stories
└── index.ts                    # Exports
```

### Index File Pattern

```tsx
// src/components/atoms/ComponentName/index.ts
export { Component } from "./Component";
export type { ComponentProps } from "./Component";
```

### Main Index File

Update `src/components/atoms/index.ts`:

```tsx
export { Component } from "./Component";
export type { ComponentProps } from "./Component";
```

---

## Code Examples

### Complete Component Example

```tsx
// ComponentName.tsx
import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";

const component = tv({
    base: "px-4 py-2 rounded font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent",
    variants: {
        variant: {
            solid: "bg-accent text-primary hover:opacity-90",
            outline: "border-2 border-accent text-accent hover:bg-accent/10",
        },
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        },
        state: {
            default: "",
            disabled: "opacity-50 cursor-not-allowed",
        },
    },
    defaultVariants: {
        variant: "solid",
        size: "md",
        state: "default",
    },
});

export interface ComponentProps {
    children: JSX.Element;
    variant?: "solid" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    onClick?: () => void;
    class?: string;
    "aria-label"?: string;
}

export function Component(props: ComponentProps) {
    const [local, others] = splitProps(props, [
        "children",
        "variant",
        "size",
        "disabled",
        "onClick",
        "class",
        "aria-label",
    ]);

    const componentState = () => {
        if (local.disabled) return "disabled";
        return "default";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && !local.disabled) {
            e.preventDefault();
            local.onClick?.();
        }
    };

    return (
        <button
            class={component({
                variant: local.variant,
                size: local.size,
                state: componentState(),
                class: local.class,
            })}
            disabled={local.disabled}
            onClick={() => local.onClick?.()}
            onKeyDown={handleKeyDown}
            aria-label={local["aria-label"]}
            aria-disabled={local.disabled}
            {...others}
        >
            {local.children}
        </button>
    );
}
```

### Test File Example

```tsx
// ComponentName.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { Component } from "./Component";

describe("Component", () => {
    describe("Rendering", () => {
        it("renders with children", () => {
            render(() => <Component>Click me</Component>);
            expect(screen.getByText("Click me")).toBeInTheDocument();
        });
    });

    describe("Variants", () => {
        const variantMap = {
            solid: "bg-accent",
            outline: "border-2",
        } as const;

        Object.entries(variantMap).forEach(([variant, expectedClass]) => {
            it(`applies correct classes for ${variant} variant`, () => {
                const { container } = render(() => (
                    <Component variant={variant as any}>Test</Component>
                ));
                const button = container.querySelector("button");
                expect(button?.className).toContain(expectedClass);
            });
        });
    });

    describe("Sizes", () => {
        const sizeMap = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        } as const;

        Object.entries(sizeMap).forEach(([size, expectedClasses]) => {
            it(`applies correct classes for ${size} size`, () => {
                const { container } = render(() => (
                    <Component size={size as any}>Test</Component>
                ));
                const button = container.querySelector("button");
                expectedClasses.split(" ").forEach((cls) => {
                    expect(button?.className).toContain(cls);
                });
            });
        });
    });

    describe("States", () => {
        it("is disabled when disabled prop is true", () => {
            render(() => <Component disabled>Disabled</Component>);
            const button = screen.getByText("Disabled");
            expect(button).toBeDisabled();
            expect(button.className).toContain("opacity-50");
        });
    });

    describe("Interactions", () => {
        it("handles click events", () => {
            const handleClick = vi.fn();
            render(() => <Component onClick={handleClick}>Click</Component>);
            screen.getByText("Click").click();
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(() => (
                <Component aria-label="Test button" disabled>
                    Test
                </Component>
            ));
            const button = screen.getByLabelText("Test button");
            expect(button).toHaveAttribute("aria-disabled", "true");
        });
    });

    describe("Default Values", () => {
        it("uses default variant when not specified", () => {
            const { container } = render(() => <Component>Test</Component>);
            const button = container.querySelector("button");
            expect(button?.className).toContain("bg-accent");
        });
    });
});
```

### Story File Example

```tsx
// ComponentName.stories.tsx
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Component } from "./Component";

/**
 * Component description with usage examples.
 *
 * Supports multiple variants and sizes.
 * Includes built-in disabled state.
 *
 * @example
 * ```tsx
 * <Component variant="solid" size="md">Click me</Component>
 * ```
 */
const meta = {
    title: "Atoms/Component",
    component: Component,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "outline"],
            description: "Visual style variant",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "solid" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the component",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "md" },
            },
        },
        disabled: {
            control: "boolean",
            description: "Whether the component is disabled",
        },
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: "solid",
        children: "Primary Action",
    },
};

export const Secondary: Story = {
    args: {
        variant: "outline",
        children: "Secondary Action",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: "Disabled",
    },
    parameters: {
        docs: {
            description: {
                story: "Disabled state prevents interaction and reduces opacity.",
            },
        },
    },
};
```

---

## Checklist

Before considering a component complete, verify:

### Design System
- [ ] All colors use design system tokens (no hardcoded values)
- [ ] All sizes follow standard conventions (sm, md, lg)
- [ ] All spacing uses Tailwind utilities
- [ ] Border radius follows conventions (rounded, rounded-lg)
- [ ] Component works across all themes
- [ ] Typography follows type scale

### Implementation
- [ ] Uses `tailwind-variants` (tv) for styling
- [ ] Uses `splitProps` for prop separation
- [ ] Uses dictionary maps instead of switch statements
- [ ] TypeScript interface is properly defined
- [ ] Default variants are sensible
- [ ] Accessibility features are implemented (ARIA, keyboard)

### Testing
- [ ] Unit tests cover rendering
- [ ] Unit tests cover all variants
- [ ] Unit tests cover all sizes
- [ ] Unit tests cover all states
- [ ] Unit tests cover interactions
- [ ] Unit tests cover accessibility
- [ ] Unit tests cover default values
- [ ] All tests pass

### Storybook
- [ ] Story file includes JSDoc comments
- [ ] Autodocs is enabled
- [ ] All props are documented in argTypes
- [ ] Stories show all variants
- [ ] Stories show all sizes
- [ ] Stories show all states
- [ ] Composition stories show real-world usage
- [ ] Story descriptions explain use cases
- [ ] Uses `fn()` for event handlers
- [ ] Uses Tailwind classes (no inline styles)

### File Organization
- [ ] Component file follows naming convention
- [ ] Test file follows naming convention
- [ ] Story file follows naming convention
- [ ] Index file exports component and types
- [ ] Main index file is updated

### Code Quality
- [ ] No linter errors
- [ ] Code is formatted with Prettier
- [ ] TypeScript types are correct
- [ ] No useless comments
- [ ] Code follows project patterns

---

## Quick Reference

### Standard Sizes
```tsx
sm: "px-3 py-1.5 text-sm"
md: "px-4 py-2 text-base"  // default
lg: "px-6 py-3 text-lg"
```

### Standard Spacing
```tsx
none: "p-0"
sm: "p-4"
md: "p-6"  // default for cards
lg: "p-8"
```

### Standard Border Radius
```tsx
rounded      // 4px - buttons, inputs
rounded-lg   // 8px - cards, containers
```

### Standard Colors
```tsx
bg-primary, bg-secondary, bg-tertiary
text-fg-main, text-fg-muted
bg-accent, text-accent
border-ui-border
bg-ui-active, bg-ui-gutter
```

### Required Imports
```tsx
import { splitProps, type JSX } from "solid-js";
import { tv } from "tailwind-variants";
```

### Required Test Imports
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
```

### Required Story Imports
```tsx
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
```

---

## Resources

- **Design System**: `DESIGN_SYSTEM.md` - Color tokens, typography, spacing
- **Storybook Guide**: `STORYBOOK_GUIDE.md` - Story writing patterns
- **Component Architecture**: `COMPONENT_ARCHITECTURE.md` - Component structure
- **Existing Components**: `src/components/atoms/` - Reference implementations

---

## Summary

When creating a new component:

1. **Start with Design System** - Use tokens, follow conventions
2. **Implement with Patterns** - Use tv, splitProps, dictionary maps
3. **Write Comprehensive Tests** - Cover all variants, sizes, states, interactions
4. **Document in Storybook** - Show all variants, use cases, and compositions
5. **Follow File Structure** - Use standard naming and organization
6. **Ensure Quality** - Test, lint, format, and verify accessibility

**Remember**: Consistency, quality, and accessibility are non-negotiable. Every component must meet these standards before it's considered complete.

