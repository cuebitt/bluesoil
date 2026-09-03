export interface TerminalPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}
export const TERMINAL_PRESETS: TerminalPreset[] = [
  { id: "computer", label: "Computer (51×19)", width: 51, height: 19 },
  { id: "pocket", label: "Pocket (26×20)", width: 26, height: 20 },
  { id: "monitor", label: "Monitor 2x2 (7×5)", width: 7, height: 5 },
  { id: "monitor3x2", label: "Monitor 3x2 (10×6)", width: 10, height: 6 },
  { id: "monitor5x4", label: "Monitor 5x4 (16×12)", width: 16, height: 12 },
];
export const MIN_TERMINAL = 1;
export const MAX_TERMINAL_W = 164;
export const MAX_TERMINAL_H = 81;
export type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
export function resizeAttrs(
  rect: { x: number; y: number; width: number; height: number },
  dx: number,
  dy: number,
  handle: ResizeHandle,
  termW: number,
  termH: number,
) {
  const right = rect.x + rect.width - 1;
  const bottom = rect.y + rect.height - 1;
  let { x, y, width, height } = rect;
  if (handle.includes("e")) width = Math.max(1, rect.width + dx);
  if (handle.includes("s")) height = Math.max(1, rect.height + dy);
  if (handle.includes("w")) {
    x = Math.max(1, rect.x + dx);
    width = Math.max(1, right - x + 1);
  }
  if (handle.includes("n")) {
    y = Math.max(1, rect.y + dy);
    height = Math.max(1, bottom - y + 1);
  }
  width = Math.max(1, Math.min(width, termW - x + 1));
  height = Math.max(1, Math.min(height, termH - y + 1));
  return { x, y, width, height };
}
export function clampTerminalSize(w: number, h: number): { width: number; height: number } {
  return {
    width: Math.min(MAX_TERMINAL_W, Math.max(MIN_TERMINAL, Math.floor(w) || 1)),
    height: Math.min(MAX_TERMINAL_H, Math.max(MIN_TERMINAL, Math.floor(h) || 1)),
  };
}
