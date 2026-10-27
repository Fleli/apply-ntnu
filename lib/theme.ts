export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "applyntnu-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

// Runs while <head> is parsed, before content paints. Only fixed application
// constants are interpolated; browser storage is validated before use.
export const themeInitScript = `(() => {
  let saved;
  try { saved = localStorage.getItem("${THEME_STORAGE_KEY}"); } catch {}
  const theme = saved === "light" || saved === "dark"
    ? saved
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
})();`;
