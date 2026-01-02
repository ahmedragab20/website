import { For, createEffect } from "solid-js";
import { Dropdown, DropdownItem } from "./atoms/Dropdown";
import { Button } from "./atoms/Button";
import { useTheme } from "../hooks/useTheme";

export default function ThemeSwitcherComplete() {
    const { theme, setTheme, themes } = useTheme();

    const formatThemeName = (themeName: string): string => {
        return themeName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    let displayElement: HTMLSpanElement | undefined;

    createEffect(() => {
        if (displayElement) {
            displayElement.textContent = formatThemeName(theme());
        }
    });

    return (
        <Dropdown
            placement="bottom-end"
            aria-label="Theme switcher"
            trigger={
                <Button variant="outline" size="sm" class="capitalize">
                    <span ref={displayElement}>{formatThemeName(theme())}</span>
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
                {(themeOption) => (
                    <DropdownItem
                        onClick={() => setTheme(themeOption)}
                        class="capitalize"
                    >
                        {formatThemeName(themeOption)}
                    </DropdownItem>
                )}
            </For>
        </Dropdown>
    );
}
