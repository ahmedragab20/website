import type { Meta, StoryObj } from "storybook-solidjs-vite";
import ThemeToggle from "./ThemeToggle";

/**
 * ThemeToggle component for switching between color themes.
 *
 * Provides a visual interface to switch between available themes.
 * Supports 35 modern IDE themes.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
const meta = {
    title: "Components/ThemeToggle",
    component: ThemeToggle,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
