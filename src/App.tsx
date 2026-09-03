import { useEffect } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { ElementPalette } from "./components/palette/ElementPalette";
import { ElementTree } from "./components/tree/ElementTree";
import { TerminalCanvas } from "./components/canvas/TerminalCanvas";
import { PropertyPanel } from "./components/properties/PropertyPanel";
import { useAutoSave } from "./hooks/useAutoSave";
import { useEditorStore } from "./store/editor";

function App() {
  useAutoSave();
  const removeElement = useEditorStore((s) => s.removeElement);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const select = useEditorStore((s) => s.select);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const copy = useEditorStore((s) => s.copy);
  const paste = useEditorStore((s) => s.paste);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "d" && selectedId) {
        e.preventDefault();
        duplicateElement(selectedId);
        return;
      }
      if (mod && e.key.toLowerCase() === "c" && selectedId) {
        copy(selectedId);
        return;
      }
      if (mod && e.key.toLowerCase() === "v") {
        paste();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        removeElement(selectedId);
      }
      if (e.key === "Escape") {
        setActiveTool(null);
        select(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, removeElement, setActiveTool, select, undo, redo, duplicateElement, copy, paste]);

  return (
    <MainLayout>
      <div className="flex min-h-0 w-64 shrink-0 flex-col">
        <ElementPalette />
        <ElementTree />
      </div>
      <TerminalCanvas />
      <div className="min-h-0 w-72 shrink-0">
        <PropertyPanel />
      </div>
    </MainLayout>
  );
}

export default App;
