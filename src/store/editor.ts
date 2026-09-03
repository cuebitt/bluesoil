import { create } from "zustand";
import type { ElementType, ElementNode } from "@/lib/elements";
import { createElementNode } from "@/lib/elements";

interface EditorStore {
  elements: ElementNode[];
  selectedId: string | null;
  activeTool: ElementType | null;
  clipboard: ElementNode | null;
  past: ElementNode[][];
  future: ElementNode[][];

  addElement: (type: ElementType, parentId: string | null, index: number) => string;
  removeElement: (id: string) => void;
  moveElementUp: (id: string) => void;
  moveElementDown: (id: string) => void;
  duplicateElement: (id: string) => void;
  updateAttribute: (id: string, key: string, value: string | number | boolean) => void;
  renameElement: (id: string, name: string) => void;
  select: (id: string | null) => void;
  setActiveTool: (type: ElementType | null) => void;
  copy: (id: string) => void;
  paste: () => void;
  newProject: () => void;
  setElements: (elements: ElementNode[]) => void;
  undo: () => void;
  redo: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

function findNode(
  elements: ElementNode[],
  id: string,
  parent: ElementNode | null = null,
): { node: ElementNode; parent: ElementNode | null; index: number } | null {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) return { node: elements[i], parent, index: i };
    if (elements[i].children.length > 0) {
      const found = findNode(elements[i].children, id, elements[i]);
      if (found) return found;
    }
  }
  return null;
}

function cloneNode(node: ElementNode): ElementNode {
  return {
    ...node,
    id: crypto.randomUUID(),
    attributes: { ...node.attributes },
    children: node.children.map(cloneNode),
  };
}

function removeNode(elements: ElementNode[], id: string): [ElementNode[], ElementNode | null] {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === id) {
      const removed = elements[i];
      return [[...elements.slice(0, i), ...elements.slice(i + 1)], removed];
    }
    if (elements[i].children.length > 0) {
      const [newChildren, removed] = removeNode(elements[i].children, id);
      if (removed) {
        const next = [...elements];
        next[i] = { ...next[i], children: newChildren };
        return [next, removed];
      }
    }
  }
  return [elements, null];
}

function swapSibling(elements: ElementNode[], id: string, direction: "up" | "down"): ElementNode[] {
  const result = findNode(elements, id);
  if (!result) return elements;
  if (result.parent === null) {
    const idx = result.index;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= elements.length) return elements;
    const next = [...elements];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    return next;
  }

  const siblings = result.parent.children;
  const idx = result.index;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return elements;

  const newSiblings = [...siblings];
  [newSiblings[idx], newSiblings[swapIdx]] = [newSiblings[swapIdx], newSiblings[idx]];
  return replaceChildren(elements, result.parent.id, newSiblings);
}

function replaceChildren(
  elements: ElementNode[],
  parentId: string,
  children: ElementNode[],
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === parentId) return { ...el, children };
    if (el.children.length > 0)
      return { ...el, children: replaceChildren(el.children, parentId, children) };
    return el;
  });
}

function addToParent(
  elements: ElementNode[],
  parentId: string,
  child: ElementNode,
  index: number,
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === parentId) {
      const children = [...el.children];
      children.splice(index, 0, child);
      return { ...el, children };
    }
    if (el.children.length > 0)
      return { ...el, children: addToParent(el.children, parentId, child, index) };
    return el;
  });
}

function updateElementAttr(
  elements: ElementNode[],
  id: string,
  key: string,
  value: string | number | boolean,
): ElementNode[] {
  return elements.map((el) => {
    if (el.id === id) return { ...el, attributes: { ...el.attributes, [key]: value } };
    if (el.children.length > 0)
      return { ...el, children: updateElementAttr(el.children, id, key, value) };
    return el;
  });
}

function updateElementName(elements: ElementNode[], id: string, name: string): ElementNode[] {
  return elements.map((el) => {
    if (el.id === id) return { ...el, name };
    if (el.children.length > 0)
      return { ...el, children: updateElementName(el.children, id, name) };
    return el;
  });
}

const MAX_HISTORY = 50;

type StoreSet = (
  partial: Partial<EditorStore> | ((state: EditorStore) => Partial<EditorStore>),
) => void;
type StoreGet = () => EditorStore;

function commit(
  set: StoreSet,
  get: StoreGet,
  next: Partial<EditorStore> | ((state: EditorStore) => Partial<EditorStore>),
): void {
  const { elements, past } = get();
  const newPast = [...past, structuredClone(elements)];
  if (newPast.length > MAX_HISTORY) newPast.shift();
  if (typeof next === "function") {
    const fn = next as (state: EditorStore) => Partial<EditorStore>;
    set((state) => ({ ...fn(state), past: newPast, future: [] }));
  } else {
    set({ ...next, past: newPast, future: [] });
  }
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  elements: [],
  selectedId: null,
  activeTool: null,
  clipboard: null,
  past: [],
  future: [],

  addElement: (type, parentId, index) => {
    const node = createElementNode(type);
    commit(set, get, (state) => {
      if (parentId === null) {
        const elements = [...state.elements];
        elements.splice(index, 0, node);
        return { elements, selectedId: node.id, activeTool: null };
      }
      return {
        elements: addToParent(state.elements, parentId, node, index),
        selectedId: node.id,
        activeTool: null,
      };
    });
    return node.id;
  },

  removeElement: (id) =>
    commit(set, get, (state) => {
      const [elements] = removeNode(state.elements, id);
      return { elements, selectedId: state.selectedId === id ? null : state.selectedId };
    }),

  moveElementUp: (id) =>
    commit(set, get, (state) => ({ elements: swapSibling(state.elements, id, "up") })),
  moveElementDown: (id) =>
    commit(set, get, (state) => ({ elements: swapSibling(state.elements, id, "down") })),

  duplicateElement: (id) =>
    commit(set, get, (state) => {
      const result = findNode(state.elements, id);
      if (!result) return state;
      const clone = cloneNode(result.node);
      if (result.parent) {
        const children = [...result.parent.children];
        children.splice(result.index + 1, 0, clone);
        return {
          elements: replaceChildren(state.elements, result.parent.id, children),
          selectedId: clone.id,
        };
      }
      const elements = [...state.elements];
      elements.splice(result.index + 1, 0, clone);
      return { elements, selectedId: clone.id };
    }),

  updateAttribute: (id, key, value) =>
    commit(set, get, (state) => ({ elements: updateElementAttr(state.elements, id, key, value) })),

  renameElement: (id, name) =>
    commit(set, get, (state) => ({ elements: updateElementName(state.elements, id, name) })),

  select: (id) => set({ selectedId: id }),
  setActiveTool: (type) => set({ activeTool: type, selectedId: null }),

  copy: (id) =>
    set((state) => {
      const result = findNode(state.elements, id);
      return result ? { clipboard: cloneNode(result.node) } : state;
    }),

  paste: () => {
    if (!get().clipboard) return;
    commit(set, get, (state) => {
      if (!state.clipboard) return state;
      const clone = cloneNode(state.clipboard);
      return { elements: [...state.elements, clone], selectedId: clone.id };
    });
  },

  newProject: () =>
    commit(set, get, { elements: [], selectedId: null, activeTool: null, clipboard: null }),
  setElements: (elements) => commit(set, get, { elements }),

  undo: () => {
    const { past, future, elements } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      elements: structuredClone(previous),
      past: past.slice(0, -1),
      future: [...future, structuredClone(elements)],
      selectedId: null,
    });
  },

  redo: () => {
    const { past, future, elements } = get();
    if (future.length === 0) return;
    const next = future[future.length - 1];
    set({
      elements: structuredClone(next),
      future: future.slice(0, -1),
      past: [...past, structuredClone(elements)],
      selectedId: null,
    });
  },

  saveToLocalStorage: () => {
    const { elements } = get();
    localStorage.setItem("bluesoil-project", JSON.stringify({ elements, version: 1 }));
  },

  loadFromLocalStorage: () => {
    try {
      const raw =
        localStorage.getItem("bluesoil-project") ?? localStorage.getItem("bluesand-project");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.elements) set({ elements: data.elements });
    } catch {
      /* ignore */
    }
  },
}));
