import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Network, Sparkles, Layers, RefreshCw, FileText, CheckCircle2, ShieldCheck, Download, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import KnowledgeGraph from '../components/KnowledgeGraph';
import ExecutiveSummaryPanel from '../components/ExecutiveSummaryPanel';
import ClaimCrossChecker from '../components/ClaimCrossChecker';
import EntityFilterBar from '../components/EntityFilterBar';
import EvidenceInspectorModal from '../components/EvidenceInspectorModal';
import DocumentViewerModal from '../components/DocumentViewerModal';
import DocumentUploader from '../components/DocumentUploader';
import API from '../services/api';

export default function ResearchWorkspace() {
  const [searchParams] = useSearchParams();
  const targetDocId = searchParams.get('docId');

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [claims, setClaims] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [graphMeta, setGraphMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedItemForInspector, setSelectedItemForInspector] = useState(null);
  const [selectedDocForReader, setSelectedDocForReader] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [summaryText, setSummaryText] = useState('');

  const fetchKnowledgeGraph = async () => {
    try {
      setLoading(true);
      const res = await API.post('/ai/graph-synthesis', {
        documentIds: targetDocId ? [targetDocId] : []
      });

      setGraphData(res.data.graph || { nodes: [], links: [] });
      setClaims(res.data.claims || []);
      setDocuments(res.data.documents || []);
      setGraphMeta(res.data.meta || null);

      if (res.data.claims && res.data.claims.length > 0) {
        setSummaryText(res.data.claims.map((c, i) => `${i + 1}. ${c.claim}`).join('\n'));
      }
    } catch (err) {
      console.error('Failed to load Knowledge Graph synthesis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeGraph();
  }, [targetDocId]);

  const handleToggleFilter = (typeId) => {
    if (activeFilters.includes(typeId)) {
      setActiveFilters(activeFilters.filter(f => f !== typeId));
    } else {
      setActiveFilters([...activeFilters, typeId]);
    }
  };

  const handleResetFilters = () => {
    setActiveFilters([]);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSelectedItemForInspector(node);
  };

  const handleClaimClick = (claim) => {
    setSelectedItemForInspector(claim);
  };

  const handleExportGraphJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graphData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "insightmesh_knowledge_graph.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar onOpenUpload={() => setShowUploadModal(true)} />

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Workspace Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Interactive Research Workspace</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {documents.length} Document(s) Synthesized
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualizing multi-document entity networks, evidence scores, and citation mappings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchKnowledgeGraph}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Re-Synthesize
            </button>

            <button
              onClick={handleExportGraphJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Graph JSON
            </button>
          </div>
        </div>

        {/* Entity Filter Bar */}
        <EntityFilterBar
          activeFilters={activeFilters}
          onToggleFilter={handleToggleFilter}
          onResetFilters={handleResetFilters}
        />

        {/* Workspace Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left / Main Graph Visualization Panel */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
            {loading ? (
              <div className="w-full h-[600px] bg-[#0B0F19] rounded-2xl border border-slate-800/80 flex items-center justify-center flex-col gap-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs font-mono text-cyan-300">
                  Executing Gemini 3 Multi-Model Entity Extraction & Graph Synthesis...
                </p>
              </div>
            ) : (
              <KnowledgeGraph
                graphData={graphData}
                onSelectNode={handleNodeClick}
                selectedNodeId={selectedNode?.id}
                activeFilters={activeFilters}
              />
            )}
          </div>

          {/* Right Sidebar: AI Synthesis & Claims Panel */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6">
            <ExecutiveSummaryPanel
              graphMeta={graphMeta}
              docCount={documents.length}
              summaryText={summaryText}
            />

            <ClaimCrossChecker
              claims={claims}
              onSelectClaim={handleClaimClick}
            />
          </div>

        </div>

      </main>

      {/* Evidence Inspector Modal */}
      {selectedItemForInspector && (
        <EvidenceInspectorModal
          selectedItem={selectedItemForInspector}
          onClose={() => setSelectedItemForInspector(null)}
          onOpenDocumentViewer={(docId) => {
            setSelectedDocForReader(docId || documents[0]?.id);
            setSelectedItemForInspector(null);
          }}
        />
      )}

      {/* Full Document Reader Modal */}
      {selectedDocForReader && (
        <DocumentViewerModal
          documentId={selectedDocForReader}
          onClose={() => setSelectedDocForReader(null)}
        />
      )}

      {/* Document Uploader Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg">
            <DocumentUploader
              onUploadSuccess={() => fetchKnowledgeGraph()}
              onClose={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
