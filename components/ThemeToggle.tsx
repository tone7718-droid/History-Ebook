"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
        aria-label="테마"
      >
        테마
      </button>
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const label =
    theme === "light" ? "라이트" : theme === "dark" ? "다크" : "시스템";

  return (
    <button
      type="button"
      onClick={cycle}
      className="min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
      aria-label={`테마: ${label}`}
    >
      {label}
    </button>
  );
}
