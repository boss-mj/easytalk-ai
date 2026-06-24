import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

const SETTINGS_COLUMNS = `
  id,
  business_id,
  is_enabled,
  bot_name,
  fallback_message,
  enable_human_handoff,
  use_knowledge_base,
  response_delay_seconds,
  typing_indicator,
  updated_at
`;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("ai_settings")
      .select(SETTINGS_COLUMNS)
      .eq("business_id", BUSINESS_ID)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      const { data: created, error: createError } = await supabaseAdmin
        .from("ai_settings")
        .insert({ business_id: BUSINESS_ID })
        .select(SETTINGS_COLUMNS)
        .single();

      if (createError) {
        return NextResponse.json(
          { success: false, error: createError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        settings: created,
      });
    }

    return NextResponse.json({
      success: true,
      settings: data,
    });
  } catch (error) {
    console.error("GET /api/settings/automation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load automation settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const responseDelay =
      typeof body.response_delay_seconds === "number"
        ? Math.max(0, Math.min(60, body.response_delay_seconds))
        : 0;

    const payload = {
      is_enabled:
        typeof body.is_enabled === "boolean" ? body.is_enabled : true,

      bot_name: cleanText(body.bot_name, 80) || "EasyBot",

      fallback_message:
        cleanText(body.fallback_message, 500) ||
        "I am not sure about that yet. A team member will assist you shortly.",

      enable_human_handoff:
        typeof body.enable_human_handoff === "boolean"
          ? body.enable_human_handoff
          : true,

      use_knowledge_base:
        typeof body.use_knowledge_base === "boolean"
          ? body.use_knowledge_base
          : true,

      response_delay_seconds: responseDelay,

      typing_indicator:
        typeof body.typing_indicator === "boolean"
          ? body.typing_indicator
          : true,
    };

    const { data, error } = await supabaseAdmin
      .from("ai_settings")
      .upsert(
        {
          business_id: BUSINESS_ID,
          ...payload,
        },
        {
          onConflict: "business_id",
        }
      )
      .select(SETTINGS_COLUMNS)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Automation settings saved.",
      settings: data,
    });
  } catch (error) {
    console.error("PUT /api/settings/automation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save automation settings." },
      { status: 500 }
    );
  }
}