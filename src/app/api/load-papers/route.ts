// /api/load-papers/route.ts
import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";
import { MongoClient } from "mongodb";

// Type definitions for Semantic Scholar API response
interface SemanticScholarAuthor {
  name: string;
  authorId?: string;
}

interface SemanticScholarReference {
  paperId: string;
  title?: string;
}

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  abstract: string | null;
  authors: SemanticScholarAuthor[];
  year: number | null;
  citationCount: number;
  url: string | null;
  references?: SemanticScholarReference[];
}

interface SemanticScholarResponse {
  data: SemanticScholarPaper[];
  total: number;
}

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index(process.env.PINECONE_INDEX!);

const mongo = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB || "healthcareDB";

async function embedText(text: string): Promise<number[]> {
  const res = await hf.featureExtraction({
    model: "BAAI/bge-large-en-v1.5",
    inputs: text,
  });

  // Handle different possible response formats
  if (Array.isArray(res)) {
    // If it's a nested array (batch response), take the first item
    if (Array.isArray(res[0])) {
      return res[0] as number[];
    }
    // If it's already a flat array, return it
    return res as number[];
  }

  // If it's a single number, wrap it in an array
  return [res as number];
}

export async function GET() {
  const DOMAIN_QUERY = "healthcare OR medicine OR public health";

  try {
    const res = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
        DOMAIN_QUERY
      )}&limit=100&fields=paperId,title,abstract,authors,year,citationCount,url,references`
    );

    if (!res.ok) throw new Error(`Error fetching: ${res.statusText}`);
    const json: SemanticScholarResponse = await res.json();

    const vectors = [];
    const paperMetadata = [];

    for (const paper of json.data) {
      const textForEmbedding = `${paper.title}. ${paper.abstract || ""}`;
      const embedding = await embedText(textForEmbedding);

      vectors.push({
        id: paper.paperId,
        values: embedding,
        metadata: {
          title: paper.title,
          abstract: paper.abstract || "",
          authors: paper.authors
            .map((a: SemanticScholarAuthor) => a.name)
            .join(", "),
          year: paper.year || 0,
          citationCount: paper.citationCount,
          url: paper.url || "",
          references: JSON.stringify(
            paper.references?.map((r: SemanticScholarReference) => r.paperId) ||
              []
          ),
        },
      });

      paperMetadata.push({
        id: paper.paperId,
        title: paper.title,
        authors: paper.authors,
        year: paper.year || 0,
        citationCount: paper.citationCount,
        url: paper.url || "",
        references:
          paper.references?.map((r: SemanticScholarReference) => r.paperId) ||
          [],
      });
    }

    // Push vectors to Pinecone
    await index.upsert(vectors);

    // Save metadata to MongoDB
    await mongo.connect();
    const collection = mongo.db(dbName).collection("papers");
    await collection.insertMany(paperMetadata);

    return NextResponse.json({ count: vectors.length, papers: vectors });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await mongo.close();
  }
}
