import React from 'react';
import { Filter, Layers, Check } from 'lucide-react';

const ENTITY_TYPES = [
  { id: 'Concept', label: 'Concepts', color: 'bg-cyan-500' },
  { id: 'Methodology', label: 'Methodologies', color: 'bg-purple-500' },
  { id: 'Organization', label: 'Organizations', color: 'bg-emerald-500' },
  { id: 'Finding', label: 'Findings', color: 'bg-amber-500' },
  { id: 'Contradiction', label: 'Contradictions', color: 'bg-rose-500' }
];

export default function EntityFilterBar({ activeFilters, onToggleFilter, onResetFilters }) {
  const isAll = activeFilters.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 shadow-md text-xs">
      <div className="flex items-center gap-1.5 px-2 font-semibold text-slate-400">
        <Filter className="w-3.5 h-3.5 text-cyan-400" />
        <span>Filter Entity Graph:</span>
      </div>

      <button
        onClick={onResetFilters}
        className={`px-3 py-1 rounded-lg font-semibold transition-all ${
          isAll
            ? 'bg-cyan-500 text-black shadow-md font-bold'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        Show All
      </button>

      {ENTITY_TYPES.map((type) => {
        const isActive = activeFilters.includes(type.id);
        return (
          <button
            key={type.id}
            onClick={() => onToggleFilter(type.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold border transition-all ${
              isActive
                ? `${type.color} text-black font-bold border-transparent shadow-md`
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${type.color}`}></span>
            <span>{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}
