import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

export type Accent = "neutral" | "blue" | "green" | "amber" | "red" | "violet";

export const ACCENTS: Accent[] = ["neutral", "blue", "green", "amber", "red", "violet"];

const STORAGE_KEY = "bluesand-theme";

interface ThemeStore {
  mode: ThemeMode;
  systemDark: boolean;
  accent: Accent;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
}

function isMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function isAccent(value: unknown): value is Accent {
  return typeof value === "string" && (ACCENTS as string[]).includes(value);
}

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolveEffective(mode: ThemeMode, systemDark: boolean): "light" | "dark" {
  return mode === "system" ? (systemDark ? "dark" : "light") : mode;
}

function loadInitial(): { mode: ThemeMode; accent: Accent } {
  const fallback: { mode: ThemeMode; accent: Accent } = { mode: "system", accent: "neutral" };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { mode?: unknown; accent?: unknown };
      return {
        mode: isMode(parsed.mode) ? parsed.mode : "system",
        accent: isAccent(parsed.accent) ? parsed.accent : "neutral",
      };
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

function applyTheme(mode: ThemeMode, accent: Accent, systemDark: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", resolveEffective(mode, systemDark) === "dark");
  if (accent === "neutral") {
    root.removeAttribute("data-accent");
  } else {
    root.setAttribute("data-accent", accent);
  }
}

function persist(mode: ThemeMode, accent: Accent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, accent }));
  } catch {
    /* ignore */
  }
}

const initial = loadInitial();
const initialSystemDark = typeof window === "undefined" ? false : prefersDark();
applyTheme(initial.mode, initial.accent, initialSystemDark);

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const state = useThemeStore.getState();
    applyTheme(state.mode, state.accent, e.matches);
    if (state.mode === "system") useThemeStore.setState({ systemDark: e.matches });
  });
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: initial.mode,
  systemDark: initialSystemDark,
  accent: initial.accent,

  setMode: (mode) =>
    set((state) => {
      applyTheme(mode, state.accent, state.systemDark);
      persist(mode, state.accent);
      return { mode };
    }),

  setAccent: (accent) =>
    set((state) => {
      applyTheme(state.mode, accent, state.systemDark);
      persist(state.mode, accent);
      return { accent };
    }),
}));
