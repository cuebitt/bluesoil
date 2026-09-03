import { useMemo } from "react";
import { useEditorStore } from "@/store/editor";
import { generateLua } from "@/lib/lua-generator";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function LuaOutput() {
  const elements = useEditorStore((s) => s.elements);
  const lua = useMemo(() => generateLua(elements), [elements]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-3 py-1">
        <span className="text-xs font-medium">Lua</span>
        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(lua)}>
          <Copy data-icon="inline-start" />
          Copy
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <Highlight theme={themes.vsDark} code={lua} language="lua">
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="p-3 text-xs" style={style}>
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
