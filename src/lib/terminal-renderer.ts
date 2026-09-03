import type { ElementNode } from "./elements";
import { CC_PALETTE, hexToCC } from "./palette-colors";

export const CELL_WIDTH = 6;
export const CELL_HEIGHT = 9;
const TERMINAL_MARGIN = 4;

export interface TerminalCell {
  char: string;
  fg: string;
  bg: string;
}

export type TerminalGrid = TerminalCell[][];

let fontImage: HTMLImageElement | null = null;
let fontLoaded = false;
let fontPromise: Promise<void> | null = null;
const paletteCache: Record<string, HTMLCanvasElement> = {};

export function loadFont(fontPath: string): Promise<void> {
  if (fontLoaded) return Promise.resolve();
  if (fontPromise) return fontPromise;

  fontImage = new Image();
  fontImage.src = fontPath;

  fontPromise = new Promise<void>((resolve, reject) => {
    fontImage!.onload = () => {
      fontLoaded = true;
      for (const key of Object.keys(CC_PALETTE)) {
        loadPalette(CC_PALETTE[key]);
      }
      resolve();
    };
    fontImage!.onerror = () => {
      fontPromise = null;
      reject(new Error(`Failed to load terminal font: ${fontPath}`));
    };
  });

  return fontPromise;
}

function loadPalette(color: string): HTMLCanvasElement {
  if (paletteCache[color]) return paletteCache[color];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  canvas.width = fontImage!.width;
  canvas.height = fontImage!.height;
  ctx.globalCompositeOperation = "destination-atop";
  ctx.fillStyle = color;
  ctx.globalAlpha = 1.0;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fontImage!, 0, 0);
  paletteCache[color] = canvas;
  return canvas;
}

export function createGrid(w: number, h: number): TerminalGrid {
  const grid: TerminalGrid = [];
  for (let y = 0; y < h; y++) {
    const row: TerminalCell[] = [];
    for (let x = 0; x < w; x++) {
      row.push({ char: " ", fg: "0", bg: "f" });
    }
    grid.push(row);
  }
  return grid;
}

const SHORT_LABELS: Partial<Record<ElementNode["type"], string>> = {
  barChart: "Bar",
  lineChart: "Line",
  bigFont: "Big",
  pixelGraph: "Pixel",
};

export function renderToGrid(elements: ElementNode[], w: number, h: number): TerminalGrid {
  const grid = createGrid(w, h);

  function renderElement(el: ElementNode) {
    const x = (el.attributes.x as number) || 1;
    const y = (el.attributes.y as number) || 1;
    const ew = (el.attributes.width as number) || 10;
    const eh = (el.attributes.height as number) || 3;
    const bg = el.attributes.background;
    const fg = el.attributes.foreground;
    const text = (el.attributes.text as string) || "";

    const label =
      text || SHORT_LABELS[el.type] || el.type.charAt(0).toUpperCase() + el.type.slice(1);

    if (bg && typeof bg !== "boolean") {
      const bgIdx = resolveColor(bg);
      for (let dy = 0; dy < eh; dy++) {
        for (let dx = 0; dx < ew; dx++) {
          const gx = x - 1 + dx;
          const gy = y - 1 + dy;
          if (gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[0].length) {
            grid[gy][gx].bg = bgIdx;
          }
        }
      }
    }

    const fgIdx = fg ? resolveColor(fg) : "0";
    for (let i = 0; i < label.length && i < ew; i++) {
      const gx = x - 1 + i;
      const gy = y - 1;
      if (gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[0].length) {
        grid[gy][gx].char = label[i];
        grid[gy][gx].fg = fgIdx;
      }
    }

    if (el.type === "bigFont") {
      for (let i = 0; i < label.length && i < ew; i++) {
        const gx = x - 1 + i;
        const gy = y;
        if (gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[0].length) {
          grid[gy][gx].char = label[i];
          grid[gy][gx].fg = fgIdx;
        }
      }
    }

    for (const child of el.children) {
      renderElement(child);
    }
  }

  for (const el of elements) {
    renderElement(el);
  }
  return grid;
}

function resolveColor(val: string | number | boolean | object): string {
  if (typeof val === "string" && val.startsWith("#")) return hexToCC(val);
  if (typeof val === "string") return val;
  return "f";
}

export function drawGrid(ctx: CanvasRenderingContext2D, grid: TerminalGrid, scale: number): void {
  if (!fontLoaded || !fontImage) return;

  const fontScale = fontImage.width / 256;
  const fontMargin = fontScale;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      const cellX = x * CELL_WIDTH * scale + TERMINAL_MARGIN;
      const cellY = y * CELL_HEIGHT * scale + TERMINAL_MARGIN;

      ctx.fillStyle = CC_PALETTE[cell.bg] || CC_PALETTE["f"];
      ctx.fillRect(cellX, cellY, CELL_WIDTH * scale, CELL_HEIGHT * scale);

      if (cell.char !== " ") {
        const charCode = cell.char.charCodeAt(0);
        const imgW = CELL_WIDTH * fontScale;
        const imgH = CELL_HEIGHT * fontScale;
        const imgX = fontMargin + (charCode % 16) * (imgW + fontMargin * 2);
        const imgY = fontMargin + Math.floor(charCode / 16) * (imgH + fontMargin * 2);

        const fgColor = CC_PALETTE[cell.fg] || CC_PALETTE["0"];
        const tinted = loadPalette(fgColor);

        ctx.drawImage(
          tinted,
          imgX,
          imgY,
          imgW,
          imgH,
          cellX,
          cellY,
          CELL_WIDTH * scale,
          CELL_HEIGHT * scale,
        );
      }
    }
  }
}

export function pixelToCell(
  px: number,
  py: number,
  scale: number,
  w: number,
  h: number,
): { x: number; y: number } | null {
  const x = Math.floor((px - TERMINAL_MARGIN) / (CELL_WIDTH * scale));
  const y = Math.floor((py - TERMINAL_MARGIN) / (CELL_HEIGHT * scale));
  if (x < 0 || x >= w || y < 0 || y >= h) return null;
  return { x, y };
}

export function hitTest(elements: ElementNode[], cellX: number, cellY: number): ElementNode | null {
  // pixelToCell returns 0-based cells; element x/y are 1-based.
  const x1 = cellX + 1;
  const y1 = cellY + 1;
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.children.length > 0) {
      const childHit = hitTest(el.children, cellX, cellY);
      if (childHit) return childHit;
    }
    const ex = (el.attributes.x as number) || 1;
    const ey = (el.attributes.y as number) || 1;
    const ew = (el.attributes.width as number) || 10;
    const eh = (el.attributes.height as number) || 3;
    if (x1 >= ex && x1 < ex + ew && y1 >= ey && y1 < ey + eh) {
      return el;
    }
  }
  return null;
}
