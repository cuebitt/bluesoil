import { CC_PALETTE } from "@/lib/palette-colors";
import { cn } from "@/lib/utils";

const COLOR_ENTRIES = Object.entries(CC_PALETTE);

interface ColorPickerProps {
  value: string | boolean;
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const currentHex = typeof value === "string" && value.startsWith("#") ? value : "#000000";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded border" style={{ backgroundColor: currentHex }} />
        <span className="text-xs text-muted-foreground">{currentHex}</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {COLOR_ENTRIES.map(([idx, rgb]) => {
          const match = rgb.match(/rgb\((\d+),(\d+),(\d+)\)/);
          const hex = match
            ? `#${parseInt(match[1]).toString(16).padStart(2, "0")}${parseInt(match[2]).toString(16).padStart(2, "0")}${parseInt(match[3]).toString(16).padStart(2, "0")}`
            : "#000000";
          return (
            <button
              key={idx}
              onClick={() => onChange(hex)}
              className={cn(
                "size-6 rounded border transition-transform hover:scale-110",
                currentHex === hex && "ring-2 ring-primary ring-offset-1",
              )}
              style={{ backgroundColor: hex }}
              title={idx}
            />
          );
        })}
      </div>
    </div>
  );
}
