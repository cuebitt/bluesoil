import { Monitor, Moon, Sun } from "lucide-react";
import { ACCENTS, useThemeStore, type Accent, type ThemeMode } from "@/store/theme";
import { cn } from "@/lib/utils";

const ACCENT_DOT: Record<Accent, string> = {
  neutral: "bg-neutral-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
};

const ACCENT_LABEL: Record<Accent, string> = {
  neutral: "Neutral",
  blue: "Blue",
  green: "Green",
  amber: "Amber",
  red: "Red",
  violet: "Violet",
};

const MODES: Array<{ mode: ThemeMode; label: string; Icon: typeof Sun }> = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "system", label: "System", Icon: Monitor },
];

export function ThemeControls() {
  const mode = useThemeStore((s) => s.mode);
  const accent = useThemeStore((s) => s.accent);
  const setMode = useThemeStore((s) => s.setMode);
  const setAccent = useThemeStore((s) => s.setAccent);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1 rounded-md border p-0.5">
        {ACCENTS.map((a) => (
          <button
            key={a}
            type="button"
            title={ACCENT_LABEL[a]}
            aria-label={`Accent: ${ACCENT_LABEL[a]}`}
            aria-pressed={accent === a}
            onClick={() => setAccent(a)}
            className={cn(
              "size-5 rounded-full transition-all",
              ACCENT_DOT[a],
              accent === a && "ring-2 ring-ring ring-offset-2 ring-offset-background",
            )}
          />
        ))}
      </div>
      <div
        className="flex items-center gap-0.5 rounded-md border p-0.5"
        role="group"
        aria-label="Color mode"
      >
        {MODES.map(({ mode: m, label, Icon }) => (
          <button
            key={m}
            type="button"
            title={label}
            aria-label={`Color mode: ${label}`}
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-sm p-1.5 transition-colors hover:bg-muted",
              mode === m ? "bg-muted text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
