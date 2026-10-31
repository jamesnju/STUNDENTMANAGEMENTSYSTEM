"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  /** Toggle requires `settable: true` on the provider. */
  toggle: () => void;
  /** Explicit setter — respects the same `settable` rule. */
  setTheme: (t: Theme) => void;
  /** Whether the current provider allows changes. */
  settable: boolean;
}

const Ctx = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
  settable: false,
});

const STORAGE_KEY = "theme";

interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * If `true`, the user can change the theme via `toggle` / `setTheme`.
   * If `false`, the provider forces light mode and ignores stored preference.
   *
   * Root provider: `settable={false}` (landing + login stay light).
   * Dashboard layout: nest another `<ThemeProvider settable>` to enable it.
   */
  settable?: boolean;
  /** Force a specific theme regardless of storage. Defaults to `"light"`. */
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  settable = false,
  defaultTheme = "light",
}: ThemeProviderProps) {
  // SSR-safe: initial state matches the server-rendered markup (light).
  // On mount, we read localStorage / DOM class and sync.
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Sync on mount (client only)
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? defaultTheme;
    const next = settable ? stored : defaultTheme;
    setThemeState(next);
    applyThemeClass(next);
  }, [settable, defaultTheme]);

  const applyAndPersist = useCallback(
    (next: Theme) => {
      if (!settable) return;
      setThemeState(next);
      applyThemeClass(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* localStorage may be unavailable (private mode) — non-fatal */
      }
    },
    [settable]
  );

  const toggle = useCallback(() => {
    applyAndPersist(theme === "light" ? "dark" : "light");
  }, [theme, applyAndPersist]);

  const setTheme = useCallback(
    (t: Theme) => applyAndPersist(t),
    [applyAndPersist]
  );

  return (
    <Ctx.Provider value={{ theme, toggle, setTheme, settable }}>
      {children}
    </Ctx.Provider>
  );
}

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useTheme = () => useContext(Ctx);