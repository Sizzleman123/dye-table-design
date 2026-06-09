'use client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { LOGOS, LogoItem } from '@/lib/logoData';
import { SECTIONS } from '@/lib/tableLayout';

export interface SectionFill {
  logoId: string;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  inverted: boolean; // swap bold color background <-> light background
}

export type SectionsState = Record<string, SectionFill | null>;

interface TableStore {
  sections: SectionsState;
  selectedSectionId: string | null;
  history: SectionsState[];
  historyIndex: number;
  toasts: { id: string; message: string; type: 'success' | 'info' }[];

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
  loadDesign: (sections: SectionsState) => void;
}

function emptySections(): SectionsState {
  const s: SectionsState = {};
  SECTIONS.forEach(sec => { s[sec.id] = null; });
  return s;
}

function clone(s: SectionsState): SectionsState {
  return JSON.parse(JSON.stringify(s));
}

function pushHistory(get: () => TableStore, sections: SectionsState) {
  const { history, historyIndex } = get();
  const next = history.slice(0, historyIndex + 1);
  next.push(clone(sections));
  return { history: next.slice(-40), historyIndex: Math.min(next.length - 1, 39) };
}

export const useTableStore = create<TableStore>((set, get) => ({
  sections: emptySections(),
  selectedSectionId: null,
  history: [emptySections()],
  historyIndex: 0,
  toasts: [],

  selectSection: (id) => set({ selectedSectionId: id }),

  fillSection: (sectionId, logo) => {
    const sections = clone(get().sections);
    sections[sectionId] = {
      logoId: logo.id,
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      inverted: false,
    };
    set({ sections, ...pushHistory(get, sections) });
    get().addToast(`${logo.name} painted in!`, 'success');
  },

  clearSection: (sectionId) => {
    const sections = clone(get().sections);
    sections[sectionId] = null;
    set({ sections, ...pushHistory(get, sections) });
  },

  updateFill: (sectionId, updates, commit = false) => {
    const sections = clone(get().sections);
    const fill = sections[sectionId];
    if (!fill) return;
    sections[sectionId] = { ...fill, ...updates };
    if (commit) {
      set({ sections, ...pushHistory(get, sections) });
    } else {
      set({ sections });
    }
  },

  randomize: () => {
    const sections: SectionsState = {};
    // Shuffle the full logo list so neighbours differ; reuse if more
    // sections than logos.
    const shuffled = [...LOGOS].sort(() => Math.random() - 0.5);
    SECTIONS.forEach((sec, i) => {
      const logo = shuffled[i % shuffled.length];
      sections[sec.id] = {
        logoId: logo.id,
        scale: 1,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        inverted: Math.random() > 0.5,
      };
    });
    set({ sections, selectedSectionId: null, ...pushHistory(get, sections) });
    get().addToast('🎲 Fresh table generated!', 'success');
  },

  clearAll: () => {
    const sections = emptySections();
    set({ sections, selectedSectionId: null, ...pushHistory(get, sections) });
    get().addToast('Table cleared', 'info');
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    set({ sections: clone(history[idx]), historyIndex: idx });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    set({ sections: clone(history[idx]), historyIndex: idx });
  },

  addToast: (message, type = 'success') => {
    const id = uuidv4();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 2500);
  },

  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  loadDesign: (sections) => {
    const base = emptySections();
    Object.keys(base).forEach(k => {
      if (sections[k]) base[k] = sections[k];
    });
    set({ sections: base, selectedSectionId: null, ...pushHistory(get, base) });
    get().addToast('Design loaded!', 'success');
  },
}));
