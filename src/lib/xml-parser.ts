import type { ElementNode, ElementType } from "./elements";

const VALID_TYPES = new Set<string>([
  "frame", "label", "button", "input", "textBox",
  "list", "dropdown", "comboBox", "checkbox", "switch",
  "slider", "progressBar", "table", "tabControl",
  "dialog", "row", "column", "flex", "menu",
  "contextMenu", "toast",
]);

interface XmlNode {
  tag: string;
  attrs: Record<string, string>;
  children: XmlNode[];
}

export function parseBasaltXml(xml: string): ElementNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/html");
  const result: XmlNode[] = [];
  for (const child of Array.from(doc.body.childNodes)) {
    if (child instanceof HTMLElement) result.push(parseElement(child));
  }
  return result.map(xmlNodeToElement).filter(Boolean) as ElementNode[];
}

function parseElement(el: HTMLElement): XmlNode {
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) attrs[attr.name] = attr.value;
  const children: XmlNode[] = [];
  for (const child of Array.from(el.childNodes)) {
    if (child instanceof HTMLElement) children.push(parseElement(child));
  }
  return { tag: el.tagName.toLowerCase(), attrs, children };
}

function xmlNodeToElement(node: XmlNode): ElementNode | null {
  const normalizedName = node.tag.charAt(0).toLowerCase() + node.tag.slice(1);
  if (!VALID_TYPES.has(normalizedName)) return null;

  const attributes: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(node.attrs)) {
    attributes[key] = convertAttrValue(key, value);
  }

  return {
    id: crypto.randomUUID(),
    type: normalizedName as ElementType,
    name: node.attrs.name || "",
    attributes,
    children: node.children.map(xmlNodeToElement).filter(Boolean) as ElementNode[],
  };
}

function convertAttrValue(key: string, value: string): string | number | boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  if (["x", "y", "width", "height", "maxLength", "dropHeight", "minValue", "maxWidth"].includes(key)) {
    const num = Number(value);
    if (!isNaN(num)) return num;
  }
  return value;
}
