"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="px-3 py-1.5 rounded-md border border-neutral-700 hover:bg-neutral-800 transition"
      title="Toggle theme"
    >
      {resolvedTheme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
