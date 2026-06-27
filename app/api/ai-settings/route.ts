import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Converts database column names into frontend-friendly names.
 *
 * Database:
 * is_enabled
 *
 * Frontend:
 * isEnabled
 */
function toClientSettings(row: any) {
  return {
    isEnabled: row?.is_enabled ?? true,
    botName: row?.bot_name ?? "EasyBot",
    welcomeMessage:
      row?.welcome_message ?? "Hello! 👋 How can I help you today?",
    tone: row?.tone ?? "friendly",
    fallbackMessage:
      row?.fallback_message ??
      "I am not sure about that yet. A team member will assist you shortly.",
    handoffMessage:
      row?.handoff_message ??
      "I will forward this to a human team member who can assist you better.",
    maxReplyLength: row?.max_reply_length ?? "short",
    confidenceThreshold: row?.confidence_threshold ?? 85,
    responseDelaySeconds: row?.response_delay_seconds ?? 2,
    enableHumanHandoff: row?.enable_human_handoff ?? true,
    rememberConversationHistory: row?.remember_conversation_history ?? true,
    typingIndicator: row?.typing_indicator ?? true,
    useBusinessProfile: row?.use_business_profile ?? true,
    useProducts: row?.use_products ?? true,
    useFaqs: row?.use_faqs ?? true,
    useOpeningHours: row?.use_opening_hours ?? true,
    useKnowledgeBase: row?.use_knowledge_base ?? true,
    systemPrompt: row?.system_prompt ?? "",
  };
}

/**
 * Converts frontend-friendly names into database column names.
 *
 * Important:
 * businessId comes from the logged-in user's business.
 * We do NOT use DEFAULT_BUSINESS_ID anymore for protected dashboard routes.
 */
function toDatabaseSettings(body: any, businessId: number) {

  return {
    business_id: businessId,

    is_enabled: body.isEnabled,
    bot_name: body.botName,
    welcome_message: body.welcomeMessage,
    tone: body.tone,

    fallback_message: body.fallbackMessage,
    handoff_message: body.handoffMessage,
    max_reply_length: body.maxReplyLength,

    confidence_threshold: body.confidenceThreshold,
    response_delay_seconds: body.responseDelaySeconds,

    enable_human_handoff: body.enableHumanHandoff,
    remember_conversation_history: body.rememberConversationHistory,
    typing_indicator: body.typingIndicator,

    use_business_profile: body.useBusinessProfile,
    use_products: body.useProducts,
    use_faqs: body.useFaqs,
    use_opening_hours: body.useOpeningHours,
    use_knowledge_base: body.useKnowledgeBase,

    system_prompt: body.systemPrompt,
  };
}

export async function GET() {
  const { errorResponse } = await requireUser();

  if (errorResponse) {
    return errorResponse;
  }

  try {
    /**
     * This checks:
     * 1. Is the user logged in?
     * 2. Does the logged-in user own a business?
     *
     * If not, it returns 401 or 404.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * ai_settings is a child table.
     * So we filter by business_id.
     */
    const { data, error } = await supabaseAdmin
      .from("ai_settings")
      .select("*")
      .eq("business_id", business.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    /**
     * If this business has no AI settings row yet,
     * create a default one automatically.
     */
    if (!data) {
      const { data: createdSettings, error: createError } = await supabaseAdmin
        .from("ai_settings")
        .insert({
          business_id: business.id,
        })
        .select("*")
        .single();

      if (createError) {
        return NextResponse.json(
          {
            success: false,
            error: createError.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        settings: toClientSettings(createdSettings),
      });
    }

    return NextResponse.json({
      success: true,
      settings: toClientSettings(data),
    });
  } catch (error) {
    console.error("GET /api/ai-settings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load AI settings.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    /**
     * Same rule here:
     * only the logged-in user's business can update its own AI settings.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    /**
     * Convert frontend data into database format.
     * business.id replaces the old DEFAULT_BUSINESS_ID.
     */
    const row = toDatabaseSettings(body, business.id);

    /**
     * ai_settings has unique business_id.
     * So upsert means:
     * - create settings if missing
     * - update settings if already existing
     */
    const { data, error } = await supabaseAdmin
      .from("ai_settings")
      .upsert(row, {
        onConflict: "business_id",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: toClientSettings(data),
    });
  } catch (error) {
    console.error("PUT /api/ai-settings error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save AI settings.",
      },
      { status: 500 }
    );
  }
}