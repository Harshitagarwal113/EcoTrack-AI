"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-surface-variant animate-pulse flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
          contrast
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-full hover:bg-surface-variant/50 flex items-center justify-center text-on-surface-variant transition-colors"
      title="Toggle Dark Mode"
      aria-label="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
        {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
