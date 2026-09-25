import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, UploadCloud, Trash2, Eye, Network, Sparkles, BookOpen, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import DocumentUploader from '../components/DocumentUploader';
import DocumentViewerModal from '../components/DocumentViewerModal';
import API from '../services/api';

export default function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForView, setSelectedDocForView] = useState(null);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/documents');
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document from your repository?')) return;
    try {
      await API.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error('Delete document failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar onOpenUpload={() => setShowUploadModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Page Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Research Document Repository
            </h2>
            <p className="text-xs text-slate-400">
              Manage uploaded PDFs, TXT research articles, and AI entity extraction pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
            >
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              Upload New Paper
            </button>

            <button
              onClick={() => navigate('/workspace')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Network className="w-4 h-4" />
              Synthesize Knowledge Graph
            </button>
          </div>
        </div>

        {/* Document Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
              Uploaded Research Papers ({documents.length})
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 text-xs font-mono animate-pulse">
              Fetching research documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No Research Papers Uploaded Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your research PDFs or text documents to extract key entities, evaluate claims, and render interactive Knowledge Graphs.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg transition-all"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-slate-900/90 hover:bg-slate-800/90 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Indexed
                        </span>
                        <button
                          onClick={(e) => handleDelete(doc.id, e)}
                          title="Delete Document"
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {doc.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 font-mono">
                      Uploaded {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedDocForView(doc.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      View Text
                    </button>

                    <button
                      onClick={() => navigate(`/workspace?docId=${doc.id}`)}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all"
                    >
                      <Network className="w-3.5 h-3.5" />
                      Synthesize Graph
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg">
            <DocumentUploader
              onUploadSuccess={() => fetchDocuments()}
              onClose={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}

      {/* Document Reader Modal */}
      {selectedDocForView && (
        <DocumentViewerModal
          documentId={selectedDocForView}
          onClose={() => setSelectedDocForView(null)}
        />
      )}

    </div>
  );
}
