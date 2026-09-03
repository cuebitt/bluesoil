import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { AttrFieldType } from "@/lib/elements";
import { ColorPicker } from "./ColorPicker";

interface AttributeFieldProps {
  label: string;
  keyName: string;
  value: string | number | boolean;
  onChange: (key: string, value: string | number | boolean) => void;
  type?: AttrFieldType;
  options?: string[];
  error?: string | null;
}

export function AttributeField({
  label,
  keyName,
  value,
  onChange,
  type,
  options,
  error,
}: AttributeFieldProps) {
  const inferredType =
    type ??
    (typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "text");

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
