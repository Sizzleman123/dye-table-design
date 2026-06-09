// Live logo search: aggregates the curated set with two free, key-less,
// CORS-enabled sources so users can search almost anything:
//  - Clearbit Autocomplete: any company/brand -> transparent logo PNG
//  - Wikipedia page images: teams, events, orgs, frats, everything else
// Results are cached in memory and localStorage for instant repeat searches.

import { LOGOS, LogoItem } from './logoData';

export interface LogoResult {
  id: string;
  name: string;
  img?: string;
  letters?: string;
  emoji?: string;
  color: string;
  bg: string;
  cover?: boolean;
  source: 'curated' | 'brand' | 'wiki';
}

export function curatedToResult(l: LogoItem): LogoResult {
  return {
    id: l.id,
    name: l.name,
    img: l.img,
    letters: l.letters,
    emoji: l.emoji,
    color: l.color,
    bg: l.bg,
    cover: l.cover,
    source: 'curated',
  };
}

export function searchCurated(query: string): LogoResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return LOGOS
    .filter(l => l.name.toLowerCase().includes(q) || l.tags.some(t => t.includes(q)))
    .map(curatedToResult);
}

// ── Remote sources ──────────────────────────────────────────────────

async function searchClearbit(query: string, signal: AbortSignal): Promise<LogoResult[]> {
  const res = await fetch(
    `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`,
    { signal }
  );
  if (!res.ok) return [];
  const data: { name: string; domain: string; logo: string }[] = await res.json();
  return data.map(c => ({
    id: `brand-${c.domain}`,
    name: c.name,
    img: `${c.logo}?size=256`,
    color: '#1a1a1a',
    bg: '#ffffff',
    source: 'brand' as const,
  }));
}

async function searchWikipedia(query: string, signal: AbortSignal): Promise<LogoResult[]> {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*' +
    '&generator=search&gsrlimit=10&gsrnamespace=0' +
    `&gsrsearch=${encodeURIComponent(query)}` +
    '&prop=pageimages&piprop=thumbnail&pithumbsize=400';
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  return Object.values(pages as Record<string, {
    pageid: number; title: string; index: number;
    thumbnail?: { source: string };
  }>)
    .filter(p => p.thumbnail?.source)
    .sort((a, b) => a.index - b.index)
    .map(p => ({
      id: `wiki-${p.pageid}`,
      name: p.title,
      img: p.thumbnail!.source,
      color: '#1a1a1a',
      bg: '#ffffff',
      source: 'wiki' as const,
    }));
}

// ── Cache ───────────────────────────────────────────────────────────

const memCache = new Map<string, LogoResult[]>();
const LS_KEY = 'die-table-logo-cache-v1';
const LS_MAX_ENTRIES = 60;

function readLS(): Record<string, { t: number; r: LogoResult[] }> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeLS(key: string, results: LogoResult[]) {
  try {
    const cache = readLS();
    cache[key] = { t: Date.now(), r: results };
    const keys = Object.keys(cache);
    if (keys.length > LS_MAX_ENTRIES) {
      keys.sort((a, b) => cache[a].t - cache[b].t)
        .slice(0, keys.length - LS_MAX_ENTRIES)
        .forEach(k => delete cache[k]);
    }
    localStorage.setItem(LS_KEY, JSON.stringify(cache));
  } catch {
    // storage full / unavailable — skip persistence
  }
}

/**
 * Search remote sources. Curated results are synchronous via
 * searchCurated(); call this for the web results to append.
 */
export async function searchRemote(query: string, signal: AbortSignal): Promise<LogoResult[]> {
  const key = query.toLowerCase().trim();
  if (!key) return [];

  const cached = memCache.get(key);
  if (cached) return cached;
  const ls = readLS()[key];
  if (ls) {
    memCache.set(key, ls.r);
    return ls.r;
  }

  const [brand, wiki] = await Promise.allSettled([
    searchClearbit(query, signal),
    searchWikipedia(query, signal),
  ]);
  const brandResults = brand.status === 'fulfilled' ? brand.value : [];
  const wikiResults = wiki.status === 'fulfilled' ? wiki.value : [];

  // Brands first (transparent PNGs), then Wikipedia; dedupe by image URL
  const seen = new Set<string>();
  const results = [...brandResults, ...wikiResults].filter(r => {
    if (!r.img || seen.has(r.img)) return false;
    seen.add(r.img);
    return true;
  }).slice(0, 24);

  if (results.length) {
    memCache.set(key, results);
    writeLS(key, results);
  }
  return results;
}
