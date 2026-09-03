import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor";
import { TERMINAL_PRESETS, MIN_TERMINAL, MAX_TERMINAL_W, MAX_TERMINAL_H } from "@/lib/terminal";
import { ExportDialog } from "@/components/export/ExportDialog";
import { ImportDialog } from "@/components/export/ImportDialog";
import { ThemeControls } from "@/components/layout/ThemeControls";
import { Palette, FilePlus, Trash2 } from "lucide-react";

export function AppHeader() {
  const newProject = useEditorStore((s) => s.newProject);
  const terminalWidth = useEditorStore((s) => s.terminalWidth);
  const terminalHeight = useEditorStore((s) => s.terminalHeight);
  const setTerminalSize = useEditorStore((s) => s.setTerminalSize);
  const selectedPreset =
    TERMINAL_PRESETS.find((p) => p.width === terminalWidth && p.height === terminalHeight)?.id ??
    "custom";

  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <Palette className="size-6 text-primary" />
        <h1 className="text-lg font-semibold">BlueSoil</h1>
      </div>
      <div className="flex items-center gap-2">
        <select
          aria-label="Terminal size preset"
          value={selectedPreset}
          onChange={(e) => {
            const preset = TERMINAL_PRESETS.find((p) => p.id === e.target.value);
            if (preset) setTerminalSize(preset.width, preset.height);
          }}
          className="rounded-md border bg-background px-1.5 py-1 text-sm"
        >
          {TERMINAL_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
        <input
          aria-label="Terminal width"
          type="number"
          value={terminalWidth}
          min={MIN_TERMINAL}
          max={MAX_TERMINAL_W}
          onChange={(e) => {
            const next = e.target.valueAsNumber;
            if (Number.isFinite(next)) setTerminalSize(next, terminalHeight);
          }}
          className="w-16 rounded-md border bg-background px-1.5 py-1 text-sm"
        />
        <span className="text-sm text-muted-foreground">×</span>
        <input
          aria-label="Terminal height"
          type="number"
          value={terminalHeight}
          min={MIN_TERMINAL}
          max={MAX_TERMINAL_H}
          onChange={(e) => {
            const next = e.target.valueAsNumber;
            if (Number.isFinite(next)) setTerminalSize(terminalWidth, next);
          }}
          className="w-16 rounded-md border bg-background px-1.5 py-1 text-sm"
        />
        <ImportDialog />
        <ExportDialog />
        <Button variant="outline" size="sm" onClick={newProject}>
          <FilePlus data-icon="inline-start" />
          New
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Clear the canvas? This cannot be undone.")) newProject();
          }}
        >
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
        <ThemeControls />
      </div>
    </header>
  );
}
