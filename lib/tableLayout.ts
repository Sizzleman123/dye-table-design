// Fixed beer die table layout — 23 irregular sections made from diagonal
// cuts, triangles, trapezoids and polygons. The lines never move; users
// only choose what fills each section.

export const TABLE_W = 1000;
export const TABLE_H = 500;

export interface Section {
  id: string;
  points: [number, number][];
}

export const SECTIONS: Section[] = [
  // Left band
  { id: 's1', points: [[0, 0], [180, 0], [0, 160]] },
  { id: 's2', points: [[180, 0], [180, 250], [0, 160]] },
  { id: 's3', points: [[0, 160], [180, 250], [0, 360]] },
  { id: 's4', points: [[0, 360], [180, 250], [180, 500], [0, 500]] },

  // Left-center band
  { id: 's5', points: [[180, 0], [380, 0], [380, 120], [180, 250]] },
  { id: 's6', points: [[180, 250], [380, 120], [380, 300]] },
  { id: 's7', points: [[180, 250], [380, 300], [280, 500], [180, 500]] },
  { id: 's8', points: [[280, 500], [380, 300], [380, 500]] },

  // Center band — X pattern meeting at (500, 250)
  { id: 's9', points: [[380, 0], [500, 0], [500, 250]] },
  { id: 's10', points: [[500, 0], [620, 0], [500, 250]] },
  { id: 's11', points: [[380, 0], [500, 250], [380, 300]] },
  { id: 's12', points: [[620, 0], [620, 320], [500, 250]] },
  { id: 's13', points: [[380, 300], [500, 250], [500, 500], [380, 500]] },
  { id: 's14', points: [[500, 250], [620, 320], [620, 500], [500, 500]] },

  // Right-center band
  { id: 's15', points: [[620, 0], [730, 0], [620, 180]] },
  { id: 's16', points: [[730, 0], [820, 0], [620, 180]] },
  { id: 's17', points: [[820, 0], [820, 200], [620, 320], [620, 180]] },
  { id: 's18', points: [[620, 320], [820, 200], [820, 380], [720, 500], [620, 500]] },
  { id: 's19', points: [[720, 500], [820, 380], [820, 500]] },

  // Right band
  { id: 's20', points: [[820, 0], [1000, 0], [1000, 130], [820, 200]] },
  { id: 's21', points: [[820, 200], [1000, 130], [1000, 300]] },
  { id: 's22', points: [[820, 200], [1000, 300], [820, 380]] },
  { id: 's23', points: [[820, 380], [1000, 300], [1000, 500], [820, 500]] },
];

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

export function pointsToString(points: [number, number][]): string {
  return points.map(p => p.join(',')).join(' ');
}
