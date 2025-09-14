"use client";

import { useEffect, useState, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark";
  attribute?: "class" | "data-theme";
  forcedTheme?: "light" | "dark";
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  attribute = "class",
  forcedTheme,
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const theme = forcedTheme || defaultTheme;
    if (attribute === "class") {
      root.classList.toggle("dark", theme === "dark");
    } else {
      root.setAttribute(attribute, theme);
    }
  }, [forcedTheme, defaultTheme, attribute]);

  // Only render children after mounted to avoid hydration mismatch
  if (!mounted) return null;

  return <>{children}</>;
}
