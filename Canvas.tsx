
import React from 'react';
import { PCBComponent, Trace, Vector2, Pin } from './types';
import { SNAP_SIZE } from './constants';
import { generateBezierPath, getBezierControlPoints, getPointOnBezier } from './utils/pcbUtils';

interface CanvasProps {
  boardRef: React.RefObject<SVGSVGElement>;
  viewportRef: React.RefObject<SVGGElement>;
  components: PCBComponent[];
  traces: Trace[];
  allPins: Pin[];
  selectedIds: Set<string>;
  hoveredPinId: string | null;
  hoveredCompId: string | null;
  viewport: { x: number; y: number; scale: number };
  routingPreview: { path: string } | null;
  marquee: { start: Vector2; end: Vector2 } | null;
  violationMarkers: Vector2[];
  pendingFootprintId: string | null;
  previewPos: Vector2 | null;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
  getFootprint: (id: string) => any;
  getCompPosForPinTarget: (fid: string, target: Vector2, rot: number) => Vector2;
}

const Canvas: React.FC<CanvasProps> = ({
  boardRef, viewportRef, components, traces, allPins, selectedIds,
  hoveredPinId, hoveredCompId, viewport, routingPreview, marquee,
  violationMarkers, pendingFootprintId, previewPos,
  onPointerDown, onPointerMove, onPointerUp, onWheel,
  getFootprint, getCompPosForPinTarget
}) => {
  const hoveredPin = allPins.find(p => p.id === hoveredPinId);

  return (
    <svg 
      ref={boardRef} 
      className="w-full h-full cursor-crosshair touch-none outline-none" 
      onPointerDown={onPointerDown} 
      onPointerMove={onPointerMove} 
      onPointerUp={onPointerUp} 
      onWheel={onWheel}
    >
      <g ref={viewportRef} transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}>
        {/* Grid Background */}
        <pattern id="grid" width={SNAP_SIZE} height={SNAP_SIZE} patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1.2" fill="#152B1B" />
        </pattern>
        <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#grid)" />

        {/* Components & Junctions */}
        {components.map(c => {
          const foot = getFootprint(c.footprintId);
          if (!foot) return null;
          const isJ = foot.id === 'JUNCTION';
          const isS = selectedIds.has(c.id);
          const isH = hoveredCompId === c.id;
          
          // Junctions are only visible if interacted with or selected
          if (isJ && !isS && !traces.some(t => selectedIds.has(t.id) && (t.fromPinId.startsWith(c.id) || t.toPinId.startsWith(c.id))) && !isH) return null;

          return (
            <g key={c.id} transform={`translate(${c.position.x}, ${c.position.y}) rotate(${c.rotation}, ${foot.width/2}, ${foot.height/2})`}>
              {!isJ && (
                <rect 
                  width={foot.width} height={foot.height} 
                  fill={isS ? '#10b98110' : 'transparent'} 
                  stroke={isS || isH ? '#10B981' : '#27272a'} 
                  strokeWidth={isS || isH ? "3" : "1.5"} rx="4" 
                />
              )}
              {foot.pins.map(pin => (
                <g key={pin.id} transform={`translate(${pin.localPos.x}, ${pin.localPos.y})`}>
                  <circle r="11" fill="#18181b" stroke={pin.type === 'power' ? '#ef4444' : (pin.type === 'ground' ? '#3b82f6' : '#FCD34D')} strokeWidth="3" />
                  <circle r="3.5" fill={pin.type === 'power' ? '#ef4444' : (pin.type === 'ground' ? '#3b82f6' : '#FCD34D')} />
                </g>
              ))}
              {!isJ && <text x={foot.width / 2} y={-10} textAnchor="middle" fill={isS || isH ? "#10B981" : "#3f3f46"} className="text-[10px] font-bold font-mono pointer-events-none uppercase">{c.name}</text>}
            </g>
          );
        })}

        {/* Traces */}
        {traces.map(t => {
          const p1 = allPins.find(p => p.id === t.fromPinId);
          const p2 = allPins.find(p => p.id === t.toPinId);
          if(!p1 || !p2) return null;
          const isS = selectedIds.has(t.id);
          const path = generateBezierPath(p1.globalPos!, p2.globalPos!, t);
          return (
            <g key={t.id}>
              <path d={path} stroke={isS ? '#FCD34D' : '#FCD34D80'} strokeWidth={isS ? t.width + 4 : t.width} fill="none" strokeLinecap="round" />
              {isS && (
                <g className="pointer-events-none">
                  {(() => {
                    const { cx1, cy1, cx2, cy2 } = getBezierControlPoints(p1.globalPos!, p2.globalPos!, t);
                    return <><circle cx={cx1} cy={cy1} r="6" fill="#FCD34D" /><circle cx={cx2} cy={cy2} r="6" fill="#FCD34D" /></>;
                  })()}
                </g>
              )}
            </g>
          );
        })}

        {/* Snapping Feedback */}
        {hoveredPin && (
          <circle 
            cx={hoveredPin.globalPos!.x} 
            cy={hoveredPin.globalPos!.y} 
            r="18" 
            fill="none" 
            stroke="#FCD34D" 
            strokeWidth="2" 
            strokeDasharray="4 2" 
            className="animate-spin-slow"
          />
        )}

        {/* Previews & Markers */}
        {routingPreview && (
          <path 
            d={routingPreview.path} 
            stroke="#FCD34D" 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray="8 4" 
            className="opacity-50" 
          />
        )}
        
        {violationMarkers.map((m, i) => (
          <g key={i} transform={`translate(${m.x}, ${m.y})`}>
            <circle r="20" fill="#ef444425" className="animate-pulse" />
            <path d="M 0 -13 L 13 10 L -13 10 Z" fill="#ef4444" stroke="#050C07" strokeWidth="1.5" strokeLinejoin="round" />
            <text x="0" y="7" textAnchor="middle" fill="#fff" className="text-[10px] font-black pointer-events-none">!</text>
          </g>
        ))}

        {pendingFootprintId && previewPos && (
          (() => {
            const foot = getFootprint(pendingFootprintId);
            if (!foot) return null;
            const compPos = getCompPosForPinTarget(pendingFootprintId, {x: Math.round(previewPos.x/25.4)*25.4, y: Math.round(previewPos.y/25.4)*25.4}, 0);
            return (<g transform={`translate(${compPos.x}, ${compPos.y})`}><rect width={foot.width} height={foot.height} fill="#10b98108" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" className="pointer-events-none" /></g>);
          })()
        )}
        {marquee && <rect x={Math.min(marquee.start.x, marquee.end.x)} y={Math.min(marquee.start.y, marquee.end.y)} width={Math.abs(marquee.end.x - marquee.start.x)} height={Math.abs(marquee.end.y - marquee.start.y)} fill="#10b98108" stroke="#10b981" strokeWidth="1" strokeDasharray="5 3" className="pointer-events-none" />}
      </g>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
      `}</style>
    </svg>
  );
};

export default Canvas;
