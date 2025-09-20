"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_OPTIONS = [
  {
    label: "Clair",
    value: "light",
    icon: SunIcon,
  },
  {
    label: "Sombre",
    value: "dark",
    icon: MoonIcon,
  },
  {
    label: "Automatique",
    value: "system",
    icon: LaptopIcon,
  },
] as const;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full border border-border bg-background/80 text-foreground shadow-sm transition-colors hover:bg-accent"
          aria-label="Basculer le thème"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Apparence</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(value) => {
            setTheme(value);
          }}
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{option.label}</span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
