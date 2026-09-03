import { describe, expect, test } from "vite-plus/test";
import {
  ELEMENT_DEFS,
  createElementNode,
  isDraggable,
  type ElementNode,
  type ElementType,
} from "./elements";
import { parseBasaltXmlWithWarnings } from "./xml-parser";
import { generateXml } from "./xml-generator";

function node(
  type: ElementType,
  parentType: ElementType | null = null,
): {
  node: ElementNode;
  parent: ElementNode | null;
} {
  const mk = (t: ElementType): ElementNode => ({
    id: t,
    type: t,
    name: "",
    attributes: { x: 1, y: 1 },
    children: [],
  });
  return { node: mk(type), parent: parentType ? mk(parentType) : null };
}

describe("isDraggable", () => {
  test("allows top-level positioned element", () => {
    const { node: el, parent } = node("button", null);
    expect(isDraggable(el, parent)).toBe(true);
  });

  test("denies nested element even in absolute container", () => {
    const { node: el, parent } = node("button", "frame");
    expect(isDraggable(el, parent)).toBe(false);
  });

  test("denies children of layout containers", () => {
    for (const layout of ["row", "column", "flex"] as const) {
      const { node: el, parent } = node("label", layout);
      expect(isDraggable(el, parent)).toBe(false);
    }
  });
});

describe("widget scalar props", () => {
  test("slider exposes min", () => {
    expect(ELEMENT_DEFS.slider.optionalAttrs.some((a) => a.key === "min")).toBe(true);
  });

  test("switch exposes onColor and not onBackground", () => {
    const keys = ELEMENT_DEFS.switch.optionalAttrs.map((a) => a.key);
    expect(keys).toContain("onColor");
    expect(keys).not.toContain("onBackground");
  });

  test("list exposes scrollbarColor and not selectable", () => {
    const keys = ELEMENT_DEFS.list.optionalAttrs.map((a) => a.key);
    expect(keys).toContain("scrollbarColor");
    expect(keys).not.toContain("selectable");
  });

  test("flex direction options are row and column", () => {
    expect(ELEMENT_DEFS.flex.optionalAttrs.find((a) => a.key === "direction")?.options).toEqual([
      "row",
      "column",
    ]);
  });

  test("tabControl exposes active", () => {
    expect(ELEMENT_DEFS.tabControl.optionalAttrs.some((a) => a.key === "active")).toBe(true);
  });
});

describe("visual-builder new elements", () => {
  test("tree exposes canonical selection and scrollbar keys", () => {
    const keys = ELEMENT_DEFS.tree.optionalAttrs.map((a) => a.key);
    expect(keys).toContain("selectionBackground");
    expect(keys).toContain("selectionForeground");
    expect(keys).toContain("scrollbarColor");
    expect(keys).toContain("scrollbarThumbColor");
    expect(keys).toContain("scrollbar");
    expect(keys).not.toContain("nodeColor");
    expect(keys).not.toContain("selectedColor");
  });

  test("program exposes path and not running", () => {
    const keys = ELEMENT_DEFS.program.optionalAttrs.map((a) => a.key);
    expect(keys).toContain("path");
    expect(keys).not.toContain("running");
  });

  test.runIf(typeof DOMParser !== "undefined")("Tree parses to tree element with numeric x", () => {
    const { elements } = parseBasaltXmlWithWarnings('<Tree x="2" y="3"/>');
    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("tree");
    expect(elements[0].attributes.x).toBe(2);
  });

  test("tree nodes export escaped without raw quotes", () => {
    const node = createElementNode("tree");
    node.attributes.nodes = [{ label: "a" }];
    const xml = generateXml([node]);
    expect(xml).toContain("&quot;");
    expect(xml).not.toContain('[{"');
  });

  test("legacy display/sideNav defs are gone (not in Basalt 2.5)", () => {
    expect("display" in ELEMENT_DEFS).toBe(false);
    expect("sideNav" in ELEMENT_DEFS).toBe(false);
  });

  test("canvas is a non-container with position/size/appearance only", () => {
    const meta = ELEMENT_DEFS.canvas;
    expect(meta.isContainer).toBe(false);
    expect(meta.fieldGroups).toEqual(["position", "size", "appearance"]);
    expect(meta.optionalAttrs).toEqual([]);
  });

  test("pixelGraph exposes min/max value range", () => {
    const keys = ELEMENT_DEFS.pixelGraph.optionalAttrs.map((a) => a.key);
    expect(keys).toContain("minValue");
    expect(keys).toContain("maxValue");
  });

  test.runIf(typeof DOMParser !== "undefined")("PixelGraph parses with numeric min/max", () => {
    const { elements } = parseBasaltXmlWithWarnings(
      '<PixelGraph x="2" minValue="0" maxValue="100"/>',
    );
    expect(elements).toHaveLength(1);
    expect(elements[0].type).toBe("pixelGraph");
    expect(elements[0].attributes.minValue).toBe(0);
    expect(elements[0].attributes.maxValue).toBe(100);
  });

  test.runIf(typeof DOMParser !== "undefined")("legacy tags warn and skip", () => {
    const result = parseBasaltXmlWithWarnings('<Display x="1"/><SideNav x="1"/>');
    expect(result.elements).toHaveLength(0);
    expect(result.warnings).toHaveLength(2);
  });
});
