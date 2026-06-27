import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAIReply } from "@/lib/ai/generate-ai-reply";
import { searchKnowledge } from "@/lib/knowledge/search-knowledge";
import { requireBusiness } from "@/lib/auth/require-business";

export async function POST(req: Request) {
  try {
    /**
     * Protect this API route.
     *
     * This does two things:
     * 1. Checks if the user is logged in.
     * 2. Gets the business owned by the logged-in user.
     *
     * This replaces:
     * const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * Get the test customer message from the frontend.
     */
    const body = await req.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    /**
     * Since requireBusiness() already loaded the business,
     * we do NOT need to query the businesses table again.
     *
     * business.id is the current logged-in user's business ID.
     */
    const businessId = business.id;

    /**
     * ai_settings is a child table.
     * So we filter by business_id.
     */
    const { data: aiSettings, error: settingsError } = await supabaseAdmin
      .from("ai_settings")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle();

    if (settingsError) {
      return NextResponse.json(
        { success: false, error: settingsError.message },
        { status: 500 }
      );
    }

    /**
     * products is also a child table.
     * So we filter by business_id.
     */
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_available", true)
      .order("created_at", { ascending: true });

    if (productsError) {
      return NextResponse.json(
        { success: false, error: productsError.message },
        { status: 500 }
      );
    }

    /**
     * faqs is also a child table.
     * So we filter by business_id.
     */
    const { data: faqs, error: faqsError } = await supabaseAdmin
      .from("faqs")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (faqsError) {
      return NextResponse.json(
        { success: false, error: faqsError.message },
        { status: 500 }
      );
    }

    /**
     * Search uploaded knowledge base documents.
     *
     * If Knowledge Base Search is disabled in settings,
     * we return an empty array.
     */
    const knowledgeMatches =
      aiSettings?.use_knowledge_base === false
        ? []
        : await searchKnowledge({
            businessId,
            query: message,
            limit: 5,
          });

    /**
     * Generate the AI reply using:
     * - business profile
     * - AI settings
     * - products
     * - FAQs
     * - knowledge base matches
     */
    const reply = await generateAIReply({
      customerMessage: message,
      business,
      aiSettings,
      products: products || [],
      faqs: faqs || [],
      knowledgeMatches,
    });

    return NextResponse.json({
      success: true,
      reply,
      debug: {
        businessName: business.name,
        businessId,
        productsUsed: products?.length || 0,
        faqsUsed: faqs?.length || 0,
        knowledgeMatchesFound: knowledgeMatches.length,
        knowledgeMatches: knowledgeMatches.map((match) => ({
          id: match.id,
          document_id: match.document_id,
          file_name: match.file_name,
          similarity: match.similarity,
          preview: match.content.slice(0, 250),
        })),
      },
    });
  } catch (error) {
    console.error("POST /api/ai/test-reply error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to test AI reply.",
      },
      { status: 500 }
    );
  }
}