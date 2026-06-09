'use client';
import { useTableStore } from '@/store/tableStore';

export default function ItemProperties() {
  const { items, selectedId, updateItem, removeItem, duplicateItem, bringToFront, sendToBack, flipItem } = useTableStore();
  const item = items.find(i => i.id === selectedId);

  if (!item) return (
    <div className="p-4 text-center text-gray-600 text-sm">
      <div className="text-3xl mb-2 opacity-40">👆</div>
      <p>Click an item to edit it</p>
    </div>
  );

  return (
    <div className="p-3 space-y-4 text-sm slide-up">
      {/* Preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
          style={{ background: item.bg, borderColor: item.color + '66' }}
        >
          {item.emoji}
        </div>
        <div>
          <div className="font-semibold text-white truncate max-w-[140px]">{item.name}</div>
          <div className="text-gray-500 text-xs capitalize">{item.logoId}</div>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Size</label>
        <input
          type="range"
          min={40} max={300}
          value={Math.round(item.width)}
          onChange={e => {
            const s = Number(e.target.value);
            updateItem(item.id, { width: s, height: s });
          }}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(item.width)}px</div>
      </div>

      {/* Rotation */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Rotation</label>
        <input
          type="range"
          min={-180} max={180}
          value={Math.round(item.rotation)}
          onChange={e => updateItem(item.id, { rotation: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(item.rotation)}°</div>
      </div>

      {/* Opacity */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Opacity</label>
        <input
          type="range"
          min={0.1} max={1} step={0.05}
          value={item.opacity}
          onChange={e => updateItem(item.id, { opacity: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(item.opacity * 100)}%</div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5">
        <ActionBtn onClick={() => bringToFront(item.id)}>⬆ Front</ActionBtn>
        <ActionBtn onClick={() => sendToBack(item.id)}>⬇ Back</ActionBtn>
        <ActionBtn onClick={() => duplicateItem(item.id)}>⧉ Copy</ActionBtn>
        <ActionBtn onClick={() => flipItem(item.id)}>⇄ Flip</ActionBtn>
        <ActionBtn onClick={() => removeItem(item.id)} danger>🗑 Delete</ActionBtn>
        <ActionBtn onClick={() => updateItem(item.id, { rotation: 0 })}>⊕ Reset rot</ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, danger }: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-1.5 rounded-lg text-xs font-medium transition-all
        ${danger
          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
          : 'bg-white/8 text-gray-300 hover:bg-white/15'
        }`}
    >
      {children}
    </button>
  );
}
