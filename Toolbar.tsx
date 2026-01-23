
import React from 'react';
import { MousePointer2, Hand, Undo2, Target, RotateCw, Trash2, ZoomIn, ZoomOut } from 'lucide-react';

interface ToolbarProps {
  tool: 'select' | 'pan';
  setTool: (tool: 'select' | 'pan') => void;
  undo: () => void;
  canUndo: boolean;
  centerView: () => void;
  rotateSelected: () => void;
  deleteSelected: () => void;
  handleZoom: (delta: number) => void;
  scale: number;
  selectionSize: number;
}

const Toolbar: React.FC<ToolbarProps> = ({
  tool, setTool, undo, canUndo, centerView, rotateSelected, deleteSelected, handleZoom, scale, selectionSize
}) => {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-[#0A1A0F]/90 backdrop-blur-md border border-[#1A4A23] rounded-2xl shadow-2xl z-20">
      <button 
        onClick={() => setTool('select')} 
        className={`relative group p-3 rounded-xl transition-all ${tool === 'select' ? 'bg-emerald-500 text-black' : 'text-emerald-900 hover:bg-[#152B1B]'}`}
        title="Select Tool [V]"
      >
        <MousePointer2 size={20} />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-zinc-900 text-emerald-500 px-1 rounded border border-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity">V</span>
      </button>
      
      <button 
        onClick={() => setTool('pan')} 
        className={`relative group p-3 rounded-xl transition-all ${tool === 'pan' ? 'bg-emerald-500 text-black' : 'text-emerald-900 hover:bg-[#152B1B]'}`}
        title="Pan Tool [H]"
      >
        <Hand size={20} />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-zinc-900 text-emerald-500 px-1 rounded border border-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity">H</span>
      </button>
      
      <div className="w-px h-6 bg-zinc-800 mx-1" />
      
      <button 
        onClick={undo} 
        className="relative group p-3 text-emerald-500 hover:bg-[#152B1B] rounded-xl disabled:opacity-20" 
        disabled={!canUndo}
        title="Undo [Ctrl+Z]"
      >
        <Undo2 size={20} />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-zinc-900 text-emerald-500 px-1 rounded border border-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity">Z</span>
      </button>
      
      <button 
        onClick={centerView} 
        className="relative group p-3 text-emerald-500 hover:bg-[#152B1B] rounded-xl"
        title="Center View [C]"
      >
        <Target size={20} />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-zinc-900 text-emerald-500 px-1 rounded border border-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity">C</span>
      </button>
      
      <button 
        onClick={rotateSelected} 
        className="relative group p-3 text-emerald-500 hover:bg-[#152B1B] rounded-xl disabled:opacity-30" 
        disabled={selectionSize === 0}
        title="Rotate Selected [R]"
      >
        <RotateCw size={20} />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-zinc-900 text-emerald-500 px-1 rounded border border-emerald-900/50 opacity-0 group-hover:opacity-100 transition-opacity">R</span>
      </button>
      
      <button 
        onClick={deleteSelected} 
        className="relative group p-3 text-emerald-500 hover:bg-red-500/20 hover:text-red-400 rounded-xl disabled:opacity-30" 
        disabled={selectionSize === 0}
        title="Delete Selected [Del]"
      >
        <Trash2 size={20} />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-zinc-900 text-red-500 px-1 rounded border border-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity">DEL</span>
      </button>
      
      <div className="w-px h-6 bg-zinc-800 mx-1" />
      
      <div className="flex items-center gap-1 bg-zinc-950/50 rounded-xl px-2">
        <button className="p-2 text-zinc-400 hover:text-white" onClick={() => handleZoom(1)}><ZoomIn size={16} /></button>
        <span className="text-[10px] font-mono text-zinc-600 w-12 text-center">{Math.round(scale * 100)}%</span>
        <button className="p-2 text-zinc-400 hover:text-white" onClick={() => handleZoom(-1)}><ZoomOut size={16} /></button>
      </div>
    </div>
  );
};

export default Toolbar;
