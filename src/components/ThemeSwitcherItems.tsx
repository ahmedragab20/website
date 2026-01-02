import { onMount, For } from "solid-js";
import { DropdownItem } from "./atoms/Dropdown";

const themes = ["nordfox", "nightfox", "carbonfox", "dayfox"] as const;
type Theme = (typeof themes)[number];

function switchTheme(theme: Theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Update display
    const display = document.getElementById("current-theme-display");
    if (display) {
        display.textContent = theme;
    }

    // Dispatch custom event for same-window listeners
    window.dispatchEvent(
        new CustomEvent("theme-change", { detail: { theme } })
    );
}

export default function ThemeSwitcherItems() {
    onMount(() => {
        // Set initial theme display
        const savedTheme = (localStorage.getItem("theme") ||
            "nordfox") as Theme;
        const display = document.getElementById("current-theme-display");
        if (display) {
            display.textContent = savedTheme;
        }
    });

    return (
        <For each={themes}>
            {(theme) => (
                <DropdownItem
                    onClick={() => switchTheme(theme)}
                    class="capitalize"
                >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </DropdownItem>
            )}
        </For>
    );
}
