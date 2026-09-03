import { describe, expect, test } from "vite-plus/test";
import { isDraggable, type ElementNode, type ElementType } from "./elements";

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
