// Five fixed beer die table presets. Lines never move — users fill sections.
// Generated layouts use a seeded irregular tessellation so every section is
// a different size and nothing repeats, like a real hand-painted table.

import { tessellate, Pt } from './tessellate';

export const TABLE_W = 1000;
export const TABLE_H = 500;

export interface Section {
  id: string;
  points: Pt[];
}

export interface Layout {
  id: string;
  name: string;
  description: string;
  sections: Section[];
  /** Optional painted base color for empty sections (instead of plywood) */
  baseColor?: string;
}

function toSections(prefix: string, polys: Pt[][]): Section[] {
  return polys.map((points, i) => ({ id: `${prefix}-${i}`, points }));
}

// ── 1. Old Glory ────────────────────────────────────────────────────
// Big American-flag panel top-left, irregular mix everywhere else.
const oldGlory: Section[] = [
  { id: 'og-flag', points: [[0, 0], [380, 0], [380, 300], [0, 300]] },
  ...toSections('og-b', tessellate({
    seed: 71, x0: 0, y0: 300, w: 380, h: 200, cols: 2, rows: 1, jitter: 0.6, mergeProb: 0.5,
  })),
  ...toSections('og-r', tessellate({
    seed: 42, x0: 380, y0: 0, w: 620, h: 500, cols: 3, rows: 2, jitter: 0.6, mergeProb: 0.65,
  })),
];

// ── 2. Frat Classic ─────────────────────────────────────────────────
// Dense collage, 20-30 random-sized sections.
const fratClassic: Section[] = toSections('fc', tessellate({
  seed: 1337, x0: 0, y0: 0, w: TABLE_W, h: TABLE_H, cols: 5, rows: 3, jitter: 0.55, mergeProb: 0.8,
}));

// ── 3. Golf Table ───────────────────────────────────────────────────
// Masters-green base, fewer + larger sections for big golf logos.
const golf: Section[] = toSections('gf', tessellate({
  seed: 1934, x0: 0, y0: 0, w: TABLE_W, h: TABLE_H, cols: 3, rows: 2, jitter: 0.5, mergeProb: 0.75,
}));

// ── 4. Americana ────────────────────────────────────────────────────
// Hand-laid: large diamond centerpiece, trapezoids and triangles around.
const americana: Section[] = [
  { id: 'am-center', points: [[340, 250], [500, 40], [660, 250], [500, 460]] },
  { id: 'am-tl1', points: [[0, 0], [250, 0], [340, 250]] },
  { id: 'am-tl2', points: [[0, 0], [340, 250], [0, 250]] },
  { id: 'am-t1', points: [[250, 0], [500, 0], [500, 40], [340, 250]] },
  { id: 'am-t2', points: [[500, 0], [750, 0], [660, 250], [500, 40]] },
  { id: 'am-tr', points: [[750, 0], [1000, 0], [1000, 250], [660, 250]] },
  { id: 'am-br1', points: [[660, 250], [1000, 250], [750, 500]] },
  { id: 'am-br2', points: [[1000, 250], [1000, 500], [750, 500]] },
  { id: 'am-b1', points: [[500, 460], [660, 250], [750, 500], [500, 500]] },
  { id: 'am-b2', points: [[340, 250], [500, 460], [500, 500], [250, 500]] },
  { id: 'am-bl', points: [[0, 250], [340, 250], [250, 500], [0, 500]] },
];

// ── 5. Chaos ────────────────────────────────────────────────────────
// Lots of small irregular shapes, hand-painted vibe.
const chaos: Section[] = toSections('ch', tessellate({
  seed: 666, x0: 0, y0: 0, w: TABLE_W, h: TABLE_H, cols: 6, rows: 3, jitter: 0.65, mergeProb: 0.45,
}));

export const LAYOUTS: Layout[] = [
  { id: 'old-glory', name: 'Old Glory', description: 'Big flag panel + irregular mix', sections: oldGlory },
  { id: 'frat-classic', name: 'Frat Classic', description: 'Dense collage, 20-30 sections', sections: fratClassic },
  { id: 'golf', name: 'Golf', description: 'Masters green, large sections', sections: golf, baseColor: '#0a5c36' },
  { id: 'americana', name: 'Americana', description: 'Diamond centerpiece + trapezoids', sections: americana },
  { id: 'chaos', name: 'Chaos', description: 'Tons of irregular shapes', sections: chaos },
];

export function getLayout(id: string): Layout {
  return LAYOUTS.find(l => l.id === id) ?? LAYOUTS[0];
}

export function polygonCentroid(points: Pt[]): { x: number; y: number } {
  let area = 0, cx = 0, cy = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 1e-6) {
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  }
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

export function polygonArea(points: Pt[]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    area += x0 * y1 - x1 * y0;
  }
  return Math.abs(area / 2);
}

export function polygonBBox(points: Pt[]) {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function pointsToString(points: Pt[]): string {
  return points.map(p => p.join(',')).join(' ');
}
