import { createSignal, onMount, onCleanup, createEffect } from "solid-js";

export const THEMES = [
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

export type Theme = (typeof THEMES)[number];

const DEFAULT_THEME: Theme = "nordfox";
const STORAGE_KEY = "theme";

export interface UseThemeReturn {
    theme: () => Theme;
    setTheme: (theme: Theme) => void;
    themes: readonly Theme[];
    defaultTheme: Theme;
}

export function useTheme(): UseThemeReturn {
    const [theme, setThemeSignal] = createSignal<Theme>(DEFAULT_THEME);

    const setTheme = (newTheme: Theme) => {
        if (typeof window === "undefined") return;

        if (!THEMES.includes(newTheme)) {
            console.warn(`Invalid theme: ${newTheme}. Using default theme.`);
            newTheme = DEFAULT_THEME;
        }

        setThemeSignal(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);

        window.dispatchEvent(
            new CustomEvent("theme-change", { detail: { theme: newTheme } })
        );
    };

    const loadTheme = () => {
        if (typeof window === "undefined") return;

        const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
        const initialTheme =
            savedTheme && THEMES.includes(savedTheme)
                ? savedTheme
                : DEFAULT_THEME;

        setThemeSignal(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
    };

    onMount(() => {
        loadTheme();
    });

    createEffect(() => {
        if (typeof window === "undefined") return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                const newTheme = e.newValue as Theme;
                if (THEMES.includes(newTheme)) {
                    setThemeSignal(newTheme);
                    document.documentElement.setAttribute(
                        "data-theme",
                        newTheme
                    );
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        onCleanup(() => {
            window.removeEventListener("storage", handleStorageChange);
        });
    });

    return {
        theme,
        setTheme,
        themes: THEMES,
        defaultTheme: DEFAULT_THEME,
    };
}
