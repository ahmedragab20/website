// Storybook Theme Decorator - Applies theme via CSS data attributes only
// No dependencies on app's useTheme hook

const THEMES = [
    "nordfox",
    "nightfox",
    "carbonfox",
    "dayfox",
    "dracula",
    "onedark",
    "gruvbox",
    "material",
    "monokai",
    "solarized-dark",
    "solarized-light",
    "tokyo-night",
    "catppuccin-mocha",
    "catppuccin-latte",
    "rose-pine",
    "ayu-dark",
    "ayu-light",
    "github-dark",
    "github-light",
    "github-dimmed",
    "nord",
    "everforest-dark",
    "everforest-light",
    "kanagawa",
    "oxocarbon",
    "poimandres",
    "tokyo-night-storm",
    "shades-of-purple",
    "synthwave",
    "horizon",
    "sonokai",
    "material-ocean",
    "vscode-dark-plus",
    "palenight",
    "night-owl",
    "ayu-mirage",
    "rose-pine-dawn",
    "tokyo-night-day",
    "one-light",
    "linear-light",
    "nord-snow-storm",
    "zenburn",
    "panda",
    "darcula",
    "papercolor-light",
    "intellij-light",
    "flat-light",
    "cobalt2",
    "monokai-pro",
    "winter-is-coming",
    "night-owl-light",
    "oceanic-next",
    "city-lights",
    "andromeda",
    "cyberpunk",
    "jellybeans",
    "tomorrow-night",
    "tomorrow-night-eighties",
    "tomorrow-night-blue",
    "twilight",
    "espresso",
    "kimbie-dark",
    "gruvbox-material",
] as const;

type Theme = (typeof THEMES)[number];

// Function to apply theme to document
const applyTheme = (theme: string) => {
    if (THEMES.includes(theme as Theme)) {
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
        savedTheme && THEMES.includes(savedTheme as Theme)
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
    const theme = THEMES.includes(themeValue as Theme) ? themeValue : "nordfox";

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

    // Just render the story - no provider needed since we rely on CSS data-theme
    return Story(context);
};
