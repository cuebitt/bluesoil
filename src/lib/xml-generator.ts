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

  const attrOrder = [
    "x", "y", "width", "height",
    "text", "placeholder", "placeholderColor", "maxLength", "replaceChar", "pattern",
    "background", "foreground",
    "emptyText", "scrollbar", "dropHeight", "sortable",
    "value", "minValue", "maxWidth",
    "onClick", "onClickUp", "onChange", "onSelect", "onEnter",
    "onFocus", "onBlur", "onKey", "onScroll",
  ];

  for (const key of attrOrder) {
    if (key in el.attributes && key !== "name") {
      parts.push(`${key}="${formatAttrValue(el.attributes[key])}"`);
    }
  }

  for (const [key, value] of Object.entries(el.attributes)) {
    if (key !== "name" && !attrOrder.includes(key)) {
      parts.push(`${key}="${formatAttrValue(value)}"`);
    }
  }

  return parts.length > 0 ? " " + parts.join(" ") : "";
}

function formatAttrValue(value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) return value;
  return String(value);
}
