import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

const allowedStatuses = ["open", "needs_human", "closed"];

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
    const { id } = await context.params;
    const conversationId = parseConversationId(id);

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Invalid conversation ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const status = body.status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid conversation status." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .update({ status })
      .eq("id", conversationId)
      .eq("business_id", BUSINESS_ID)
      .select(CONVERSATION_COLUMNS)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
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
      { success: false, error: "Failed to update conversation." },
      { status: 500 }
    );
  }
}