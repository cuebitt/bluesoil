import { useEditorStore } from "@/store/editor";
import { ELEMENT_DEFS, type ElementNode } from "@/lib/elements";
import { AttributeField } from "./AttributeField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function PropertyPanel() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const elements = useEditorStore((s) => s.elements);
  const updateAttribute = useEditorStore((s) => s.updateAttribute);
  const renameElement = useEditorStore((s) => s.renameElement);

  const element = selectedId ? findElement(elements, selectedId) : null;

  if (!element) {
    return (
      <div className="flex flex-col border-l">
        <div className="border-b px-3 py-2">
          <h2 className="text-sm font-medium">Properties</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
          Select an element to edit
        </div>
      </div>
    );
  }

  const meta = ELEMENT_DEFS[element.type];
  const update = (k: string, v: string | number | boolean) => updateAttribute(element.id, k, v);

  return (
    <div className="flex flex-col border-l">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-medium">Properties</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{meta.label}</Badge>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Name</label>
            <Input value={element.name} onChange={(e) => renameElement(element.id, e.target.value)} placeholder="element_name" />
          </div>

          {meta.fieldGroups.includes("position") && (
            <>
              <AttributeField label="X" keyName="x" value={element.attributes.x ?? 1} onChange={update} type="number" />
              <AttributeField label="Y" keyName="y" value={element.attributes.y ?? 1} onChange={update} type="number" />
            </>
          )}

          {meta.fieldGroups.includes("size") && (
            <>
              <AttributeField label="Width" keyName="width" value={element.attributes.width ?? 10} onChange={update} type="number" />
              <AttributeField label="Height" keyName="height" value={element.attributes.height ?? 3} onChange={update} type="number" />
            </>
          )}

          {meta.fieldGroups.includes("appearance") && (
            <>
              <AttributeField label="Background" keyName="background" value={element.attributes.background ?? "#000000"} onChange={update} type="color" />
              <AttributeField label="Foreground" keyName="foreground" value={element.attributes.foreground ?? "#ffffff"} onChange={update} type="color" />
            </>
          )}

          {meta.fieldGroups.includes("content") && "text" in meta.defaultProps && (
            <AttributeField label="Text" keyName="text" value={element.attributes.text ?? ""} onChange={update} />
          )}
          {meta.fieldGroups.includes("content") && "placeholder" in meta.defaultProps && (
            <AttributeField label="Placeholder" keyName="placeholder" value={element.attributes.placeholder ?? ""} onChange={update} />
          )}
          {meta.fieldGroups.includes("content") && "emptyText" in meta.defaultProps && (
            <AttributeField label="Empty Text" keyName="emptyText" value={element.attributes.emptyText ?? ""} onChange={update} />
          )}

          {meta.fieldGroups.includes("behavior") && "scrollbar" in meta.defaultProps && (
            <AttributeField label="Scrollbar" keyName="scrollbar" value={element.attributes.scrollbar ?? "auto"} onChange={update} />
          )}
          {meta.fieldGroups.includes("behavior") && "sortable" in meta.defaultProps && (
            <AttributeField label="Sortable" keyName="sortable" value={element.attributes.sortable ?? false} onChange={update} type="boolean" />
          )}

          {meta.fieldGroups.includes("events") && (
            <>
              <AttributeField label="onClick" keyName="onClick" value={element.attributes.onClick ?? ""} onChange={update} />
              <AttributeField label="onChange" keyName="onChange" value={element.attributes.onChange ?? ""} onChange={update} />
              <AttributeField label="onSelect" keyName="onSelect" value={element.attributes.onSelect ?? ""} onChange={update} />
            </>
          )}
        </div>
      </ScrollArea>
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
