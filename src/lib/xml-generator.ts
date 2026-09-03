import type { ElementNode } from "./elements";

export function generateXml(elements: ElementNode[]): string {
  return elements.map((el) => elementToXml(el, 0)).join("\n");
}

function elementToXml(el: ElementNode, depth: number): string {
  const indent = "    ".repeat(depth);
  const tag = el.type;
  const attrs = attributesToXml(el);

  if (el.children.length === 0) {
    return `${indent}<${tag}${attrs}/>`;
  }

  const childXml = el.children.map((child) => elementToXml(child, depth + 1)).join("\n");
  return `${indent}<${tag}${attrs}>\n${childXml}\n${indent}</${tag}>`;
}

function attributesToXml(el: ElementNode): string {
  const parts: string[] = [];

  if (el.name) parts.push(`name="${el.name}"`);

  for (const [key, value] of Object.entries(el.attributes)) {
    if (key === "name") continue;
    // Skip empty event handler references: Basalt would look up
    // a scope function with an empty name and fail at load time.
    if (key.startsWith("on") && typeof value === "string" && !value.trim()) continue;
    parts.push(`${key}="${formatAttrValue(value)}"`);
  }

  return parts.length > 0 ? " " + parts.join(" ") : "";
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function formatAttrValue(value: string | number | boolean | object): string {
  if (typeof value === "object" && value !== null) return escapeXml(JSON.stringify(value));
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  // Entity-escaping is safe for reactive {expr} values too: the XML
  // parser decodes entities before Basalt evaluates the expression.
  return escapeXml(String(value));
}
