import { createSignal, onMount, For } from "solid-js";

const themes = ["nordfox", "nightfox", "carbonfox", "dayfox"] as const;
type Theme = (typeof themes)[number];

export default function ThemeToggle() {
    const [currentTheme, setCurrentTheme] = createSignal<Theme>("nordfox");

    onMount(() => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme && themes.includes(savedTheme)) {
            setCurrentTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            document.documentElement.setAttribute("data-theme", "nordfox");
        }
    });

    const switchTheme = (theme: Theme) => {
        setCurrentTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    };

    return (
        <div class="flex items-center gap-2 p-2 rounded-lg bg-secondary border border-(--color-ui-border)">
            <span class="text-sm text-fg-mute px-2">Theme:</span>
            <div class="flex gap-1">
                <For each={themes}>{(theme) => (
                    <button
                        onClick={() => switchTheme(theme)}
                        class={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                            currentTheme() === theme
                                ? "bg-accent text-primary"
                                : "text-fg-mute hover:text-fg-main hover:bg-(--color-tertiary)"
                        }`}
                    >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                )}</For>
            </div>
        </div>
    );
}
