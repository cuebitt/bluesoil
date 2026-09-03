import { useEffect, useRef, useCallback, useState } from "react";
import { useEditorStore } from "@/store/editor";
import {
  loadFont,
  renderToGrid,
  drawGrid,
  pixelToCell,
  hitTest,
  CELL_WIDTH,
  CELL_HEIGHT,
} from "@/lib/terminal-renderer";
import {
  ELEMENT_DEFS,
  findElementById,
  isDraggable,
  type ElementNode,
  type ElementType,
} from "@/lib/elements";
import fontUrl from "../../assets/font.png";

const QUICK_ADD_TYPES: ElementType[] = [
  "frame",
  "label",
  "button",
  "input",
  "textBox",
  "checkbox",
  "list",
  "dropdown",
];

interface ContextMenuState {
  clientX: number;
  clientY: number;
  cellX: number;
  cellY: number;
  targetId: string | null;
}

function findParent(nodes: ElementNode[], id: string): ElementNode | null {
  for (const n of nodes) {
    if (n.children.some((c) => c.id === id)) return n;
    const p = findParent(n.children, id);
    if (p) return p;
  }
  return null;
}

export function TerminalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    origX: number;
    origY: number;
    startCellX: number;
    startCellY: number;
    startClientX: number;
    startClientY: number;
    dragging: boolean;
  } | null>(null);
  const [fontError, setFontError] = useState<string | null>(null);
  const [fontReady, setFontReady] = useState(false);
  const [menu, setMenu] = useState<ContextMenuState | null>(null);
  const elements = useEditorStore((s) => s.elements);
  const selectedId = useEditorStore((s) => s.selectedId);
  const activeTool = useEditorStore((s) => s.activeTool);
  const addElement = useEditorStore((s) => s.addElement);
  const select = useEditorStore((s) => s.select);
  const updateAttribute = useEditorStore((s) => s.updateAttribute);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const copy = useEditorStore((s) => s.copy);
  const removeElement = useEditorStore((s) => s.removeElement);
  const terminalWidth = useEditorStore((s) => s.terminalWidth);
  const terminalHeight = useEditorStore((s) => s.terminalHeight);

  const getScale = useCallback(() => {
    if (!wrapperRef.current) return 1;
    const availW = wrapperRef.current.clientWidth - 8;
    const availH = wrapperRef.current.clientHeight - 8;
    const termW = terminalWidth * CELL_WIDTH;
    const termH = terminalHeight * CELL_HEIGHT;
    return Math.max(1, Math.min(Math.floor(availW / termW), Math.floor(availH / termH)));
  }, [terminalWidth, terminalHeight]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = getScale();
    const width = terminalWidth * CELL_WIDTH * scale + 8;
    const height = terminalHeight * CELL_HEIGHT * scale + 8;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.imageSmoothingEnabled = false;

    const grid = renderToGrid(elements, terminalWidth, terminalHeight);
    drawGrid(ctx, grid, scale);

    if (selectedId) {
      const el = findElementById(elements, selectedId);
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
  }, [elements, selectedId, getScale, terminalWidth, terminalHeight]);

  const load = useCallback(() => {
    setFontError(null);
    loadFont(fontUrl).then(
      () => {
        setFontReady(true);
        draw();
      },
      (err: unknown) => {
        setFontError(err instanceof Error ? err.message : "Failed to load terminal font.");
      },
    );
  }, [draw]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    draw();
  }, [draw]);

  const cellFromEvent = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return pixelToCell(
        e.clientX - rect.left,
        e.clientY - rect.top,
        getScale(),
        terminalWidth,
        terminalHeight,
      );
    },
    [getScale, terminalWidth, terminalHeight],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0 || activeTool) return;
      const cell = cellFromEvent(e);
      if (!cell) return;
      const hit = hitTest(elements, cell.x, cell.y);
      if (!hit) return;
      if (!isDraggable(hit, findParent(elements, hit.id))) return;
      dragRef.current = {
        id: hit.id,
        origX: (hit.attributes.x as number) || 1,
        origY: (hit.attributes.y as number) || 1,
        startCellX: cell.x,
        startCellY: cell.y,
        startClientX: e.clientX,
        startClientY: e.clientY,
        dragging: false,
      };
    },
    [activeTool, cellFromEvent, elements],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const drag = dragRef.current;
      if (!drag) {
        if (canvas && !activeTool) {
          const cell = cellFromEvent(e);
          const hit = cell ? hitTest(elements, cell.x, cell.y) : null;
          canvas.style.cursor =
            hit && isDraggable(hit, findParent(elements, hit.id)) ? "move" : "crosshair";
        }
        return;
      }
      if (!drag.dragging) {
        if (Math.hypot(e.clientX - drag.startClientX, e.clientY - drag.startClientY) <= 4) return;
        drag.dragging = true;
        select(drag.id);
        if (canvas) canvas.style.cursor = "grabbing";
      }
      const cell = cellFromEvent(e);
      if (!cell) return;
      const el = findElementById(useEditorStore.getState().elements, drag.id);
      if (!el) return;
      const w = (el.attributes.width as number) || 10;
      const h = (el.attributes.height as number) || 3;
      const nx = Math.min(
        Math.max(drag.origX + (cell.x - drag.startCellX), 1),
        terminalWidth - w + 1,
      );
      const ny = Math.min(
        Math.max(drag.origY + (cell.y - drag.startCellY), 1),
        terminalHeight - h + 1,
      );
      updateAttribute(drag.id, "x", nx);
      updateAttribute(drag.id, "y", ny);
    },
    [activeTool, cellFromEvent, elements, select, updateAttribute, terminalWidth, terminalHeight],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "crosshair";
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const scale = getScale();
      const cell = pixelToCell(px, py, scale, terminalWidth, terminalHeight);
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
    [activeTool, elements, addElement, select, getScale, terminalWidth, terminalHeight],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cell = pixelToCell(
        e.clientX - rect.left,
        e.clientY - rect.top,
        getScale(),
        terminalWidth,
        terminalHeight,
      );
      if (!cell) {
        setMenu(null);
        return;
      }
      const hit = hitTest(elements, cell.x, cell.y);
      setMenu({
        clientX: Math.min(e.clientX, window.innerWidth - 208),
        clientY: Math.min(e.clientY, window.innerHeight - 320),
        cellX: cell.x,
        cellY: cell.y,
        targetId: hit ? hit.id : null,
      });
    },
    [elements, getScale, terminalWidth, terminalHeight],
  );

  const handleAddFromMenu = useCallback(
    (type: ElementType) => {
      if (!menu) return;
      addElement(type, null, useEditorStore.getState().elements.length);
      const store = useEditorStore.getState();
      if (store.selectedId) {
        store.updateAttribute(store.selectedId, "x", menu.cellX + 1);
        store.updateAttribute(store.selectedId, "y", menu.cellY + 1);
      }
      setMenu(null);
    },
    [menu, addElement],
  );

  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  useEffect(() => {
    const handler = () => draw();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [draw]);

  useEffect(() => {
    const up = () => {
      dragRef.current = null;
    };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex flex-1 items-center justify-center overflow-auto bg-neutral-900"
    >
      {fontError ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-sm text-neutral-300">{fontError}</p>
          <p className="text-xs text-neutral-500">
            The terminal preview cannot render without the font sprite.
          </p>
          <button
            type="button"
            onClick={load}
            className="rounded-md bg-neutral-700 px-3 py-1.5 text-sm text-white transition-colors hover:bg-neutral-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="cursor-crosshair"
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onContextMenu={handleContextMenu}
          style={{ visibility: fontReady ? "visible" : "hidden", imageRendering: "pixelated" }}
        />
      )}
      {menu && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setMenu(null)}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenu(null);
          }}
        >
          <div
            className="absolute w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            style={{ left: menu.clientX, top: menu.clientY }}
            onClick={(e) => e.stopPropagation()}
          >
            {menu.targetId ? (
              <>
                <button
                  type="button"
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                  onClick={() => {
                    select(menu.targetId);
                    setMenu(null);
                  }}
                >
                  Select
                </button>
                <button
                  type="button"
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                  onClick={() => {
                    duplicateElement(menu.targetId!);
                    setMenu(null);
                  }}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                  onClick={() => {
                    copy(menu.targetId!);
                    setMenu(null);
                  }}
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-muted"
                  onClick={() => {
                    removeElement(menu.targetId!);
                    setMenu(null);
                  }}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Add element here
                </p>
                {QUICK_ADD_TYPES.map((type) => {
                  const meta = ELEMENT_DEFS[type];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                      onClick={() => handleAddFromMenu(type)}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{meta.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
