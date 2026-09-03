import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AttrEditor, AttrFieldType } from "@/lib/elements";
import { ColorPicker } from "./ColorPicker";

type FieldValue = string | number | boolean | object;

interface AttributeFieldProps {
  label: string;
  keyName: string;
  value: FieldValue;
  onChange: (key: string, value: FieldValue) => void;
  type?: AttrFieldType;
  editor?: AttrEditor;
  options?: string[];
  error?: string | null;
}

function inferAttrType(value: FieldValue, explicit?: AttrFieldType): AttrFieldType {
  if (explicit) return explicit;
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "text";
}

function isJsonValue(editor: AttrEditor | undefined, value: FieldValue) {
  return editor === "json" || (typeof value === "object" && value !== null);
}

export function AttributeField({
  label,
  keyName,
  value,
  onChange,
  type,
  editor,
  options,
  error,
}: AttributeFieldProps) {
  const fieldId = useId();
  if (isJsonValue(editor, value)) {
    return <JsonField label={label} keyName={keyName} value={value} onChange={onChange} />;
  }
  switch (inferAttrType(value, type)) {
    case "boolean":
      return (
        <BooleanField
          id={fieldId}
          label={label}
          checked={!!value}
          onChange={(checked) => onChange(keyName, checked)}
        />
      );
    case "color":
      return (
        <ColorField
          labelId={fieldId}
          label={label}
          value={String(value)}
          onChange={(hex) => onChange(keyName, hex)}
        />
      );
    case "select":
      return (
        <SelectField
          id={fieldId}
          label={label}
          value={String(value)}
          options={options ?? []}
          error={error}
          onChange={(next) => onChange(keyName, next)}
        />
      );
    default:
      return (
        <TextField
          id={fieldId}
          label={label}
          value={value}
          numeric={inferAttrType(value, type) === "number"}
          error={error}
          onChange={(next) => onChange(keyName, next)}
        />
      );
  }
}

function BooleanField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ColorField({
  labelId,
  label,
  value,
  onChange,
}: {
  labelId: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm" id={labelId}>
        {label}
      </span>
      <ColorPicker value={value} labelledBy={labelId} onChange={onChange} />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  error?: string | null;
  onChange: (next: string) => void;
}) {
  const current = options.includes(value) ? value : (options[0] ?? "");
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  numeric,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: FieldValue;
  numeric: boolean;
  error?: string | null;
  onChange: (next: string | number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        value={String(value)}
        onChange={(e) => {
          onChange(numeric ? Number(e.target.valueAsNumber) || 0 : e.target.value);
        }}
        type={numeric ? "number" : "text"}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function JsonField({
  label,
  keyName,
  value,
  onChange,
}: {
  label: string;
  keyName: string;
  value: FieldValue;
  onChange: (key: string, value: FieldValue) => void;
}) {
  const fieldId = useId();
  const fallback = keyName === "bimg" ? {} : [];
  const effective = value === "" ? fallback : value;
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" htmlFor={fieldId}>
        {label}
      </label>
      <Textarea
        id={fieldId}
        value={draft ?? JSON.stringify(effective, null, 2)}
        onChange={(e) => {
          setDraft(e.target.value);
          try {
            onChange(keyName, JSON.parse(e.target.value));
            setError(null);
          } catch {
            setError("Invalid JSON, keeping last good value.");
          }
        }}
        className="font-mono"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
