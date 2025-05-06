"use client";

import * as React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// Define available themes
const themes = [
  { id: "theme-1", name: "Default" },
  { id: "theme-2", name: "Purple" },
  { id: "theme-3", name: "Monochrome" },
  { id: "theme-4", name: "Retro" },
  { id: "theme-5", name: "Minimal" },
  { id: "theme-6", name: "Colorful" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<string>("theme-1");

  // useEffect only runs on the client, so we can safely show the UI
  React.useEffect(() => {
    setMounted(true);

    // Get the current theme from localStorage or use default
    const savedTheme = localStorage.getItem("app-theme") || "theme-1";
    setCurrentTheme(savedTheme);

    // Apply the theme class to the root element
    document.documentElement.classList.remove(...themes.map(t => t.id));
    document.documentElement.classList.add(savedTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("app-theme", themeId);

    // Apply the theme class to the root element
    document.documentElement.classList.remove(...themes.map(t => t.id));
    document.documentElement.classList.add(themeId);
  };

  if (!mounted) {
    // Avoid rendering mismatch during hydration
    // Render a placeholder or null on the server
    return <div className="h-[1.2rem] w-[1.2rem]"></div>;
  }

  return (
    <div className="my-4 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Select theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themes.map((t) => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={currentTheme === t.id ? "bg-accent text-accent-foreground" : ""}
            >
              {t.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle mode</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}