import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index(process.env.PINECONE_INDEX!);

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

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 1. Embed the search query
    const queryEmbedding = await embedText(query);

    // 2. Search Pinecone
    const searchResults = await index.query({
      topK: 5,
      vector: queryEmbedding,
      includeMetadata: true,
    });

    // 3. Return results to frontend
    return NextResponse.json({ matches: searchResults.matches });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
