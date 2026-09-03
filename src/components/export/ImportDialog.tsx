import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/store/editor";
import { parseBasaltXmlWithWarnings } from "@/lib/xml-parser";
import { parseProjectObject } from "@/lib/project-json";
import { Upload } from "lucide-react";

export function ImportDialog() {
  const [xml, setXml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const setElements = useEditorStore((s) => s.setElements);
  const setTerminalSize = useEditorStore((s) => s.setTerminalSize);
  const elements = useEditorStore((s) => s.elements);

  const handleImport = () => {
    if (elements.length > 0 && !confirm("This will replace the current project. Continue?")) return;
    try {
      const obj = JSON.parse(xml);
      if (
        typeof obj === "object" &&
        obj !== null &&
        Array.isArray((obj as { elements?: unknown }).elements)
      ) {
        try {
          const parsed = parseProjectObject(obj);
          setElements(parsed.elements);
          setTerminalSize(parsed.terminalWidth, parsed.terminalHeight);
          setWarnings(parsed.warnings);
          setError(null);
          if (parsed.warnings.length === 0) {
            setOpen(false);
            setXml("");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to parse project.");
          setWarnings([]);
        }
        return;
      }
    } catch {
      /* not JSON, fall through to XML */
    }
    try {
      const { elements: parsed, warnings: parseWarnings } = parseBasaltXmlWithWarnings(xml);
      setElements(parsed);
      setWarnings(parseWarnings);
      setError(null);
      if (parseWarnings.length === 0) {
        setOpen(false);
        setXml("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse XML.");
      setWarnings([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setXml(ev.target?.result as string);
      setError(null);
      setWarnings([]);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Upload data-icon="inline-start" />
        Import
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Textarea
            value={xml}
            onChange={(e) => {
              setXml(e.target.value);
              setError(null);
              setWarnings([]);
            }}
            placeholder="Paste Basalt XML here..."
            className="min-h-48 font-mono text-xs"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {warnings.length > 0 && (
            <ul className="flex flex-col gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("xml-file-input")?.click()}
            >
              Upload .xml file
            </Button>
            <input
              id="xml-file-input"
              type="file"
              accept=".xml,.json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button onClick={handleImport} disabled={!xml.trim()}>
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
