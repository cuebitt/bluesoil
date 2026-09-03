import type { ElementNode } from "./elements";

export function generateLua(elements: ElementNode[]): string {
  const handlers = new Set<string>();
  const namedElements: Array<{ name: string; type: string }> = [];

  function walk(nodes: ElementNode[]) {
    for (const node of nodes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        if (key.startsWith("on") && typeof value === "string" && value.trim()) {
          handlers.add(value.trim());
        }
      }
      if (node.name) namedElements.push({ name: node.name, type: node.type });
      walk(node.children);
    }
  }
  walk(elements);

  const lines: string[] = [];
  lines.push('local basalt = require("basalt")');
  lines.push('local xml = basalt.use("xml")');
  lines.push("");
  lines.push("local frame = basalt.getMainFrame()");
  lines.push("");
  lines.push("local scope = {}");

  if (handlers.size > 0) {
    lines.push("");
    lines.push("-- Handler stubs");
    for (const handler of handlers) {
      lines.push(`function scope.${handler}()`);
      lines.push("    -- TODO: implement");
      lines.push("end");
      lines.push("");
    }
  }

  lines.push('local created = xml.loadFile(frame, "ui/main.xml", scope)');
  lines.push('local app = assert(created[1], "XML did not create a root element")');

  if (namedElements.length > 0) {
    lines.push("");
    lines.push("-- Named element lookups");
    for (const { name } of namedElements) {
      lines.push(`local ${name} = assert(app:find("${name}"))`);
    }
  }

  lines.push("");
  lines.push("basalt.run()");

  return lines.join("\n");
}
