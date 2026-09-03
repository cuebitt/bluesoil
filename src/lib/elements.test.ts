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
  test("slider exposes step", () => {
    expect(ELEMENT_DEFS.slider.optionalAttrs.some((a) => a.key === "step")).toBe(true);
  });

  test("list exposes selectable", () => {
    expect(ELEMENT_DEFS.list.optionalAttrs.some((a) => a.key === "selectable")).toBe(true);
  });

  test("list scrollbar is a select", () => {
    expect(ELEMENT_DEFS.list.optionalAttrs.find((a) => a.key === "scrollbar")?.type).toBe("select");
  });

  test("switch exposes onBackground", () => {
    expect(ELEMENT_DEFS.switch.optionalAttrs.some((a) => a.key === "onBackground")).toBe(true);
  });
});
