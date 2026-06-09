'use client';
import { useState, useMemo } from 'react';
import { searchLogos, CATEGORIES } from '@/lib/logoData';
import LogoTile from './LogoTile';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => searchLogos(query, category), [query, category]);

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
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

      {/* Category filter */}
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

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-2">
        {results.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-sm">
            <div className="text-3xl mb-2">🔍</div>
            No results found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {results.map(logo => (
              <LogoTile key={logo.id} logo={logo} />
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      <div className="p-2 border-t border-white/10 text-xs text-gray-500 text-center">
        {results.length} items · click to add
      </div>
    </div>
  );
}
