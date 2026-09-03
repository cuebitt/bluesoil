import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "./ColorPicker";

interface AttributeFieldProps {
  label: string;
  keyName: string;
  value: string | number | boolean;
  onChange: (key: string, value: string | number | boolean) => void;
  type?: "text" | "number" | "boolean" | "color";
  error?: string | null;
}

export function AttributeField({
  label,
  keyName,
  value,
  onChange,
  type,
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
