import React from 'react';
import { X } from 'lucide-react';

const StateFilterBar = ({ chips, onRemove, onClearAll }) => {
  if (!chips.length) return null;
  return (
    <div className="flex items-center flex-wrap gap-2">
      {chips.map((chip) => (
        <button key={chip.id} type="button" onClick={() => onRemove(chip.id)} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-medium border border-cyan-100">
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button onClick={onClearAll} className="text-xs text-slate-600 hover:text-slate-900">Clear all</button>
    </div>
  );
};

export default StateFilterBar;
