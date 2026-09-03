import { useEditorStore } from "@/store/editor";
import { ELEMENT_DEFS, type ElementType } from "@/lib/elements";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ELEMENT_GROUPS: Array<{ label: string; types: ElementType[] }> = [
  {
    label: "Containers",
    types: ["frame", "container", "row", "column", "flex", "tabControl"],
  },
  { label: "Overlays", types: ["dialog", "menu", "contextMenu", "toast"] },
  { label: "Basic", types: ["label", "button", "input", "textBox", "checkbox", "switch"] },
  { label: "Selection", types: ["list", "dropdown", "comboBox"] },
  { label: "Data", types: ["table", "tree"] },
  {
    label: "Display",
    types: [
      "slider",
      "progressBar",
      "image",
      "graph",
      "barChart",
      "lineChart",
      "pixelGraph",
      "canvas",
      "bigFont",
      "program",
    ],
  },
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
        <div className="flex flex-col gap-3 p-2">
          {ELEMENT_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <h3 className="px-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
              {group.types.map((type) => {
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
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        container
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
