'use client';
import { useRef, useCallback, useEffect } from 'react';
import { useTableStore, SectionFill } from '@/store/tableStore';
import { LOGOS } from '@/lib/logoData';
import {
  SECTIONS, TABLE_W, TABLE_H,
  polygonCentroid, polygonArea, pointsToString, Section,
} from '@/lib/tableLayout';

const LINE_COLOR = '#15120c';
const LINE_WIDTH = 5;

interface DragState {
  sectionId: string;
  startX: number;
  startY: number;
  startOffsetX: number;
  startOffsetY: number;
}

export default function TableSVG() {
  const sections = useTableStore(s => s.sections);
  const selectedSectionId = useTableStore(s => s.selectedSectionId);
  const selectSection = useTableStore(s => s.selectSection);
  const updateFill = useTableStore(s => s.updateFill);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * TABLE_W,
      y: ((clientY - rect.top) / rect.height) * TABLE_H,
    };
  }, []);

  const onSectionPointerDown = useCallback((e: React.PointerEvent, section: Section) => {
    e.stopPropagation();
    selectSection(section.id);
    const fill = useTableStore.getState().sections[section.id];
    if (!fill) return;
    const pt = toSvgPoint(e.clientX, e.clientY);
    dragRef.current = {
      sectionId: section.id,
      startX: pt.x,
      startY: pt.y,
      startOffsetX: fill.offsetX,
      startOffsetY: fill.offsetY,
    };
  }, [selectSection, toSvgPoint]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const pt = toSvgPoint(e.clientX, e.clientY);
      useTableStore.getState().updateFill(drag.sectionId, {
        offsetX: drag.startOffsetX + (pt.x - drag.startX),
        offsetY: drag.startOffsetY + (pt.y - drag.startY),
      });
    };
    const onUp = () => {
      if (dragRef.current) {
        const { sectionId } = dragRef.current;
        const fill = useTableStore.getState().sections[sectionId];
        if (fill) useTableStore.getState().updateFill(sectionId, {}, true);
      }
      dragRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [toSvgPoint]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const store = useTableStore.getState();
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) store.undo();
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) store.redo();
      if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedSectionId) {
        store.clearSection(store.selectedSectionId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full p-6"
      style={{ background: 'radial-gradient(ellipse at center, #232323 0%, #0d0d0d 100%)' }}
      onClick={() => selectSection(null)}
    >
      <div
        className="w-full max-w-5xl"
        style={{
          borderRadius: 14,
          padding: 10,
          background: 'linear-gradient(160deg, #4a3415 0%, #2e1f0c 100%)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <svg
          ref={svgRef}
          id="table-svg"
          viewBox={`0 0 ${TABLE_W} ${TABLE_H}`}
          width={TABLE_W}
          height={TABLE_H}
          className="w-full h-auto block select-none"
          style={{ borderRadius: 6, touchAction: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {SECTIONS.map(sec => (
              <clipPath key={sec.id} id={`clip-${sec.id}`}>
                <polygon points={pointsToString(sec.points)} />
              </clipPath>
            ))}
          </defs>

          {/* Base plywood (only visible in unfilled sections) */}
          <rect x={0} y={0} width={TABLE_W} height={TABLE_H} fill="#c9a05c" />
          <rect x={0} y={0} width={TABLE_W} height={TABLE_H} fill="url(#wood-grain)" opacity={0.5} />
          <defs>
            <pattern id="wood-grain" width="120" height="16" patternUnits="userSpaceOnUse">
              <rect width="120" height="16" fill="#c9a05c" />
              <path d="M0 8 Q30 4 60 8 T120 8" stroke="#b08a44" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M0 14 Q40 11 80 14 T120 13" stroke="#b8924c" strokeWidth="1" fill="none" opacity="0.4" />
            </pattern>
          </defs>

          {/* Section fills */}
          {SECTIONS.map(sec => (
            <SectionShape
              key={sec.id}
              section={sec}
              fill={sections[sec.id]}
              isSelected={sec.id === selectedSectionId}
              onPointerDown={onSectionPointerDown}
            />
          ))}

          {/* Fixed dividing lines drawn on top — these never move */}
          {SECTIONS.map(sec => (
            <polygon
              key={`line-${sec.id}`}
              points={pointsToString(sec.points)}
              fill="none"
              stroke={LINE_COLOR}
              strokeWidth={LINE_WIDTH}
              strokeLinejoin="round"
              pointerEvents="none"
            />
          ))}

          {/* Outer frame */}
          <rect
            x={LINE_WIDTH / 2} y={LINE_WIDTH / 2}
            width={TABLE_W - LINE_WIDTH} height={TABLE_H - LINE_WIDTH}
            fill="none" stroke={LINE_COLOR} strokeWidth={LINE_WIDTH * 1.6}
            pointerEvents="none"
          />

          {/* Selection highlight */}
          {selectedSectionId && (
            <polygon
              points={pointsToString(SECTIONS.find(s => s.id === selectedSectionId)!.points)}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={5}
              strokeLinejoin="round"
              pointerEvents="none"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

interface SectionShapeProps {
  section: Section;
  fill: SectionFill | null;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, section: Section) => void;
}

// Break a name into 1-2 balanced lines so it fits inside narrow sections.
function splitName(name: string): string[] {
  const words = name.split(' ');
  if (words.length === 1) return [name];
  let best = [name];
  let bestMax = name.length;
  for (let i = 1; i < words.length; i++) {
    const l1 = words.slice(0, i).join(' ');
    const l2 = words.slice(i).join(' ');
    const max = Math.max(l1.length, l2.length);
    if (max < bestMax) { bestMax = max; best = [l1, l2]; }
  }
  return best;
}

function SectionShape({ section, fill, isSelected, onPointerDown }: SectionShapeProps) {
  const logo = fill ? LOGOS.find(l => l.id === fill.logoId) : null;
  const centroid = polygonCentroid(section.points);
  const size = Math.sqrt(polygonArea(section.points));

  const bgColor = logo ? (fill!.inverted ? logo.bg : logo.color) : 'transparent';
  const fgColor = logo ? (fill!.inverted ? logo.color : '#ffffff') : '#000';

  const emojiSize = size * 0.5;
  const lines = logo ? splitName(logo.name.toUpperCase()) : [];
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 1);
  // Arial Black runs ~0.72em per char; keep the longest line inside ~80%
  // of the section's characteristic width.
  const nameSize = Math.max(9, Math.min(size * 0.14, (size * 0.8) / (0.72 * longest)));

  return (
    <g
      onPointerDown={e => onPointerDown(e, section)}
      style={{ cursor: fill ? 'grab' : 'pointer' }}
    >
      {/* Hit area / fill background */}
      <polygon
        points={pointsToString(section.points)}
        fill={logo ? bgColor : 'transparent'}
        className="transition-opacity"
      />

      {logo && fill && (
        <g clipPath={`url(#clip-${section.id})`} pointerEvents="none">
          <g
            transform={`translate(${centroid.x + fill.offsetX}, ${centroid.y + fill.offsetY}) rotate(${fill.rotation}) scale(${fill.scale})`}
          >
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={-size * 0.06}
              fontSize={emojiSize}
            >
              {logo.emoji}
            </text>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={size * 0.28}
              fontSize={nameSize}
              fontWeight={900}
              fontFamily="Arial Black, Arial, sans-serif"
              fill={fgColor}
              style={{ letterSpacing: 0.5 }}
            >
              {lines.map((line, i) => (
                <tspan
                  key={i}
                  x={0}
                  dy={i === 0 ? 0 : nameSize * 1.15}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        </g>
      )}

      {/* Empty section hint */}
      {!logo && (
        <g pointerEvents="none" opacity={isSelected ? 0.9 : 0.35}>
          <circle cx={centroid.x} cy={centroid.y} r={Math.min(16, size * 0.18)} fill="rgba(0,0,0,0.25)" />
          <text
            x={centroid.x} y={centroid.y}
            textAnchor="middle" dominantBaseline="central"
            fontSize={Math.min(20, size * 0.22)} fill="#fff" fontWeight={700}
          >
            +
          </text>
        </g>
      )}
    </g>
  );
}
