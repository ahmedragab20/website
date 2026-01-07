# SolidJS Best Practices for LLMs

This guide outlines strict rules and best practices for generating SolidJS code. These rules are crucial because SolidJS works differently from React, and mistakes here can break reactivity.

## 1. Reactivity Fundamentals

### 1.1. Signal Access

**Rule:** always access signals by calling them as functions.

- **Correct:** `console.log(count())`
- **Incorrect:** `console.log(count)`

### 1.2. Tracking Scopes

**Rule:** Reactivity is tracked strictly within tracking scopes (JSX, `createEffect`, `createMemo`).

- **Note:** Accessing a signal outside a tracking scope will just read the value once and never update.

## 2. Component Props

### 2.1. No Destructuring

**CRITICAL RULE:** NEVER destructure `props`. Destructuring breaks reactivity because accessing the property on the destructured object does not track the underlying signal.

- **Correct:**
    ```tsx
    const MyComponent = (props) => {
        return <div>{props.title}</div>;
    };
    ```
- **Incorrect:**
    ```tsx
    const MyComponent = ({ title }) => {
        return <div>{title}</div>; // 'title' will not update if props.title changes
    };
    ```

### 2.2. Split Props

**Rule:** If you need to separate props (e.g., for spreading rest props onto a DOM element), use `splitProps`.

- **Example:**
    ```tsx
    const [local, others] = splitProps(props, ["class", "children"]);
    return (
        <div class={local.class} {...others}>
            {local.children}
        </div>
    );
    ```

### 2.3. Default Props

**Rule:** Use `mergeProps` if you need default values, or handle it inside the usage (e.g., `props.value ?? 'default'`). Do not use default parameters in the function signature if you want defaults to be merged reactively.

- **Example:**
    ```tsx
    const merged = mergeProps({ size: "md" }, props);
    // Use merged.size
    ```

## 3. Control Flow

### 3.1. Use Components, Not Array Methods

**Rule:** Use `<For>`, `<Show>`, `<Switch>`, `<Match>`, `<Index>` instead of `array.map`, ternary operators, or `if` statements inside JSX.

- **Why:** Solid's control flow components are optimized for fine-grained updates. `Array.map` recreates all nodes on every update.
- **Tip (For vs Index):**
    - Use `<For each={items()}>` when iterating over **objects**. It keys by reference, so if the array order changes, DOM nodes are moved, not recreated.
    - Use `<Index each={items()}>` when iterating over **primitives** (strings/numbers) or when the list length is stable and you standardly want to update values at specific indices without moving DOM nodes.
- **Correct:**
    ```tsx
    <For each={items()}>{(item) => <div>{item.name}</div>}</For>
    ```
- **Incorrect:**
    ```tsx
    {
        items().map((item) => <div>{item.name}</div>);
    }
    ```

### 3.2. Show for Conditionals

- **Correct:**
    ```tsx
    <Show when={props.isLoggedIn} fallback={<Login />}>
        <Dashboard />
    </Show>
    ```
- **Incorrect:**
    ```tsx
    {
        props.isLoggedIn ? <Dashboard /> : <Login />;
    }
    ```

## 4. Derived State and Side Effects

### 4.1. createMemo

**Rule:** Use `createMemo` for expensive computations or when you need a stable derived signal reference. If the derivation is cheap (e.g., string concatenation), a simple function is often sufficient (`const fullName = () => "${firstName()} ${lastName()}"`).

### 4.2. createEffect

**Rule:** Use `createEffect` ONLY for side effects (syncing with external stores, manual DOM manipulation, etc.). Do not use it to sync one signal to another; use derived state (`createMemo` or function) instead.

## 5. Styling

### 5.1. classList

**Rule:** Use `classList` for conditional classes. it is cleaner and more efficient.

- **Example:**
    ```tsx
    <div classList={{ active: isActive(), disabled: props.isDisabled }} />
    ```

## 6. Accessing the DOM

### 6.1. Refs

**Rule:** Use standard variable refs.

- **Example:**
    ```tsx
    let myDiv;
    <div ref={myDiv} />;
    onMount(() => console.log(myDiv));
    ```
- **Note:** In TypeScript, strict typing might require:
    ```tsx
    let myDiv!: HTMLDivElement;
    ```

## 7. Component Lifecycle

### 7.1. Components Run Once

**Rule:** Remember that the component function body runs ONLY ONCE.

- **Implication:** Any code directly in the function body that creates DOM or logs output happens only on mount. Updates happen essentially "inside" the returned JSX closure (where signals are accessed).
- **Mistake:** Putting a `console.log(props.value)` in the body will only log the initial value. Use `createEffect(() => console.log(props.value))` to log updates.

## 8. TypeScript

### 8.1. Component Type

**Rule:** Use `Component` or `ParentComponent` (if children are expected) types.

- **Example:**
    ```tsx
    import { Component } from 'solid-js';
    const Button: Component<ButtonProps> = (props) => { ... }
    ```

## 9. Advanced Reactivity Techniques

### 9.1. Nested Reactivity & Path Syntax (createStore)

**CRITICAL RULE:** When updating a store, **ALWAYS use path syntax** (`setStore('key', 'nested', value)`). **NEVER** use object spreading (`...`) to update the store at the top level or nested levels unless absolutely necessary for replacing an entire structure. Path syntax allows Solid to pinpoint exactly which property changed, ensuring fine-grained reactivity.

- **Why:** 
    - Spreading (`{ ...state, count: 5 }`) creates a new object reference. This notifies *all* observers of the parent object, even if they only cared about unrelated properties.
    - Path syntax (`setStore('count', 5)`) updates *only* the specific property, triggering *only* the effects that depend on that specific leaf node.

- **Correct (Path Syntax):**
    ```tsx
    const [state, setState] = createStore({ 
        user: { 
            name: "John", 
            settings: { theme: "dark", notifications: true } 
        },
        todos: [{ id: 1, text: "Buy milk", done: false }]
    });

    // Update nested property directly
    setState("user", "settings", "theme", "light");

    // Update array item by index
    setState("todos", 0, "done", true);

    // Update array items using a predicate (e.g., mark all as done)
    setState("todos", (todo) => !todo.done, "done", true);
    ```

- **Incorrect (Spreading):**
    ```tsx
    // BAD: Triggers updates for 'user' and everything inside it, even if only 'age' changed
    setState({ 
        ...state, 
        user: { 
            ...state.user, 
            settings: { ...state.user.settings, theme: "light" } 
        } 
    });
    ```

    ```

### 9.2. Store Utilities (`produce`, `reconcile`, `unwrap`)

**Rule:** Use these utilities to handle complex store updates more efficiently.

#### 9.2.1. `produce`
- **Use when:** You want to modify a store using mutable style (like Immer), or need to update multiple properties at once without multiple path-setter calls.
- **Example:**
    ```tsx
    import { produce } from "solid-js/store";
    setState("users", index, produce((user) => {
        user.name = "New Name";
        user.active = true;
    }));
    ```

#### 9.2.2. `reconcile`
- **Use when:** You are replacing a large part of the store (e.g., from an API response) and want to keep references stable where data hasn't changed. This avoids recreating DOM nodes for unchanged items in a list.
- **Example:**
    ```tsx
    import { reconcile } from "solid-js/store";
    // Only updates 'animals' that actually changed/added/removed
    setState("animals", reconcile(apiResponseList)); 
    ```

#### 9.2.3. `unwrap`
- **Use when:** You need a non-reactive, raw JavaScript object snapshot of the store (e.g., for logging or passing to a 3rd party non-reactive library).
- **Example:**
    ```tsx
    import { unwrap } from "solid-js/store";
    console.log(unwrap(store.data)); 
    ```

### 9.3. `batch` for Performance

**Rule:** Use `batch` when making multiple synchronous state updates to prevent unnecessary intermediate re-renders.

- **Example:**
    ```tsx
    batch(() => {
        setFirstName("John");
        setLastName("Doe");
    });
    ```

### 9.4. `untrack`

**Rule:** Use `untrack` when you need to read a signal's value inside a tracking scope (like `createEffect`) WITHOUT subscribing to that signal.

- **Example:**
    ```tsx
    createEffect(() => {
        const currentCount = count();
        const untrackedValue = untrack(otherSignal); // Changes to otherSignal won't re-run this effect
        console.log(currentCount, untrackedValue);
    });
    ```

## 10. Component Patterns

### 10.1. Compound Components & Context

**Rule:** Prefer `Context` over `cloneElement` or complex prop drilling when building compound components (e.g., Accordion, Tabs, Select).

- **Why:** SolidJS components run once. `cloneElement` (or iterating over children to inject props) is antipattern or difficult because `children` are often lazily evaluated functions. Context provides a reactive way to share state with deep descendants without tight coupling.
- **Example:**

    ```tsx
    // Create Context
    const TabsContext = createContext<{
        selected: Accessor<string>;
        setSelected: Setter<string>;
    }>();

    // Parent
    const Tabs: Component = (props) => {
        const [selected, setSelected] = createSignal(props.defaultValue);
        return (
            <TabsContext.Provider value={{ selected, setSelected }}>
                <div class="tabs">{props.children}</div>
            </TabsContext.Provider>
        );
    };

    // Child
    const TabItem: Component = (props) => {
        const ctx = useContext(TabsContext);
        return (
            <button
                classList={{ active: ctx?.selected() === props.value }}
                onClick={() => ctx?.setSelected(props.value)}
            >
                {props.children}
            </button>
        );
    };
    ```

## 11. Async & Resources

### 11.1. `createResource` (The Gold Standard)

**Rule:** Always use `createResource` for asynchronous data fetching (e.g., API calls). It integrates automatically with `<Suspense>` and `<ErrorBoundary>`.

- **Why:** `createResource` manages the loading state, error state, and value automatically. It also handles race conditions (latest request wins) and integrates with Solid's SSR and hydration.
- **Example:**
    ```tsx
    const [data, { mutate, refetch }] = createResource(sourceSignal, fetchDataFunction);
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
                <div>{data()?.name}</div>
            </ErrorBoundary>
        </Suspense>
    );
    ```

### 11.2. Async in `createEffect`

**Rule:** `createEffect` functions are synchronous by default. If you need to perform async operations (that are NOT data fetching - for data fetching use Resources), be very careful about dependencies and cleanup.

- **Warning:** `await` inside a `createEffect` breaks the tracking scope. Signals accessed *after* the `await` keyword will NOT be tracked as dependencies of the effect.
- **Solution:** 
    1. Read all necessary signals *synchronously* at the start of the effect.
    2. Use `onCleanup` to handle cancellations or resetting state.
    3. Use `on` (from `solid-js`) to make dependencies explicit if logic gets complex.

- **Example (Explicit Dependencies with `on`):**
    ```tsx
    createEffect(on(userId, async (id) => {
        // 'userId' is strictly tracked. 
        // Anything accessed inside the async function is NOT tracked, which is often desired for async side-effects.
        await doAsyncWork(id);
    }));
    ```
