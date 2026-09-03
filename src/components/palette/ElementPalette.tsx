import { useEditorStore } from "@/store/editor";
import { ELEMENT_DEFS, type ElementType } from "@/lib/elements";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ELEMENT_TYPES: ElementType[] = [
  "frame", "label", "button", "input", "textBox",
  "list", "dropdown", "comboBox", "checkbox", "switch",
  "slider", "progressBar", "table", "tabControl",
  "dialog", "row", "column", "flex", "menu",
  "contextMenu", "toast",
];

export function ElementPalette() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  return (
    <div className="flex min-h-0 flex-1 flex-col border-r">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-medium">Elements</h2>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-1 p-2">
          {ELEMENT_TYPES.map((type) => {
            const meta = ELEMENT_DEFS[type];
            const Icon = meta.icon;
            const isActive = activeTool === type;
            return (
              <button
                key={type}
                onClick={() => setActiveTool(isActive ? null : type)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate">{meta.label}</span>
                {meta.isContainer && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">container</Badge>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
