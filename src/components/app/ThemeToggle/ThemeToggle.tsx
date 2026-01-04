import { For } from "solid-js";
import { useTheme } from "../../../hooks/useTheme";

export default function ThemeToggle() {
    const { theme, setTheme, themes } = useTheme();

    const formatThemeName = (themeName: string): string => {
        return themeName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div class="flex flex-col gap-2 p-3 rounded-xl bg-secondary border border-ui-border shadow-sm max-w-2xl">
            <div class="flex items-center justify-between px-1">
                <span class="text-xs font-bold text-fg-muted uppercase tracking-wider">
                    Select Theme
                </span>
                <span class="text-xs text-fg-muted opacity-50">
                    {themes.length} available
                </span>
            </div>
            <div class="flex gap-1.5 flex-wrap max-h-50 overflow-y-auto p-1 custom-scrollbar">
                <For each={themes}>
                    {(themeOption) => (
                        <button
                            onClick={() => setTheme(themeOption)}
                            class={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 border ${
                                theme() === themeOption
                                    ? "bg-accent text-primary border-accent shadow-sm"
                                    : "bg-tertiary text-fg-muted border-transparent hover:text-fg-main hover:bg-ui-active"
                            }`}
                            title={formatThemeName(themeOption)}
                        >
                            {formatThemeName(themeOption)}
                        </button>
                    )}
                </For>
            </div>
        </div>
    );
}
