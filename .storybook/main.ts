import type { StorybookConfig } from "storybook-solidjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
    stories: [
        "../src/storybook/**/*.mdx",
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
    ],
    framework: "storybook-solidjs-vite",
    viteFinal: async (config) => {
        // Ensure Tailwind plugin is added at the beginning to process CSS correctly
        // This is critical for Tailwind CSS v4 to process @import "tailwindcss" directives
        // With Tailwind v4, the plugin automatically scans files and generates utilities
        const tailwindPlugin = tailwindcss();

        // Remove any existing Tailwind plugin to avoid duplicates
        if (config.plugins) {
            config.plugins = config.plugins.filter((plugin) => {
                // Filter out any existing Tailwind plugin
                if (!plugin) return true;
                const pluginName = (plugin as any).name;
                return pluginName !== "@tailwindcss/vite";
            });
            // Insert Tailwind plugin at the beginning for proper CSS processing
            // This ensures Tailwind processes CSS files before other plugins
            config.plugins = [tailwindPlugin, ...config.plugins];
        } else {
            config.plugins = [tailwindPlugin];
        }

        // Ensure Vite processes CSS files correctly
        // This is important for Tailwind v4 to scan and generate utilities
        if (!config.css) {
            config.css = {};
        }
        config.css.devSourcemap = true;

        return config;
    },
};
export default config;
