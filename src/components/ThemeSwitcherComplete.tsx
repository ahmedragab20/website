import { onMount, For } from "solid-js";
import { Dropdown, DropdownItem } from "./atoms/Dropdown";
import { Button } from "./atoms/Button";

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

export default function ThemeSwitcherComplete() {
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
        <Dropdown
            placement="bottom-end"
            aria-label="Theme switcher"
            trigger={
                <Button variant="outline" size="sm" class="capitalize">
                    <span id="current-theme-display">nordfox</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="ml-1"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </Button>
            }
        >
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
        </Dropdown>
    );
}
