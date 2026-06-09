'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useTableStore, TableItem } from '@/store/tableStore';

const TABLE_W = 900;
const TABLE_H = 500;

type HandleType = 'move' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se' | 'rotate';

interface DragState {
  handleType: HandleType;
  itemId: string;
  startMouseX: number;
  startMouseY: number;
  startItemX: number;
  startItemY: number;
  startW: number;
  startH: number;
  startRot: number;
  itemCenterX: number;
  itemCenterY: number;
}

export default function TableCanvas() {
  const { items, selectedId, zoom } = useTableStore();
  const selectItem = useTableStore(s => s.selectItem);
  const updateItem = useTableStore(s => s.updateItem);
  const bringToFront = useTableStore(s => s.bringToFront);
  const setZoom = useTableStore(s => s.setZoom);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const getCanvasPoint = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom,
    };
  }, [zoom]);

  const startDrag = useCallback((
    e: React.MouseEvent,
    item: TableItem,
    handleType: HandleType
  ) => {
    e.stopPropagation();
    e.preventDefault();
    selectItem(item.id);
    if (handleType === 'move') bringToFront(item.id);

    const pt = getCanvasPoint(e.clientX, e.clientY);
    dragRef.current = {
      handleType,
      itemId: item.id,
      startMouseX: pt.x,
      startMouseY: pt.y,
      startItemX: item.x,
      startItemY: item.y,
      startW: item.width,
      startH: item.height,
      startRot: item.rotation,
      itemCenterX: item.x + item.width / 2,
      itemCenterY: item.y + item.height / 2,
    };
  }, [selectItem, bringToFront, getCanvasPoint]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const pt = getCanvasPoint(e.clientX, e.clientY);
      const dx = pt.x - drag.startMouseX;
      const dy = pt.y - drag.startMouseY;
      const MIN = 40;

      if (drag.handleType === 'move') {
        updateItem(drag.itemId, {
          x: drag.startItemX + dx,
          y: drag.startItemY + dy,
        });
      } else if (drag.handleType === 'rotate') {
        const cx = drag.itemCenterX;
        const cy = drag.itemCenterY;
        const angle = Math.atan2(pt.y - cy, pt.x - cx) * (180 / Math.PI) + 90;
        updateItem(drag.itemId, { rotation: angle });
      } else {
        let newX = drag.startItemX;
        let newY = drag.startItemY;
        let newW = drag.startW;
        let newH = drag.startH;

        if (drag.handleType === 'resize-se') {
          newW = Math.max(MIN, drag.startW + dx);
          newH = Math.max(MIN, drag.startH + dy);
        } else if (drag.handleType === 'resize-sw') {
          newW = Math.max(MIN, drag.startW - dx);
          newH = Math.max(MIN, drag.startH + dy);
          newX = drag.startItemX + drag.startW - newW;
        } else if (drag.handleType === 'resize-ne') {
          newW = Math.max(MIN, drag.startW + dx);
          newH = Math.max(MIN, drag.startH - dy);
          newY = drag.startItemY + drag.startH - newH;
        } else if (drag.handleType === 'resize-nw') {
          newW = Math.max(MIN, drag.startW - dx);
          newH = Math.max(MIN, drag.startH - dy);
          newX = drag.startItemX + drag.startW - newW;
          newY = drag.startItemY + drag.startH - newH;
        }
        updateItem(drag.itemId, { x: newX, y: newY, width: newW, height: newH });
      }
    };

    const onMouseUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [getCanvasPoint, updateItem]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      const store = useTableStore.getState();
      const { selectedId } = store;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        store.removeItem(selectedId);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) store.undo();
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) store.redo();
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        store.duplicateItem(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(zoom + (e.deltaY > 0 ? -0.1 : 0.1));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoom, setZoom]);

  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full overflow-auto"
      style={{ background: 'radial-gradient(ellipse at center, #1e1e1e 0%, #0d0d0d 100%)' }}
      onClick={() => selectItem(null)}
    >
      <div
        ref={canvasRef}
        data-export
        className="relative flex-shrink-0"
        style={{
          width: TABLE_W,
          height: TABLE_H,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundImage: `
            repeating-linear-gradient(92deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px),
            repeating-linear-gradient(182deg, transparent, transparent 22px, rgba(0,0,0,0.025) 22px, rgba(0,0,0,0.025) 44px),
            linear-gradient(155deg, #d4a44c 0%, #b8803a 20%, #c89542 40%, #a86525 65%, #c08535 85%, #b07030 100%)
          `,
          borderRadius: 20,
          border: '8px solid #5a3a10',
          boxShadow: '0 0 0 2px #8b6020, 0 25px 80px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Inner rim */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.18), inset 0 -3px 8px rgba(0,0,0,0.35)',
            borderRadius: 12,
          }}
        />
        {/* Subtle wear marks */}
        <div
          className="absolute pointer-events-none opacity-20"
          style={{
            inset: 0,
            borderRadius: 12,
            backgroundImage: `radial-gradient(ellipse 60px 30px at 15% 30%, rgba(255,255,255,0.15) 0%, transparent 100%),
              radial-gradient(ellipse 40px 20px at 75% 70%, rgba(255,255,255,0.1) 0%, transparent 100%)`,
          }}
        />

        {/* Items */}
        {sortedItems.map(item => (
          <StickerItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedId}
            startDrag={startDrag}
          />
        ))}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-5xl mb-3 opacity-30">🎨</div>
            <p className="text-white/25 text-base font-medium">Search & click logos to add them</p>
            <p className="text-white/15 text-sm mt-1">or hit Randomize for instant inspiration</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface StickerItemProps {
  item: TableItem;
  isSelected: boolean;
  startDrag: (e: React.MouseEvent, item: TableItem, handle: HandleType) => void;
}

function StickerItem({ item, isSelected, startDrag }: StickerItemProps) {
  const fontSize = Math.min(item.width, item.height) * 0.44;
  const nameFontSize = Math.max(8, Math.min(item.width * 0.1, 13));

  return (
    <div
      className="absolute"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
        transformOrigin: 'center center',
        zIndex: item.zIndex,
        opacity: item.opacity,
        cursor: 'grab',
        willChange: 'transform',
      }}
      onMouseDown={e => startDrag(e, item, 'move')}
    >
      {/* Sticker */}
      <div
        className="w-full h-full rounded-2xl flex flex-col items-center justify-center border-2 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${item.bg} 0%, ${item.bg}ee 100%)`,
          borderColor: item.color + '88',
          boxShadow: isSelected
            ? `0 0 0 3px #fbbf24, 0 0 20px rgba(251,191,36,0.4), 2px 6px 16px rgba(0,0,0,0.5)`
            : `2px 6px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)`,
        }}
      >
        <span className="leading-none select-none" style={{ fontSize }}>
          {item.emoji}
        </span>
        {item.width > 75 && (
          <span
            className="font-bold text-center leading-tight px-1.5 mt-0.5 truncate w-full"
            style={{
              fontSize: nameFontSize,
              color: item.color,
            }}
          >
            {item.name}
          </span>
        )}
      </div>

      {/* Resize handles + rotate handle (only when selected) */}
      {isSelected && (
        <>
          {/* Resize corners */}
          {[
            { h: 'resize-nw' as HandleType, style: { top: -6, left: -6, cursor: 'nw-resize' } },
            { h: 'resize-ne' as HandleType, style: { top: -6, right: -6, cursor: 'ne-resize' } },
            { h: 'resize-sw' as HandleType, style: { bottom: -6, left: -6, cursor: 'sw-resize' } },
            { h: 'resize-se' as HandleType, style: { bottom: -6, right: -6, cursor: 'se-resize' } },
          ].map(({ h, style }) => (
            <div
              key={h}
              className="absolute w-3.5 h-3.5 bg-yellow-400 rounded-sm border-2 border-white shadow"
              style={{ ...style, position: 'absolute', zIndex: 20 }}
              onMouseDown={e => startDrag(e, item, h)}
            />
          ))}

          {/* Rotate handle */}
          <div
            className="absolute flex items-center justify-center text-xs font-bold bg-blue-500 border-2 border-white rounded-full shadow-lg"
            style={{
              width: 20,
              height: 20,
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'crosshair',
              zIndex: 20,
              color: 'white',
              fontSize: 12,
            }}
            onMouseDown={e => startDrag(e, item, 'rotate')}
          >
            ↻
          </div>

          {/* Line to rotate handle */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 1,
              height: 20,
              background: 'rgba(59,130,246,0.6)',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </>
      )}
    </div>
  );
}
