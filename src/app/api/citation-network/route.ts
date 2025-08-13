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
    }));

    // Build graph edges based on references
    const edges: { source: string; target: string }[] = [];
    for (const paper of papers) {
      if (Array.isArray(paper.references)) {
        for (const ref of paper.references) {
          // Only add edge if the referenced paper exists in the DB
          if (papers.find((p) => p.id === ref)) {
            edges.push({ source: paper.id, target: ref });
          }
        }
      }
    }

    return NextResponse.json({ nodes, edges });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await mongo.close();
  }
}
