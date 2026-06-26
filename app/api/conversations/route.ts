import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Columns returned to the frontend.
 *
 * This is safe because it only returns conversation data,
 * not private business tokens.
 */
const CONVERSATION_COLUMNS = `
  id,
  business_id,
  customer_psid,
  customer_name,
  customer_profile_pic,
  status,
  last_message,
  last_message_at,
  created_at,
  updated_at
`;

export async function GET() {
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
     * conversations is a child table.
     *
     * So we filter using:
     * .eq("business_id", business.id)
     *
     * This makes sure the logged-in user only sees conversations
     * that belong to their own business.
     */
    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select(CONVERSATION_COLUMNS)
      .eq("business_id", business.id)
      .order("last_message_at", {
        ascending: false,
        nullsFirst: false,
      });

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
      conversations: data || [],
    });
  } catch (error) {
    console.error("GET /api/conversations error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load conversations.",
      },
      { status: 500 }
    );
  }
}