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

// Helper function for structured analysis when AI fails
function createStructuredAnalysis(papers: { metadata?: { title?: string; abstract?: string } }[], query: string): string {
  if (papers.length === 0) {
    return "No papers available for analysis.";
  }

  let analysis = `Research Analysis for "${query}":\n\n`;
  
  if (papers.length >= 2) {
    const paper1 = papers[0];
    const paper2 = papers[1];
    
    analysis += `📊 COMPARATIVE ANALYSIS\n\n`;
    analysis += `Study 1: ${paper1.metadata?.title || 'Unknown Title'}\n`;
    analysis += `Key Finding: ${extractKeyFinding(paper1.metadata?.abstract || '')}\n\n`;
    
    analysis += `Study 2: ${paper2.metadata?.title || 'Unknown Title'}\n`;
    analysis += `Key Finding: ${extractKeyFinding(paper2.metadata?.abstract || '')}\n\n`;
    
    analysis += `🔬 SYNTHESIS:\n`;
    analysis += `Both studies contribute to understanding ${query.toLowerCase()}. `;
    analysis += `The research suggests complementary approaches and findings that advance the field.`;
  } else {
    const paper = papers[0];
    analysis += `📋 SINGLE STUDY ANALYSIS\n\n`;
    analysis += `Study: ${paper.metadata?.title || 'Unknown Title'}\n`;
    analysis += `Key Finding: ${extractKeyFinding(paper.metadata?.abstract || '')}\n\n`;
    analysis += `🔬 IMPLICATIONS:\n`;
    analysis += `This research provides valuable insights into ${query.toLowerCase()} and contributes to the current understanding of the field.`;
  }
  
  return analysis;
}

// Helper function to extract key finding from abstract
function extractKeyFinding(abstract: string): string {
  if (!abstract || abstract.length < 50) {
    return "Key findings not available in abstract.";
  }
  
  // Look for sentences with key indicator words
  const sentences = abstract.split('.').filter(s => s.trim().length > 30);
  const keyWords = ['found', 'showed', 'demonstrated', 'results', 'conclusion', 'significant', 'effect'];
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    if (keyWords.some(word => lowerSentence.includes(word))) {
      return sentence.trim() + '.';
    }
  }
  
  // If no key finding sentence found, return first substantial sentence
  return sentences[0] ? sentences[0].trim() + '.' : "Key findings not clearly stated.";
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 1. Embed the search query
    const queryEmbedding = await embedText(query);

    // 2. Search Pinecone
    const searchResults = await index.query({
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
    });

    // 3. Generate answer from abstracts using Hugging Face
    let generatedAnswer = "";
    if (searchResults.matches && searchResults.matches.length > 0) {
      // Get the first two papers for analysis
      const topTwoPapers = searchResults.matches.slice(0, 2);
      
      if (topTwoPapers.length > 0) {
        // Create clean abstracts for analysis
        const paper1 = topTwoPapers[0];
        const paper2 = topTwoPapers[1];
        
        const paper1Abstract = paper1.metadata?.abstract || "";
        const paper1Title = paper1.metadata?.title || "";
        
        const paper2Abstract = paper2?.metadata?.abstract || "";
        const paper2Title = paper2?.metadata?.title || "";
        
        // Create analysis prompt
        let analysisText = "";
        if (paper2Abstract) {
          // Two papers analysis
          analysisText = `Analyze and synthesize the research findings from these two studies on "${query}":

Study 1 - ${paper1Title}:
${paper1Abstract}

Study 2 - ${paper2Title}:
${paper2Abstract}

Provide a comparative analysis highlighting key findings, methodologies, and implications.`;
        } else {
          // Single paper analysis
          analysisText = `Analyze this research study on "${query}":

${paper1Title}:
${paper1Abstract}

Provide an analysis of the key findings, methodology, and implications.`;
        }
        
        // Try AI summarization with analysis prompt
        try {
          const response = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: analysisText,
            parameters: {
              max_length: 150,
              min_length: 50,
              do_sample: false,
            },
          });

          generatedAnswer = response.summary_text || "Unable to generate analysis at this time.";
        } catch (genError) {
          console.error("Error generating AI analysis:", genError);
          console.log("Using structured analysis fallback");
          
          // Create structured analysis fallback
          generatedAnswer = createStructuredAnalysis(topTwoPapers, query);
        }
      }
    }

    // 4. Return results with generated answer
    return NextResponse.json({ 
      matches: searchResults.matches,
      generatedAnswer: generatedAnswer,
      query: query
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
