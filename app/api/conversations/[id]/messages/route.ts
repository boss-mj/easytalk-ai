import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Converts the dynamic route id into a valid number.
 *
 * Example:
 * /api/conversations/5/messages
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

export async function GET(
  _req: Request,
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
     * Get the conversation id from the URL.
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
     * First, check that this conversation exists AND belongs
     * to the logged-in user's business.
     *
     * conversations is a child table, so we use:
     * .eq("business_id", business.id)
     */
    const { data: conversation, error: conversationError } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("business_id", business.id)
      .maybeSingle();

    if (conversationError) {
      return NextResponse.json(
        {
          success: false,
          error: conversationError.message,
        },
        { status: 500 }
      );
    }

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          error: "Conversation not found.",
        },
        { status: 404 }
      );
    }

    /**
     * Load only messages from this conversation AND this business.
     *
     * messages is also a child table, so we filter by business_id.
     *
     * This prevents one logged-in user from reading another
     * business' conversation messages.
     */
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select(
        `
        id,
        business_id,
        conversation_id,
        sender_type,
        sender_id,
        message_text,
        created_at
      `
      )
      .eq("business_id", business.id)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

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
      messages: data || [],
    });
  } catch (error) {
    console.error("GET /api/conversations/[id]/messages error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load messages.",
      },
      { status: 500 }
    );
  }
}