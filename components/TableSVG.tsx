'use client';
import { useRef, useCallback, useEffect, useState } from 'react';
import { useTableStore, SectionFill, FillLogo } from '@/store/tableStore';
import {
  getLayout, TABLE_W, TABLE_H,
  polygonCentroid, polygonArea, polygonBBox, pointsToString, Section,
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
  const layoutId = useTableStore(s => s.layoutId);
  const sections = useTableStore(s => s.sections);
  const selectedSectionId = useTableStore(s => s.selectedSectionId);
  const selectSection = useTableStore(s => s.selectSection);

  const layout = getLayout(layoutId);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const markFailed = useCallback((logoId: string) => {
    setFailedImages(prev => {
      if (prev.has(logoId)) return prev;
      const next = new Set(prev);
      next.add(logoId);
      return next;
    });
  }, []);

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
            {layout.sections.map(sec => (
              <clipPath key={sec.id} id={`clip-${sec.id}`}>
                <polygon points={pointsToString(sec.points)} />
              </clipPath>
            ))}
            <pattern id="wood-grain" width="120" height="16" patternUnits="userSpaceOnUse">
              <rect width="120" height="16" fill="#c9a05c" />
              <path d="M0 8 Q30 4 60 8 T120 8" stroke="#b08a44" strokeWidth="1.5" fill="none" opacity="0.6" />
              <path d="M0 14 Q40 11 80 14 T120 13" stroke="#b8924c" strokeWidth="1" fill="none" opacity="0.4" />
            </pattern>
          </defs>

          {/* Base (visible only in unfilled sections): painted color or plywood */}
          {layout.baseColor ? (
            <rect x={0} y={0} width={TABLE_W} height={TABLE_H} fill={layout.baseColor} />
          ) : (
            <>
              <rect x={0} y={0} width={TABLE_W} height={TABLE_H} fill="#c9a05c" />
              <rect x={0} y={0} width={TABLE_W} height={TABLE_H} fill="url(#wood-grain)" opacity={0.5} />
            </>
          )}

          {/* Section fills */}
          {layout.sections.map(sec => (
            <SectionShape
              key={sec.id}
              section={sec}
              fill={sections[sec.id]}
              isSelected={sec.id === selectedSectionId}
              onPointerDown={onSectionPointerDown}
              imageFailed={failedImages}
              markFailed={markFailed}
            />
          ))}

          {/* Fixed dividing lines — these never move */}
          {layout.sections.map(sec => (
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
          {selectedSectionId && layout.sections.find(s => s.id === selectedSectionId) && (
            <polygon
              points={pointsToString(layout.sections.find(s => s.id === selectedSectionId)!.points)}
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

// Break a name into 1-2 balanced lines so it fits narrow sections.
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

interface SectionShapeProps {
  section: Section;
  fill: SectionFill | null;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, section: Section) => void;
  imageFailed: Set<string>;
  markFailed: (logoId: string) => void;
}

function SectionShape({ section, fill, isSelected, onPointerDown, imageFailed, markFailed }: SectionShapeProps) {
  const logo = fill ? fill.logo : null;
  const centroid = polygonCentroid(section.points);
  const size = Math.sqrt(polygonArea(section.points));
  const bbox = polygonBBox(section.points);

  const hasImage = !!(logo?.img && !imageFailed.has(logo.img));
  const bgColor = logo ? (fill!.inverted ? logo.color : logo.bg) : 'transparent';

  return (
    <g
      onPointerDown={e => onPointerDown(e, section)}
      style={{ cursor: fill ? 'grab' : 'pointer' }}
    >
      {/* Background panel / hit area */}
      <polygon
        points={pointsToString(section.points)}
        fill={logo ? bgColor : 'transparent'}
      />

      {logo && fill && (
        <g clipPath={`url(#clip-${section.id})`} pointerEvents="none">
          {hasImage && logo.cover ? (
            // Flags etc: stretch to cover the whole section
            <g transform={`rotate(${fill.rotation}, ${centroid.x}, ${centroid.y})`}>
              <image
                href={logo.img}
                x={bbox.x + fill.offsetX - (bbox.w * (fill.scale - 1)) / 2}
                y={bbox.y + fill.offsetY - (bbox.h * (fill.scale - 1)) / 2}
                width={bbox.w * fill.scale}
                height={bbox.h * fill.scale}
                preserveAspectRatio="xMidYMid slice"
                onError={() => markFailed(logo.img!)}
              />
            </g>
          ) : hasImage ? (
            // Brand/team logos: real image centered in the section
            <g transform={`translate(${centroid.x + fill.offsetX}, ${centroid.y + fill.offsetY}) rotate(${fill.rotation}) scale(${fill.scale})`}>
              <image
                href={logo.img}
                x={-size * 0.42}
                y={-size * 0.42}
                width={size * 0.84}
                height={size * 0.84}
                preserveAspectRatio="xMidYMid meet"
                onError={() => markFailed(logo.img!)}
              />
            </g>
          ) : (
            <PaintedFallback logo={logo} fill={fill} centroid={centroid} size={size} />
          )}
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

// Painted-style rendering for frats (Greek letters), graphics (emblem),
// and any logo whose image failed to load.
function PaintedFallback({ logo, fill, centroid, size }: {
  logo: FillLogo;
  fill: SectionFill;
  centroid: { x: number; y: number };
  size: number;
}) {
  const fgColor = fill.inverted ? logo.bg : logo.color;

  if (logo.letters) {
    const letterSize = Math.min(size * 0.42, (size * 0.85) / (0.75 * logo.letters.length));
    return (
      <g transform={`translate(${centroid.x + fill.offsetX}, ${centroid.y + fill.offsetY}) rotate(${fill.rotation}) scale(${fill.scale})`}>
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={letterSize}
          fontWeight={900}
          fontFamily="Georgia, 'Times New Roman', serif"
          fill={fgColor}
          stroke={fill.inverted ? logo.color : 'none'}
          style={{ letterSpacing: 2 }}
        >
          {logo.letters}
        </text>
      </g>
    );
  }

  const lines = splitName(logo.name.toUpperCase());
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 1);
  const nameSize = Math.max(9, Math.min(size * 0.14, (size * 0.8) / (0.72 * longest)));

  return (
    <g transform={`translate(${centroid.x + fill.offsetX}, ${centroid.y + fill.offsetY}) rotate(${fill.rotation}) scale(${fill.scale})`}>
      {logo.emoji && (
        <text textAnchor="middle" dominantBaseline="central" y={-size * 0.08} fontSize={size * 0.42}>
          {logo.emoji}
        </text>
      )}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={logo.emoji ? size * 0.26 : 0}
        fontSize={nameSize}
        fontWeight={900}
        fontFamily="Arial Black, Arial, sans-serif"
        fill={fgColor}
        style={{ letterSpacing: 0.5 }}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? 0 : nameSize * 1.15}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
