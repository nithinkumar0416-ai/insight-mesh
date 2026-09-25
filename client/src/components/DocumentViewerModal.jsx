import React, { useState, useEffect } from 'react';
import { X, FileText, BookOpen, Search, Bookmark } from 'lucide-react';
import API from '../services/api';

export default function DocumentViewerModal({ documentId, onClose }) {
  const [docData, setDocData] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!documentId) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/documents/${documentId}`);
        setDocData(res.data.document);
        setParagraphs(res.data.paragraphs || []);
      } catch (err) {
        console.error('Failed to load document text:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (!documentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0F172A] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white truncate max-w-xl">
                {docData?.title || 'Document Reader'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {paragraphs.length} Structured Paragraphs • Evidence Indexed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside Document */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search terms inside document text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Document Body Reader */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-sm bg-[#0B0F19]">
          {loading ? (
            <div className="text-center py-20 text-slate-500 text-xs font-mono animate-pulse">
              Loading document text and indexing paragraphs...
            </div>
          ) : paragraphs.length === 0 ? (
            <div className="whitespace-pre-wrap text-slate-300 font-mono text-xs leading-relaxed p-4 bg-slate-950 rounded-xl border border-slate-800">
              {docData?.extracted_text}
            </div>
          ) : (
            paragraphs.map((p, idx) => {
              const isMatch = searchTerm && p.text.toLowerCase().includes(searchTerm.toLowerCase());
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isMatch
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2 border-b border-slate-800/50 pb-1">
                    <span className="flex items-center gap-1 font-bold">
                      <Bookmark className="w-3 h-3" />
                      Paragraph {p.paragraphNumber || idx + 1}
                    </span>
                    <span>Approx. Page {p.approxPage || Math.floor(idx / 3) + 1}</span>
                  </div>
                  <p className="leading-relaxed text-xs font-sans">{p.text}</p>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
