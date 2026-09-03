import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/store/editor";
import { parseBasaltXml } from "@/lib/xml-parser";
import { Icon } from "@iconify/react";

export function ImportDialog() {
  const [xml, setXml] = useState("");
  const [open, setOpen] = useState(false);
  const setElements = useEditorStore((s) => s.setElements);
  const elements = useEditorStore((s) => s.elements);

  const handleImport = () => {
    if (elements.length > 0 && !confirm("This will replace the current project. Continue?")) return;
    setElements(parseBasaltXml(xml));
    setOpen(false);
    setXml("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setXml(ev.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <Icon icon="mdi:import" data-icon="inline-start" />
          Import
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Basalt XML</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Textarea
            value={xml}
            onChange={(e) => setXml(e.target.value)}
            placeholder="Paste Basalt XML here..."
            className="min-h-48 font-mono text-xs"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => document.getElementById("xml-file-input")?.click()}>
              Upload .xml file
            </Button>
            <input id="xml-file-input" type="file" accept=".xml" className="hidden" onChange={handleFileUpload} />
            <Button onClick={handleImport} disabled={!xml.trim()}>Import</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
