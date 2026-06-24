import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

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
    const { id } = await context.params;
    const conversationId = parseConversationId(id);

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const { data: conversation, error: conversationError } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("business_id", BUSINESS_ID)
      .maybeSingle();

    if (conversationError) {
      return NextResponse.json(
        { success: false, error: conversationError.message },
        { status: 500 }
      );
    }

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found." },
        { status: 404 }
      );
    }

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
      .eq("business_id", BUSINESS_ID)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
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
      { success: false, error: "Failed to load messages." },
      { status: 500 }
    );
  }
}