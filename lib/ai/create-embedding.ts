import { getOpenAIClient } from "@/lib/supabase/openai/client";

export async function createEmbedding(text: string) {
  const openai = getOpenAIClient();

  const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

  const response = await openai.embeddings.create({
    model,
    input: text,
    encoding_format: "float",
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding) {
    throw new Error("OpenAI did not return an embedding.");
  }

  return embedding;
}

/**
 * pgvector accepts vector input like: [0.1,0.2,0.3]
 */
export function toPgVector(embedding: number[]) {
  return `[${embedding.join(",")}]`;
}