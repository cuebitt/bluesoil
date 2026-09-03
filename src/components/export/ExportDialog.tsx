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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/store/editor";
import { generateXml } from "@/lib/xml-generator";
import { generateLua } from "@/lib/lua-generator";
import { serializeProject } from "@/lib/project-json";
import { Highlight, themes } from "prism-react-renderer";
import { Download } from "lucide-react";

export function ExportDialog() {
  const [includeLua, setIncludeLua] = useState(true);
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

  const stats = (code: string) =>
    `${code.split("\n").length} lines · ${new Blob([code]).size} bytes`;

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="flex items-center gap-2">
          <Switch id="include-lua" checked={includeLua} onCheckedChange={setIncludeLua} />
          <Label htmlFor="include-lua">Include Lua scaffold</Label>
        </div>
        <Tabs defaultValue="xml">
          <TabsList>
            <TabsTrigger value="xml">XML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            {includeLua && <TabsTrigger value="lua">Lua</TabsTrigger>}
          </TabsList>
          <TabsContent value="xml" className="mt-2">
            <div className="rounded border">
              <Highlight theme={themes.vsDark} code={xml || "<!-- No elements -->"} language="xml">
                {({ style, tokens, getLineProps, getTokenProps }) => (
                  <pre className="max-h-64 overflow-auto p-3 text-xs" style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stats(xml)}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => navigator.clipboard.writeText(xml)}>
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => download(xml, "ui.xml")}>
                Download .xml
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="json" className="mt-2">
            <div className="rounded border">
              <Highlight theme={themes.vsDark} code={json} language="json">
                {({ style, tokens, getLineProps, getTokenProps }) => (
                  <pre className="max-h-64 overflow-auto p-3 text-xs" style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stats(json)}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => navigator.clipboard.writeText(json)}>
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => download(json, "bluesoil-project.json")}
              >
                Download .json
              </Button>
            </div>
          </TabsContent>
          {includeLua && (
            <TabsContent value="lua" className="mt-2">
              <div className="rounded border">
                <Highlight theme={themes.vsDark} code={lua} language="lua">
                  {({ style, tokens, getLineProps, getTokenProps }) => (
                    <pre className="max-h-64 overflow-auto p-3 text-xs" style={style}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{stats(lua)}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => navigator.clipboard.writeText(lua)}>
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => download(lua, "startup.lua")}>
                  Download .lua
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
