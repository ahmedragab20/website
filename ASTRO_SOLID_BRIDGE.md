# Astro-to-Solid Components Bridge

This document explains the bridge pattern for using SolidJS components that require JSX elements as props (like `trigger` in Dropdown) within Astro files.

## Problem

Astro doesn't support passing JSX elements directly as props to SolidJS components. For example, the `Dropdown` component expects a `trigger` prop that is a JSX element:

```tsx
// This works in SolidJS/TSX
<Dropdown trigger={<Button>Open Menu</Button>}>
    <DropdownItem>Item 1</DropdownItem>
</Dropdown>
```

But in Astro, you can't pass JSX elements as props. However, Astro does support **slots**, which is perfect for this use case.

## Solution

The bridge pattern uses:

1. An **Astro component** (`.astro`) that accepts slots
2. A **SolidJS bridge component** (`.tsx`) that converts slots to JSX
3. The **original SolidJS component** that does the actual work

## Architecture

```
Astro File
  └──> Dropdown.astro (accepts slots)
        └──> DropdownBridge.tsx (converts slots to JSX)
              └──> Dropdown.tsx (original component)
```

## Usage

### In Astro Files

Use the `.astro` bridge component with a named slot for the trigger and direct children for dropdown items:

```astro
---
import { Dropdown } from "@/components/atoms/Dropdown/Dropdown.astro";
import { DropdownItem } from "@/components/atoms/Dropdown";
import { Button } from "@/components/atoms/Button";
---

<Dropdown client:load size="md" placement="bottom-start">
    <button slot="trigger" class="px-4 py-2 bg-accent rounded">
        Open Menu
    </button>

    <DropdownItem client:load>Profile</DropdownItem>
    <DropdownItem client:load>Settings</DropdownItem>
    <DropdownItem client:load>Logout</DropdownItem>
</Dropdown>
```

**Important:**

- The `trigger` uses a **slot** (can be HTML or Astro components)
- The `children` (DropdownItem components) are passed **directly** (not in a slot) and need `client:load` to work as SolidJS components

### With Button Component

You can use the Button component in the trigger slot:

```astro
---
import { Dropdown } from "@/components/atoms/Dropdown/Dropdown.astro";
import { DropdownItem } from "@/components/atoms/Dropdown";
import { Button } from "@/components/atoms/Button";
---

<Dropdown client:load>
    <Button slot="trigger" client:load>Open Menu</Button>

    <DropdownItem client:load onClick={() => alert("Edit clicked")}
        >Edit</DropdownItem
    >
    <DropdownItem
        client:load
        onClick={() => alert("Delete clicked")}
        variant="danger"
    >
        Delete
    </DropdownItem>
</Dropdown>
```

## How It Works

1. **Astro Component** (`Dropdown.astro`):
    - Accepts a `trigger` slot and default slot (for dropdown items)
    - Renders the trigger slot into a hidden container with a unique ID
    - Renders the `DropdownBridge` component with the trigger ID

2. **Bridge Component** (`DropdownBridge.tsx`):
    - Finds the trigger element by ID
    - Moves it into the Dropdown's trigger wrapper
    - Passes all other props to the original Dropdown component

3. **Original Component** (`Dropdown.tsx`):
    - Works exactly as before, receiving the trigger as JSX

## Creating New Bridges

When you need to create a bridge for another component:

### 1. Create the Bridge Component

```tsx
// MyComponentBridge.tsx
import { type JSX, onMount, createSignal, Show } from "solid-js";
import { MyComponent, type MyComponentProps } from "./MyComponent";

export interface MyComponentBridgeProps extends Omit<
    MyComponentProps,
    "trigger" | "children"
> {
    triggerId: string;
    children: JSX.Element;
}

export function MyComponentBridge(props: MyComponentBridgeProps) {
    const [triggerElement, setTriggerElement] =
        createSignal<HTMLElement | null>(null);

    onMount(() => {
        const container = document.getElementById(props.triggerId);
        if (container) {
            const trigger = container.firstElementChild as HTMLElement;
            if (trigger) {
                setTriggerElement(trigger);
            }
        }
    });

    return (
        <Show when={triggerElement()}>
            {(trigger) => (
                <MyComponent
                    {...props}
                    trigger={
                        <div
                            ref={(el) => {
                                const actualTrigger = trigger();
                                if (
                                    actualTrigger &&
                                    el &&
                                    actualTrigger.parentNode
                                ) {
                                    el.appendChild(actualTrigger);
                                }
                            }}
                        />
                    }
                >
                    {props.children}
                </MyComponent>
            )}
        </Show>
    );
}
```

### 2. Create the Astro Component

```astro
---
// MyComponent.astro
import { MyComponentBridge } from "./MyComponentBridge";
import type { MyComponentProps } from "./MyComponent";

interface Props extends Omit<MyComponentProps, "trigger" | "children"> {
    class?: string;
}

const { class: className, ...rest } = Astro.props;
const triggerId = `mycomponent-trigger-${Math.random().toString(36).substring(2, 9)}`;
---

<div id={triggerId} style="display: contents;">
    <slot name="trigger" />
</div>

<MyComponentBridge
    client:load
    triggerId={triggerId}
    class={className}
    {...rest}
>
    <slot />
</MyComponentBridge>
```

### 3. Export the Bridge

```ts
// index.ts
export { MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";
export { MyComponentBridge } from "./MyComponentBridge";
export type { MyComponentBridgeProps } from "./MyComponentBridge";
```

## When to Use Bridges

Use bridges when:

- ✅ A SolidJS component requires JSX elements as props (not just children)
- ✅ You want to use the component in Astro files
- ✅ The component needs slots for flexibility

Don't use bridges when:

- ❌ The component only needs children (use `client:load` directly)
- ❌ The component accepts simple props (strings, numbers, booleans)
- ❌ You're only using the component in SolidJS/TSX files

## Examples

### Dropdown Component

```astro
---
import { Dropdown } from "@/components/atoms/Dropdown/Dropdown.astro";
import { DropdownItem } from "@/components/atoms/Dropdown";
import { Button } from "@/components/atoms/Button";
---

<Dropdown client:load placement="bottom-end">
    <Button slot="trigger" client:load variant="solid" color="accent">
        Actions
    </Button>

    <DropdownItem client:load onClick={() => console.log("Edit")}
        >Edit</DropdownItem
    >
    <DropdownItem client:load onClick={() => console.log("Share")}
        >Share</DropdownItem
    >
    <DropdownItem
        client:load
        variant="danger"
        onClick={() => console.log("Delete")}
    >
        Delete
    </DropdownItem>
</Dropdown>
```

## Notes

- Always use `client:load` on the bridge component
- The trigger slot must contain a single root element
- The bridge pattern moves the trigger element in the DOM, so it will be removed from its original location
- Use `display: contents` on the trigger container to avoid layout issues
- **Children (like DropdownItem) must be passed directly (not in a slot) and need `client:load`** to work as SolidJS components
- The trigger slot can contain HTML or Astro components (rendered as HTML)
- SolidJS components as children are passed directly to the bridge component
