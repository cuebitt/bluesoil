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
  Image,
  ChartLine,
  ChartColumn,
  Network,
  Type,
  SquareTerminal,
  Box,
  Brush,
  Grid2x2,
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
  | "toast"
  | "image"
  | "graph"
  | "barChart"
  | "lineChart"
  | "tree"
  | "canvas"
  | "pixelGraph"
  | "bigFont"
  | "program"
  | "container";

export type AttrFieldType = "text" | "number" | "boolean" | "color" | "select";

export type AttrEditor = "json";

export interface OptionalAttr {
  key: string;
  label: string;
  type: AttrFieldType;
  options?: string[];
  editor?: AttrEditor;
}

export interface ElementMeta {
  label: string;
  icon: LucideIcon;
  isContainer: boolean;
  defaultProps: Record<string, string | number | boolean | object>;
  fieldGroups: Array<"position" | "size" | "appearance" | "content" | "behavior" | "events">;
  optionalAttrs: OptionalAttr[];
  eventAttrs: string[];
}

export interface ElementNode {
  id: string;
  type: ElementType;
  name: string;
  attributes: Record<string, string | number | boolean | object>;
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
    optionalAttrs: [
      {
        key: "scrollbar",
        label: "Scrollbar",
        type: "select",
        options: ["auto", "always", "hidden"],
      },
      { key: "scrollbarColor", label: "Scrollbar Color", type: "color" },
      { key: "scrollbarThumbColor", label: "Scrollbar Thumb Color", type: "color" },
      { key: "selectionBackground", label: "Selection Background", type: "color" },
      { key: "selectionForeground", label: "Selection Foreground", type: "color" },
    ],
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
      { key: "emptyTextColor", label: "Empty Text Color", type: "color" },
      {
        key: "scrollbar",
        label: "Scrollbar",
        type: "select",
        options: ["auto", "always", "hidden"],
      },
      { key: "scrollbarColor", label: "Scrollbar Color", type: "color" },
      { key: "scrollbarThumbColor", label: "Scrollbar Thumb Color", type: "color" },
      { key: "items", label: "Items", type: "text", editor: "json" },
    ],
    eventAttrs: ["onChange", "onSelect"],
  },
  dropdown: {
    label: "Dropdown",
    icon: ChevronDown,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 15, text: "Choose..." },
    fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"],
    optionalAttrs: [
      { key: "dropHeight", label: "Drop Height", type: "number" },
      { key: "dropBackground", label: "Drop Background", type: "color" },
      { key: "scrollbarColor", label: "Scrollbar Color", type: "color" },
      { key: "scrollbarThumbColor", label: "Scrollbar Thumb Color", type: "color" },
      { key: "open", label: "Open", type: "boolean" },
      { key: "items", label: "Items", type: "text", editor: "json" },
    ],
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
    defaultProps: { x: 1, y: 1, text: "Option", checkedSymbol: "x", uncheckedSymbol: " " },
    fieldGroups: ["position", "size", "appearance", "content", "events"],
    optionalAttrs: [
      { key: "checked", label: "Checked", type: "boolean" },
      { key: "checkedSymbol", label: "Checked Symbol", type: "text" },
      { key: "uncheckedSymbol", label: "Unchecked Symbol", type: "text" },
    ],
    eventAttrs: ["onChange"],
  },
  switch: {
    label: "Switch",
    icon: ToggleLeft,
    isContainer: false,
    defaultProps: { x: 1, y: 1 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [
      { key: "checked", label: "Checked", type: "boolean" },
      { key: "onColor", label: "On Color", type: "color" },
      { key: "offColor", label: "Off Color", type: "color" },
      { key: "knobColor", label: "Knob Color", type: "color" },
    ],
    eventAttrs: ["onChange"],
  },
  slider: {
    label: "Slider",
    icon: SlidersHorizontal,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 15, min: 0, step: 1, max: 100, horizontal: true },
    fieldGroups: ["position", "size", "appearance", "behavior", "events"],
    optionalAttrs: [
      { key: "value", label: "Value", type: "number" },
      { key: "min", label: "Min", type: "number" },
      { key: "max", label: "Max", type: "number" },
      { key: "step", label: "Step", type: "number" },
      { key: "horizontal", label: "Horizontal", type: "boolean" },
      { key: "barColor", label: "Bar Color", type: "color" },
      { key: "knobColor", label: "Knob Color", type: "color" },
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
      { key: "progress", label: "Progress", type: "number" },
      { key: "maxWidth", label: "Max Width", type: "number" },
      { key: "showPercentage", label: "Show Percentage", type: "boolean" },
      {
        key: "direction",
        label: "Direction",
        type: "select",
        options: ["right", "left", "up", "down"],
      },
      { key: "barColor", label: "Bar Color", type: "color" },
    ],
    eventAttrs: [],
  },
  table: {
    label: "Table",
    icon: Table,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 30, height: 10 },
    fieldGroups: ["position", "size", "appearance", "behavior", "events"],
    optionalAttrs: [
      { key: "sortable", label: "Sortable", type: "boolean" },
      { key: "gridColor", label: "Grid Color", type: "color" },
      { key: "headerBackground", label: "Header Background", type: "color" },
      { key: "selectionBackground", label: "Selection Background", type: "color" },
      { key: "selectionForeground", label: "Selection Foreground", type: "color" },
      { key: "columns", label: "Columns", type: "text", editor: "json" },
      { key: "data", label: "Data", type: "text", editor: "json" },
    ],
    eventAttrs: ["onSelect", "onChange"],
  },
  tabControl: {
    label: "TabControl",
    icon: PanelTop,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 30, height: 15 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [
      { key: "active", label: "Active", type: "number" },
      { key: "headerBackground", label: "Header Background", type: "color" },
      { key: "activeBackground", label: "Active Background", type: "color" },
      { key: "activeForeground", label: "Active Foreground", type: "color" },
      { key: "tabs", label: "Tabs", type: "text", editor: "json" },
    ],
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
    optionalAttrs: [
      {
        key: "direction",
        label: "Direction",
        type: "select",
        options: ["row", "column"],
      },
      { key: "gap", label: "Gap", type: "number" },
      { key: "padding", label: "Padding", type: "number" },
      {
        key: "align",
        label: "Align",
        type: "select",
        options: ["start", "center", "end", "stretch"],
      },
      {
        key: "justify",
        label: "Justify",
        type: "select",
        options: ["start", "center", "end", "spaceBetween"],
      },
    ],
    eventAttrs: [],
  },
  menu: {
    label: "Menu",
    icon: Menu,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 15, height: 5 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [
      { key: "separatorColor", label: "Separator Color", type: "color" },
      { key: "spacing", label: "Spacing", type: "number" },
      { key: "dropBackground", label: "Drop Background", type: "color" },
    ],
    eventAttrs: ["onSelect"],
  },
  contextMenu: {
    label: "ContextMenu",
    icon: PanelLeftOpen,
    isContainer: true,
    defaultProps: { x: 1, y: 1 },
    fieldGroups: ["position", "size", "appearance", "events"],
    optionalAttrs: [{ key: "separatorColor", label: "Separator Color", type: "color" }],
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
  image: {
    label: "Image",
    icon: Image,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 10, height: 8 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "currentFrame", label: "Current Frame", type: "number" },
      { key: "autoResize", label: "Auto Resize", type: "boolean" },
      { key: "offsetX", label: "Offset X", type: "number" },
      { key: "offsetY", label: "Offset Y", type: "number" },
      { key: "bimg", label: "Bimg", type: "text", editor: "json" },
    ],
    eventAttrs: [],
  },
  graph: {
    label: "Graph",
    icon: ChartLine,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 10 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "minValue", label: "Min Value", type: "number" },
      { key: "maxValue", label: "Max Value", type: "number" },
      { key: "series", label: "Series", type: "text", editor: "json" },
    ],
    eventAttrs: [],
  },
  barChart: {
    label: "BarChart",
    icon: ChartColumn,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 10 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "minValue", label: "Min Value", type: "number" },
      { key: "maxValue", label: "Max Value", type: "number" },
      { key: "series", label: "Series", type: "text", editor: "json" },
    ],
    eventAttrs: [],
  },
  lineChart: {
    label: "LineChart",
    icon: ChartLine,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 10 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "minValue", label: "Min Value", type: "number" },
      { key: "maxValue", label: "Max Value", type: "number" },
      { key: "series", label: "Series", type: "text", editor: "json" },
    ],
    eventAttrs: [],
  },
  tree: {
    label: "Tree",
    icon: Network,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 10 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "selectionBackground", label: "Selection Background", type: "color" },
      { key: "selectionForeground", label: "Selection Foreground", type: "color" },
      { key: "scrollbarColor", label: "Scrollbar Color", type: "color" },
      { key: "scrollbarThumbColor", label: "Scrollbar Thumb Color", type: "color" },
      {
        key: "scrollbar",
        label: "Scrollbar",
        type: "select",
        options: ["auto", "always", "hidden"],
      },
      { key: "nodes", label: "Nodes", type: "text", editor: "json" },
    ],
    eventAttrs: [],
  },
  canvas: {
    label: "Canvas",
    icon: Brush,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 10 },
    fieldGroups: ["position", "size", "appearance"],
    optionalAttrs: [],
    eventAttrs: [],
  },
  pixelGraph: {
    label: "PixelGraph",
    icon: Grid2x2,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 8 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "minValue", label: "Min Value", type: "number" },
      { key: "maxValue", label: "Max Value", type: "number" },
      { key: "series", label: "Series", type: "text", editor: "json" },
    ],
    eventAttrs: [],
  },
  bigFont: {
    label: "BigFont",
    icon: Type,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 10, height: 2, text: "Big" },
    fieldGroups: ["position", "size", "appearance", "content"],
    optionalAttrs: [{ key: "fontSize", label: "Font Size", type: "number" }],
    eventAttrs: [],
  },
  program: {
    label: "Program",
    icon: SquareTerminal,
    isContainer: false,
    defaultProps: { x: 1, y: 1, width: 20, height: 15 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [{ key: "path", label: "Path", type: "text" }],
    eventAttrs: [],
  },
  container: {
    label: "Container",
    icon: Box,
    isContainer: true,
    defaultProps: { x: 1, y: 1, width: 10, height: 5 },
    fieldGroups: ["position", "size", "appearance", "behavior"],
    optionalAttrs: [
      { key: "offsetX", label: "Offset X", type: "number" },
      { key: "offsetY", label: "Offset Y", type: "number" },
    ],
    eventAttrs: [],
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

export function findParent(nodes: ElementNode[], id: string): ElementNode | null {
  for (const n of nodes) {
    if (n.children.some((c) => c.id === id)) return n;
    const p = findParent(n.children, id);
    if (p) return p;
  }
  return null;
}

export function isDraggable(node: ElementNode, parent: ElementNode | null): boolean {
  // ponytail: v1 allows top-level only; layout children (row/column/flex)
  // stay non-draggable since the parent manages position.
  if (parent !== null) return false;
  return ELEMENT_DEFS[node.type].fieldGroups.includes("position");
}
