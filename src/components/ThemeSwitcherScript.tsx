import { For } from "solid-js";
import { DropdownItem } from "./atoms/Dropdown";
import { useTheme } from "../hooks/useTheme";

export default function ThemeSwitcherScript() {
    const { setTheme, themes } = useTheme();

    const formatThemeName = (themeName: string): string => {
        return themeName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
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
    );
}
