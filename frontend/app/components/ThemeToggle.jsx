"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const activeTheme = theme === "system" ? systemTheme : theme;
  const isDark = activeTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border px-3 py-2 text-sm hover:border-teal-400"
      aria-pressed={isDark}
      title="Toggle theme"
    >
      {isDark ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
}