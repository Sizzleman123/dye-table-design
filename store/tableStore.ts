'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { LOGOS, LogoItem } from '@/lib/logoData';
import { getLayout, LAYOUTS } from '@/lib/tableLayout';

export interface SectionFill {
  logoId: string;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  inverted: boolean; // light panel <-> bold brand-color panel
}

export type SectionsState = Record<string, SectionFill | null>;

interface Snapshot {
  layoutId: string;
  sections: SectionsState;
}

interface TableStore {
  layoutId: string;
  sections: SectionsState;
  selectedSectionId: string | null;
  history: Snapshot[];
  historyIndex: number;
  toasts: { id: string; message: string; type: 'success' | 'info' }[];

  setLayout: (layoutId: string) => void;
  selectSection: (id: string | null) => void;
  fillSection: (sectionId: string, logo: LogoItem) => void;
  clearSection: (sectionId: string) => void;
  updateFill: (sectionId: string, updates: Partial<SectionFill>, commit?: boolean) => void;
  randomize: () => void;
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
  addToast: (message: string, type?: 'success' | 'info') => void;
  removeToast: (id: string) => void;
  loadDesign: (layoutId: string, sections: SectionsState) => void;
}

function emptySections(layoutId: string): SectionsState {
  const s: SectionsState = {};
  getLayout(layoutId).sections.forEach(sec => { s[sec.id] = null; });
  return s;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function pushHistory(get: () => TableStore, layoutId: string, sections: SectionsState) {
  const { history, historyIndex } = get();
  const next = history.slice(0, historyIndex + 1);
  next.push({ layoutId, sections: clone(sections) });
  return { history: next.slice(-40), historyIndex: Math.min(next.length - 1, 39) };
}

const DEFAULT_LAYOUT = LAYOUTS[0].id;

export const useTableStore = create<TableStore>((set, get) => ({
  layoutId: DEFAULT_LAYOUT,
  sections: emptySections(DEFAULT_LAYOUT),
  selectedSectionId: null,
  history: [{ layoutId: DEFAULT_LAYOUT, sections: emptySections(DEFAULT_LAYOUT) }],
  historyIndex: 0,
  toasts: [],

  setLayout: (layoutId) => {
    if (layoutId === get().layoutId) return;
    const sections = emptySections(layoutId);
    set({
      layoutId,
      sections,
      selectedSectionId: null,
      ...pushHistory(get, layoutId, sections),
    });
    get().addToast(`Switched to ${getLayout(layoutId).name} layout`, 'info');
  },

  selectSection: (id) => set({ selectedSectionId: id }),

  fillSection: (sectionId, logo) => {
    const { layoutId } = get();
    const sections = clone(get().sections);
    sections[sectionId] = {
      logoId: logo.id,
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      inverted: false,
    };
    set({ sections, ...pushHistory(get, layoutId, sections) });
    get().addToast(`${logo.name} painted in!`, 'success');
  },

  clearSection: (sectionId) => {
    const { layoutId } = get();
    const sections = clone(get().sections);
    sections[sectionId] = null;
    set({ sections, ...pushHistory(get, layoutId, sections) });
  },

  updateFill: (sectionId, updates, commit = false) => {
    const { layoutId } = get();
    const sections = clone(get().sections);
    const fill = sections[sectionId];
    if (!fill) return;
    sections[sectionId] = { ...fill, ...updates };
    if (commit) {
      set({ sections, ...pushHistory(get, layoutId, sections) });
    } else {
      set({ sections });
    }
  },

  randomize: () => {
    const { layoutId } = get();
    const layout = getLayout(layoutId);
    const sections: SectionsState = {};
    const shuffled = [...LOGOS].sort(() => Math.random() - 0.5);
    layout.sections.forEach((sec, i) => {
      const logo = shuffled[i % shuffled.length];
      sections[sec.id] = {
        logoId: logo.id,
        scale: 1,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        inverted: false,
      };
    });
    set({ sections, selectedSectionId: null, ...pushHistory(get, layoutId, sections) });
    get().addToast('🎲 Fresh table generated!', 'success');
  },

  clearAll: () => {
    const { layoutId } = get();
    const sections = emptySections(layoutId);
    set({ sections, selectedSectionId: null, ...pushHistory(get, layoutId, sections) });
    get().addToast('Table cleared', 'info');
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    const snap = history[idx];
    set({ layoutId: snap.layoutId, sections: clone(snap.sections), historyIndex: idx });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    const snap = history[idx];
    set({ layoutId: snap.layoutId, sections: clone(snap.sections), historyIndex: idx });
  },

  addToast: (message, type = 'success') => {
    const id = uuidv4();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 2500);
  },

  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  loadDesign: (layoutId, sections) => {
    const base = emptySections(layoutId);
    Object.keys(base).forEach(k => {
      if (sections[k]) base[k] = sections[k];
    });
    set({
      layoutId,
      sections: base,
      selectedSectionId: null,
      ...pushHistory(get, layoutId, base),
    });
    get().addToast('Design loaded!', 'success');
  },
}));
