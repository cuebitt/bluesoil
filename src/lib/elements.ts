export type ElementType =
  | "frame" | "label" | "button" | "input" | "textBox"
  | "list" | "dropdown" | "comboBox" | "checkbox" | "switch"
  | "slider" | "progressBar" | "table" | "tabControl"
  | "dialog" | "row" | "column" | "flex" | "menu"
  | "contextMenu" | "toast";

export interface ElementMeta {
  label: string;
  icon: string;
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
  frame:        { label: "Frame",        icon: "mdi:window-restore",        isContainer: true,  defaultProps: { x: 1, y: 1, width: 20, height: 10 }, fieldGroups: ["position", "size", "appearance", "events"] },
  label:        { label: "Label",        icon: "mdi:label",                 isContainer: false, defaultProps: { x: 1, y: 1, width: 10, height: 1, text: "Label" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  button:       { label: "Button",       icon: "mdi:button-cursor",         isContainer: false, defaultProps: { x: 1, y: 1, width: 10, height: 3, text: "Button" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  input:        { label: "Input",        icon: "mdi:textbox",               isContainer: false, defaultProps: { x: 1, y: 1, width: 20, height: 1 }, fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"] },
  textBox:      { label: "TextBox",      icon: "mdi:textbox-multiple",      isContainer: false, defaultProps: { x: 1, y: 1, width: 20, height: 5 }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  list:         { label: "List",         icon: "mdi:format-list-bulleted",  isContainer: false, defaultProps: { x: 1, y: 1, width: 15, height: 8 }, fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"] },
  dropdown:     { label: "Dropdown",     icon: "mdi:menu-down",             isContainer: false, defaultProps: { x: 1, y: 1, width: 15, text: "Choose..." }, fieldGroups: ["position", "size", "appearance", "content", "behavior", "events"] },
  comboBox:     { label: "ComboBox",     icon: "mdi:combobox",              isContainer: false, defaultProps: { x: 1, y: 1, width: 15, text: "" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  checkbox:     { label: "Checkbox",     icon: "mdi:checkbox-marked",       isContainer: false, defaultProps: { x: 1, y: 1, text: "Option" }, fieldGroups: ["position", "size", "appearance", "content", "events"] },
  switch:       { label: "Switch",       icon: "mdi:toggle-switch",         isContainer: false, defaultProps: { x: 1, y: 1 }, fieldGroups: ["position", "size", "appearance", "events"] },
  slider:       { label: "Slider",       icon: "mdi:tune-vertical",         isContainer: false, defaultProps: { x: 1, y: 1, width: 15 }, fieldGroups: ["position", "size", "appearance", "behavior", "events"] },
  progressBar:  { label: "ProgressBar",  icon: "mdi:progress-check",        isContainer: false, defaultProps: { x: 1, y: 1, width: 20, height: 1 }, fieldGroups: ["position", "size", "appearance", "behavior", "events"] },
  table:        { label: "Table",        icon: "mdi:table",                 isContainer: false, defaultProps: { x: 1, y: 1, width: 30, height: 10 }, fieldGroups: ["position", "size", "appearance", "behavior", "events"] },
  tabControl:   { label: "TabControl",   icon: "mdi:tab",                   isContainer: true,  defaultProps: { x: 1, y: 1, width: 30, height: 15 }, fieldGroups: ["position", "size", "appearance", "events"] },
  dialog:       { label: "Dialog",       icon: "mdi:dialog",                isContainer: true,  defaultProps: { x: 5, y: 3, width: 30, height: 12 }, fieldGroups: ["position", "size", "appearance", "events"] },
  row:          { label: "Row",          icon: "mdi:row-first",             isContainer: true,  defaultProps: { x: 1, y: 1, width: 40, height: 3 }, fieldGroups: ["position", "size", "appearance", "events"] },
  column:       { label: "Column",       icon: "mdi:column-first",          isContainer: true,  defaultProps: { x: 1, y: 1, width: 15, height: 15 }, fieldGroups: ["position", "size", "appearance", "events"] },
  flex:         { label: "Flex",         icon: "mdi:view-dashboard",        isContainer: true,  defaultProps: { x: 1, y: 1, width: 40, height: 15 }, fieldGroups: ["position", "size", "appearance", "events"] },
  menu:         { label: "Menu",         icon: "mdi:menu",                  isContainer: true,  defaultProps: { x: 1, y: 1, width: 15, height: 5 }, fieldGroups: ["position", "size", "appearance", "events"] },
  contextMenu:  { label: "ContextMenu",  icon: "mdi:menu-open",             isContainer: true,  defaultProps: { x: 1, y: 1 }, fieldGroups: ["position", "size", "appearance", "events"] },
  toast:        { label: "Toast",        icon: "mdi:information",           isContainer: true,  defaultProps: { x: 1, y: 1, width: 20, height: 3 }, fieldGroups: ["position", "size", "appearance", "events"] },
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
