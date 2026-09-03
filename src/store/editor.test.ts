import { describe, expect, test, beforeEach } from "vite-plus/test";
import { useEditorStore } from "./editor";

beforeEach(() => {
  useEditorStore.setState({
    elements: [],
    selectedId: null,
    clipboard: null,
    past: [],
    future: [],
  });
});

describe("history", () => {
  test("add then undo removes the element", () => {
    const s = useEditorStore.getState();
    s.addElement("button", null, 0);
    expect(useEditorStore.getState().elements).toHaveLength(1);
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements).toHaveLength(0);
  });

  test("undo then redo restores the element", () => {
    const s = useEditorStore.getState();
    s.addElement("label", null, 0);
    s.undo();
    s.redo();
    expect(useEditorStore.getState().elements).toHaveLength(1);
  });

  test("new action clears the redo stack", () => {
    const s = useEditorStore.getState();
    s.addElement("label", null, 0);
    s.undo();
    useEditorStore.getState().addElement("button", null, 0);
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().elements.map((e) => e.type)).toEqual(["button"]);
  });

  test("history is capped at 50 entries", () => {
    const s = useEditorStore.getState();
    for (let i = 0; i < 60; i++) s.addElement("label", null, 0);
    for (let i = 0; i < 50; i++) useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements).toHaveLength(10);
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements).toHaveLength(10);
  });

  test("top-level moveElementUp swaps order", () => {
    const s = useEditorStore.getState();
    s.addElement("label", null, 0);
    s.addElement("button", null, 1);
    useEditorStore.getState().moveElementUp(useEditorStore.getState().elements[1].id);
    expect(useEditorStore.getState().elements[0].type).toBe("button");
  });

  test("rename is covered by undo", () => {
    const s = useEditorStore.getState();
    const id = s.addElement("button", null, 0);
    useEditorStore.getState().renameElement(id, "saveBtn");
    expect(useEditorStore.getState().elements[0].name).toBe("saveBtn");
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().elements[0].name).toBe("");
  });
});
