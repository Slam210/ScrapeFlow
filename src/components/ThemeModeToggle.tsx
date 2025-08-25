"use client";

import * as React from "react";
import { CogIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * A client-side theme mode selector rendered as a dropdown button.
 *
 * Renders a trigger button showing an icon that reflects the current selection (Sun for "light", Moon for "dark", Cog for "system"). On mount the component enables client-only rendering to avoid SSR hydration issues; selecting an option updates both the local icon state and the global theme via next-themes' `setTheme`.
 *
 * @returns The dropdown JSX element, or `null` until the component has mounted (prevents SSR hydration mismatch).
 */
export function ModeToggle() {
  const [themeIcon, setThemeIcon] = React.useState("");
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {themeIcon === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          ) : themeIcon === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-all scale-100 rotate-0" />
          ) : (
            <CogIcon className="h-[1.2rem] w-[1.2rem] transition-all scale-100 rotate-0" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setThemeIcon("light");
            setTheme("light");
          }}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setThemeIcon("dark");
            setTheme("dark");
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setThemeIcon("system");
            setTheme("system");
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
