import { useEffect, useRef } from "react";
import { AppHeader } from "./components/layout/AppHeader";
import { ElementPalette } from "./components/palette/ElementPalette";
import { ElementTree } from "./components/tree/ElementTree";
import { CenterView } from "./components/canvas/CenterView";
import { PropertyPanel } from "./components/properties/PropertyPanel";
import { useEditorStore } from "./store/editor";

function App() {
  const removeElement = useEditorStore((s) => s.removeElement);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const select = useEditorStore((s) => s.select);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const copy = useEditorStore((s) => s.copy);
  const paste = useEditorStore((s) => s.paste);
  const elements = useEditorStore((s) => s.elements);
  const terminalWidth = useEditorStore((s) => s.terminalWidth);
  const terminalHeight = useEditorStore((s) => s.terminalHeight);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    useEditorStore.getState().loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => useEditorStore.getState().saveToLocalStorage(), 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [elements, terminalWidth, terminalHeight]);

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
    <div className="flex h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex min-h-0 min-w-[920px] flex-1">
          <div className="flex min-h-0 w-64 shrink-0 flex-col">
            <ElementPalette />
            <ElementTree />
          </div>
          <CenterView />
          <div className="min-h-0 w-72 shrink-0">
            <PropertyPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
