import { useEditorStore } from "@/store/editor";
import { ELEMENT_DEFS, findElementById } from "@/lib/elements";
import { isValidLuaName } from "@/lib/lua-generator";
import { AttributeField } from "./AttributeField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function PropertyPanel() {
  const selectedId = useEditorStore((s) => s.selectedId);
  const elements = useEditorStore((s) => s.elements);
  const updateAttribute = useEditorStore((s) => s.updateAttribute);
  const renameElement = useEditorStore((s) => s.renameElement);

  const element = selectedId ? findElementById(elements, selectedId) : null;

  if (!element) {
    return (
      <div className="flex h-full min-h-0 flex-col border-l">
        <div className="border-b px-3 py-2">
          <h2 className="text-sm font-medium">Properties</h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
          Select an element to edit
        </div>
      </div>
    );
  }

  const meta = ELEMENT_DEFS[element.type];
  const update = (k: string, v: string | number | boolean) => updateAttribute(element.id, k, v);

  return (
    <div className="flex h-full min-h-0 flex-col border-l">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-medium">Properties</h2>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{meta.label}</Badge>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Name</label>
            <Input
              value={element.name}
              onChange={(e) => renameElement(element.id, e.target.value)}
              placeholder="element_name"
            />
            {element.name && !isValidLuaName(element.name) && (
              <p className="text-xs text-destructive">
                Not a valid Lua identifier; the generated scaffold will not run.
              </p>
            )}
          </div>

          {meta.fieldGroups.includes("position") && (
            <>
              <AttributeField
                label="X"
                keyName="x"
                value={element.attributes.x ?? 1}
                onChange={update}
                type="number"
              />
              <AttributeField
                label="Y"
                keyName="y"
                value={element.attributes.y ?? 1}
                onChange={update}
                type="number"
              />
            </>
          )}

          {meta.fieldGroups.includes("size") && (
            <>
              <AttributeField
                label="Width"
                keyName="width"
                value={element.attributes.width ?? 10}
                onChange={update}
                type="number"
              />
              <AttributeField
                label="Height"
                keyName="height"
                value={element.attributes.height ?? 3}
                onChange={update}
                type="number"
              />
            </>
          )}

          {meta.fieldGroups.includes("appearance") && (
            <>
              <AttributeField
                label="Background"
                keyName="background"
                value={element.attributes.background ?? "#000000"}
                onChange={update}
                type="color"
              />
              <AttributeField
                label="Foreground"
                keyName="foreground"
                value={element.attributes.foreground ?? "#ffffff"}
                onChange={update}
                type="color"
              />
            </>
          )}

          {meta.fieldGroups.includes("content") && "text" in meta.defaultProps && (
            <AttributeField
              label="Text"
              keyName="text"
              value={element.attributes.text ?? ""}
              onChange={update}
            />
          )}

          {(meta.fieldGroups.includes("content") || meta.fieldGroups.includes("behavior")) &&
            meta.optionalAttrs.map((attr) => (
              <AttributeField
                key={attr.key}
                label={attr.label}
                keyName={attr.key}
                value={
                  element.attributes[attr.key] ??
                  (attr.type === "boolean"
                    ? false
                    : attr.type === "number"
                      ? 0
                      : attr.type === "color"
                        ? "#000000"
                        : "")
                }
                onChange={update}
                type={attr.type}
              />
            ))}

          {meta.fieldGroups.includes("events") && meta.eventAttrs.length > 0 && (
            <>
              {meta.eventAttrs.map((eventKey) => (
                <EventField
                  key={eventKey}
                  eventKey={eventKey}
                  value={element.attributes[eventKey]}
                  onChange={update}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function EventField({
  eventKey,
  value,
  onChange,
}: {
  eventKey: string;
  value: string | number | boolean | undefined;
  onChange: (key: string, value: string | number | boolean) => void;
}) {
  const text = typeof value === "string" ? value : "";
  return (
    <AttributeField
      label={eventKey}
      keyName={eventKey}
      value={value ?? ""}
      onChange={onChange}
      error={
        text.trim() && !isValidLuaName(text.trim())
          ? "Not a valid Lua function name; the generated scaffold will not run."
          : null
      }
    />
  );
}
