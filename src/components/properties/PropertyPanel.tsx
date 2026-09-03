import { useId } from "react";
import { useEditorStore } from "@/store/editor";
import { ELEMENT_DEFS, findElementById, type ElementNode } from "@/lib/elements";
import { isValidLuaName } from "@/lib/lua-generator";
import { AttributeField } from "./AttributeField";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type UpdateFn = (k: string, v: string | number | boolean | object) => void;

export function PropertyPanel() {
  const nameId = useId();
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
  const update: UpdateFn = (k, v) => updateAttribute(element.id, k, v);

  return (
    <div className="flex h-full min-h-0 flex-col border-l">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-medium">Properties</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{meta.label}</Badge>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor={nameId}>
              Name
            </label>
            <Input
              id={nameId}
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

          <PositionFields element={element} update={update} />
          <SizeFields element={element} update={update} />
          <AppearanceFields element={element} update={update} />
          <ContentFields element={element} update={update} />
          <EventFields element={element} update={update} />
        </div>
      </div>
    </div>
  );
}

function PositionFields({ element, update }: { element: ElementNode; update: UpdateFn }) {
  if (!ELEMENT_DEFS[element.type].fieldGroups.includes("position")) return null;
  return (
    <>
      <AttributeField
        label="Visible"
        keyName="visible"
        value={element.attributes.visible ?? true}
        onChange={update}
        type="boolean"
      />
      <AttributeField
        label="Z"
        keyName="z"
        value={element.attributes.z ?? 0}
        onChange={update}
        type="number"
      />
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
  );
}

function SizeFields({ element, update }: { element: ElementNode; update: UpdateFn }) {
  if (!ELEMENT_DEFS[element.type].fieldGroups.includes("size")) return null;
  return (
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
  );
}

function AppearanceFields({ element, update }: { element: ElementNode; update: UpdateFn }) {
  if (!ELEMENT_DEFS[element.type].fieldGroups.includes("appearance")) return null;
  return (
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
  );
}

function ContentFields({ element, update }: { element: ElementNode; update: UpdateFn }) {
  const meta = ELEMENT_DEFS[element.type];
  const groups = meta.fieldGroups;
  if (!groups.includes("content") && !groups.includes("behavior")) return null;
  return (
    <>
      {groups.includes("content") && "text" in meta.defaultProps && (
        <AttributeField
          label="Text"
          keyName="text"
          value={element.attributes.text ?? ""}
          onChange={update}
        />
      )}
      {(groups.includes("content") || groups.includes("behavior")) &&
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
                    : attr.type === "select"
                      ? (attr.options?.[0] ?? "")
                      : "")
            }
            onChange={update}
            type={attr.type}
            editor={attr.editor}
            options={attr.options}
          />
        ))}
    </>
  );
}

function EventFields({ element, update }: { element: ElementNode; update: UpdateFn }) {
  const meta = ELEMENT_DEFS[element.type];
  if (!meta.fieldGroups.includes("events")) return null;
  return (
    <>
      {meta.eventAttrs.map((eventKey) => {
        const value = element.attributes[eventKey];
        const text = typeof value === "string" ? value : "";
        return (
          <AttributeField
            key={eventKey}
            label={eventKey}
            keyName={eventKey}
            value={value ?? ""}
            onChange={update}
            error={
              text.trim() && !isValidLuaName(text.trim())
                ? "Not a valid Lua function name; the generated scaffold will not run."
                : null
            }
          />
        );
      })}
    </>
  );
}
