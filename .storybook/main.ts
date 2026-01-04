import type { StorybookConfig } from "storybook-solidjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
    stories: [
        // "../src/storybook/**/*.mdx",
        // "../src/**/*.mdx",
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
        const tailwindPlugin = tailwindcss();

        if (config.plugins) {
            config.plugins = config.plugins.filter((plugin) => {
                if (!plugin) return true;
                const pluginName = (plugin as any).name;
                return pluginName !== "@tailwindcss/vite";
            });
            config.plugins = [tailwindPlugin, ...config.plugins];
        } else {
            config.plugins = [tailwindPlugin];
        }

        if (!config.css) {
            config.css = {};
        }
        config.css.devSourcemap = true;

        return config;
    },
};
export default config;
