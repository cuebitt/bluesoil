import { describe, expect, test } from "vite-plus/test";
import { clampTerminalSize, resizeAttrs } from "./terminal";

describe("clampTerminalSize", () => {
  test("clamps zero to one", () => {
    expect(clampTerminalSize(0, 0)).toEqual({ width: 1, height: 1 });
  });

  test("clamps large values to max", () => {
    expect(clampTerminalSize(999, 999)).toEqual({ width: 164, height: 81 });
  });

  test("floors fractional values", () => {
    expect(clampTerminalSize(10.9, 5.7)).toEqual({ width: 10, height: 5 });
  });
});

describe("resizeAttrs", () => {
  test("east handle grows width", () => {
    expect(resizeAttrs({ x: 2, y: 2, width: 10, height: 5 }, 3, 0, "e", 51, 19)).toEqual({
      x: 2,
      y: 2,
      width: 13,
      height: 5,
    });
  });
  test("west handle shrinks width and moves x, clamped at 1", () => {
    expect(resizeAttrs({ x: 2, y: 2, width: 10, height: 5 }, -5, 0, "w", 51, 19)).toEqual({
      x: 1,
      y: 2,
      width: 11,
      height: 5,
    });
  });
  test("south handle clamps to terminal height", () => {
    expect(resizeAttrs({ x: 1, y: 15, width: 5, height: 4 }, 0, 10, "s", 51, 19)).toEqual({
      x: 1,
      y: 15,
      width: 5,
      height: 5,
    });
  });
});
