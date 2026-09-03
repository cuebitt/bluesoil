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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
  }, [selectedId, removeElement, setActiveTool, select]);

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
