"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface GraphNode {
  id: string;
  label: string;
  group?: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  { ssr: false }
);

export default function CitationGraphPage() {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [allData, setAllData] = useState<GraphData>({ nodes: [], links: [] });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/citation-network")
      .then((res) => res.json())
      .then((data) => {
        setGraphData({ nodes: data.nodes, links: data.edges });
        setAllData({ nodes: data.nodes, links: data.edges });
      })
      .catch((err) => console.error("Error fetching citation network:", err));
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

    setGraphData({ nodes: filteredNodes, links: filteredLinks });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Filter Controls */}
      <div
        style={{
          padding: "0.5rem",
          backgroundColor: "#fff",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.4rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            flex: 1,
            fontFamily: "Inter, sans-serif",
          }}
        />
        <button
          onClick={handleFilter}
          style={{
            padding: "0.4rem 0.8rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Apply
        </button>
      </div>

      {/* Graph */}
      <div style={{ flex: 1 }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="label"
          nodeAutoColorBy="group"
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          backgroundColor="#f9fafb"
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = (node as GraphNode).label;
            const fontSize = Math.max(12 / globalScale, 4);
            ctx.font = `${fontSize}px Inter`;
            ctx.fillStyle = "#111827";
            if (typeof node.x === "number" && typeof node.y === "number") {
              ctx.fillText(label, node.x + 6, node.y + 3);
            }
          }}
        />
      </div>
    </div>
  );
}
