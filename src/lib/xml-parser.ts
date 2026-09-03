import type { ElementNode, ElementType } from "./elements";

// Maps lowercase tag names to Basalt's camelCase element types.
// XML parsing preserves case, but Basalt files in the wild may vary,
// so matching is case-insensitive with an explicit canonical mapping.
const TAG_MAP: Record<string, ElementType> = {
  frame: "frame",
  label: "label",
  button: "button",
  input: "input",
  textbox: "textBox",
  list: "list",
  dropdown: "dropdown",
  combobox: "comboBox",
  checkbox: "checkbox",
  switch: "switch",
  slider: "slider",
  progressbar: "progressBar",
  table: "table",
  tabcontrol: "tabControl",
  dialog: "dialog",
  row: "row",
  column: "column",
  flex: "flex",
  menu: "menu",
  contextmenu: "contextMenu",
  toast: "toast",
  image: "image",
  graph: "graph",
  barchart: "barChart",
  linechart: "lineChart",
  tree: "tree",
  display: "display",
  bigfont: "bigFont",
  program: "program",
  container: "container",
  sidenav: "sideNav",
};

interface XmlNode {
  tag: string;
  attrs: Record<string, string>;
  children: XmlNode[];
}

export interface ParseResult {
  elements: ElementNode[];
  warnings: string[];
}

export function parseBasaltXml(xml: string): ElementNode[] {
  return parseBasaltXmlWithWarnings(xml).elements;
}

export function parseBasaltXmlWithWarnings(xml: string): ParseResult {
  const warnings: string[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error(`Invalid XML: ${parserError.textContent?.trim() ?? "parse error"}`);
  }

  const result: XmlNode[] = [];
  for (const child of Array.from(doc.childNodes)) {
    if (child instanceof Element) result.push(parseElement(child));
  }

  const elements = result
    .map((node) => xmlNodeToElement(node, warnings))
    .filter((el): el is ElementNode => el !== null);

  return { elements, warnings };
}

function parseElement(el: Element): XmlNode {
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) attrs[attr.name] = attr.value;
  const children: XmlNode[] = [];
  for (const child of Array.from(el.childNodes)) {
    if (child instanceof Element) children.push(parseElement(child));
  }
  return { tag: el.tagName, attrs, children };
}

function xmlNodeToElement(node: XmlNode, warnings: string[]): ElementNode | null {
  const type = TAG_MAP[node.tag.toLowerCase()];
  if (!type) {
    warnings.push(`Unknown element <${node.tag}> skipped.`);
    return null;
  }

  const attributes: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(node.attrs)) {
    attributes[key] = convertAttrValue(key, value);
  }

  return {
    id: crypto.randomUUID(),
    type,
    name: node.attrs.name || "",
    attributes,
    children: node.children
      .map((child) => xmlNodeToElement(child, warnings))
      .filter((el): el is ElementNode => el !== null),
  };
}

function convertAttrValue(key: string, value: string): string | number | boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  if (
    [
      "x",
      "y",
      "width",
      "height",
      "maxLength",
      "dropHeight",
      "maxWidth",
      "z",
      "step",
      "max",
      "min",
      "active",
      "activeTab",
      "tabHeight",
      "flexSpacing",
      "gap",
      "padding",
      "spacing",
      "progress",
      "currentFrame",
      "minValue",
      "maxValue",
      "offsetX",
      "offsetY",
      "fontSize",
      "sidebarWidth",
    ].includes(key)
  ) {
    const num = Number(value);
    if (!isNaN(num)) return num;
  }
  return value;
}
