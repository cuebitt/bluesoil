import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editor";
import { generateXml } from "@/lib/xml-generator";
import { generateLua } from "@/lib/lua-generator";
import { serializeProject } from "@/lib/project-json";
import { CodeView } from "@/components/canvas/CodeView";
import { Download } from "lucide-react";

export function ExportDialog() {
  const [open, setOpen] = useState(false);
  const elements = useEditorStore((s) => s.elements);
  const terminalWidth = useEditorStore((s) => s.terminalWidth);
  const terminalHeight = useEditorStore((s) => s.terminalHeight);

  const xml = useMemo(() => generateXml(elements), [elements]);
  const lua = useMemo(() => generateLua(elements), [elements]);
  const json = useMemo(
    () => serializeProject(elements, terminalWidth, terminalHeight),
    [elements, terminalWidth, terminalHeight],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Download data-icon="inline-start" />
        Export
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="xml">
          <TabsList>
            <TabsTrigger value="xml">XML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="lua">Lua</TabsTrigger>
          </TabsList>
          <TabsContent value="xml" className="mt-2">
            <CodeView code={xml || "<!-- No elements -->"} language="xml" filename="ui.xml" />
          </TabsContent>
          <TabsContent value="json" className="mt-2">
            <CodeView code={json} language="json" filename="bluesoil-project.json" />
          </TabsContent>
          <TabsContent value="lua" className="mt-2">
            <CodeView code={lua} language="lua" filename="startup.lua" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
