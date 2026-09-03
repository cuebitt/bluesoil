import { useMemo } from "react";
import { useEditorStore } from "@/store/editor";
import { generateXml } from "@/lib/xml-generator";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export function XmlOutput() {
  const elements = useEditorStore((s) => s.elements);
  const xml = useMemo(() => generateXml(elements), [elements]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-3 py-1">
        <span className="text-xs font-medium">XML</span>
        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(xml)}>
          <Icon icon="mdi:content-copy" data-icon="inline-start" />
          Copy
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <Highlight theme={themes.vsDark} code={xml || "<!-- No elements -->"} language="xml">
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
