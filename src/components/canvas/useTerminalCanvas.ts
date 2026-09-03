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
  findElementById,
  findParent,
  isDraggable,
  type ElementNode,
  type ElementType,
} from "@/lib/elements";
import { resizeAttrs, type ResizeHandle } from "@/lib/terminal";
import fontUrl from "../../assets/font.png";

export interface ContextMenuState {
  clientX: number;
  clientY: number;
  cellX: number;
  cellY: number;
  targetId: string | null;
}

const HANDLE_SIZE = 6;
const SE_CURSOR = "nwse-resize";

function selectionBox(el: ElementNode, scale: number) {
  const ex = ((el.attributes.x as number) || 1) - 1;
  const ey = ((el.attributes.y as number) || 1) - 1;
  const ew = (el.attributes.width as number) || 10;
  const eh = (el.attributes.height as number) || 3;
  const left = ex * CELL_WIDTH * scale + 4;
  const top = ey * CELL_HEIGHT * scale + 4;
  const w = ew * CELL_WIDTH * scale;
  const h = eh * CELL_HEIGHT * scale;
  return { left, top, w, h };
}

function seHandle(box: { left: number; top: number; w: number; h: number }) {
  return { cx: box.left + box.w, cy: box.top + box.h };
}

export function useTerminalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    handle: ResizeHandle | null;
    startCellX: number;
    startCellY: number;
    startClientX: number;
    startClientY: number;
    dragging: boolean;
  } | null>(null);
  const [showGrid, setShowGrid] = useState(false);
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
        const box = selectionBox(el, scale);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(box.left, box.top, box.w, box.h);
        ctx.setLineDash([]);
        const { cx, cy } = seHandle(box);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cx - HANDLE_SIZE / 2, cy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - HANDLE_SIZE / 2, cy - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
      }
    }

    if (showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      for (let gx = 0; gx <= terminalWidth; gx++) {
        const px = gx * CELL_WIDTH * scale + 4;
        ctx.moveTo(px, 4);
        ctx.lineTo(px, terminalHeight * CELL_HEIGHT * scale + 4);
      }
      for (let gy = 0; gy <= terminalHeight; gy++) {
        const py = gy * CELL_HEIGHT * scale + 4;
        ctx.moveTo(4, py);
        ctx.lineTo(terminalWidth * CELL_WIDTH * scale + 4, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [elements, selectedId, getScale, terminalWidth, terminalHeight, showGrid]);

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

  const handleAtEvent = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      const state = useEditorStore.getState();
      const el = state.selectedId ? findElementById(state.elements, state.selectedId) : null;
      if (!canvas || !el) return null;
      if (findParent(state.elements, el.id) !== null) return null;
      if (!isDraggable(el, null)) return null;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const box = selectionBox(el, getScale());
      const { cx, cy } = seHandle(box);
      if (Math.abs(px - cx) <= HANDLE_SIZE && Math.abs(py - cy) <= HANDLE_SIZE) return "se";
      return null;
    },
    [getScale],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0 || activeTool) return;
      const resizeHandle = handleAtEvent(e);
      if (resizeHandle) {
        const state = useEditorStore.getState();
        const el = state.selectedId ? findElementById(state.elements, state.selectedId) : null;
        if (!el) return;
        const cell = cellFromEvent(e);
        if (!cell) return;
        dragRef.current = {
          id: el.id,
          origX: (el.attributes.x as number) || 1,
          origY: (el.attributes.y as number) || 1,
          origW: (el.attributes.width as number) || 10,
          origH: (el.attributes.height as number) || 3,
          handle: resizeHandle,
          startCellX: cell.x,
          startCellY: cell.y,
          startClientX: e.clientX,
          startClientY: e.clientY,
          dragging: true,
        };
        select(el.id);
        if (canvasRef.current) canvasRef.current.style.cursor = SE_CURSOR;
        return;
      }
      const cell = cellFromEvent(e);
      if (!cell) return;
      const hit = hitTest(elements, cell.x, cell.y);
      if (!hit) return;
      if (!isDraggable(hit, findParent(elements, hit.id))) return;
      dragRef.current = {
        id: hit.id,
        origX: (hit.attributes.x as number) || 1,
        origY: (hit.attributes.y as number) || 1,
        origW: (hit.attributes.width as number) || 10,
        origH: (hit.attributes.height as number) || 3,
        handle: null,
        startCellX: cell.x,
        startCellY: cell.y,
        startClientX: e.clientX,
        startClientY: e.clientY,
        dragging: false,
      };
    },
    [activeTool, cellFromEvent, elements, handleAtEvent, select],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const drag = dragRef.current;
      if (!drag) {
        if (canvas && !activeTool) {
          const hoverHandle = handleAtEvent(e);
          if (hoverHandle) {
            canvas.style.cursor = SE_CURSOR;
            return;
          }
          const cell = cellFromEvent(e);
          const hit = cell ? hitTest(elements, cell.x, cell.y) : null;
          canvas.style.cursor =
            hit && isDraggable(hit, findParent(elements, hit.id)) ? "move" : "crosshair";
        }
        return;
      }
      if (drag.handle) {
        const cell = cellFromEvent(e);
        if (!cell) return;
        const state = useEditorStore.getState();
        const current = findElementById(state.elements, drag.id);
        if (!current) return;
        const next = resizeAttrs(
          { x: drag.origX, y: drag.origY, width: drag.origW, height: drag.origH },
          cell.x - drag.startCellX,
          cell.y - drag.startCellY,
          drag.handle,
          state.terminalWidth,
          state.terminalHeight,
        );
        if (next.x !== current.attributes.x) updateAttribute(drag.id, "x", next.x);
        if (next.y !== current.attributes.y) updateAttribute(drag.id, "y", next.y);
        if (next.width !== current.attributes.width) updateAttribute(drag.id, "width", next.width);
        if (next.height !== current.attributes.height)
          updateAttribute(drag.id, "height", next.height);
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
    [
      activeTool,
      cellFromEvent,
      elements,
      handleAtEvent,
      select,
      updateAttribute,
      terminalWidth,
      terminalHeight,
    ],
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

      if (!activeTool && handleAtEvent(e)) return;

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
    [
      activeTool,
      elements,
      addElement,
      select,
      getScale,
      terminalWidth,
      terminalHeight,
      handleAtEvent,
    ],
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

  return {
    canvasRef,
    wrapperRef,
    showGrid,
    setShowGrid,
    fontError,
    fontReady,
    load,
    menu,
    setMenu,
    select,
    duplicateElement,
    copy,
    removeElement,
    handleClick,
    handleMouseDown,
    handleMouseMove,
    endDrag,
    handleContextMenu,
    handleAddFromMenu,
  };
}
