import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Settings columns returned to the frontend.
 *
 * ai_settings is a child table of businesses.
 * Each settings row belongs to one business through business_id.
 */
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

/**
 * Cleans text fields before saving to database.
 *
 * Example:
 * "   EasyBot   " becomes "EasyBot"
 */
function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

export async function GET() {
    const { errorResponse } = await requireUser();

  if (errorResponse) {
    return errorResponse;
  }

  try {
    /**
     * Protect this API route.
     *
     * requireBusiness() checks:
     * 1. Is the user logged in?
     * 2. Does the logged-in user own a business?
     *
     * This replaces:
     * const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * ai_settings is a child table.
     *
     * So we filter using:
     * .eq("business_id", business.id)
     *
     * This ensures the logged-in user only loads settings
     * for their own business.
     */
    const { data, error } = await supabaseAdmin
      .from("ai_settings")
      .select(SETTINGS_COLUMNS)
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
     * If this business does not have automation settings yet,
     * automatically create a default settings row.
     */
    if (!data) {
      const { data: created, error: createError } = await supabaseAdmin
        .from("ai_settings")
        .insert({
          business_id: business.id,
        })
        .select(SETTINGS_COLUMNS)
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
      {
        success: false,
        error: "Failed to load automation settings.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
    const { errorResponse } = await requireUser();

  if (errorResponse) {
    return errorResponse;
  }

  try {
    /**
     * Protect this API route.
     *
     * The settings will be saved only under the logged-in user's business,
     * not DEFAULT_BUSINESS_ID.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    /**
     * Limit response delay between 0 and 60 seconds.
     */
    const responseDelay =
      typeof body.response_delay_seconds === "number"
        ? Math.max(0, Math.min(60, body.response_delay_seconds))
        : 0;

    /**
     * Clean and normalize settings payload before saving.
     */
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

    /**
     * ai_settings has unique business_id.
     *
     * upsert means:
     * - create settings if missing
     * - update settings if already existing
     *
     * OLD:
     * business_id: BUSINESS_ID
     *
     * NEW:
     * business_id: business.id
     */
    const { data, error } = await supabaseAdmin
      .from("ai_settings")
      .upsert(
        {
          business_id: business.id,
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
        {
          success: false,
          error: error.message,
        },
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
      {
        success: false,
        error: "Failed to save automation settings.",
      },
      { status: 500 }
    );
  }
}