import { useMemo, useState } from "react";
import { useEditorStore } from "@/store/editor";
import { generateXml } from "@/lib/xml-generator";
import { generateLua } from "@/lib/lua-generator";
import { serializeProject } from "@/lib/project-json";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TerminalCanvas } from "./TerminalCanvas";
import { CodeView } from "./CodeView";
import { Monitor, Braces, FileCode, FileTerminal } from "lucide-react";

type ViewMode = "canvas" | "json" | "xml" | "lua";

export function CenterView() {
  const [view, setView] = useState<ViewMode>("canvas");
  const elements = useEditorStore((s) => s.elements);
  const terminalWidth = useEditorStore((s) => s.terminalWidth);
  const terminalHeight = useEditorStore((s) => s.terminalHeight);

  const json = useMemo(
    () => serializeProject(elements, terminalWidth, terminalHeight),
    [elements, terminalWidth, terminalHeight],
  );
  const xml = useMemo(() => generateXml(elements), [elements]);
  const lua = useMemo(() => generateLua(elements), [elements]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-900">
      <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)} className="gap-0">
        <div className="flex items-center border-b border-neutral-800 px-2 py-1">
          <TabsList className="bg-neutral-800">
            <TabsTrigger
              value="canvas"
              className="text-neutral-400 data-active:bg-neutral-700 data-active:text-white"
            >
              <Monitor data-icon="inline-start" />
              Canvas
            </TabsTrigger>
            <TabsTrigger
              value="json"
              className="text-neutral-400 data-active:bg-neutral-700 data-active:text-white"
            >
              <Braces data-icon="inline-start" />
              JSON
            </TabsTrigger>
            <TabsTrigger
              value="xml"
              className="text-neutral-400 data-active:bg-neutral-700 data-active:text-white"
            >
              <FileCode data-icon="inline-start" />
              XML
            </TabsTrigger>
            <TabsTrigger
              value="lua"
              className="text-neutral-400 data-active:bg-neutral-700 data-active:text-white"
            >
              <FileTerminal data-icon="inline-start" />
              Lua
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      <div className="flex min-h-0 flex-1">
        {view === "canvas" ? (
          <TerminalCanvas />
        ) : view === "json" ? (
          <CodeView code={json} language="json" filename="bluesoil-project.json" />
        ) : view === "xml" ? (
          <CodeView code={xml || "<!-- No elements -->"} language="xml" filename="ui.xml" />
        ) : (
          <CodeView code={lua} language="lua" filename="startup.lua" />
        )}
      </div>
    </div>
  );
}
