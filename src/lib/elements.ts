import type { LucideIcon } from "lucide-react";
import {
  Monitor,
  Tag,
  MousePointerClick,
  TextCursorInput,
  AlignLeft,
  List,
  ChevronDown,
  ChevronsUpDown,
  CheckSquare,
  ToggleLeft,
  SlidersHorizontal,
  BarChart3,
  Table,
  PanelTop,
  MessageSquare,
  Rows3,
  Columns3,
  LayoutDashboard,
  Menu,
  PanelLeftOpen,
  Info,
} from "lucide-react";

export type ElementType =
  | "frame"
  | "label"
  | "button"
  | "input"
  | "textBox"
  | "list"
  | "dropdown"
  | "comboBox"
  | "checkbox"
  | "switch"
  | "slider"
  | "progressBar"
  | "table"
  | "tabControl"
  | "dialog"
  | "row"
  | "column"
  | "flex"
  | "menu"
  | "contextMenu"
  | "toast";

export type AttrFieldType = "text" | "number" | "boolean" | "color";

export interface OptionalAttr {
  key: string;
  label: string;
  type: AttrFieldType;
}

export interface ElementMeta {
  label: string;
  icon: LucideIcon;
  isContainer: boolean;
  defaultProps: Record<string, string | number | boolean>;
  fieldGroups: Array<"position" | "size" | "appearance" | "content" | "behavior" | "events">;
  optionalAttrs: OptionalAttr[];
  eventAttrs: string[];
}

export interface ElementNode {
  id: string;
  type: ElementType;
  name: string;
  attributes: Record<string, string | number | boolean>;
  children: ElementNode[];
}

export const ELEMENT_DEFS: Record<ElementType, ElementMeta> = {
  frame: {
    label: "Frame",
    icon: Monitor,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 20, height: 10 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onClick", "onScroll"],
  },
  label: {
    label: "Label",
    icon: Tag,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 10, height: 1, text: "Label" },
    fieldGroups: ["position", "size", "appearance", "content", "events"],
    optionalAttrs: [],
    eventAttrs: ["onClick"],
  },
  button: {
    label: "Button",
    icon: MousePointerClick,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 10, height: 3, text: "Button" },
    fieldGroups: ["position", "size", "appearance", "content", "events"],
    optionalAttrs: [],
    eventAttrs: ["onClick", "onClickUp"],
  },
  input: {
    label: "Input",
    icon: TextCursorInput,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 1 },
    fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"],
    optionalAttrs: [
      { key: "placeholder", label: "Placeholder", type: "text" },
      { key: "placeholderColor", label: "Placeholder Color", type: "color" },
      { key: "maxLength", label: "Max Length", type: "number" },
      { key: "replaceChar", label: "Replace Char", type: "text" },
      { key: "pattern", label: "Pattern", type: "text" },
    ],
    eventAttrs: ["onChange", "onEnter", "onFocus", "onBlur"],
  },
  textBox: {
    label: "TextBox",
    icon: AlignLeft,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 5 },
    fieldGroups: ["position", "size", "appearance", "content", "events"],
    optionalAttrs: [],
    eventAttrs: ["onChange"],
  },
  list: {
    label: "List",
    icon: List,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 15, height: 8 },
    fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"],
    optionalAttrs: [
      { key: "emptyText", label: "Empty Text", type: "text" },
      { key: "scrollbar", label: "Scrollbar", type: "text" },
    ],
    eventAttrs: ["onChange", "onSelect"],
  },
  dropdown: {
    label: "Dropdown",
    icon: ChevronDown,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 15, text: "Choose..." },
    fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"],
    optionalAttrs: [{ key: "dropHeight", label: "Drop Height", type: "number" }],
    eventAttrs: ["onSelect", "onChange"],
  },
  comboBox: {
    label: "ComboBox",
    icon: ChevronsUpDown,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 15, text: "" },
    fieldGroups: ["position", "size", "appearance", "content", "events"],
    optionalAttrs: [],
    eventAttrs: ["onSelect", "onChange", "onEnter"],
  },
  checkbox: {
    label: "Checkbox",
    icon: CheckSquare,
    isContainer: false,
    defaultProps: { x: 1, y: 1, text: "Option" },
    fieldGroups: ["position", "size", "appearance", "content", "events"],
    optionalAttrs: [],
    eventAttrs: ["onChange"],
  },
  switch: {
    label: "Switch",
    icon: ToggleLeft,
    isContainer: false,
    defaultProps: { x: 1, y: 1 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onChange"],
  },
  slider: {
    label: "Slider",
    icon: SlidersHorizontal,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 15 },
    fieldGroups: ["position", "size", "appearance", "behavior", "events"],
    optionalAttrs: [
      { key: "value", label: "Value", type: "number" },
      { key: "minValue", label: "Min Value", type: "number" },
      { key: "maxValue", label: "Max Value", type: "number" },
    ],
    eventAttrs: ["onChange"],
  },
  progressBar: {
    label: "ProgressBar",
    icon: BarChart3,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 1 },
    fieldGroups: ["position", "size", "appearance", "behavior", "events"],
    optionalAttrs: [
      { key: "value", label: "Value", type: "number" },
      { key: "maxWidth", label: "Max Width", type: "number" },
    ],
    eventAttrs: [],
  },
  table: {
    label: "Table",
    icon: Table,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 30, height: 10 },
    fieldGroups: ["position", "size", "appearance", "behavior", "events"],
    optionalAttrs: [{ key: "sortable", label: "Sortable", type: "boolean" }],
    eventAttrs: ["onSelect", "onChange"],
  },
  tabControl: {
    label: "TabControl",
    icon: PanelTop,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 30, height: 15 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onChange"],
  },
  dialog: {
    label: "Dialog",
    icon: MessageSquare,
    isContainer: true,
    defaultProps: { x: 5, y: 3, width: 30, height: 12 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onClick"],
  },
  row: {
    label: "Row",
    icon: Rows3,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 40, height: 3 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: [],
  },
  column: {
    label: "Column",
    icon: Columns3,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 15, height: 15 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: [],
  },
  flex: {
    label: "Flex",
    icon: LayoutDashboard,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 40, height: 15 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: [],
  },
  menu: {
    label: "Menu",
    icon: Menu,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 15, height: 5 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onSelect"],
  },
  contextMenu: {
    label: "ContextMenu",
    icon: PanelLeftOpen,
    isContainer: true,
    defaultProps: { x: 1, y: 1 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onSelect"],
  },
  toast: {
    label: "Toast",
    icon: Info,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 20, height: 3 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [],
    eventAttrs: ["onClick"],
  },
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

export function findElementById(elements: ElementNode[], id: string): ElementNode | null {
  for (const el of elements) {
    if (el.id === id) return el;
    const found = findElementById(el.children, id);
    if (found) return found;
  }
  return null;
}
