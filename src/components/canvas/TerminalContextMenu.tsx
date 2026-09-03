import { ELEMENT_DEFS, type ElementType } from "@/lib/elements";
import type { ContextMenuState } from "./useTerminalCanvas";

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

interface TerminalContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (type: ElementType) => void;
}

export function TerminalContextMenu({
  menu,
  onClose,
  onSelect,
  onDuplicate,
  onCopy,
  onRemove,
  onAdd,
}: TerminalContextMenuProps) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="absolute inset-0 h-full w-full cursor-default"
      />
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
              onClick={() => onSelect(menu.targetId!)}
            >
              Select
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
              onClick={() => onDuplicate(menu.targetId!)}
            >
              Duplicate
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
              onClick={() => onCopy(menu.targetId!)}
            >
              Copy
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-muted"
              onClick={() => onRemove(menu.targetId!)}
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
                  onClick={() => onAdd(type)}
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
  );
}
