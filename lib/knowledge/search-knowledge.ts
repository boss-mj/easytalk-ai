import { createEmbedding, toPgVector } from "@/lib/ai/create-embedding";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type KnowledgeMatch = {
  id: number;
  document_id: number;
  file_name: string | null;
  content: string;
  similarity: number;
};

export async function searchKnowledge({
  businessId,
  query,
  limit = 5,
}: {
  businessId: number;
  query: string;
  limit?: number;
}) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  const embedding = await createEmbedding(cleanQuery);

  const { data, error } = await supabaseAdmin.rpc("match_knowledge_chunks", {
    query_embedding: toPgVector(embedding),
    match_business_id: businessId,
    match_count: limit,
    similarity_threshold: 0.15,
  });

  if (error) {
    console.error("Knowledge search error:", error);
    return [];
  }

  return (data || []) as KnowledgeMatch[];
}