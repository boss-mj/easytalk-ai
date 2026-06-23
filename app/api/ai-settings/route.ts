import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUSINESS_ID = 1;

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
    rememberConversationHistory:
      row?.remember_conversation_history ?? true,
    typingIndicator: row?.typing_indicator ?? true,
    useBusinessProfile: row?.use_business_profile ?? true,
    useProducts: row?.use_products ?? true,
    useFaqs: row?.use_faqs ?? true,
    useOpeningHours: row?.use_opening_hours ?? true,
    systemPrompt: row?.system_prompt ?? "",
  };
}

function toDatabaseSettings(body: any) {
  return {
    business_id: BUSINESS_ID,

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

    system_prompt: body.systemPrompt,
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("ai_settings")
    .select("*")
    .eq("business_id", BUSINESS_ID)
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

  return NextResponse.json({
    success: true,
    settings: toClientSettings(data),
  });
}

export async function PUT(req: Request) {
  const body = await req.json();

  const row = toDatabaseSettings(body);

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
}