import { describe, expect, test } from "vite-plus/test";
import { ELEMENT_DEFS, isDraggable, type ElementNode, type ElementType } from "./elements";

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
