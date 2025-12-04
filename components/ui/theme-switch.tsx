"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
  variant?: "icon-click";
  modes: string[];
  icons: React.ReactNode[];
  showInactiveIcons?: "all";
  className?: string;
}

export function ThemeSwitch({
  variant,
  modes,
  icons,
  className,
}: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentIndex = modes.indexOf(theme || "system");
  const nextIndex = (currentIndex + 1) % modes.length;
  const nextTheme = modes[nextIndex];

  const currentIcon = icons[currentIndex !== -1 ? currentIndex : 0];

  if (variant === "icon-click") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", className)}
        onClick={() => setTheme(nextTheme)}
      >
        {currentIcon}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return null;
}
