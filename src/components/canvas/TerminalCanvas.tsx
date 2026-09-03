import { useTerminalCanvas } from "./useTerminalCanvas";
import { TerminalContextMenu } from "./TerminalContextMenu";

export function TerminalCanvas() {
  const {
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
  } = useTerminalCanvas();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-900">
      <div className="flex justify-end px-2 py-1">
        <button
          type="button"
          aria-pressed={showGrid}
          onClick={() => setShowGrid((v) => !v)}
          className={`rounded-md border px-2 py-0.5 text-xs transition-colors ${
            showGrid ? "bg-neutral-700 text-white" : "text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          Grid
        </button>
      </div>
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
            aria-label="Terminal canvas editor. Use the element tree or properties panel for keyboard editing. Press Escape to deselect."
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Escape") select(null);
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onContextMenu={handleContextMenu}
            style={{ visibility: fontReady ? "visible" : "hidden", imageRendering: "pixelated" }}
          />
        )}
        {menu && (
          <TerminalContextMenu
            menu={menu}
            onClose={() => setMenu(null)}
            onSelect={(id) => {
              select(id);
              setMenu(null);
            }}
            onDuplicate={(id) => {
              duplicateElement(id);
              setMenu(null);
            }}
            onCopy={(id) => {
              copy(id);
              setMenu(null);
            }}
            onRemove={(id) => {
              removeElement(id);
              setMenu(null);
            }}
            onAdd={handleAddFromMenu}
          />
        )}
      </div>
    </div>
  );
}
