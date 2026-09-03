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

const CC_RGB: Record<string, [number, number, number]> = {
  "0": [240, 240, 240],
  "1": [242, 178, 51],
  "2": [229, 127, 216],
  "3": [153, 178, 242],
  "4": [222, 222, 108],
  "5": [127, 204, 25],
  "6": [242, 178, 204],
  "7": [76, 76, 76],
  "8": [153, 153, 153],
  "9": [76, 153, 178],
  a: [178, 102, 229],
  b: [37, 49, 146],
  c: [127, 102, 76],
  d: [87, 166, 78],
  e: [204, 76, 76],
  f: [0, 0, 0],
};

export function hexToCC(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  let best = "f";
  let bestDist = Infinity;
  for (const [key, [pr, pg, pb]] of Object.entries(CC_RGB)) {
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = key;
    }
  }
  return best;
}

export function ccToHex(index: string): string {
  const [r, g, b] = CC_RGB[index] || CC_RGB["f"];
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
