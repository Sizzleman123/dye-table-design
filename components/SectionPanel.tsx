'use client';
import { useTableStore } from '@/store/tableStore';
import { getLayout } from '@/lib/tableLayout';

export default function SectionPanel() {
  const layoutId = useTableStore(s => s.layoutId);
  const selectedSectionId = useTableStore(s => s.selectedSectionId);
  const sections = useTableStore(s => s.sections);
  const updateFill = useTableStore(s => s.updateFill);
  const clearSection = useTableStore(s => s.clearSection);

  const SECTIONS = getLayout(layoutId).sections;
  const filledCount = SECTIONS.filter(sec => sections[sec.id]).length;

  if (!selectedSectionId) {
    return (
      <div className="p-4 text-center text-gray-600 text-sm">
        <div className="text-3xl mb-2 opacity-40">👆</div>
        <p>Click a section on the table to customize it</p>
        <div className="mt-6 text-xs text-gray-500">
          {filledCount}/{SECTIONS.length} sections filled
        </div>
      </div>
    );
  }

  const fill = sections[selectedSectionId];

  if (!fill) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm slide-up">
        <div className="text-3xl mb-2 opacity-50">🎨</div>
        <p className="text-yellow-300 font-medium">Empty section selected</p>
        <p className="mt-1 text-gray-500">Search on the left and click a design to paint it in</p>
        <div className="mt-6 text-xs text-gray-600">
          {filledCount}/{SECTIONS.length} sections filled
        </div>
      </div>
    );
  }

  const logo = fill.logo;

  return (
    <div className="p-3 space-y-4 text-sm slide-up">
      {/* Preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 overflow-hidden flex-shrink-0"
          style={{ background: fill.inverted ? logo.color : logo.bg }}
        >
          {logo.img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.img} alt={logo.name} className="w-10 h-10 object-contain" />
          ) : logo.letters ? (
            <span className="font-black text-lg" style={{ color: fill.inverted ? logo.bg : logo.color, fontFamily: 'Georgia, serif' }}>
              {logo.letters}
            </span>
          ) : (
            <span className="text-2xl">{logo.emoji ?? '🎨'}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-white truncate">{logo.name}</div>
          <div className="text-gray-500 text-xs">in this section</div>
        </div>
      </div>

      {/* Scale */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Scale</label>
        <input
          type="range"
          min={0.4} max={2.5} step={0.05}
          value={fill.scale}
          onChange={e => updateFill(selectedSectionId, { scale: Number(e.target.value) })}
          onMouseUp={() => updateFill(selectedSectionId, {}, true)}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(fill.scale * 100)}%</div>
      </div>

      {/* Rotation */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Rotation</label>
        <input
          type="range"
          min={-180} max={180}
          value={Math.round(fill.rotation)}
          onChange={e => updateFill(selectedSectionId, { rotation: Number(e.target.value) })}
          onMouseUp={() => updateFill(selectedSectionId, {}, true)}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(fill.rotation)}°</div>
      </div>

      <p className="text-xs text-gray-600">💡 Drag inside the section to reposition the design</p>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5">
        {logo.img && (
          <button
            onClick={() => updateFill(selectedSectionId, { logo: { ...logo, cover: !logo.cover } }, true)}
            className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
              logo.cover ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/8 text-gray-300 hover:bg-white/15'
            }`}
          >
            ⛶ {logo.cover ? 'Fit logo' : 'Fill section'}
          </button>
        )}
        <button
          onClick={() => updateFill(selectedSectionId, { inverted: !fill.inverted }, true)}
          className="py-1.5 rounded-lg text-xs font-medium bg-white/8 text-gray-300 hover:bg-white/15 transition-all"
        >
          🎨 Swap colors
        </button>
        <button
          onClick={() => updateFill(selectedSectionId, { scale: 1, rotation: 0, offsetX: 0, offsetY: 0 }, true)}
          className="py-1.5 rounded-lg text-xs font-medium bg-white/8 text-gray-300 hover:bg-white/15 transition-all"
        >
          ⊕ Reset
        </button>
        <button
          onClick={() => clearSection(selectedSectionId)}
          className="py-1.5 rounded-lg text-xs font-medium bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all"
        >
          🗑 Clear
        </button>
      </div>

      <div className="pt-2 border-t border-white/10 text-xs text-gray-600 text-center">
        {filledCount}/{SECTIONS.length} sections filled
      </div>
    </div>
  );
}
