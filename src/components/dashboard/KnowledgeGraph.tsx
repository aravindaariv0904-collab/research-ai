import React, { useState, useMemo } from 'react';
import { ResearchReport, KnowledgeGraphNode, KnowledgeGraphEdge } from '../../types/research';
import { Card } from '../ui/Card';
import { Search, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

interface KnowledgeGraphProps {
  report: ResearchReport;
}

export function KnowledgeGraph({ report }: KnowledgeGraphProps) {
  const { nodes, edges } = report.knowledgeGraph;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Entity Type Color Map
  const typeColors = {
    Company: { bg: '#8b5cf6', stroke: 'rgba(139,92,246,0.3)', text: '#e9d5ff' },
    Technology: { bg: '#06b6d4', stroke: 'rgba(6,182,212,0.3)', text: '#cffafe' },
    Concept: { bg: '#ec4899', stroke: 'rgba(236,72,153,0.3)', text: '#fce7f3' },
    Researcher: { bg: '#f59e0b', stroke: 'rgba(245,158,11,0.3)', text: '#fef3c7' },
    Product: { bg: '#10b981', stroke: 'rgba(16,185,129,0.3)', text: '#d1fae5' },
    Industry: { bg: '#3b82f6', stroke: 'rgba(59,130,246,0.3)', text: '#dbeafe' },
  };

  // Edge Type Styles
  const edgeColors = {
    'Related To': '#475569',
    'Uses': '#06b6d4',
    'Influences': '#8b5cf6',
    'Competes With': '#rose-500',
  };

  // Node coordinate generator (spiral layout for even spacing)
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const center = { x: 350, y: 220 };
    
    nodes.forEach((node, index) => {
      if (index === 0) {
        // Core node is at the center
        positions[node.id] = { ...center };
      } else {
        // Distribute others around the center in a spiral layout
        const angle = (index * 2 * Math.PI) / (nodes.length - 1);
        const radius = 130 + (index % 2) * 35; // alternating radius for staggered spacing
        positions[node.id] = {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius
        };
      }
    });
    
    return positions;
  }, [nodes]);

  // Handle graph dragging (panning)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2.5, prev * factor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setSearchTerm('');
  };

  // Determine highlighted nodes & edges based on search & selection
  const highlightedNodes = useMemo(() => {
    const list = new Set<string>();
    
    if (selectedNodeId) {
      list.add(selectedNodeId);
      // Add neighbors
      edges.forEach(edge => {
        if (edge.source === selectedNodeId) list.add(edge.target);
        if (edge.target === selectedNodeId) list.add(edge.source);
      });
    } else if (searchTerm.trim() !== '') {
      nodes.forEach(node => {
        if (node.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.add(node.id);
        }
      });
    } else {
      // Nothing selected or searched: highlight everything
      nodes.forEach(n => list.add(n.id));
    }
    
    return list;
  }, [nodes, edges, selectedNodeId, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-2">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight text-white">NEXUS Knowledge Graph</h2>
            <span className="text-xs text-slate-500">Interactive semantic mapping of entities (companies, systems, technologies) and their relationships.</span>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Node search */}
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedNodeId(null); // clear node click selection when searching
              }}
              className="w-full bg-slate-950/60 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/30"
            />
          </div>

          <div className="flex rounded-lg border border-white/10 bg-slate-950/40 p-1 gap-1 shrink-0">
            <button onClick={() => handleZoom(1.2)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => handleZoom(0.8)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={resetView} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white" title="Reset View">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Graph SVG Box */}
        <div className="lg:col-span-3">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full h-[450px] bg-slate-950/60 border border-white/10 rounded-2xl overflow-hidden relative cursor-grab select-none ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
          >
            {/* Panning / Zooming Container */}
            <svg width="100%" height="100%" className="absolute inset-0">
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* 1. Draw Edges (Lines) */}
                {edges.map((edge, idx) => {
                  const sourcePos = nodePositions[edge.source];
                  const targetPos = nodePositions[edge.target];
                  if (!sourcePos || !targetPos) return null;

                  const isEdgeHighlighted =
                    highlightedNodes.has(edge.source) && highlightedNodes.has(edge.target);

                  return (
                    <g key={idx} className="transition-opacity duration-300" style={{ opacity: isEdgeHighlighted ? 1 : 0.15 }}>
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke={edgeColors[edge.relationship] || '#475569'}
                        strokeWidth={isEdgeHighlighted ? 2 : 1}
                        strokeDasharray={edge.relationship === 'Competes With' ? '4,4' : undefined}
                      />
                      {/* Edge Label at midpoint */}
                      <text
                        x={(sourcePos.x + targetPos.x) / 2}
                        y={(sourcePos.y + targetPos.y) / 2 - 4}
                        fill="#64748b"
                        fontSize="8"
                        textAnchor="middle"
                        className="pointer-events-none font-semibold tracking-wider uppercase"
                      >
                        {edge.relationship}
                      </text>
                    </g>
                  );
                })}

                {/* 2. Draw Nodes (Circles) */}
                {nodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;

                  const isNodeHighlighted = highlightedNodes.has(node.id);
                  const isSelected = selectedNodeId === node.id;
                  const typeStyle = typeColors[node.type] || typeColors.Concept;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(isSelected ? null : node.id);
                      }}
                      className="cursor-pointer transition-all duration-300"
                      style={{ opacity: isNodeHighlighted ? 1 : 0.2 }}
                    >
                      {/* Outer halo */}
                      <circle
                        r={22}
                        fill="transparent"
                        stroke={isSelected ? '#c084fc' : typeStyle.stroke}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className={isSelected ? 'animate-pulse' : ''}
                      />
                      {/* Core circle */}
                      <circle
                        r={14}
                        fill={typeStyle.bg}
                        stroke="#070b14"
                        strokeWidth={1.5}
                      />
                      {/* Node Label */}
                      <text
                        y={32}
                        fill="#f1f5f9"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        className="pointer-events-none font-sans"
                      >
                        {node.label}
                      </text>
                      {/* Node Sub-Type label */}
                      <text
                        y={42}
                        fill="#64748b"
                        fontSize="7"
                        textAnchor="middle"
                        className="pointer-events-none tracking-wide font-mono uppercase"
                      >
                        {node.type}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            
            {/* Help instructions info label overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-slate-900/80 border border-white/5 rounded-lg p-2 text-[10px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-purple-400" />
              <span>Click a node to highlight its relationships. Drag to pan. Scroll to zoom.</span>
            </div>
          </div>
        </div>

        {/* Legend / Sidebar info panel */}
        <div className="space-y-4">
          <Card className="border border-white/5 bg-slate-950/40 p-4 space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Entity Legend</h4>
            <div className="space-y-2">
              {Object.entries(typeColors).map(([type, style]) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: style.bg }} />
                  <span className="text-slate-300 font-medium">{type}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-white/5 bg-slate-950/40 p-4 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Entity Analysis</h4>
            {selectedNodeId ? (
              (() => {
                const nodeObj = nodes.find(n => n.id === selectedNodeId);
                const connectedEdges = edges.filter(e => e.source === selectedNodeId || e.target === selectedNodeId);
                return (
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Selected Label</div>
                      <div className="text-sm font-bold text-slate-100">{nodeObj?.label}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Category</div>
                      <div className="text-slate-300 font-semibold">{nodeObj?.type}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Semantic Connections ({connectedEdges.length})</div>
                      <div className="space-y-1.5 mt-1.5">
                        {connectedEdges.map((e, idx) => {
                          const neighborId = e.source === selectedNodeId ? e.target : e.source;
                          const neighbor = nodes.find(n => n.id === neighborId);
                          return (
                            <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/5 text-[10px]">
                              <span className="text-slate-400">{e.relationship}</span>
                              <strong className="text-slate-200">{neighbor?.label}</strong>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Click any node on the graph to drill down into its semantic connections and review its isolated relational analysis.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
