
import React from 'react';
import { PCBComponent, Trace } from './types';
import { Settings2, Trash2, Layers, Activity, Zap, Eye, Palette, Lock, Unlock } from 'lucide-react';

interface InspectorProps {
  selectedComponents: PCBComponent[];
  selectedTraces: Trace[];
  hoveredCompId: string | null;
  onMouseEnterItem: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<PCBComponent>) => void;
  onUpdateTrace: (id: string, updates: Partial<Trace>) => void;
  onRemoveItem: (id: string) => void;
  onClearSelection: () => void;
  onIsolate: (id: string) => void;
  getFootprint: (id: string) => any;
  deleteSelected: () => void;
}

const TRACE_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
];

const TraceEditor: React.FC<{ 
  traces: Trace[], 
  onUpdate: (id: string, updates: Partial<Trace>) => void, 
  onDelete: () => void 
}> = ({ traces, onUpdate, onDelete }) => (
  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-6">
    <div className="flex items-center gap-2">
      <Activity size={18} style={{ color: traces[0].color }} />
      <h3 className="text-xs font-black uppercase">{traces.length > 1 ? 'Trace Chain Properties' : 'Trace Properties'}</h3>
    </div>
    
    <div className="flex flex-col gap-3">
      <label className="text-[10px] text-emerald-900 font-black uppercase">Track Width</label>
      <input 
        type="range" min="1" max="50" 
        value={traces[0].width} 
        onChange={(e) => onUpdate(traces[0].id, { width: parseInt(e.target.value) })} 
        className="w-full accent-emerald-500 bg-[#050C07] h-2 rounded-full appearance-none" 
      />
      <span className="text-[10px] font-mono text-emerald-500 text-center">{traces[0].width} MIL</span>
    </div>

    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Palette size={12} className="text-emerald-900" />
        <label className="text-[10px] text-emerald-900 font-black uppercase">Color</label>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {TRACE_COLORS.map(color => (
          <button
            key={color.value}
            onClick={() => onUpdate(traces[0].id, { color: color.value })}
            className={`group relative h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
              traces.every(t => t.color === color.value) 
                ? 'border-white scale-105 shadow-lg' 
                : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
            }`}
            style={{ backgroundColor: color.value }}
          >
            {traces.every(t => t.color === color.value) && (
              <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>

    <button onClick={onDelete} className="w-full p-4 text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] font-black uppercase tracking-widest">
      <Trash2 size={16} className="inline mr-2" /> Delete Selection
    </button>
  </div>
);

const ComponentEditor: React.FC<{
  comp: PCBComponent,
  footprint: any,
  onUpdate: (id: string, updates: Partial<PCBComponent>) => void,
  onDelete: () => void
}> = ({ comp, footprint, onUpdate, onDelete }) => (
  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Layers size={18} className="text-emerald-500" />
        <h3 className="text-xs font-black uppercase tracking-widest">
          {comp.footprintId === 'JUNCTION' ? 'Junction' : 'Properties'}
        </h3>
      </div>
      <button 
        onClick={() => onUpdate(comp.id, { locked: !comp.locked })}
        className={`p-2 rounded-lg border transition-all ${comp.locked ? 'bg-red-500 border-red-400 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'}`}
        title={comp.locked ? "Unlock component" : "Lock component"}
      >
        {comp.locked ? <Lock size={16} /> : <Unlock size={16} />}
      </button>
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-[10px] text-emerald-900 font-black uppercase">Designator</label>
      <input 
        type="text" 
        value={comp.name} 
        onChange={(e) => onUpdate(comp.id, { name: e.target.value })} 
        className="w-full bg-[#050C07] border border-zinc-800 p-3 rounded-xl text-sm" 
      />
    </div>

    {footprint && footprint.valueType && (
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-emerald-900 font-black uppercase">
          {footprint.valueType.charAt(0).toUpperCase() + footprint.valueType.slice(1)}
        </label>
        <div className="relative">
          <input 
            type="text" 
            value={comp.value || ''} 
            onChange={(e) => onUpdate(comp.id, { value: e.target.value })} 
            className="w-full bg-[#050C07] border border-zinc-800 p-3 rounded-xl text-sm pl-11" 
          />
          <Zap size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/40" />
        </div>
      </div>
    )}

    <div className="flex flex-col gap-3">
      <label className="text-[10px] text-emerald-900 font-black uppercase">Position</label>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-600">X</span>
          <input 
            type="number" 
            value={Math.round(comp.position.x)} 
            onChange={(e) => onUpdate(comp.id, { position: { ...comp.position, x: parseFloat(e.target.value) || 0 } })} 
            className="w-full bg-[#050C07] border border-zinc-800 p-3 pl-7 rounded-xl text-sm" 
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-600">Y</span>
          <input 
            type="number" 
            value={Math.round(comp.position.y)} 
            onChange={(e) => onUpdate(comp.id, { position: { ...comp.position, y: parseFloat(e.target.value) || 0 } })} 
            className="w-full bg-[#050C07] border border-zinc-800 p-3 pl-7 rounded-xl text-sm" 
          />
        </div>
      </div>
    </div>

    {comp.footprintId !== 'JUNCTION' && (
      <div className="flex flex-col gap-3">
        <label className="text-[10px] text-emerald-900 font-black uppercase">Rotation</label>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 90, 180, 270].map(angle => (
            <button 
              key={angle} 
              onClick={() => onUpdate(comp.id, { rotation: angle })} 
              className={`py-3 rounded-xl border text-[11px] font-black ${comp.rotation === angle ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-[#050C07] border-zinc-800'}`}
            >
              {angle}°
            </button>
          ))}
        </div>
      </div>
    )}

    <button onClick={onDelete} className="w-full flex items-center justify-center gap-2 p-4 text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] font-black uppercase tracking-widest">
      <Trash2 size={18} /> Remove Item
    </button>
  </div>
);

const Inspector: React.FC<InspectorProps> = ({
  selectedComponents, selectedTraces, hoveredCompId, onMouseEnterItem,
  onUpdateComponent, onUpdateTrace, onRemoveItem, onClearSelection, onIsolate,
  getFootprint, deleteSelected
}) => {
  const totalCount = selectedComponents.length + selectedTraces.length;
  const isBulkTraces = selectedTraces.length > 0 && selectedComponents.length === 0;

  return (
    <div className="w-80 bg-[#0A1A0F] border-l border-[#1A4A23] p-4 flex flex-col gap-6 z-10 shadow-2xl overflow-y-auto scrollbar-thin">
      <div className="flex items-center gap-3 px-2">
        <Settings2 size={16} className="text-emerald-900" />
        <h2 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Inspector</h2>
      </div>

      {isBulkTraces ? (
        <TraceEditor traces={selectedTraces} onUpdate={onUpdateTrace} onDelete={deleteSelected} />
      ) : totalCount > 1 ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest">Selection Stack</h3>
            <button onClick={onClearSelection} className="text-[10px] font-black text-emerald-900 hover:text-red-400 uppercase">Clear</button>
          </div>
          <div className="flex flex-col gap-1.5">
            {[...selectedComponents, ...selectedTraces].map(item => {
              const isComp = 'footprintId' in item;
              const name = isComp ? (item as PCBComponent).name : `Trace ${item.id.slice(-4)}`;
              return (
                <div 
                  key={item.id} 
                  onMouseEnter={() => onMouseEnterItem(item.id)}
                  onMouseLeave={() => onMouseEnterItem(null)}
                  className={`group flex items-center justify-between bg-zinc-950 border ${hoveredCompId === item.id ? 'border-emerald-500' : 'border-zinc-800'} p-3 rounded-xl cursor-pointer`}
                  onClick={() => onIsolate(item.id)}
                >
                  <span className="text-[11px] font-bold truncate">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : selectedComponents.length === 1 ? (
        <ComponentEditor 
          comp={selectedComponents[0]} 
          footprint={getFootprint(selectedComponents[0].footprintId)}
          onUpdate={onUpdateComponent}
          onDelete={deleteSelected}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-800/50">
          <Eye size={36} className="text-emerald-900 mb-6" />
          <p className="text-[11px] font-black text-emerald-900/60 text-center uppercase tracking-widest">Select an item to inspect</p>
        </div>
      )}
    </div>
  );
};

export default Inspector;
