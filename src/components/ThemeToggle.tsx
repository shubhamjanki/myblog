"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-muted/50 border border-border/30 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-all duration-300"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Sun
        className={`w-4 h-4 absolute transition-all duration-500 ${
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`w-4 h-4 absolute transition-all duration-500 ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
