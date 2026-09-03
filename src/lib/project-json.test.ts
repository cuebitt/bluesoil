import { describe, expect, test } from "vite-plus/test";
import { serializeProject, parseProjectJson } from "./project-json";
import type { ElementNode } from "./elements";

const sample: ElementNode[] = [
  {
    id: "a",
    type: "button",
    name: "save",
    attributes: { x: 2, y: 3, width: 10, height: 3, text: "Save" },
    children: [],
  },
];

describe("project-json", () => {
  test("round-trip preserves elements and terminal", () => {
    const raw = serializeProject(sample, 51, 19);
    const out = parseProjectJson(raw);
    expect(out.terminalWidth).toBe(51);
    expect(out.elements).toHaveLength(1);
    expect(out.elements[0].type).toBe("button");
    expect(out.elements[0].attributes.text).toBe("Save");
    expect(out.warnings).toEqual([]);
  });
  test("unknown types are skipped with warnings", () => {
    const out = parseProjectJson(
      JSON.stringify({
        app: "bluesoil",
        version: 1,
        terminal: { width: 51, height: 19 },
        elements: [{ id: "x", type: "nope", attributes: {}, children: [] }],
      }),
    );
    expect(out.elements).toEqual([]);
    expect(out.warnings).toHaveLength(1);
  });
  test("malformed JSON throws", () => {
    expect(() => parseProjectJson("{oops")).toThrow();
  });
  test("missing terminal defaults to 51x19", () => {
    const out = parseProjectJson(JSON.stringify({ app: "bluesoil", version: 1, elements: [] }));
    expect(out.terminalWidth).toBe(51);
    expect(out.terminalHeight).toBe(19);
  });
});
