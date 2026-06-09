// Seeded irregular tessellation: jittered points -> Delaunay triangles ->
// random neighbor merges. Produces hand-painted-looking section layouts
// with guaranteed full coverage and no overlaps. Deterministic per seed so
// section ids stay stable for save/share links.

export type Pt = [number, number];

export function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Tri { a: number; b: number; c: number; }

function delaunay(points: Pt[]): Tri[] {
  const pts = points.slice();
  const si = pts.length;
  pts.push([-100000, -100000], [300000, -100000], [500, 300000]);
  let tris: Tri[] = [{ a: si, b: si + 1, c: si + 2 }];

  const inCircumcircle = (t: Tri, p: Pt) => {
    const [ax, ay] = pts[t.a], [bx, by] = pts[t.b], [cx, cy] = pts[t.c];
    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    if (d === 0) return false;
    const a2 = ax * ax + ay * ay, b2 = bx * bx + by * by, c2 = cx * cx + cy * cy;
    const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
    const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
    const r2 = (ax - ux) ** 2 + (ay - uy) ** 2;
    return (p[0] - ux) ** 2 + (p[1] - uy) ** 2 < r2 - 1e-9;
  };

  for (let i = 0; i < si; i++) {
    const bad = tris.filter(t => inCircumcircle(t, pts[i]));
    const edges: [number, number][] = [];
    bad.forEach(t => edges.push([t.a, t.b], [t.b, t.c], [t.c, t.a]));
    const boundary = edges.filter(([u, v]) =>
      edges.filter(([x, y]) => (x === u && y === v) || (x === v && y === u)).length === 1
    );
    tris = tris.filter(t => !bad.includes(t));
    boundary.forEach(([u, v]) => tris.push({ a: u, b: v, c: i }));
  }
  return tris.filter(t => t.a < si && t.b < si && t.c < si);
}

function signedArea(poly: Pt[]): number {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    area += x0 * y1 - x1 * y0;
  }
  return area / 2;
}

function ensureCCW(poly: Pt[]): Pt[] {
  return signedArea(poly) < 0 ? poly.slice().reverse() : poly;
}

/**
 * Generate an irregular tessellation of the rectangle [x0,y0,w,h].
 * cols/rows control density; jitter controls irregularity (0-1 of cell);
 * mergeProb controls how many triangle pairs become quads.
 */
export function tessellate(opts: {
  seed: number;
  x0: number; y0: number; w: number; h: number;
  cols: number; rows: number;
  jitter?: number;
  mergeProb?: number;
}): Pt[][] {
  const { seed, x0, y0, w, h, cols, rows } = opts;
  const jitter = opts.jitter ?? 0.55;
  const mergeProb = opts.mergeProb ?? 0.5;
  const rnd = mulberry32(seed);
  const cw = w / cols, ch = h / rows;

  const pts: Pt[] = [
    [x0, y0], [x0 + w, y0], [x0, y0 + h], [x0 + w, y0 + h],
  ];
  // Edge points (jittered along the edge only, so the boundary stays exact)
  for (let i = 1; i < cols; i++) {
    const jx = () => (rnd() - 0.5) * cw * jitter;
    pts.push([x0 + i * cw + jx(), y0]);
    pts.push([x0 + i * cw + jx(), y0 + h]);
  }
  for (let j = 1; j < rows; j++) {
    const jy = () => (rnd() - 0.5) * ch * jitter;
    pts.push([x0, y0 + j * ch + jy()]);
    pts.push([x0 + w, y0 + j * ch + jy()]);
  }
  // Interior points
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pts.push([
        x0 + (i + 0.5) * cw + (rnd() - 0.5) * cw * jitter,
        y0 + (j + 0.5) * ch + (rnd() - 0.5) * ch * jitter,
      ]);
    }
  }

  const tris = delaunay(pts);

  // Random neighbor merges: triangle pairs sharing an edge become quads
  const edgeMap = new Map<string, number[]>();
  tris.forEach((t, i) => {
    [[t.a, t.b], [t.b, t.c], [t.c, t.a]].forEach(([u, v]) => {
      const k = u < v ? `${u}-${v}` : `${v}-${u}`;
      const arr = edgeMap.get(k) ?? [];
      arr.push(i);
      edgeMap.set(k, arr);
    });
  });

  const used = new Array(tris.length).fill(false);
  const order = tris.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const polys: Pt[][] = [];
  for (const i of order) {
    if (used[i]) continue;
    used[i] = true;
    const t = tris[i];
    let merged = false;
    if (rnd() < mergeProb) {
      const candidates: { j: number; u: number; v: number }[] = [];
      [[t.a, t.b], [t.b, t.c], [t.c, t.a]].forEach(([u, v]) => {
        const k = u < v ? `${u}-${v}` : `${v}-${u}`;
        (edgeMap.get(k) ?? []).forEach(j => {
          if (j !== i && !used[j]) candidates.push({ j, u, v });
        });
      });
      if (candidates.length) {
        const { j, u, v } = candidates[Math.floor(rnd() * candidates.length)];
        used[j] = true;
        const t2 = tris[j];
        const w1 = [t.a, t.b, t.c].find(x => x !== u && x !== v)!;
        const w2 = [t2.a, t2.b, t2.c].find(x => x !== u && x !== v)!;
        polys.push(ensureCCW([pts[w1], pts[u], pts[w2], pts[v]]));
        merged = true;
      }
    }
    if (!merged) polys.push(ensureCCW([pts[t.a], pts[t.b], pts[t.c]]));
  }

  return polys.map(poly =>
    poly.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as Pt)
  );
}
