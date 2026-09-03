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
export function clampTerminalSize(w: number, h: number): { width: number; height: number } {
  return {
    width: Math.min(MAX_TERMINAL_W, Math.max(MIN_TERMINAL, Math.floor(w) || 1)),
    height: Math.min(MAX_TERMINAL_H, Math.max(MIN_TERMINAL, Math.floor(h) || 1)),
  };
}
