import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AttrEditor, AttrFieldType } from "@/lib/elements";
import { ColorPicker } from "./ColorPicker";

interface AttributeFieldProps {
  label: string;
  keyName: string;
  value: string | number | boolean | object;
  onChange: (key: string, value: string | number | boolean | object) => void;
  type?: AttrFieldType;
  editor?: AttrEditor;
  options?: string[];
  error?: string | null;
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
  const inferredType =
    type ??
    (typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "text");

  if (editor === "json" || (typeof value === "object" && value !== null)) {
    return <JsonField label={label} keyName={keyName} value={value} onChange={onChange} />;
  }

  if (inferredType === "boolean") {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm">{label}</label>
        <Switch checked={!!value} onCheckedChange={(checked) => onChange(keyName, checked)} />
      </div>
    );
  }

  if (inferredType === "color") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm">{label}</label>
        <ColorPicker value={String(value)} onChange={(hex) => onChange(keyName, hex)} />
      </div>
    );
  }

  if (inferredType === "select") {
    const opts = options ?? [];
    const current = opts.includes(String(value)) ? String(value) : (opts[0] ?? "");
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm">{label}</label>
        <select
          value={current}
          onChange={(e) => onChange(keyName, e.target.value)}
          className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
        >
          {opts.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{label}</label>
      <Input
        value={String(value)}
        onChange={(e) => {
          const val = inferredType === "number" ? Number(e.target.value) || 0 : e.target.value;
          onChange(keyName, val);
        }}
        type={inferredType === "number" ? "number" : "text"}
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
  value: string | number | boolean | object;
  onChange: (key: string, value: string | number | boolean | object) => void;
}) {
  const fallback = keyName === "bimg" ? {} : [];
  const effective = value === "" ? fallback : value;
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{label}</label>
      <Textarea
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
