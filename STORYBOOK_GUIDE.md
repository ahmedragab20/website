# Storybook v10 Story Writing Guide

This guide helps you write effective Storybook stories that follow Storybook v10 best practices. Stories in this project focus on **documentation** and **accessibility validation** rather than test execution, as tests are managed separately through Vitest.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Story Structure](#story-structure)
3. [Component Documentation](#component-documentation)
4. [Accessibility Testing](#accessibility-testing)
5. [ArgTypes Configuration](#argtypes-configuration)
6. [Story Variants](#story-variants)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)

---

## Core Principles

### What Stories Should Do

✅ **DO:**

- Document component behavior and visual states
- Show all component variants and use cases
- Validate accessibility through the a11y addon
- Provide interactive controls for designers and developers
- Serve as living documentation

❌ **DON'T:**

- Write test assertions (use Vitest for that)
- Include `play` functions with test logic
- Use `expect` or `userEvent` for testing (those belong in Vitest)
- Duplicate test coverage that exists in `.test.tsx` files

### Story vs Test Separation

- **Stories** = Visual documentation + Accessibility checks
- **Tests** = Unit/integration tests (in `.test.tsx` files with Vitest)

---

## Story Structure

### Basic Story Template

**For Atom Components (use `.stories.tsx`):**

```tsx
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { YourComponent } from "./YourComponent";

const meta = {
    title: "Category/ComponentName",
    component: YourComponent,
    parameters: {
        layout: "centered", // or "fullscreen" or "padded"
    },
    tags: ["autodocs"], // Enables auto-generated documentation
    argTypes: {
        // Configure controls and documentation
    },
    args: {
        // Default args for all stories
        onClick: fn(), // Use fn() for action handlers
    },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story variants
export const Default: Story = {
    args: {
        // Story-specific args
    },
};
```

### Key Elements Explained

#### `title`

Organize stories hierarchically:

```typescript
title: "Atoms/Button"; // Component category
title: "Molecules/Card"; // More specific grouping
title: "Pages/HomePage"; // Page-level components
```

#### `tags: ["autodocs"]`

Automatically generates documentation pages with:

- Component description
- Props table
- All story variants
- Controls panel

#### `parameters.layout`

- `"centered"` - Centers component in canvas (good for buttons, inputs)
- `"fullscreen"` - Full viewport (good for pages, modals)
- `"padded"` - Adds padding around component

---

## Component Documentation

### File Format Guidelines

**Atom Components:**

- Always use `.stories.tsx` for atom component stories
- Atom components benefit from JSX syntax for props and children
- Example: `Button.stories.tsx`, `Input.stories.tsx`, `Icon.stories.tsx`

**Content-First Documentation:**

- Use `.mdx` files for content-first, non-interactive documentation
- MDX is ideal for design system documentation, usage guidelines, and conceptual content
- MDX files are non-interactive and focus on written documentation
- Example: `DesignSystem.mdx`, `GettingStarted.mdx`, `ComponentGuidelines.mdx`

### Using Autodocs

Enable autodocs with the `autodocs` tag:

```typescript
const meta = {
    title: "Atoms/Button",
    component: Button,
    tags: ["autodocs"],
    // ...
} satisfies Meta<typeof Button>;
```

### Adding Component Description

**MANDATORY:** Every story file MUST include a top-level JSDoc comment describing the component and providing a usage example.

Use JSDoc comments above the `meta` definition:

````typescript
/**
 * Button component with multiple variants and sizes.
 *
 * Supports solid, subtle, text, and outline variants.
 * Includes built-in disabled state.
 *
 * @example
 * ```tsx
 * <Button variant="solid" color="accent">Click me</Button>
 * ```
 */
const meta = {
    // ...
} satisfies Meta<typeof Button>;
````

### Custom MDX Documentation (Content-First)

Create `ComponentName.mdx` files for rich, content-first documentation. MDX files are **non-interactive** and focus on written documentation, design guidelines, and conceptual content:

```mdx
import { Meta, Story } from "@storybook/blocks";
import * as ButtonStories from "./Button.stories.tsx";

<Meta of={ButtonStories} />

# Button Component

The Button component is a versatile interactive element that supports multiple
visual styles and states.

## Usage

Buttons should be used for primary actions in your interface.

## Accessibility

- Buttons are keyboard accessible
- Disabled buttons prevent interaction
```

**When to use MDX:**

- Design system documentation pages
- Usage guidelines and best practices
- Conceptual documentation (e.g., "What is a design token?")
- Non-interactive content that doesn't need story controls
- Content-first pages that prioritize reading over interaction

**When to use `.tsx` stories:**

- Atom components (always use `.tsx`)
- Interactive component documentation
- Stories that need controls and props
- Component variants and states

---

## Accessibility Testing

### Using the a11y Addon

The accessibility addon is configured in `.storybook/preview.ts`. It automatically:

- Scans rendered components for accessibility issues
- Shows violations in the Storybook UI
- Highlights ARIA issues, color contrast problems, and more

### Configuring a11y Parameters

Set accessibility parameters per story or globally:

```typescript
const meta = {
    // ...
    parameters: {
        a11y: {
            // 'todo' - show violations in UI only (default)
            // 'error' - fail CI on violations
            // 'off' - skip checks
            test: "todo",
            config: {
                rules: [
                    {
                        id: "color-contrast",
                        enabled: true,
                    },
                    {
                        id: "button-name",
                        enabled: true,
                    },
                ],
            },
        },
    },
} satisfies Meta<typeof Button>;
```

### Story-Specific a11y Configuration

Override accessibility rules for specific stories:

```typescript
export const IconButton: Story = {
  args: {
    icon: <Icon />,
    children: undefined,
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Icon buttons may not have visible text
            id: 'button-name',
            enabled: false,
          },
        ],
      },
    },
  },
};
```

### Common Accessibility Patterns

#### 1. Ensure Proper Labels

```typescript
export const WithAriaLabel: Story = {
  args: {
    "aria-label": "Close dialog",
    children: <Icon name="close" />,
  },
};
```

#### 2. Test Keyboard Navigation

Document keyboard interactions in story descriptions:

```typescript
export const KeyboardAccessible: Story = {
    args: {
        onClick: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "This button can be activated with Enter or Space key.",
            },
        },
    },
};
```

#### 3. Test Focus States

```typescript
export const FocusState: Story = {
    args: {
        variant: "outline",
    },
    parameters: {
        docs: {
            description: {
                story: "Focus ring should be visible when tabbing to this button.",
            },
        },
    },
};
```

---

## ArgTypes Configuration

### Purpose of ArgTypes

ArgTypes provide:

- **Controls** - Interactive UI to modify props
- **Documentation** - Descriptions and type information
- **Validation** - Constrained options for props

### Basic ArgTypes

```typescript
const meta = {
    // ...
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "subtle", "text", "outline"],
            description: "Visual style variant of the button",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "solid" },
            },
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the button",
        },
        disabled: {
            control: "boolean",
            description: "Whether the button is disabled",
        },
    },
} satisfies Meta<typeof Button>;
```

### Control Types

```typescript
argTypes: {
  // Text input
  label: {
    control: "text",
  },

  // Number input
  count: {
    control: "number",
  },

  // Range slider
  opacity: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
  },

  // Color picker
  backgroundColor: {
    control: "color",
  },

  // Select dropdown
  variant: {
    control: "select",
    options: ["solid", "subtle"],
  },

  // Radio buttons
  size: {
    control: "radio",
    options: ["sm", "md", "lg"],
  },

  // Multi-select
  tags: {
    control: "multi-select",
    options: ["react", "vue", "angular"],
  },

  // Date picker
  date: {
    control: "date",
  },

  // Object/array (JSON editor)
  config: {
    control: "object",
  },
}
```

### Hiding ArgTypes

Hide internal or computed props from controls:

```typescript
argTypes: {
  internalProp: {
    table: {
      disable: true,
    },
  },
  computedValue: {
    control: false, // Hides from controls but shows in docs
  },
}
```

### Organizing ArgTypes

Group related props in the controls panel:

```typescript
argTypes: {
  // Group: Appearance
  variant: { /* ... */ },
  size: { /* ... */ },
  color: { /* ... */ },

  // Group: State
  disabled: { /* ... */ },

  // Group: Content
  children: { /* ... */ },
  icon: { /* ... */ },
}
```

---

## Story Variants

### Creating Meaningful Variants

Create stories that showcase different use cases, not just prop combinations:

```typescript
// ✅ Good: Meaningful use cases
export const PrimaryAction: Story = {
    args: {
        variant: "solid",
        color: "accent",
        children: "Save Changes",
    },
};

export const DestructiveAction: Story = {
    args: {
        variant: "solid",
        color: "error",
        children: "Delete Account",
    },
};

export const SecondaryAction: Story = {
    args: {
        variant: "outline",
        children: "Cancel",
    },
};

// ❌ Avoid: Just prop combinations
export const SolidAccent: Story = {
    /* ... */
};
export const SolidPrimary: Story = {
    /* ... */
};
export const SubtleAccent: Story = {
    /* ... */
};
```

### State Variants

Document all component states:

```typescript
export const Default: Story = {
  args: {
    children: "Click me",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};


export const WithIcon: Story = {
  args: {
    children: "Download",
    icon: <DownloadIcon />,
    iconPosition: "left",
  },
};
```

### Edge Cases

Document edge cases and boundary conditions:

```typescript
export const LongText: Story = {
  args: {
    children: "This is a very long button label that might wrap",
  },
};

export const Empty: Story = {
  args: {
    children: "",
    "aria-label": "Empty button",
  },
};

export const IconOnly: Story = {
  args: {
    icon: <CloseIcon />,
    "aria-label": "Close",
    children: undefined,
  },
};
```

### Composition Stories

Show how components work together using Tailwind CSS classes:

```tsx
export const InForm: Story = {
    render: (args: Story["args"]) => (
        <form class="flex flex-col gap-3 w-[300px]">
            <Input label="Email" />
            <Input label="Password" type="password" />
            <Button {...args}>Submit</Button>
        </form>
    ),
    args: {
        type: "submit",
    },
};
```

---

## Best Practices

### 1. Use `satisfies` for Type Safety

Always use `satisfies Meta<typeof Component>`:

```typescript
const meta = {
    // ...
} satisfies Meta<typeof Button>;
```

This provides:

- Type checking
- Autocomplete
- Refactoring safety

### 2. Use `fn()` for Action Handlers

Use `fn()` from `storybook/test` for event handlers:

```typescript
import { fn } from "storybook/test";

const meta = {
    args: {
        onClick: fn(),
        onSubmit: fn(),
    },
};
```

This logs interactions in the Actions panel without running tests.

### 3. Organize Stories Hierarchically

Use clear category names:

```typescript
// Atoms (smallest components)
title: "Atoms/Button";
title: "Atoms/Input";
title: "Atoms/Icon";

// Molecules (composed components)
title: "Molecules/Card";
title: "Molecules/FormField";

// Organisms (complex components)
title: "Organisms/Header";
title: "Organisms/Footer";

// Pages (full page layouts)
title: "Pages/HomePage";
```

### 4. Provide Story Descriptions

Add descriptions to explain story purpose:

```typescript
export const WithTooltip: Story = {
    args: {
        // ...
    },
    parameters: {
        docs: {
            description: {
                story: "This button shows a tooltip on hover. The tooltip provides additional context about the action.",
            },
        },
    },
};
```
### 9. Type Args in Render Functions
 
**ALWAYS** explicitly type the `args` parameter in render functions to avoid implicit `any` errors and ensure type safety:
 
```typescript
export const CustomStory: Story = {
    render: (args: Story["args"]) => <Component {...args} />,
    args: {
        // ...
    },
};
```
 
Using `Story["args"]` ensures that the `args` object matches the inferred types from your meta configuration.
### 5. Use Meaningful Default Args

Set sensible defaults in the meta:

```typescript
const meta = {
    // ...
    args: {
        variant: "solid",
        size: "md",
        disabled: false,
        onClick: fn(),
    },
};
```

### 6. Use Tailwind CSS Classes for Styling

**Always use Tailwind CSS classes instead of inline styles** in story files:

```tsx
// ✅ Good: Using Tailwind classes
export const InForm: Story = {
    render: (args: Story["args"]) => (
        <form class="flex flex-col gap-3 w-[300px]">
            <Input label="Email" />
            <Input label="Password" type="password" />
            <Button {...args}>Submit</Button>
        </form>
    ),
};

// ❌ Bad: Using inline styles
export const InForm: Story = {
    render: (args: Story["args"]) => (
        <form
            style={{
                display: "flex",
                "flex-direction": "column",
                gap: "12px",
                width: "300px",
            }}
        >
            <Input label="Email" />
            <Input label="Password" type="password" />
            <Button {...args}>Submit</Button>
        </form>
    ),
};
```

**Common Tailwind patterns for stories:**

```tsx
// Flexbox layouts
<div class="flex flex-col gap-2 w-[300px]">        // flex column with gap
<div class="flex gap-4 items-center">              // flex row with gap and alignment
<div class="flex flex-col gap-4">                 // flex column with gap

// Spacing and sizing
<div class="p-6">                                  // padding
<div class="w-[300px]">                           // fixed width
<div class="w-full">                              // full width

// Typography
<span class="text-xs text-fg-muted">              // small text, muted color
<span class="text-sm font-semibold">              // small text, semibold

// Colors (use design tokens)
<span class="text-red-600">                       // error text color
<div class="bg-primary">                          // background using design token
```

**Why Tailwind?**

- Consistent with the rest of the codebase
- Better maintainability
- Design system alignment
- Smaller bundle size (with proper purging)
- Easier to read and understand

### 7. Document Accessibility Features

Explicitly document accessibility in story descriptions:

```typescript
export const Accessible: Story = {
    args: {
        "aria-label": "Close dialog",
    },
    parameters: {
        docs: {
            description: {
                story: "This button includes an aria-label for screen readers when the text is not descriptive enough.",
            },
        },
    },
};
```

### 8. Show Error States

Document error and validation states:

```typescript
export const ErrorState: Story = {
    args: {
        variant: "outline",
        color: "error",
        children: "Failed to save",
    },
    parameters: {
        docs: {
            description: {
                story: "Error state button used for failed actions or validation errors.",
            },
        },
    },
};
```

---

## Common Patterns

### Pattern 1: Component with Multiple Variants

**File: `Button.stories.tsx`**

```tsx
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Button } from "./Button";

const meta = {
    title: "Atoms/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "subtle", "text", "outline"],
        },
        color: {
            control: "select",
            options: ["primary", "accent", "success", "warning", "error"],
        },
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: "solid",
        color: "accent",
        children: "Primary Button",
    },
};

export const Secondary: Story = {
    args: {
        variant: "outline",
        color: "accent",
        children: "Secondary Button",
    },
};

export const Destructive: Story = {
    args: {
        variant: "solid",
        color: "error",
        children: "Delete",
    },
};
```

### Pattern 3: Component in Context

**File: `Button.stories.tsx`**

```tsx
export const InCard: Story = {
    render: (args: Story["args"]) => (
        <Card>
            <Card.Header>
                <h3>Card Title</h3>
            </Card.Header>
            <Card.Body>
                <p>Card content goes here.</p>
            </Card.Body>
            <Card.Footer>
                <Button {...args}>Action</Button>
            </Card.Footer>
        </Card>
    ),
    args: {
        variant: "solid",
    },
};
```

### Pattern 4: Responsive Behavior

**File: `Button.stories.tsx`**

```tsx
export const Responsive: Story = {
    args: {
        children: "Responsive Button",
    },
    parameters: {
        viewport: {
            viewports: {
                mobile: {
                    name: "Mobile",
                    styles: { width: "375px", height: "667px" },
                },
                tablet: {
                    name: "Tablet",
                    styles: { width: "768px", height: "1024px" },
                },
                desktop: {
                    name: "Desktop",
                    styles: { width: "1920px", height: "1080px" },
                },
            },
        },
    },
};
```

### Pattern 5: Dark Mode / Theme Variants

**File: `Button.stories.tsx`**

```tsx
export const LightMode: Story = {
    args: {
        variant: "solid",
    },
    parameters: {
        backgrounds: {
            default: "light",
        },
    },
};

export const DarkMode: Story = {
    args: {
        variant: "solid",
    },
    parameters: {
        backgrounds: {
            default: "dark",
        },
    },
};
```

### Pattern 6: Content-First MDX Documentation

**File: `DesignSystem.mdx`** (non-interactive, content-first)

```mdx
import { Meta } from "@storybook/blocks";

<Meta title="Design System/Overview" />

# Design System Overview

This is a content-first documentation page that provides an overview of our design system.

## Principles

Our design system is built on three core principles:

1. **Consistency** - Components follow consistent patterns
2. **Accessibility** - All components meet WCAG 2.1 AA standards
3. **Flexibility** - Components are composable and customizable

## Component Categories

### Atoms

Basic building blocks like buttons, inputs, and icons.

### Molecules

Composed components like form fields and cards.

### Organisms

Complex components like headers and navigation.
```

**Note:** MDX files are non-interactive and focus on written content. Use `.tsx` stories for interactive component documentation with controls.

---

## Accessibility Checklist

When writing stories, ensure you cover:

- [ ] **Keyboard Navigation** - Document keyboard interactions
- [ ] **Screen Reader Support** - Test with aria-labels and descriptions
- [ ] **Focus Indicators** - Verify focus states are visible
- [ ] **Color Contrast** - Use a11y addon to check contrast ratios
- [ ] **Semantic HTML** - Ensure proper HTML elements are used
- [ ] **ARIA Attributes** - Document required ARIA attributes
- [ ] **Disabled States** - Show how disabled components behave
- [ ] **Error States** - Show error messaging and validation

---

## Quick Reference

### Story File Naming

- **Atom components**: Always use `ComponentName.stories.tsx` (e.g., `Button.stories.tsx`, `Input.stories.tsx`)
- **Content-first documentation**: Use `DocumentationName.mdx` for non-interactive, content-first pages
- Stories are co-located with components or in `src/stories/`

### Required Imports

```typescript
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
```

### Essential Meta Properties

```typescript
{
  title: "Category/Component",
  component: YourComponent,
  tags: ["autodocs"],
  parameters: { /* ... */ },
  argTypes: { /* ... */ },
  args: { /* ... */ },
}
```

### Common Parameters

```typescript
parameters: {
  layout: "centered" | "fullscreen" | "padded",
  a11y: { test: "todo" },
  docs: { description: { story: "..." } },
  backgrounds: { default: "light" | "dark" },
}
```

---

## Resources

- [Storybook v10 Documentation](https://storybook.js.org/docs)
- [Writing Stories Guide](https://storybook.js.org/docs/writing-stories)
- [Accessibility Testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
- [ArgTypes](https://storybook.js.org/docs/api/argtypes)

---

## Summary

Remember:

1. **Stories document, tests verify** - Keep test logic in Vitest
2. **Use `.tsx` for atoms** - Always use `.stories.tsx` for atom component stories
3. **Use MDX for content-first docs** - Use `.mdx` for non-interactive, content-first documentation
4. **Use autodocs** - Enable automatic documentation generation
5. **Test accessibility** - Use the a11y addon to catch issues
6. **Create meaningful variants** - Show use cases, not just props
7. **Document thoroughly** - Add descriptions and examples
8. **Organize clearly** - Use hierarchical titles and categories

Happy story writing! 🎨
