import type { LucideIcon } from "lucide-react";
import {
  Monitor, Tag, MousePointerClick, TextCursorInput, AlignLeft,
  List, ChevronDown, TextCursorInput as ComboboxIcon, CheckSquare,
  ToggleLeft, SlidersHorizontal, BarChart3, Table, PanelTop,
  MessageSquare, Rows3, Columns3, LayoutDashboard, Menu,
  PanelLeftOpen, Info,
} from "lucide-react";

export type ElementType =
  | "frame" | "label" | "button" | "input" | "textBox"
  | "list" | "dropdown" | "comboBox" | "checkbox" | "switch"
  | "slider" | "progressBar" | "table" | "tabControl"
  | "dialog" | "row" | "column" | "flex" | "menu"
  | "contextMenu" | "toast";

export interface ElementMeta {
  label: string;
  icon: LucideIcon;
  isContainer: boolean;
  defaultProps: Record<string, string | number | boolean>;
  fieldGroups: Array<"position" | "size" | "appearance" | "content" | "behavior" | "events">;
}

export interface ElementNode {
  id: string;
  type: ElementType;
  name: string;
  attributes: Record<string, string | number | boolean>;
  children: ElementNode[];
}

export const ELEMENT_DEFS: Record<ElementType, ElementMeta> = {
  frame:        { label: "Frame",        icon: Monitor,            isContainer: true,  defaultProps: { x: 1, y: 1, width: 20, height: 10 }, fieldGroups: ["position", "size", "appearance", "events"] },
  label:        { label: "Label",        icon: Tag,                isContainer: false, defaultProps: { x: 1, y: 1, width: 10, height: 1, text: "Label" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  button:       { label: "Button",       icon: MousePointerClick,  isContainer: false, defaultProps: { x: 1, y: 1, width: 10, height: 3, text: "Button" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  input:        { label: "Input",        icon: TextCursorInput,    isContainer: false, defaultProps: { x: 1, y: 1, width: 20, height: 1 }, fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"] },
  textBox:      { label: "TextBox",      icon: AlignLeft,          isContainer: false, defaultProps: { x: 1, y: 1, width: 20, height: 5 }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  list:         { label: "List",         icon: List,               isContainer: false, defaultProps: { x: 1, y: 1, width: 15, height: 8 }, fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"] },
  dropdown:     { label: "Dropdown",     icon: ChevronDown,        isContainer: false, defaultProps: { x: 1, y: 1, width: 15, text: "Choose..." }, fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"] },
  comboBox:     { label: "ComboBox",     icon: ComboboxIcon,       isContainer: false, defaultProps: { x: 1, y: 1, width: 15, text: "" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  checkbox:     { label: "Checkbox",     icon: CheckSquare,        isContainer: false, defaultProps: { x: 1, y: 1, text: "Option" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  switch:       { label: "Switch",       icon: ToggleLeft,         isContainer: false, defaultProps: { x: 1, y: 1 }, fieldGroups: ["position", "size", "appearance", "events"] },
  slider:       { label: "Slider",       icon: SlidersHorizontal,  isContainer: false, defaultProps: { x: 1, y: 1, width: 15 }, fieldGroups: ["position", "size", "appearance", "behavior", "events"] },
  progressBar:  { label: "ProgressBar",  icon: BarChart3,          isContainer: false, defaultProps: { x: 1, y: 1, width: 20, height: 1 }, fieldGroups: ["position", "size", "appearance", "behavior", "events"] },
  table:        { label: "Table",        icon: Table,              isContainer: false, defaultProps: { x: 1, y: 1, width: 30, height: 10 }, fieldGroups: ["position", "size", "appearance", "behavior", "events"] },
  tabControl:   { label: "TabControl",   icon: PanelTop,           isContainer: true,  defaultProps: { x: 1, y: 1, width: 30, height: 15 }, fieldGroups: ["position", "size", "appearance", "events"] },
  dialog:       { label: "Dialog",       icon: MessageSquare,      isContainer: true,  defaultProps: { x: 5, y: 3, width: 30, height: 12 }, fieldGroups: ["position", "size", "appearance", "events"] },
  row:          { label: "Row",          icon: Rows3,              isContainer: true,  defaultProps: { x: 1, y: 1, width: 40, height: 3 }, fieldGroups: ["position", "size", "appearance", "events"] },
  column:       { label: "Column",       icon: Columns3,           isContainer: true,  defaultProps: { x: 1, y: 1, width: 15, height: 15 }, fieldGroups: ["position", "size", "appearance", "events"] },
  flex:         { label: "Flex",         icon: LayoutDashboard,    isContainer: true,  defaultProps: { x: 1, y: 1, width: 40, height: 15 }, fieldGroups: ["position", "size", "appearance", "events"] },
  menu:         { label: "Menu",         icon: Menu,               isContainer: true,  defaultProps: { x: 1, y: 1, width: 15, height: 5 }, fieldGroups: ["position", "size", "appearance", "events"] },
  contextMenu:  { label: "ContextMenu",  icon: PanelLeftOpen,      isContainer: true,  defaultProps: { x: 1, y: 1 }, fieldGroups: ["position", "size", "appearance", "events"] },
  toast:        { label: "Toast",        icon: Info,               isContainer: true,  defaultProps: { x: 1, y: 1, width: 20, height: 3 }, fieldGroups: ["position", "size", "appearance", "events"] },
};

export function createElementNode(type: ElementType): ElementNode {
  return {
    id: crypto.randomUUID(),
    type,
    name: "",
    attributes: { ...ELEMENT_DEFS[type].defaultProps },
    children: [],
  };
}
