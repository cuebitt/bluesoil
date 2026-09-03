import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editor";

export function useAutoSave() {
  const saveToLocalStorage = useEditorStore((s) => s.saveToLocalStorage);
  const loadFromLocalStorage = useEditorStore((s) => s.loadFromLocalStorage);
  const elements = useEditorStore((s) => s.elements);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveToLocalStorage(), 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [elements, saveToLocalStorage]);
}
