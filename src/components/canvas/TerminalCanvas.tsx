import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editor";
import { loadFont, renderToGrid, drawGrid, pixelToCell, hitTest, CELL_WIDTH, CELL_HEIGHT } from "@/lib/terminal-renderer";
import { TERMINAL_WIDTH, TERMINAL_HEIGHT } from "@/lib/palette-colors";
import type { ElementNode } from "@/lib/elements";

export function TerminalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const elements = useEditorStore((s) => s.elements);
  const selectedId = useEditorStore((s) => s.selectedId);
  const activeTool = useEditorStore((s) => s.activeTool);
  const addElement = useEditorStore((s) => s.addElement);
  const select = useEditorStore((s) => s.select);

  useEffect(() => {
    loadFont("/src/assets/font.png").then(() => draw());
  }, []);

  useEffect(() => { draw(); }, [elements, selectedId]);

  const getScale = useCallback(() => {
    if (!wrapperRef.current) return 1;
    const availW = wrapperRef.current.clientWidth - 8;
    const availH = wrapperRef.current.clientHeight - 8;
    const termW = TERMINAL_WIDTH * CELL_WIDTH;
    const termH = TERMINAL_HEIGHT * CELL_HEIGHT;
    return Math.max(1, Math.min(Math.floor(availW / termW), Math.floor(availH / termH)));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = getScale();
    const width = TERMINAL_WIDTH * CELL_WIDTH * scale + 8;
    const height = TERMINAL_HEIGHT * CELL_HEIGHT * scale + 8;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.imageSmoothingEnabled = false;

    const grid = renderToGrid(elements);
    drawGrid(ctx, grid, scale);

    if (selectedId) {
      const el = findElement(elements, selectedId);
      if (el) {
        const ex = ((el.attributes.x as number) || 1) - 1;
        const ey = ((el.attributes.y as number) || 1) - 1;
        const ew = (el.attributes.width as number) || 10;
        const eh = (el.attributes.height as number) || 3;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(
          ex * CELL_WIDTH * scale + 4,
          ey * CELL_HEIGHT * scale + 4,
          ew * CELL_WIDTH * scale,
          eh * CELL_HEIGHT * scale,
        );
        ctx.setLineDash([]);
      }
    }
  }, [elements, selectedId, getScale]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const scale = getScale();
      const cell = pixelToCell(px, py, scale);
      if (!cell) return;

      if (activeTool) {
        addElement(activeTool, null, elements.length);
        const store = useEditorStore.getState();
        if (store.selectedId) {
          store.updateAttribute(store.selectedId, "x", cell.x + 1);
          store.updateAttribute(store.selectedId, "y", cell.y + 1);
        }
      } else {
        const hit = hitTest(elements, cell.x, cell.y);
        select(hit ? hit.id : null);
      }
    },
    [activeTool, elements, addElement, select, getScale],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") useEditorStore.getState().setActiveTool(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = () => draw();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [draw]);

  return (
    <div ref={wrapperRef} className="flex flex-1 items-center justify-center overflow-auto bg-neutral-900">
      <canvas ref={canvasRef} className="cursor-crosshair" onClick={handleClick} />
    </div>
  );
}

function findElement(elements: ElementNode[], id: string): ElementNode | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children.length > 0) {
      const found = findElement(el.children, id);
      if (found) return found;
    }
  }
  return null;
}
