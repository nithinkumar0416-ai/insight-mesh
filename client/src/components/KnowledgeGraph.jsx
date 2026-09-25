import React, { useState, useEffect, useRef } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Filter, Eye, Layers, ShieldCheck, Sparkles, FileText } from 'lucide-react';

const ENTITY_COLORS = {
  Concept: { bg: '#06B6D4', text: '#E0F2FE', border: '#0284C7', glow: 'rgba(6, 182, 212, 0.4)' },
  Methodology: { bg: '#8B5CF6', text: '#F3E8FF', border: '#7C3AED', glow: 'rgba(139, 92, 246, 0.4)' },
  Organization: { bg: '#10B981', text: '#D1FAE5', border: '#059669', glow: 'rgba(16, 185, 129, 0.4)' },
  Finding: { bg: '#F59E0B', text: '#FEF3C7', border: '#D97706', glow: 'rgba(245, 158, 11, 0.4)' },
  Contradiction: { bg: '#F43F5E', text: '#FFE4E6', border: '#E11D48', glow: 'rgba(244, 63, 94, 0.4)' }
};

export default function KnowledgeGraph({ graphData, onSelectNode, selectedNodeId, activeFilters }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  const nodes = graphData?.nodes || [];
  const links = graphData?.links || [];

  // Filter nodes based on entity types selected
  const filteredNodes = nodes.filter((n) => {
    if (!activeFilters || activeFilters.length === 0) return true;
    return activeFilters.includes(n.type);
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredLinks = links.filter(l => 
    filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target)
  );

  // Initialize node positions in a dynamic circular/force layout
  useEffect(() => {
    if (nodes.length === 0) return;

    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const initialPos = {};
    nodes.forEach((node, index) => {
      // Use existing drag position if available
      if (nodePositions[node.id]) {
        initialPos[node.id] = nodePositions[node.id];
        return;
      }

      const angle = (index / nodes.length) * 2 * Math.PI;
      // Add slight multi-ring offset based on node importance / index
      const ringOffset = (index % 2 === 0 ? 0.85 : 1.15);
      const r = radius * ringOffset;
      
      initialPos[node.id] = {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });

    setNodePositions(initialPos);
  }, [nodes.length]);

  // Handle Pan Dragging
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'graph-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (draggingNodeId) {
      const svg = containerRef.current.getBoundingClientRect();
      const newX = (e.clientX - svg.left - pan.x) / zoom;
      const newY = (e.clientY - svg.top - pan.y) / zoom;

      setNodePositions(prev => ({
        ...prev,
        [draggingNodeId]: { x: newX, y: newY }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[600px] bg-[#0B0F19] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col select-none">
      
      {/* Graph Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800 text-xs font-semibold text-slate-300">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Knowledge Graph</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[11px]">
            {filteredNodes.length} Entities
          </span>
        </div>

        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.4))}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset View"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-lg text-[11px]">
        {Object.entries(ENTITY_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.bg }}></span>
            <span className="text-slate-300 font-medium">{type}</span>
          </div>
        ))}
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      >
        <svg
          id="graph-bg"
          className="w-full h-full"
          viewBox="0 0 800 550"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            {/* Arrowhead marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect id="graph-bg" width="100%" height="100%" fill="url(#grid)" />

          {/* Scalable Container */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            
            {/* Render Links */}
            {filteredLinks.map((link, index) => {
              const sourcePos = nodePositions[link.source];
              const targetPos = nodePositions[link.target];
              if (!sourcePos || !targetPos) return null;

              const isConnectedToHover = hoveredNodeId && (link.source === hoveredNodeId || link.target === hoveredNodeId);
              const isSelectedLink = selectedNodeId && (link.source === selectedNodeId || link.target === selectedNodeId);

              const strokeColor = link.isCrossDocument ? '#06B6D4' : isConnectedToHover || isSelectedLink ? '#3B82F6' : '#334155';
              const strokeWidth = link.isCrossDocument ? 2.5 : isConnectedToHover ? 2 : 1.2;

              const midX = (sourcePos.x + targetPos.x) / 2;
              const midY = (sourcePos.y + targetPos.y) / 2;

              return (
                <g key={`link-${index}`}>
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={link.isCrossDocument ? '5,5' : 'none'}
                    markerEnd="url(#arrow)"
                    className="transition-all duration-300"
                  />
                  {/* Relation Label / Badge */}
                  {link.isCrossDocument && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="20"
                        rx="10"
                        fill="#0F172A"
                        stroke="#06B6D4"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#06B6D4"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        Cross-Doc {link.confidence}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const color = ENTITY_COLORS[node.type] || ENTITY_COLORS.Concept;
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isMultiDoc = node.documents && node.documents.length > 1;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }}
                  onClick={() => onSelectNode && onSelectNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Aura for Selected or Multi-Doc Nodes */}
                  {(isSelected || isMultiDoc) && (
                    <circle
                      r={isSelected ? 28 : 24}
                      fill="none"
                      stroke={color.bg}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Base Node Circle */}
                  <circle
                    r={isSelected ? 22 : isHovered ? 20 : 18}
                    fill="#0F172A"
                    stroke={color.bg}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 shadow-xl"
                  />

                  {/* Inner Node Color Badge */}
                  <circle
                    r={isSelected ? 10 : 8}
                    fill={color.bg}
                  />

                  {/* Multi-Document Badge */}
                  {isMultiDoc && (
                    <g transform="translate(12, -12)">
                      <circle r="8" fill="#06B6D4" stroke="#0F172A" strokeWidth="1.5" />
                      <text x="0" y="3" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">
                        {node.documents.length}
                      </text>
                    </g>
                  )}

                  {/* Node Label Text */}
                  <text
                    x="0"
                    y="36"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#E2E8F0'}
                    fontSize={isSelected ? '12' : '11'}
                    fontWeight={isSelected ? 'bold' : '500'}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {node.name.length > 22 ? `${node.name.slice(0, 20)}...` : node.name}
                  </text>

                  {/* Subtitle / Type */}
                  <text
                    x="0"
                    y="48"
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {node.type}
                  </text>
                </g>
              );
            })}

          </g>
        </svg>

        {/* Floating Node Details Card */}
        {selectedNodeId && (() => {
          const selNode = nodes.find(n => n.id === selectedNodeId);
          if (!selNode) return null;
          const col = ENTITY_COLORS[selNode.type] || ENTITY_COLORS.Concept;

          return (
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-20 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider font-mono inline-block mb-1"
                    style={{ backgroundColor: `${col.bg}20`, color: col.bg, borderColor: `${col.bg}40`, borderWidth: 1 }}
                  >
                    {selNode.type} • {selNode.importance} Priority
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">{selNode.name}</h4>
                </div>
                <div className="flex items-center gap-1 bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-lg text-[11px] font-mono border border-cyan-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {selNode.confidence}% Conf
                </div>
              </div>

              {selNode.description && (
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">{selNode.description}</p>
              )}

              {/* Source Papers list */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Citations: <strong className="text-slate-200">{selNode.docTitles?.length || 1} Document(s)</strong></span>
                </div>
                <button
                  onClick={() => onSelectNode && onSelectNode(selNode)}
                  className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Trace Evidence
                </button>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
