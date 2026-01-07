# SolidJS Best Practices for LLMs

This guide outlines strict rules and best practices for generating SolidJS code. These rules are crucial because SolidJS works differently from React, and mistakes here can break reactivity.

## 1. Reactivity Fundamentals

### 1.1. Signal Access
**Rule:** always access signals by calling them as functions.
*   **Correct:** `console.log(count())`
*   **Incorrect:** `console.log(count)`

### 1.2. Tracking Scopes
**Rule:** Reactivity is tracked strictly within tracking scopes (JSX, `createEffect`, `createMemo`).
*   **Note:** Accessing a signal outside a tracking scope will just read the value once and never update.

## 2. Component Props

### 2.1. No Destructuring
**CRITICAL RULE:** NEVER destructure `props`. Destructuring breaks reactivity because accessing the property on the destructured object does not track the underlying signal.
*   **Correct:**
    ```tsx
    const MyComponent = (props) => {
      return <div>{props.title}</div>
    }
    ```
*   **Incorrect:**
    ```tsx
    const MyComponent = ({ title }) => {
      return <div>{title}</div> // 'title' will not update if props.title changes
    }
    ```

### 2.2. Split Props
**Rule:** If you need to separate props (e.g., for spreading rest props onto a DOM element), use `splitProps`.
*   **Example:**
    ```tsx
    const [local, others] = splitProps(props, ['class', 'children']);
    return <div class={local.class} {...others}>{local.children}</div>
    ```

### 2.3. Default Props
**Rule:** Use `mergeProps` if you need default values, or handle it inside the usage (e.g., `props.value ?? 'default'`). Do not use default parameters in the function signature if you want defaults to be merged reactively.
*   **Example:**
    ```tsx
    const merged = mergeProps({ size: 'md' }, props);
    // Use merged.size
    ```

## 3. Control Flow

### 3.1. Use Components, Not Array Methods
**Rule:** Use `<For>`, `<Show>`, `<Switch>`, `<Match>`, `<Index>` instead of `array.map`, ternary operators, or `if` statements inside JSX.
*   **Why:** Solid's control flow components are optimized for fine-grained updates. `Array.map` recreates all nodes on every update.
*   **Correct:**
    ```tsx
    <For each={items()}>
      {(item) => <div>{item.name}</div>}
    </For>
    ```
*   **Incorrect:**
    ```tsx
    {items().map(item => <div>{item.name}</div>)}
    ```

### 3.2. Show for Conditionals
*   **Correct:**
    ```tsx
    <Show when={props.isLoggedIn} fallback={<Login />}>
      <Dashboard />
    </Show>
    ```
*   **Incorrect:**
    ```tsx
    {props.isLoggedIn ? <Dashboard /> : <Login />}
    ```

## 4. Derived State and Side Effects

### 4.1. createMemo
**Rule:** Use `createMemo` for expensive computations or when you need a stable derived signal reference. If the derivation is cheap (e.g., string concatenation), a simple function is often sufficient (`const fullName = () => "${firstName()} ${lastName()}"`).

### 4.2. createEffect
**Rule:** Use `createEffect` ONLY for side effects (syncing with external stores, manual DOM manipulation, etc.). Do not use it to sync one signal to another; use derived state (`createMemo` or function) instead.

## 5. Styling

### 5.1. classList
**Rule:** Use `classList` for conditional classes. it is cleaner and more efficient.
*   **Example:**
    ```tsx
    <div classList={{ 'active': isActive(), 'disabled': props.isDisabled }} />
    ```

## 6. Accessing the DOM

### 6.1. Refs
**Rule:** Use standard variable refs.
*   **Example:**
    ```tsx
    let myDiv;
    <div ref={myDiv} />
    onMount(() => console.log(myDiv));
    ```
*   **Note:** In TypeScript, strict typing might require:
    ```tsx
    let myDiv!: HTMLDivElement;
    ```

## 7. Component Lifecycle

### 7.1. Components Run Once
**Rule:** Remember that the component function body runs ONLY ONCE.
*   **Implication:** Any code directly in the function body that creates DOM or logs output happens only on mount. Updates happen essentially "inside" the returned JSX closure (where signals are accessed).
*   **Mistake:** Putting a `console.log(props.value)` in the body will only log the initial value. Use `createEffect(() => console.log(props.value))` to log updates.

## 8. TypeScript

### 8.1. Component Type
**Rule:** Use `Component` or `ParentComponent` (if children are expected) types.
*   **Example:**
    ```tsx
    import { Component } from 'solid-js';
    const Button: Component<ButtonProps> = (props) => { ... }
    ```

## 9. Advanced Reactivity Techniques

### 9.1. Nested Reactivity with `createStore`
**Rule:** Use `createStore` when dealing with nested objects or arrays where you want fine-grained updates for individual properties.
*   **Why:** `createSignal` triggers an update for the whole object when any part changes (if not mutated carefully), whereas `createStore` allows tracking specific properties.
*   **Example:**
    ```tsx
    const [state, setState] = createStore({ user: { name: 'John', age: 25 } });
    // Update only age
    setState('user', 'age', 26);
    ```

### 9.2. `batch` for Performance
**Rule:** Use `batch` when making multiple synchronous state updates to prevent unnecessary intermediate re-renders.
*   **Example:**
    ```tsx
    batch(() => {
        setFirstName("John");
        setLastName("Doe");
    });
    ```

### 9.3. `untrack`
**Rule:** Use `untrack` when you need to read a signal's value inside a tracking scope (like `createEffect`) WITHOUT subscribing to that signal.
*   **Example:**
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
*   **Why:** SolidJS components run once. `cloneElement` (or iterating over children to inject props) is antipattern or difficult because `children` are often lazily evaluated functions. Context provides a reactive way to share state with deep descendants without tight coupling.
*   **Example:**
    ```tsx
    // Create Context
    const TabsContext = createContext<{ selected: Accessor<string>, setSelected: Setter<string> }>();

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
                classList={{ 'active': ctx?.selected() === props.value }}
                onClick={() => ctx?.setSelected(props.value)}
            >
                {props.children}
            </button>
        );
    };
    ```

## 11. Async & Resources

### 11.1. `createResource`
**Rule:** Use `createResource` for async data fetching. It integrates with `<Suspense>` automatically.
*   **Example:**
    ```tsx
    const [data] = createResource(userId, fetchUser);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>{data()?.name}</div>
        </Suspense>
    );
    ```

## 12. Recommended Utilities

### 12.1. Solid Primitives
**Rule:** For common problems, check `@solid-primitives/*` before writing custom hooks.
*   **Common Packages:**
    *   `@solid-primitives/resize-observer`: For element resizing.
    *   `@solid-primitives/intersection-observer`: For visibility checks.
    *   `@solid-primitives/media`: For media queries.
    *   `@solid-primitives/storage`: For reactive localStorage/sessionStorage.

## 13. Animation (Solid Transition Group)

### 13.1. Presence
**Rule:** When animating mounting/unmounting, use `@solid-primitives/transition-group` or pure CSS animations triggered by class changes if possible. Do not manually manipulate DOM nodes for removal if `Show` or `For` can handle it.

## 14. Summary Checklist for LLMs

1.  [ ] Are direct prop accesses used instead of destructuring (`props.x`, not `const { x } = props`)?
2.  [ ] Are signals called as functions (`val()`)?
3.  [ ] Are control flow components (`<Show>`, `<For>`) used instead of JS equivalents?
4.  [ ] Is `classList` used for conditional classes?
5.  [ ] Are derived states implemented as functions or `createMemo`, avoiding `createEffect` for state synchronization?
6.  [ ] Is `createStore` used for complex nested state?
7.  [ ] Are `batch` and `untrack` used to optimize reactivity where appropriate?
8.  [ ] Are Layout/Compound components using Context to share state instead of iterating children?
