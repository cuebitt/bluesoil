export const CC_PALETTE: Record<string, string> = {
  "0": "rgb(240,240,240)",
  "1": "rgb(242,178,51)",
  "2": "rgb(229,127,216)",
  "3": "rgb(153,178,242)",
  "4": "rgb(222,222,108)",
  "5": "rgb(127,204,25)",
  "6": "rgb(242,178,204)",
  "7": "rgb(76,76,76)",
  "8": "rgb(153,153,153)",
  "9": "rgb(76,153,178)",
  a: "rgb(178,102,229)",
  b: "rgb(37,49,146)",
  c: "rgb(127,102,76)",
  d: "rgb(87,166,78)",
  e: "rgb(204,76,76)",
  f: "rgb(0,0,0)",
};

export function hexToCC(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  let best = "f";
  let bestDist = Infinity;
  for (const [key, rgb] of Object.entries(CC_PALETTE)) {
    const match = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!match) continue;
    const pr = parseInt(match[1]);
    const pg = parseInt(match[2]);
    const pb = parseInt(match[3]);
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = key;
    }
  }
  return best;
}

export function ccToHex(index: string): string {
  const rgb = CC_PALETTE[index] || CC_PALETTE["f"];
  const match = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return "#000000";
  return `#${parseInt(match[1]).toString(16).padStart(2, "0")}${parseInt(match[2]).toString(16).padStart(2, "0")}${parseInt(match[3]).toString(16).padStart(2, "0")}`;
}

export const TERMINAL_WIDTH = 51;
export const TERMINAL_HEIGHT = 19;
