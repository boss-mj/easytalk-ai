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

async function sendMessengerMessage(senderId: string, text: string) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing META_PAGE_ACCESS_TOKEN in .env.local");
  }

  const response = await fetch(
    `https://graph.facebook.com/v20.0/me/messages?access_token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: {
          id: senderId,
        },
        message: {
          text,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Messenger manual reply error:", data);
    throw new Error(data?.error?.message || "Failed to send Messenger reply.");
  }

  return data;
}

export async function POST(
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
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Reply message is required." },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Reply is too long. Maximum is 1000 characters." },
        { status: 400 }
      );
    }

    const { data: conversation, error: conversationError } =
      await supabaseAdmin
        .from("conversations")
        .select("*")
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

    const messengerResponse = await sendMessengerMessage(
      conversation.customer_psid,
      text
    );

    const { data: message, error: messageError } = await supabaseAdmin
      .from("messages")
      .insert({
        business_id: BUSINESS_ID,
        conversation_id: conversation.id,
        sender_type: "human",
        sender_id: "dashboard-user",
        message_text: text,
        raw_payload: {
          source: "dashboard_manual_reply",
          messenger_response: messengerResponse,
        },
      })
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
      .single();

    if (messageError) {
      return NextResponse.json(
        { success: false, error: messageError.message },
        { status: 500 }
      );
    }

    const { data: updatedConversation, error: updateError } =
      await supabaseAdmin
        .from("conversations")
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversation.id)
        .eq("business_id", BUSINESS_ID)
        .select(
          `
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
        `
        )
        .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error("POST /api/conversations/[id]/reply error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send manual reply.",
      },
      { status: 500 }
    );
  }
}