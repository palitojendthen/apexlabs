"use client";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md border border-teal-400" />
          <span className="font-semibold tracking-wide">ApexQuantLabs</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500 dark:text-slate-300">
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Resources</a>
          <a href="#">Pricing</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
