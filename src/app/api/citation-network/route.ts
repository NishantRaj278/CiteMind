import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongo = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB || "healthcareDB";

export async function GET() {
  try {
    await mongo.connect();
    const collection = mongo.db(dbName).collection("papers");

    // Fetch all papers (you can limit for big datasets)
    const papers = await collection.find({}).toArray();

    // Build graph nodes
    const nodes = papers.map((p) => ({
      id: p.id,
      label: p.title,
      year: p.year,
      url:
        p.url && p.url !== "" && p.url !== "#"
          ? p.url
          : p.id
          ? `https://www.semanticscholar.org/paper/${p.id}`
          : `https://scholar.google.com/scholar?q=${encodeURIComponent(
              p.title || "research paper"
            )}`,
    }));

    // Build graph edges based on references
    const edges: { source: string; target: string }[] = [];
    const connectedNodeIds = new Set<string>();

    console.log(`Processing ${papers.length} papers for connections`);

    for (const paper of papers) {
      if (Array.isArray(paper.references)) {
        console.log(
          `Paper ${paper.id} has ${paper.references.length} references`
        );
        for (const ref of paper.references) {
          // Only add edge if the referenced paper exists in the DB
          const referencedPaper = papers.find((p) => p.id === ref);
          if (referencedPaper) {
            edges.push({ source: paper.id, target: ref });
            // Mark both nodes as connected
            connectedNodeIds.add(paper.id);
            connectedNodeIds.add(ref);
            console.log(`Connection found: ${paper.id} -> ${ref}`);
          }
        }
      }
    }

    console.log(`Total edges: ${edges.length}`);
    console.log(`Connected nodes: ${connectedNodeIds.size}`);

    // Update nodes with connection status
    const nodesWithConnectionInfo = nodes.map((node) => ({
      ...node,
      isConnected: connectedNodeIds.has(node.id),
    }));

    return NextResponse.json({ nodes: nodesWithConnectionInfo, edges });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await mongo.close();
  }
}
