'use client';
import { useTableStore } from '@/store/tableStore';
import { useRef } from 'react';

interface Props {
  onExport: () => void;
}

export default function Toolbar({ onExport }: Props) {
  const {
    selectedId, items, zoom, history, historyIndex,
    undo, redo, clearTable, randomize, setZoom,
    duplicateItem, removeItem, bringToFront, sendToBack, flipItem,
    addToast,
  } = useTableStore();

  const selected = items.find(i => i.id === selectedId);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const saveDesign = () => {
    const data = JSON.stringify(items);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'die-table-design.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Design saved!', 'success');
  };

  const shareDesign = () => {
    const data = btoa(JSON.stringify(items));
    const url = `${window.location.origin}?design=${data}`;
    navigator.clipboard.writeText(url).then(() => {
      addToast('Share link copied!', 'success');
    });
  };

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-[#1a1a1a] border-b border-white/10 flex-wrap">
      {/* Left: undo/redo */}
      <div className="flex gap-1 items-center">
        <ToolBtn onClick={undo} disabled={!canUndo} title="Undo (⌘Z)">↩</ToolBtn>
        <ToolBtn onClick={redo} disabled={!canRedo} title="Redo (⌘⇧Z)">↪</ToolBtn>
      </div>

      <Divider />

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <ToolBtn onClick={() => setZoom(zoom - 0.15)} title="Zoom out">－</ToolBtn>
        <button
          className="px-2 py-1 text-xs text-gray-400 hover:text-white w-12 text-center"
          onClick={() => setZoom(1)}
          title="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <ToolBtn onClick={() => setZoom(zoom + 0.15)} title="Zoom in">＋</ToolBtn>
      </div>

      <Divider />

      {/* Selected item controls */}
      {selected ? (
        <>
          <ToolBtn onClick={() => bringToFront(selected.id)} title="Bring to front">⬆</ToolBtn>
          <ToolBtn onClick={() => sendToBack(selected.id)} title="Send to back">⬇</ToolBtn>
          <ToolBtn onClick={() => duplicateItem(selected.id)} title="Duplicate (⌘D)">⧉</ToolBtn>
          <ToolBtn onClick={() => flipItem(selected.id)} title="Flip">⇄</ToolBtn>
          <ToolBtn onClick={() => removeItem(selected.id)} title="Delete (Del)" danger>🗑</ToolBtn>
        </>
      ) : (
        <span className="text-xs text-gray-600 px-1">Select an item to edit</span>
      )}

      <div className="flex-1" />

      {/* Right: actions */}
      <ToolBtn onClick={randomize} accent title="Randomize (fills table)">🎲 Randomize</ToolBtn>
      <ToolBtn onClick={clearTable} title="Clear table">🗑 Clear</ToolBtn>

      <Divider />

      <ToolBtn onClick={onExport} title="Export as PNG">📸 Export</ToolBtn>
      <ToolBtn onClick={saveDesign} title="Save design as JSON">💾 Save</ToolBtn>
      <ToolBtn onClick={shareDesign} title="Copy share link">🔗 Share</ToolBtn>
    </div>
  );
}

function ToolBtn({
  children, onClick, disabled, title, danger, accent,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        ${danger ? 'text-red-400 hover:bg-red-900/30' : ''}
        ${accent ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : ''}
        ${!danger && !accent ? 'text-gray-300 hover:bg-white/10' : ''}
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-white/10 mx-1" />;
}
