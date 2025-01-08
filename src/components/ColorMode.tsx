import { DropdownMenuSubTriggerProps } from "@kobalte/core/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useColorMode } from "@kobalte/core";
import { Show } from "solid-js";

export const ColorMode = () => {
  const theme = useColorMode();

  return (
    <DropdownMenu placement="bottom-start">
      <DropdownMenuTrigger
        as={(props: DropdownMenuSubTriggerProps) => (
          <Button variant="outline" {...props}>
            <Show when={theme.colorMode() === "light"}>
              <span class="i-mingcute-moon-line"></span>
            </Show>
            <Show when={theme.colorMode() === "dark"}>
              <span class="i-mingcute-sun-line"></span>
            </Show>
          </Button>
        )}
      />
      <DropdownMenuContent class="w-max">
        <DropdownMenuItem onSelect={() => theme.setColorMode("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => theme.setColorMode("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => theme.setColorMode("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ColorMode;
