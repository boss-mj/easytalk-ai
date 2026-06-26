import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAIReply } from "@/lib/ai/generate-ai-reply";
import { searchKnowledge } from "@/lib/knowledge/search-knowledge";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    const { data: business, error: businessError } = await supabaseAdmin
      .from("businesses")
      .select("*")
      .eq("id", BUSINESS_ID)
      .maybeSingle();

    if (businessError) {
      return NextResponse.json(
        { success: false, error: businessError.message },
        { status: 500 }
      );
    }

    if (!business) {
      return NextResponse.json(
        { success: false, error: "Business profile not found." },
        { status: 404 }
      );
    }

    const { data: aiSettings, error: settingsError } = await supabaseAdmin
      .from("ai_settings")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .maybeSingle();

    if (settingsError) {
      return NextResponse.json(
        { success: false, error: settingsError.message },
        { status: 500 }
      );
    }

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .eq("is_available", true)
      .order("created_at", { ascending: true });

    if (productsError) {
      return NextResponse.json(
        { success: false, error: productsError.message },
        { status: 500 }
      );
    }

    const { data: faqs, error: faqsError } = await supabaseAdmin
      .from("faqs")
      .select("*")
      .eq("business_id", BUSINESS_ID)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (faqsError) {
      return NextResponse.json(
        { success: false, error: faqsError.message },
        { status: 500 }
      );
    }

    const knowledgeMatches =
      aiSettings?.use_knowledge_base === false
        ? []
        : await searchKnowledge({
            businessId: BUSINESS_ID,
            query: message,
            limit: 5,
          });

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