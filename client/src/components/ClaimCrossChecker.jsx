import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Search, Filter, Bookmark, ExternalLink } from 'lucide-react';

export default function ClaimCrossChecker({ claims, onSelectClaim }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('ALL');

  const filteredClaims = (claims || []).filter((c) => {
    const matchesSearch = (c.claim || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.documentTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = filterScore === 'ALL' || c.evidenceScore === filterScore;
    return matchesSearch && matchesScore;
  });

  const getBadgeStyle = (score) => {
    switch (score) {
      case 'Strong':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Moderate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Weak':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col h-full">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Extracted Claims & Evidence Cross-Checker
          </h3>
          <p className="text-xs text-slate-400">Cross-verifies claims across uploaded papers with confidence scores.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {['ALL', 'Strong', 'Moderate', 'Weak'].map((score) => (
            <button
              key={score}
              onClick={() => setFilterScore(score)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                filterScore === score
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mt-3">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter claims or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Claims List */}
      <div className="mt-4 space-y-3 overflow-y-auto max-h-[420px] pr-1">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No claims found matching your current filter criteria.
          </div>
        ) : (
          filteredClaims.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectClaim && onSelectClaim(item)}
              className="group bg-slate-950/60 hover:bg-slate-800/60 p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer space-y-2 relative"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border ${getBadgeStyle(item.evidenceScore)}`}>
                  {item.evidenceScore} Evidence
                </span>
                
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 truncate max-w-[200px]">
                  <Bookmark className="w-3 h-3 text-cyan-400" />
                  {item.documentTitle || 'Primary Paper'}
                </span>
              </div>

              {/* Claim Statement */}
              <p className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors leading-relaxed">
                "{item.claim}"
              </p>

              {/* Citation Context snippet */}
              {item.citationContext && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2 bg-slate-900/80 p-2 rounded border border-slate-800/50">
                  Snippet: {item.citationContext}
                </p>
              )}

              {/* Conflict indicator if flagged */}
              {item.conflictWithDoc && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Contradicts Secondary Literature Benchmarks</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
