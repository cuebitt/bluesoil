import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor";
import { ExportDialog } from "@/components/export/ExportDialog";
import { ImportDialog } from "@/components/export/ImportDialog";
import { Palette, FilePlus } from "lucide-react";

export function AppHeader() {
  const newProject = useEditorStore((s) => s.newProject);

  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <Palette className="size-6" />
        <h1 className="text-lg font-semibold">BlueSand</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">51 x 19</span>
        <ImportDialog />
        <ExportDialog />
        <Button variant="outline" size="sm" onClick={newProject}>
          <FilePlus data-icon="inline-start" />
          New
        </Button>
      </div>
    </header>
  );
}
