import { THEMES } from "../src/hooks/useTheme";
import type { Theme } from "../src/hooks/useTheme";

const themes = THEMES;

// Function to apply theme to document
const applyTheme = (theme: string) => {
    if (themes.includes(theme as Theme)) {
        // Apply to current document
        document.documentElement.setAttribute("data-theme", theme);

        // Also apply to Storybook's docs iframe if it exists
        const docsIframe = document.querySelector(
            'iframe[title*="storybook"]'
        ) as HTMLIFrameElement;
        if (docsIframe?.contentDocument) {
            docsIframe.contentDocument.documentElement.setAttribute(
                "data-theme",
                theme
            );
        }

        // Apply to all iframes (for docs pages)
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
    }
};

// Listen for theme changes from Storybook toolbar
if (typeof window !== "undefined") {
    // Apply theme on initial load
    const savedTheme = localStorage.getItem("storybook-theme");
    const initialTheme =
        savedTheme && themes.includes(savedTheme as Theme)
            ? savedTheme
            : "nordfox";
    applyTheme(initialTheme);

    // Listen for storage changes (when theme is changed in toolbar)
    window.addEventListener("storage", (e) => {
        if (e.key === "storybook-theme" && e.newValue) {
            applyTheme(e.newValue);
        }
    });

    // Also listen for custom events (for same-window theme changes)
    window.addEventListener("storybook-theme-change", ((e: CustomEvent) => {
        if (e.detail?.theme) {
            applyTheme(e.detail.theme as string);
        }
    }) as EventListener);
}

export const ThemeDecorator = (Story: any, context: any) => {
    // Get theme from toolbar global value, localStorage, or default to nordfox
    const themeFromGlobals = context.globals?.theme;
    const themeFromStorage = localStorage.getItem("storybook-theme");
    const themeValue = themeFromGlobals || themeFromStorage || "nordfox";
    const theme = themes.includes(themeValue as Theme) ? themeValue : "nordfox";

    // Apply theme immediately
    applyTheme(theme);

    // Sync with localStorage
    if (themeFromGlobals) {
        localStorage.setItem("storybook-theme", theme);
        // Dispatch custom event for same-window listeners
        window.dispatchEvent(
            new CustomEvent("storybook-theme-change", { detail: { theme } })
        );
    }

    // Just render the story without any UI overlay
    return Story(context);
};
