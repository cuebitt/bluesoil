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
    "x",
    "y",
    "width",
    "height",
    "text",
    "placeholder",
    "placeholderColor",
    "maxLength",
    "replaceChar",
    "pattern",
    "background",
    "foreground",
    "emptyText",
    "scrollbar",
    "dropHeight",
    "sortable",
    "value",
    "maxWidth",
    "onClick",
    "onClickUp",
    "onChange",
    "onSelect",
    "onEnter",
    "onFocus",
    "onBlur",
    "onKey",
    "onScroll",
    "visible",
    "z",
    "focusedBackground",
    "focusedForeground",
    "editable",
    "checked",
    "checkedText",
    "selectedBackground",
    "selectedForeground",
    "selectedText",
    "dropSymbol",
    "step",
    "max",
    "horizontal",
    "progress",
    "showPercentage",
    "direction",
    "progressColor",
    "headerColor",
    "selectedColor",
    "gridColor",
    "activeTab",
    "tabHeight",
    "flexDirection",
    "flexSpacing",
    "flexJustifyContent",
    "flexWrap",
    "separatorColor",
    "checkedSymbol",
    "uncheckedSymbol",
    "onColor",
    "offColor",
    "knobColor",
    "min",
    "barColor",
    "headerBackground",
    "selectionBackground",
    "selectionForeground",
    "active",
    "activeBackground",
    "activeForeground",
    "direction",
    "gap",
    "padding",
    "align",
    "justify",
    "emptyTextColor",
    "scrollbarColor",
    "scrollbarThumbColor",
    "dropBackground",
    "open",
    "spacing",
  ];

  for (const key of attrOrder) {
    if (key in el.attributes && key !== "name") {
      const value = el.attributes[key];
      // Skip empty event handler references: Basalt would look up
      // a scope function with an empty name and fail at load time.
      if (key.startsWith("on") && typeof value === "string" && !value.trim()) {
        continue;
      }
      parts.push(`${key}="${formatAttrValue(value)}"`);
    }
  }

  for (const [key, value] of Object.entries(el.attributes)) {
    if (key !== "name" && !attrOrder.includes(key)) {
      parts.push(`${key}="${formatAttrValue(value)}"`);
    }
  }

  return parts.length > 0 ? " " + parts.join(" ") : "";
}

function formatAttrValue(value: string | number | boolean | object): string {
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  // Entity-escaping is safe for reactive {expr} values too: the XML
  // parser decodes entities before Basalt evaluates the expression.
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
