// Fixed beer die table layouts traced from real fraternity tables.
// Lines never move — users only fill the sections.

export const TABLE_W = 1000;
export const TABLE_H = 500;

export interface Section {
  id: string;
  points: [number, number][];
}

export interface Layout {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}

// ── Layout 1: "Old Glory" ──────────────────────────────────────────
// Traced from the flag table: one big panel on each end (perfect for a
// full flag), with a chain of three full-height diamonds down the middle
// and triangles filling the gaps.
const oldGlory: Section[] = [
  { id: 'g-end-l', points: [[0, 0], [200, 0], [200, 500], [0, 500]] },
  { id: 'g-tl', points: [[200, 0], [300, 0], [200, 250]] },
  { id: 'g-bl', points: [[200, 250], [300, 500], [200, 500]] },
  { id: 'g-d1', points: [[200, 250], [300, 0], [400, 250], [300, 500]] },
  { id: 'g-t1', points: [[300, 0], [500, 0], [400, 250]] },
  { id: 'g-b1', points: [[300, 500], [400, 250], [500, 500]] },
  { id: 'g-d2', points: [[400, 250], [500, 0], [600, 250], [500, 500]] },
  { id: 'g-t2', points: [[500, 0], [700, 0], [600, 250]] },
  { id: 'g-b2', points: [[500, 500], [600, 250], [700, 500]] },
  { id: 'g-d3', points: [[600, 250], [700, 0], [800, 250], [700, 500]] },
  { id: 'g-tr', points: [[700, 0], [800, 0], [800, 250]] },
  { id: 'g-br', points: [[800, 250], [800, 500], [700, 500]] },
  { id: 'g-end-r', points: [[800, 0], [1000, 0], [1000, 500], [800, 500]] },
];

// ── Layout 2: "Pinwheel" ───────────────────────────────────────────
// Traced from the Fireball table: triangles radiating from points along
// the center line — four X-cut cells, 16 triangles total.
const pinwheel: Section[] = (() => {
  const sections: Section[] = [];
  const cellW = 250;
  for (let c = 0; c < 4; c++) {
    const x0 = c * cellW;
    const x1 = x0 + cellW;
    const cx = x0 + cellW / 2;
    const cy = 250;
    sections.push(
      { id: `p${c}-top`, points: [[x0, 0], [x1, 0], [cx, cy]] },
      { id: `p${c}-right`, points: [[x1, 0], [x1, 500], [cx, cy]] },
      { id: `p${c}-bottom`, points: [[x1, 500], [x0, 500], [cx, cy]] },
      { id: `p${c}-left`, points: [[x0, 500], [x0, 0], [cx, cy]] },
    );
  }
  return sections;
})();

// ── Layout 3: "Chevron" ────────────────────────────────────────────
// Traced from the big-triangle sticker table: a 4x2 grid of squares,
// each cut by one diagonal, directions alternating to form chevrons.
const chevron: Section[] = (() => {
  const sections: Section[] = [];
  const s = 250;
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 2; row++) {
      const x = col * s, y = row * s;
      const even = (col + row) % 2 === 0;
      if (even) {
        // diagonal top-left -> bottom-right
        sections.push(
          { id: `c${col}${row}a`, points: [[x, y], [x + s, y], [x + s, y + s]] },
          { id: `c${col}${row}b`, points: [[x, y], [x + s, y + s], [x, y + s]] },
        );
      } else {
        // diagonal bottom-left -> top-right
        sections.push(
          { id: `c${col}${row}a`, points: [[x, y], [x + s, y], [x, y + s]] },
          { id: `c${col}${row}b`, points: [[x + s, y], [x + s, y + s], [x, y + s]] },
        );
      }
    }
  }
  return sections;
})();

export const LAYOUTS: Layout[] = [
  { id: 'old-glory', name: 'Old Glory', description: 'Flag panels + diamond chain', sections: oldGlory },
  { id: 'pinwheel', name: 'Pinwheel', description: 'Triangles radiating from center points', sections: pinwheel },
  { id: 'chevron', name: 'Chevron', description: 'Big alternating triangles', sections: chevron },
];

export function getLayout(id: string): Layout {
  return LAYOUTS.find(l => l.id === id) ?? LAYOUTS[0];
}

export function polygonCentroid(points: [number, number][]): { x: number; y: number } {
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
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

export function polygonArea(points: [number, number][]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    area += x0 * y1 - x1 * y0;
  }
  return Math.abs(area / 2);
}

export function polygonBBox(points: [number, number][]) {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function pointsToString(points: [number, number][]): string {
  return points.map(p => p.join(',')).join(' ');
}
