'use client';
import { useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTableStore } from '@/store/tableStore';
import { TABLE_W, TABLE_H } from '@/lib/tableLayout';
import SearchPanel from '@/components/SearchPanel';
import SectionPanel from '@/components/SectionPanel';
import ToastContainer from '@/components/ToastContainer';

const TableSVG = dynamic(() => import('@/components/TableSVG'), { ssr: false });

export default function Home() {
  const randomize = useTableStore(s => s.randomize);
  const clearAll = useTableStore(s => s.clearAll);
  const undo = useTableStore(s => s.undo);
  const redo = useTableStore(s => s.redo);
  const addToast = useTableStore(s => s.addToast);
  const historyIndex = useTableStore(s => s.historyIndex);
  const historyLength = useTableStore(s => s.history.length);

  // Load shared design from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const design = params.get('design');
    if (design) {
      try {
        useTableStore.getState().loadDesign(JSON.parse(atob(design)));
      } catch {
        // invalid share link — ignore
      }
    }
  }, []);

  const saveDesign = useCallback(() => {
    const data = JSON.stringify(useTableStore.getState().sections);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'die-table-design.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Design saved!', 'success');
  }, [addToast]);

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
          useTableStore.getState().loadDesign(JSON.parse(ev.target?.result as string));
        } catch {
          addToast('Invalid file', 'info');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [addToast]);

  const shareDesign = useCallback(() => {
    const data = btoa(JSON.stringify(useTableStore.getState().sections));
    const url = `${window.location.origin}${window.location.pathname}?design=${data}`;
    navigator.clipboard.writeText(url).then(
      () => addToast('Share link copied!', 'success'),
      () => addToast('Could not copy link', 'info'),
    );
  }, [addToast]);

  const exportPNG = useCallback(() => {
    const svg = document.getElementById('table-svg');
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = TABLE_W * scale;
      canvas.height = TABLE_H * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = 'die-table.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      addToast('Exported as PNG!', 'success');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      addToast('Export failed', 'info');
    };
    img.src = url;
  }, [addToast]);

  return (
    <div className="flex flex-col h-full bg-[#111] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">Die Table Designer</h1>
            <p className="text-xs text-gray-500 leading-none mt-0.5">Click a section · pick a design · build your table</p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5">
          <HeaderBtn onClick={undo} disabled={historyIndex <= 0} title="Undo (⌘Z)">↩</HeaderBtn>
          <HeaderBtn onClick={redo} disabled={historyIndex >= historyLength - 1} title="Redo (⌘⇧Z)">↪</HeaderBtn>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <HeaderBtn onClick={importDesign} title="Import design">📂 Import</HeaderBtn>
          <HeaderBtn onClick={saveDesign} title="Save design as file">💾 Save</HeaderBtn>
          <HeaderBtn onClick={shareDesign} title="Copy share link">🔗 Share</HeaderBtn>
          <HeaderBtn onClick={exportPNG} title="Export as image">📸 Export</HeaderBtn>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <HeaderBtn onClick={clearAll} title="Clear all sections">🗑 Clear</HeaderBtn>
          <button
            onClick={randomize}
            className="px-4 py-1.5 text-sm font-semibold bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition-all shadow"
          >
            🎲 Randomize
          </button>
        </nav>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: search */}
        <aside className="w-60 flex-shrink-0 border-r border-white/10 flex flex-col bg-[#161616] overflow-hidden">
          <SearchPanel />
        </aside>

        {/* Center: the table */}
        <main className="flex-1 overflow-hidden">
          <TableSVG />
        </main>

        {/* Right: section controls */}
        <aside className="w-52 flex-shrink-0 border-l border-white/10 bg-[#161616] overflow-y-auto">
          <div className="px-3 pt-3 pb-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section</h2>
          </div>
          <SectionPanel />
        </aside>
      </div>

      <ToastContainer />
    </div>
  );
}

function HeaderBtn({ children, onClick, disabled, title }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2.5 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap
        ${disabled ? 'opacity-30 cursor-not-allowed text-gray-500' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
    >
      {children}
    </button>
  );
}
