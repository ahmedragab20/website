import type { Preview } from "storybook-solidjs-vite";
import { ThemeDecorator } from "./ThemeDecorator";
import "../src/assets/design/tokens.css";

const themes = ["nordfox", "nightfox", "carbonfox", "dayfox"] as const;

// Apply theme to all documents (including iframes for docs)
const applyThemeToAll = (theme: string) => {
    // Apply to main document
    document.documentElement.setAttribute("data-theme", theme);

    // Apply to all iframes (for Storybook docs)
    const applyToIframes = () => {
        document.querySelectorAll("iframe").forEach((iframe) => {
            try {
                const iframeDoc = (iframe as HTMLIFrameElement).contentDocument;
                if (iframeDoc) {
                    iframeDoc.documentElement.setAttribute("data-theme", theme);
                }
            } catch (e) {
                console.error("Failed to apply theme to iframe:", e);
            }
        });
    };

    applyToIframes();

    // Also watch for new iframes being added (for docs pages that load dynamically)
    const observer = new MutationObserver(() => {
        applyToIframes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Clean up observer after a delay to avoid memory leaks
    setTimeout(() => observer.disconnect(), 5000);
};

// Initialize theme on load
if (typeof window !== "undefined") {
    const initialTheme = localStorage.getItem("storybook-theme") || "nordfox";
    applyThemeToAll(initialTheme);

    // Watch for theme changes
    window.addEventListener("storage", (e) => {
        if (e.key === "storybook-theme" && e.newValue) {
            applyThemeToAll(e.newValue);
        }
    });
}

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },

        docs: {
            // Ensure MDX files inherit theme styles
            theme: undefined, // Use default Storybook theme
        },
    },
    globalTypes: {
        theme: {
            description: "Global theme for components",
            defaultValue: "nordfox",
            toolbar: {
                title: "Theme",
                icon: "paintbrush",
                items: themes.map((theme) => ({
                    value: theme,
                    title: theme.charAt(0).toUpperCase() + theme.slice(1),
                })),
                dynamicTitle: true,
            },
        },
    },
    decorators: [ThemeDecorator as any],
};

export default preview;
