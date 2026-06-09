'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { searchLogos, CATEGORIES, LogoItem } from '@/lib/logoData';
import { useTableStore } from '@/store/tableStore';
import { getLayout } from '@/lib/tableLayout';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const layoutId = useTableStore(s => s.layoutId);
  const selectedSectionId = useTableStore(s => s.selectedSectionId);
  const fillSection = useTableStore(s => s.fillSection);
  const selectSection = useTableStore(s => s.selectSection);
  const sections = useTableStore(s => s.sections);
  const addToast = useTableStore(s => s.addToast);

  const results = useMemo(() => searchLogos(query, category), [query, category]);

  useEffect(() => {
    if (selectedSectionId) inputRef.current?.focus();
  }, [selectedSectionId]);

  const handlePick = (logo: LogoItem) => {
    const layout = getLayout(layoutId);
    let target = selectedSectionId;
    if (!target) {
      const empty = layout.sections.find(sec => !sections[sec.id]);
      if (!empty) {
        addToast('Click a section on the table first', 'info');
        return;
      }
      target = empty.id;
    }
    fillSection(target, logo);
    const next = layout.sections.find(sec => !useTableStore.getState().sections[sec.id]);
    selectSection(next ? next.id : null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`px-3 py-2 text-xs font-medium border-b border-white/10 ${
        selectedSectionId ? 'text-yellow-300 bg-yellow-500/10' : 'text-gray-500'
      }`}>
        {selectedSectionId
          ? '▸ Section selected — pick its design'
          : 'Click a table section to start'}
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search logos, brands..."
            className="w-full bg-white/10 border border-white/15 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 p-2 overflow-x-auto border-b border-white/10 flex-shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              category === cat.id
                ? 'bg-yellow-400 text-black'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {results.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-sm">
            <div className="text-3xl mb-2">🔍</div>
            No results found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {results.map(logo => (
              <LogoThumb key={logo.id} logo={logo} onPick={handlePick} />
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-white/10 text-xs text-gray-500 text-center">
        {results.length} designs · click to paint section
      </div>
    </div>
  );
}

function LogoThumb({ logo, onPick }: { logo: LogoItem; onPick: (logo: LogoItem) => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = logo.img && !imgFailed;

  return (
    <button
      className="logo-card flex flex-col items-center justify-center gap-1 rounded-xl p-2 border border-white/10 bg-white/5 hover:bg-white/10 select-none w-full"
      onClick={() => onPick(logo)}
      title={logo.name}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md overflow-hidden"
        style={{ background: logo.bg }}
      >
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.img}
            alt={logo.name}
            className="w-10 h-10 object-contain"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : logo.letters ? (
          <span className="font-black text-lg" style={{ color: logo.color, fontFamily: 'Georgia, serif' }}>
            {logo.letters}
          </span>
        ) : (
          <span className="text-2xl">{logo.emoji ?? '🎨'}</span>
        )}
      </div>
      <span className="text-xs text-gray-300 text-center leading-tight truncate w-full px-1">
        {logo.name}
      </span>
    </button>
  );
}
