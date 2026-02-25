import { For, lazy, Show } from "solid-js";
import { useTheme } from "../hooks/useTheme";
import {
    Dropdown,
    DropdownItem,
    type DropdownProps,
} from "./atoms/Dropdown/Dropdown";
import { Button } from "./atoms";
const Paintbrush = lazy(() => import("./icons/Paintbrush"));
const Check = lazy(() => import("./icons/Check"));

export default function ThemesSwitch(props: {
    placement?: DropdownProps["placement"];
}) {
    const { theme, setTheme, themes } = useTheme();

    const formatThemeName = (themeName: string): string => {
        return themeName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <Dropdown
            trigger={
                <Button variant="outline">
                    <Paintbrush class="size-4" />
                </Button>
            }
            placement={props.placement}
        >
            <div class="max-h-96">
                <For each={themes}>
                    {(themeOption) => (
                        <DropdownItem
                            onClick={() => setTheme(themeOption)}
                            class="justify-between"
                            aria-label={`Select ${formatThemeName(themeOption)} theme`}
                        >
                            <>
                                <span
                                    class={
                                        theme() === themeOption
                                            ? "font-medium"
                                            : ""
                                    }
                                >
                                    {formatThemeName(themeOption)}
                                </span>
                                <Show when={theme() === themeOption}>
                                    <Check class="size-4" />
                                </Show>
                            </>
                        </DropdownItem>
                    )}
                </For>
            </div>
        </Dropdown>
    );
}
