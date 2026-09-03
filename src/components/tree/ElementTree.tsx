import { useEditorStore } from "@/store/editor";
import { ELEMENT_DEFS, type ElementNode } from "@/lib/elements";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Copy, Trash2 } from "lucide-react";

export function ElementTree() {
  const elements = useEditorStore((s) => s.elements);
  const selectedId = useEditorStore((s) => s.selectedId);
  const select = useEditorStore((s) => s.select);
  const removeElement = useEditorStore((s) => s.removeElement);
  const moveElementUp = useEditorStore((s) => s.moveElementUp);
  const moveElementDown = useEditorStore((s) => s.moveElementDown);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-medium">Tree</h2>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          {elements.length === 0 ? (
            <p className="p-2 text-xs text-muted-foreground">
              No elements. Click an element type above, then click the canvas.
            </p>
          ) : (
            elements.map((el) => (
              <TreeNode
                key={el.id}
                node={el}
                depth={0}
                selectedId={selectedId}
                onSelect={select}
                onRemove={removeElement}
                onMoveUp={moveElementUp}
                onMoveDown={moveElementDown}
                onDuplicate={duplicateElement}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function TreeNode({
  node, depth, selectedId, onSelect, onRemove, onMoveUp, onMoveDown, onDuplicate,
}: {
  node: ElementNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const meta = ELEMENT_DEFS[node.type];
  const Icon = meta.icon;
  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 rounded px-1 py-0.5 text-sm transition-colors cursor-pointer",
          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => onSelect(node.id)}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="flex-1 truncate">{node.name || meta.label}</span>
        {isSelected && (
          <div className="flex gap-0.5">
            <Button variant="ghost" size="icon" className="size-5" onClick={(e) => { e.stopPropagation(); onMoveUp(node.id); }}>
              <ChevronUp className="size-3" />
            </Button>
            <Button variant="ghost" size="icon" className="size-5" onClick={(e) => { e.stopPropagation(); onMoveDown(node.id); }}>
              <ChevronDown className="size-3" />
            </Button>
            <Button variant="ghost" size="icon" className="size-5" onClick={(e) => { e.stopPropagation(); onDuplicate(node.id); }}>
              <Copy className="size-3" />
            </Button>
            <Button variant="ghost" size="icon" className="size-5" onClick={(e) => { e.stopPropagation(); onRemove(node.id); }}>
              <Trash2 className="size-3" />
            </Button>
          </div>
        )}
      </div>
      {node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
