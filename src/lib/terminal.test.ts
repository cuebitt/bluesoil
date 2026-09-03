import { describe, expect, test } from "vite-plus/test";
import { clampTerminalSize } from "./terminal";

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
