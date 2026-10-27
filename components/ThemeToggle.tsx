"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { isTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function readPreference(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  // Keep the first client render identical to SSR; the head script already
  // applies the right palette before hydration.
  const [theme, setTheme] = useState<Theme | null>(null);
  const preference = useRef<Theme | null>(null);

  useLayoutEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    preference.current = readPreference();
    const apply = () => {
      const resolved = preference.current ?? (system.matches ? "dark" : "light");
      document.documentElement.dataset.theme = resolved;
      setTheme(resolved);
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      preference.current = readPreference();
      apply();
    };
    apply();
    system.addEventListener("change", apply);
    window.addEventListener("storage", syncStorage);
    return () => {
      system.removeEventListener("change", apply);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    preference.current = next;
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); }
    catch { /* Keep the choice for this page even if storage is unavailable. */ }
  }

  const label = theme === "dark" ? "Bytt til lyst tema" : "Bytt til mørkt tema";
  return (
    <button type="button" onClick={toggle} disabled={theme === null}
      aria-label={label} title={label}
      className="btn-ghost h-11 w-11 shrink-0 rounded-full p-0 disabled:opacity-50">
      {theme === "dark" ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
