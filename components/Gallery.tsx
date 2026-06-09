'use client';
import { useTableStore, TableItem } from '@/store/tableStore';
import { LOGOS } from '@/lib/logoData';
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';

const TABLE_W = 900;
const TABLE_H = 500;

// Generate 24 gallery designs with different themes
const GALLERY_THEMES = [
  { name: 'College Party', logos: ['busch-light', 'natty-light', 'ohio-state', 'sigma-chi', 'dice', 'beer-mug', 'party', 'usa'] },
  { name: 'West Coast Vibes', logos: ['coors-light', 'corona', 'padres', 'california', 'wave', 'patagonia', 'hydro-flask', 'sun'] },
  { name: 'Tailgate Season', logos: ['bud-light', 'chiefs', 'cowboys', 'budweiser', 'flame', 'crown', 'steelers', 'beer-mug'] },
  { name: 'Frat House', logos: ['pbr', 'pike', 'phi-delt', 'kappa-sigma', 'dice', 'skull-crossbones', 'lightning-bolt', 'party'] },
  { name: 'Outdoors & Chill', logos: ['busch-light', 'yeti', 'north-face', 'realtree', 'bass-pro', 'mountain', 'anchor', 'patagonia'] },
  { name: 'Sports Fan', logos: ['miller-lite', 'lakers', 'yankees', 'patriots', 'warriors', 'cubs', 'crown', 'lightning-bolt'] },
  { name: 'American Classic', logos: ['budweiser', 'usa', 'cowboys', 'yuengling', 'skull-crossbones', 'anchor', 'flame', 'rolling-rock'] },
  { name: 'Energy Rush', logos: ['red-bull', 'monster', 'bang', 'celsius', 'ghost', 'lightning-bolt', 'flame', 'crown'] },
  { name: 'Tropical Party', logos: ['corona', 'modelo', 'dos-equis', 'mexico', 'wave', 'sun', 'beer-mug', 'party'] },
  { name: 'Greek Life', logos: ['sigma-chi', 'ato', 'beta', 'delt', 'sig-ep', 'theta-chi', 'lambda-chi', 'dice'] },
  { name: 'SEC Football', logos: ['alabama', 'georgia', 'lsu', 'florida', 'busch-light', 'bud-light', 'flame', 'crown'] },
  { name: 'San Diego Summer', logos: ['padres', 'sdsu', 'coors-light', 'white-claw', 'california', 'wave', 'sun', 'yeti'] },
  { name: 'Hunting Camp', logos: ['busch-light', 'mossy-oak', 'realtree', 'duck-dynasty', 'bass-pro', 'anchor', 'mountain', 'flame'] },
  { name: 'Big Ten Party', logos: ['ohio-state', 'michigan', 'penn-state', 'miller-lite', 'pbr', 'sigma-chi', 'dice', 'beer-mug'] },
  { name: 'Boston Nights', logos: ['red-sox', 'celtics', 'patriots', 'yuengling', 'beer-mug', 'skull-crossbones', 'usa', 'anchor'] },
  { name: 'LA Scene', logos: ['lakers', 'dodgers', 'modelo', 'corona', 'california', 'sun', 'wave', 'crown'] },
  { name: 'Classic Sesh', logos: ['pbr', 'rolling-rock', 'miller-lite', 'bud-light', 'dice', 'anchor', 'skull-crossbones', 'beer-mug'] },
  { name: 'Patriot Party', logos: ['usa', 'budweiser', 'bud-light', 'miller-lite', 'cowboys', 'flame', 'crown', 'lightning-bolt'] },
  { name: 'Adventure Bros', logos: ['north-face', 'patagonia', 'rei', 'yeti', 'hydro-flask', 'mountain', 'wave', 'busch-light'] },
  { name: 'Die Hard Fan', logos: ['bears', 'bulls', 'cubs', 'miller-lite', 'pbr', 'sigma-chi', 'flame', 'crown'] },
  { name: 'Seltzer Summer', logos: ['white-claw', 'truly', 'coors-light', 'wave', 'sun', 'party', 'rainbow', 'beach'] },
  { name: 'Rocky Mountain', logos: ['coors-light', 'broncos', 'nuggets', 'colorado', 'mountain', 'north-face', 'yeti', 'busch-light'] },
  { name: 'Night Out', logos: ['red-bull', 'crown', 'moon', 'lightning-bolt', 'party', 'skull-crossbones', 'infinity', 'ghost'] },
  { name: 'Backyard BBQ', logos: ['bud-light', 'budweiser', 'miller-lite', 'flame', 'usa', 'anchor', 'dice', 'beer-mug'] },
];

function generateDesignItems(logoIds: string[]): TableItem[] {
  const items: TableItem[] = [];
  const usedLogos = logoIds.filter(id => LOGOS.find(l => l.id === id));

  usedLogos.forEach((logoId, i) => {
    const logo = LOGOS.find(l => l.id === logoId);
    if (!logo) return;
    const size = 70 + Math.random() * 70;
    const x = 20 + (i % 4) * (TABLE_W / 4) + (Math.random() - 0.5) * 60;
    const y = 20 + Math.floor(i / 4) * (TABLE_H / 2.2) + (Math.random() - 0.5) * 40;
    items.push({
      id: uuidv4(),
      logoId: logo.id,
      name: logo.name,
      emoji: logo.emoji,
      color: logo.color,
      bg: logo.bg,
      x: Math.max(10, Math.min(TABLE_W - size - 10, x)),
      y: Math.max(10, Math.min(TABLE_H - size - 10, y)),
      width: size,
      height: size,
      rotation: (Math.random() - 0.5) * 35,
      zIndex: i,
      opacity: 0.88 + Math.random() * 0.12,
      flipped: Math.random() > 0.85,
    });
  });
  return items;
}

export default function Gallery() {
  const { setShowGallery, loadDesign } = useTableStore();

  const designs = useMemo(() =>
    GALLERY_THEMES.map(theme => ({
      ...theme,
      items: generateDesignItems(theme.logos),
    })),
    []
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111]">
        <div>
          <h2 className="text-xl font-bold text-white">Inspiration Gallery</h2>
          <p className="text-gray-400 text-sm">Click any design to load it on your table</p>
        </div>
        <button
          onClick={() => setShowGallery(false)}
          className="text-gray-400 hover:text-white text-2xl transition-colors px-2"
        >
          ✕
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {designs.map((design, idx) => (
            <GalleryCard
              key={idx}
              design={design}
              onLoad={() => {
                loadDesign(design.items);
                setShowGallery(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryCard({
  design,
  onLoad,
}: {
  design: { name: string; items: TableItem[] };
  onLoad: () => void;
}) {
  const previewItems = design.items.slice(0, 6);

  return (
    <button
      className="gallery-card text-left rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a] group"
      onClick={onLoad}
    >
      {/* Mini preview */}
      <div
        className="relative h-28 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(155deg, #c89540 0%, #a86525 60%, #b07030 100%)`,
        }}
      >
        {previewItems.map((item, i) => {
          const scale = 0.25;
          return (
            <div
              key={i}
              className="absolute flex items-center justify-center rounded-lg text-sm border"
              style={{
                left: item.x * scale,
                top: item.y * scale,
                width: item.width * scale,
                height: item.height * scale,
                transform: `rotate(${item.rotation}deg)`,
                background: item.bg,
                borderColor: item.color + '55',
                fontSize: item.width * scale * 0.45,
                opacity: item.opacity,
              }}
            >
              {item.emoji}
            </div>
          );
        })}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Load Design
          </span>
        </div>
      </div>

      {/* Name */}
      <div className="px-3 py-2">
        <div className="font-semibold text-white text-sm">{design.name}</div>
        <div className="text-gray-500 text-xs">{design.items.length} items</div>
      </div>
    </button>
  );
}
