import type { ElementNode, ElementType } from "./elements";
import { ELEMENT_DEFS } from "./elements";
import { clampTerminalSize } from "./terminal";

export const PROJECT_KIND = "bluesoil" as const;
export const PROJECT_VERSION = 1;

export interface ProjectFile {
  app: typeof PROJECT_KIND;
  version: number;
  terminal: { width: number; height: number };
  elements: ElementNode[];
}

export interface ParseResult {
  elements: ElementNode[];
  terminalWidth: number;
  terminalHeight: number;
  warnings: string[];
}

export function serializeProject(elements: ElementNode[], w: number, h: number): string {
  const file: ProjectFile = {
    app: PROJECT_KIND,
    version: PROJECT_VERSION,
    terminal: { width: w, height: h },
    elements,
  };
  return JSON.stringify(file, null, 2);
}

export function parseProjectJson(raw: string): ParseResult {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new Error("Invalid project file: malformed JSON");
  }
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("Invalid project file: expected object with elements array");
  }
  const rec = obj as Record<string, unknown>;
  if (!Array.isArray(rec.elements)) {
    throw new Error("Invalid project file: missing elements array");
  }
  const warnings: string[] = [];
  if (rec.app !== PROJECT_KIND || rec.version !== PROJECT_VERSION) {
    warnings.push(
      `Unknown project app "${String(rec.app)}" version ${String(rec.version)}; expected "${PROJECT_KIND}" version ${PROJECT_VERSION}.`,
    );
  }
  let w = 51;
  let h = 19;
  const t = rec.terminal;
  if (typeof t === "object" && t !== null && !Array.isArray(t)) {
    const tw = (t as Record<string, unknown>).width;
    const th = (t as Record<string, unknown>).height;
    if (typeof tw === "number") w = tw;
    if (typeof th === "number") h = th;
  }
  const size = clampTerminalSize(w, h);
  const typeMap: Record<string, ElementType> = {};
  for (const key of Object.keys(ELEMENT_DEFS) as ElementType[]) {
    typeMap[key.toLowerCase()] = key;
  }
  const toElement = (entry: unknown): ElementNode | null => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      warnings.push('Unknown element "unknown" skipped.');
      return null;
    }
    const r = entry as Record<string, unknown>;
    const rawType = typeof r.type === "string" ? r.type : undefined;
    const type = rawType !== undefined ? typeMap[rawType.toLowerCase()] : undefined;
    if (!type) {
      warnings.push(`Unknown element "${rawType ?? "unknown"}" skipped.`);
      return null;
    }
    const attributes =
      typeof r.attributes === "object" && r.attributes !== null && !Array.isArray(r.attributes)
        ? { ...(r.attributes as Record<string, string | number | boolean | object>) }
        : {};
    const name = typeof r.name === "string" ? r.name : "";
    const rawChildren = Array.isArray(r.children) ? r.children : [];
    const children = rawChildren
      .map((c) => toElement(c))
      .filter((el): el is ElementNode => el !== null);
    return { id: crypto.randomUUID(), type, name, attributes, children };
  };
  const elements = (rec.elements as unknown[])
    .map((e) => toElement(e))
    .filter((el): el is ElementNode => el !== null);
  return { elements, terminalWidth: size.width, terminalHeight: size.height, warnings };
}
