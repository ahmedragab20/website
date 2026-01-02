import { For } from "solid-js";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
    const { theme, setTheme, themes } = useTheme();

    const formatThemeName = (themeName: string): string => {
        return themeName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div class="flex items-center gap-2 p-2 rounded-lg bg-secondary border border-ui-border">
            <div class="flex gap-1 flex-wrap">
                <For each={themes}>
                    {(themeOption) => (
                        <button
                            onClick={() => setTheme(themeOption)}
                            class={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                                theme() === themeOption
                                    ? "bg-accent text-primary"
                                    : "text-fg-muted hover:text-fg-main hover:bg-tertiary"
                            }`}
                        >
                            {formatThemeName(themeOption)}
                        </button>
                    )}
                </For>
            </div>
        </div>
    );
}
