'use client';
import { useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTableStore } from '@/store/tableStore';
import SearchPanel from '@/components/SearchPanel';
import Toolbar from '@/components/Toolbar';
import ItemProperties from '@/components/ItemProperties';
import ToastContainer from '@/components/ToastContainer';

// Dynamically import heavy canvas component
const TableCanvas = dynamic(() => import('@/components/TableCanvas'), { ssr: false });
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false });

export default function Home() {
  const { showGallery, setShowGallery, items, randomize, addToast } = useTableStore();
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Load design from URL hash on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const design = params.get('design');
    if (design) {
      try {
        const data = JSON.parse(atob(design));
        useTableStore.getState().loadDesign(data);
      } catch {
        // ignore invalid
      }
    }
  }, []);

  // File import for saved designs
  const importDesign = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          useTableStore.getState().loadDesign(data);
        } catch {
          addToast('Invalid file', 'info');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [addToast]);

  // Screenshot export using html2canvas-like approach
  const handleExport = useCallback(async () => {
    const tableEl = document.querySelector('[data-export]') as HTMLElement;
    if (!tableEl) {
      addToast('Export not available', 'info');
      return;
    }
    try {
      const { default: html2canvas } = await import('html2canvas');
      const c = await html2canvas(tableEl, { background: '#b8803a', scale: 2 } as Parameters<typeof html2canvas>[1]);
      const link = document.createElement('a');
      link.download = 'die-table.png';
      link.href = c.toDataURL('image/png');
      link.click();
      addToast('Exported as PNG!', 'success');
    } catch {
      addToast('Export failed — try screenshot instead', 'info');
    }
  }, [addToast]);

  return (
    <div className="flex flex-col h-full bg-[#111] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">Die Table Designer</h1>
            <p className="text-xs text-gray-500 leading-none mt-0.5">Build your perfect table</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setShowGallery(true)}
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            🖼 Gallery
          </button>
          <button
            onClick={importDesign}
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            📂 Import
          </button>
          <button
            onClick={randomize}
            className="px-4 py-1.5 text-sm font-semibold bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-all shadow"
          >
            🎲 Randomize
          </button>
        </nav>
      </header>

      {/* Toolbar */}
      <Toolbar onExport={handleExport} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: search panel */}
        <aside className="w-56 flex-shrink-0 border-r border-white/10 flex flex-col bg-[#161616] overflow-hidden">
          <div className="px-3 pt-3 pb-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add Items</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <SearchPanel />
          </div>
        </aside>

        {/* Center: canvas */}
        <main ref={canvasAreaRef} className="flex-1 overflow-hidden flex flex-col">
          <TableCanvas />
        </main>

        {/* Right: properties */}
        <aside className="w-52 flex-shrink-0 border-l border-white/10 bg-[#161616] overflow-y-auto">
          <div className="px-3 pt-3 pb-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Properties</h2>
          </div>
          <ItemProperties />

          {/* Stats */}
          <div className="mt-4 px-3 py-3 border-t border-white/10">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Items on table</span>
                <span className="text-white font-medium">{items.length}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="px-3 py-3 mt-2 border-t border-white/10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tips</h3>
            <div className="text-xs text-gray-600 space-y-1.5">
              <div>🖱 Drag to move</div>
              <div>↻ Blue dot = rotate</div>
              <div>◼ Yellow dots = resize</div>
              <div>⌘Z / ⌘⇧Z undo/redo</div>
              <div>⌘D duplicate</div>
              <div>Del key = delete</div>
              <div>Scroll+⌘ = zoom</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Gallery overlay */}
      {showGallery && <Gallery />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
