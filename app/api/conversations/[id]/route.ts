import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Allowed conversation statuses.
 *
 * open        = AI can reply
 * needs_human = human handoff, AI should stop replying
 * closed      = conversation is closed
 */
const allowedStatuses = ["open", "needs_human", "closed"];

/**
 * Columns returned to the frontend.
 *
 * conversations is a child table of businesses.
 * Each conversation belongs to one business through business_id.
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

/**
 * Converts the route param into a valid number.
 *
 * Example:
 * /api/conversations/5
 * id = "5"
 * conversationId = 5
 */
function parseConversationId(id: string) {
  const conversationId = Number(id);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return null;
  }

  return conversationId;
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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
     * Get conversation ID from URL.
     *
     * Example:
     * /api/conversations/5
     */
    const { id } = await context.params;
    const conversationId = parseConversationId(id);

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid conversation ID.",
        },
        { status: 400 }
      );
    }

    /**
     * Get the requested new status from the request body.
     *
     * Example body:
     * { "status": "needs_human" }
     */
    const body = await req.json();
    const status = body.status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid conversation status.",
        },
        { status: 400 }
      );
    }

    /**
     * Update only conversations that belong to the logged-in user's business.
     *
     * conversations is a child table, so we use:
     * .eq("business_id", business.id)
     *
     * This prevents one user from updating another business' conversation.
     */
    const { data, error } = await supabaseAdmin
      .from("conversations")
      .update({ status })
      .eq("id", conversationId)
      .eq("business_id", business.id)
      .select(CONVERSATION_COLUMNS)
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
      conversation: data,
    });
  } catch (error) {
    console.error("PATCH /api/conversations/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update conversation.",
      },
      { status: 500 }
    );
  }
}