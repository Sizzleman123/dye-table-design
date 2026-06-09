'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { LogoItem } from '@/lib/logoData';

export interface TableItem {
  id: string;
  logoId: string;
  name: string;
  emoji: string;
  color: string;
  bg: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  flipped: boolean;
}

interface HistoryEntry {
  items: TableItem[];
}

interface TableStore {
  items: TableItem[];
  selectedId: string | null;
  history: HistoryEntry[];
  historyIndex: number;
  zoom: number;
  showGallery: boolean;
  toasts: { id: string; message: string; type: 'success' | 'info' }[];

  addItem: (logo: LogoItem) => void;
  updateItem: (id: string, updates: Partial<TableItem>) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  duplicateItem: (id: string) => void;
  flipItem: (id: string) => void;
  clearTable: () => void;
  randomize: () => void;
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  setShowGallery: (show: boolean) => void;
  addToast: (message: string, type?: 'success' | 'info') => void;
  removeToast: (id: string) => void;
  loadDesign: (items: TableItem[]) => void;
}

const GALLERY_DESIGNS = [
  ['busch-light', 'coors-light', 'pbr', 'dice', 'usa', 'skull-crossbones'],
  ['beer-mug', 'flame', 'lakers', 'corona', 'sigma-chi', 'lightning-bolt'],
  ['padres', 'modelo', 'sdsu', 'wave', 'california', 'yeti'],
  ['red-bull', 'patriots', 'ohio-state', 'crown', 'anchor', 'bud-light'],
  ['pike', 'bud-light', 'alabama', 'usa', 'fire', 'chiefs'],
  ['monster', 'cowboys', 'party', 'beer-mug', 'bass-pro', 'skull-crossbones'],
];

function makeItem(logoId: string, x: number, y: number, size: number, rotation: number): TableItem {
  const { LOGOS } = require('@/lib/logoData');
  const logo = LOGOS.find((l: LogoItem) => l.id === logoId);
  if (!logo) return null as unknown as TableItem;
  return {
    id: uuidv4(),
    logoId: logo.id,
    name: logo.name,
    emoji: logo.emoji,
    color: logo.color,
    bg: logo.bg,
    x,
    y,
    width: size,
    height: size,
    rotation,
    zIndex: Math.floor(Math.random() * 10),
    opacity: 1,
    flipped: false,
  };
}

function saveHistory(get: () => TableStore, items: TableItem[]) {
  const { history, historyIndex } = get();
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push({ items: JSON.parse(JSON.stringify(items)) });
  return { history: newHistory.slice(-30), historyIndex: newHistory.length - 1 };
}

export const useTableStore = create<TableStore>((set, get) => ({
  items: [],
  selectedId: null,
  history: [{ items: [] }],
  historyIndex: 0,
  zoom: 1,
  showGallery: false,
  toasts: [],

  addItem: (logo) => {
    const { items } = get();
    const maxZ = items.reduce((m, i) => Math.max(m, i.zIndex), 0);
    const TABLE_W = 900;
    const TABLE_H = 500;
    const size = 100 + Math.random() * 60;
    const x = 60 + Math.random() * (TABLE_W - size - 120);
    const y = 60 + Math.random() * (TABLE_H - size - 120);
    const rotation = (Math.random() - 0.5) * 30;

    const newItem: TableItem = {
      id: uuidv4(),
      logoId: logo.id,
      name: logo.name,
      emoji: logo.emoji,
      color: logo.color,
      bg: logo.bg,
      x,
      y,
      width: size,
      height: size,
      rotation,
      zIndex: maxZ + 1,
      opacity: 1,
      flipped: false,
    };

    const newItems = [...items, newItem];
    set({ items: newItems, selectedId: newItem.id, ...saveHistory(get, newItems) });
    get().addToast(`Added ${logo.name}!`, 'success');
  },

  updateItem: (id, updates) => {
    const { items } = get();
    const newItems = items.map(item => item.id === id ? { ...item, ...updates } : item);
    set({ items: newItems, ...saveHistory(get, newItems) });
  },

  removeItem: (id) => {
    const { items, selectedId } = get();
    const newItems = items.filter(i => i.id !== id);
    set({
      items: newItems,
      selectedId: selectedId === id ? null : selectedId,
      ...saveHistory(get, newItems),
    });
  },

  selectItem: (id) => set({ selectedId: id }),

  bringToFront: (id) => {
    const { items } = get();
    const maxZ = items.reduce((m, i) => Math.max(m, i.zIndex), 0);
    const newItems = items.map(i => i.id === id ? { ...i, zIndex: maxZ + 1 } : i);
    set({ items: newItems, ...saveHistory(get, newItems) });
  },

  sendToBack: (id) => {
    const { items } = get();
    const minZ = items.reduce((m, i) => Math.min(m, i.zIndex), 0);
    const newItems = items.map(i => i.id === id ? { ...i, zIndex: minZ - 1 } : i);
    set({ items: newItems, ...saveHistory(get, newItems) });
  },

  duplicateItem: (id) => {
    const { items } = get();
    const original = items.find(i => i.id === id);
    if (!original) return;
    const maxZ = items.reduce((m, i) => Math.max(m, i.zIndex), 0);
    const copy: TableItem = {
      ...original,
      id: uuidv4(),
      x: original.x + 20,
      y: original.y + 20,
      zIndex: maxZ + 1,
    };
    const newItems = [...items, copy];
    set({ items: newItems, selectedId: copy.id, ...saveHistory(get, newItems) });
  },

  flipItem: (id) => {
    const { items } = get();
    const newItems = items.map(i => i.id === id ? { ...i, flipped: !i.flipped } : i);
    set({ items: newItems });
  },

  clearTable: () => {
    set({ items: [], selectedId: null, ...saveHistory(get, []) });
    get().addToast('Table cleared', 'info');
  },

  randomize: () => {
    const { LOGOS } = require('@/lib/logoData');
    const TABLE_W = 900;
    const TABLE_H = 500;
    const count = 8 + Math.floor(Math.random() * 7);
    const shuffled = [...LOGOS].sort(() => Math.random() - 0.5).slice(0, count);
    const newItems: TableItem[] = shuffled.map((logo: LogoItem, i: number) => {
      const size = 80 + Math.random() * 90;
      return {
        id: uuidv4(),
        logoId: logo.id,
        name: logo.name,
        emoji: logo.emoji,
        color: logo.color,
        bg: logo.bg,
        x: 30 + Math.random() * (TABLE_W - size - 60),
        y: 30 + Math.random() * (TABLE_H - size - 60),
        width: size,
        height: size,
        rotation: (Math.random() - 0.5) * 40,
        zIndex: i,
        opacity: 0.85 + Math.random() * 0.15,
        flipped: Math.random() > 0.8,
      };
    });
    set({ items: newItems, selectedId: null, ...saveHistory(get, newItems) });
    get().addToast('🎲 Random design generated!', 'success');
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({ items: JSON.parse(JSON.stringify(history[newIndex].items)), historyIndex: newIndex, selectedId: null });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({ items: JSON.parse(JSON.stringify(history[newIndex].items)), historyIndex: newIndex });
  },

  setZoom: (zoom) => set({ zoom: Math.max(0.3, Math.min(2, zoom)) }),

  setShowGallery: (show) => set({ showGallery: show }),

  addToast: (message, type = 'success') => {
    const id = uuidv4();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 3000);
  },

  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  loadDesign: (items) => {
    set({ items: JSON.parse(JSON.stringify(items)), selectedId: null, ...saveHistory(get, items) });
    get().addToast('Design loaded!', 'success');
  },
}));
