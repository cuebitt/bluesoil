import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface CodeViewProps {
  code: string;
  language: "json" | "xml" | "lua";
  filename: string;
}

export function CodeView({ code, language, filename }: CodeViewProps) {
  const lines = code ? code.split("\n").length : 0;
  const bytes = new Blob([code]).size;

  const download = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-900">
      <div className="flex items-center justify-between gap-2 px-2 py-1">
        <span className="truncate text-xs text-neutral-400">{filename}</span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-neutral-500">
            {lines} lines · {bytes} bytes
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(code)}
            className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <Copy data-icon="inline-start" />
            Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={download}
            className="border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <Download data-icon="inline-start" />
            Download
          </Button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 overflow-auto px-2 pb-2">
        <Highlight theme={themes.vsDark} code={code} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="min-h-full w-full overflow-auto p-3 text-xs" style={style}>
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
    </div>
  );
}
