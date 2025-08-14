"use client";

import { useEffect, useState } from "react";

interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  group?: string;
  url?: string;
  isConnected?: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function CitationGraphPage() {
  const [allData, setAllData] = useState<GraphData>({ nodes: [], links: [] });
  const [filteredData, setFilteredData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const closeModal = () => {
    setSelectedNode(null);
  };

  useEffect(() => {
    fetch("/api/citation-network")
      .then((res) => res.json())
      .then((data) => {
        // Remove duplicate nodes by ID
        const uniqueNodes = data.nodes.filter(
          (node: GraphNode, index: number, array: GraphNode[]) =>
            array.findIndex((n: GraphNode) => n.id === node.id) === index
        );

        // Remove duplicate links
        const uniqueLinks = data.edges.filter(
          (link: GraphLink, index: number, array: GraphLink[]) =>
            array.findIndex(
              (l: GraphLink) =>
                l.source === link.source && l.target === link.target
            ) === index
        );

        console.log(
          `Original nodes: ${data.nodes.length}, Unique nodes: ${uniqueNodes.length}`
        );
        console.log(
          `Original links: ${data.edges.length}, Unique links: ${uniqueLinks.length}`
        );
        console.log("Sample links:", uniqueLinks.slice(0, 3));
        console.log("Sample nodes:", uniqueNodes.slice(0, 3));
        console.log(
          "Connected nodes count:",
          uniqueNodes.filter((n: GraphNode) => n.isConnected).length
        );
        console.log(
          "Connected nodes sample:",
          uniqueNodes.filter((n: GraphNode) => n.isConnected).slice(0, 3)
        );

        // Improved layout algorithm to prevent overlapping
        const svgWidth = 800;
        const svgHeight = 600;
        const nodeCount = uniqueNodes.length;

        let nodes;

        if (nodeCount <= 12) {
          // For small networks, use circular layout with adaptive radius
          const centerX = svgWidth / 2;
          const centerY = svgHeight / 2;
          const radius = Math.min(centerX - 100, centerY - 100, 250); // Adaptive radius

          nodes = uniqueNodes.map((node: GraphNode, index: number) => ({
            ...node,
            x: centerX + radius * Math.cos((index * 2 * Math.PI) / nodeCount),
            y: centerY + radius * Math.sin((index * 2 * Math.PI) / nodeCount),
          }));
        } else {
          // For larger networks, use grid layout with some randomization
          const cols = Math.ceil(Math.sqrt(nodeCount));
          const rows = Math.ceil(nodeCount / cols);
          const cellWidth = (svgWidth - 100) / cols;
          const cellHeight = (svgHeight - 100) / rows;
          const startX = 50 + cellWidth / 2;
          const startY = 50 + cellHeight / 2;

          nodes = uniqueNodes.map((node: GraphNode, index: number) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            // Add some randomization to avoid perfect grid alignment
            const jitterX = (Math.random() - 0.5) * cellWidth * 0.3;
            const jitterY = (Math.random() - 0.5) * cellHeight * 0.3;

            return {
              ...node,
              x: startX + col * cellWidth + jitterX,
              y: startY + row * cellHeight + jitterY,
            };
          });
        }

        const graphData = { nodes, links: uniqueLinks };
        setAllData(graphData);
        setFilteredData(graphData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching citation network:", err);
        setIsLoading(false);
      });
  }, []);

  const handleFilter = () => {
    const filteredNodes = allData.nodes.filter(
      (node) =>
        searchTerm.trim() === "" ||
        node.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredLinks = allData.links.filter(
      (link) =>
        filteredNodes.some((n) => n.id === link.source) &&
        filteredNodes.some((n) => n.id === link.target)
    );

    setFilteredData({ nodes: filteredNodes, links: filteredLinks });
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredData(allData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-2xl">
            <svg
              className="w-8 h-8 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <div className="mb-4">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-lg font-semibold text-gray-700">
                Loading citation network...
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Building connections between research papers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
              Citation Network
            </h1>
            <p className="text-gray-600 text-lg">
              {filteredData.nodes.length} papers • {filteredData.links.length}{" "}
              citations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search papers by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFilter()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleFilter}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
            >
              Filter
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 mb-6">
        <div className="flex gap-6 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">
              Connected Papers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700">
              Isolated Papers
            </span>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 min-h-[600px]">
        {filteredData.nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12H6.008z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No papers found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          </div>
        ) : (
          <svg
            width="800"
            height="600"
            className="w-full h-full min-w-[800px] min-h-[600px] bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
            viewBox="0 0 800 600"
          >
            {/* Background grid for better visualization */}
            <defs>
              <pattern
                id="grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Links */}
            {filteredData.links.map((link, index) => {
              const sourceNode = filteredData.nodes.find(
                (n) => n.id === link.source
              );
              const targetNode = filteredData.nodes.find(
                (n) => n.id === link.target
              );

              if (
                !sourceNode ||
                !targetNode ||
                !sourceNode.x ||
                !sourceNode.y ||
                !targetNode.x ||
                !targetNode.y
              ) {
                return null;
              }

              return (
                <line
                  key={index}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#10b981"
                  strokeWidth="2"
                  opacity="0.8"
                />
              );
            })}

            {/* Node shadows */}
            {filteredData.nodes.map((node) => (
              <circle
                key={`shadow-${node.id}`}
                cx={node.x! + 1}
                cy={node.y! + 1}
                r="6"
                fill="#000"
                opacity="0.1"
              />
            ))}

            {/* Nodes */}
            {filteredData.nodes.map((node) => (
              <g
                key={`node-${node.id}`}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: "pointer" }}
              >
                {/* Node background circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="6"
                  fill="#ffffff"
                  stroke={node.isConnected ? "#10b981" : "#94a3b8"}
                  strokeWidth="2"
                />
                {/* Node center dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="2"
                  fill={node.isConnected ? "#10b981" : "#94a3b8"}
                />
                {/* Node label with background */}
                <rect
                  x={node.x! - 30}
                  y={node.y! - 20}
                  width="60"
                  height="12"
                  rx="6"
                  fill="rgba(255, 255, 255, 0.95)"
                  stroke="#d1d5db"
                  strokeWidth="0.5"
                />
                <text
                  x={node.x}
                  y={node.y! - 12}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#1f2937"
                  fontFamily="var(--font-montserrat), Inter, sans-serif"
                  fontWeight="500"
                >
                  {node.label.length > 10
                    ? `${node.label.substring(0, 10)}...`
                    : node.label}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* Modal for showing full title */}
      {selectedNode && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-gray-200/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Paper Details
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 uppercase tracking-wide">
                  Full Title
                </h3>
                <div className="prose prose-gray max-w-none">
                  {selectedNode.url ? (
                    <a
                      href={selectedNode.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-blue-700 transition-colors duration-200 text-lg leading-relaxed font-medium no-underline hover:underline"
                    >
                      {selectedNode.label}
                    </a>
                  ) : (
                    <p className="text-gray-900 text-lg leading-relaxed font-medium">
                      {selectedNode.label}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
