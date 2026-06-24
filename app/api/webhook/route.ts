import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAIReply } from "@/lib/openai/generate-ai-reply";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "my_webhook_secret_123";

async function sendMessengerMessage(
  senderId: string,
  text: string,
  pageAccessToken?: string | null
) {
  const token = process.env.META_PAGE_ACCESS_TOKEN || pageAccessToken;

  if (!token) {
    console.error("Missing Page Access Token");
    return;
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

  console.log("Messenger Send API response:");
  console.log(JSON.stringify(data, null, 2));

  if (!response.ok) {
    console.error("Failed to send Messenger message:", data);
  }

  return data;
}

export async function GET(req: NextRequest) {
  console.log("GET /api/webhook was called");

  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Meta verification success");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    success: true,
    message: "Webhook GET route is working",
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/webhook was called");

    const body = await req.json();

    console.log("POST body:");
    console.log(JSON.stringify(body, null, 2));

    if (body.object !== "page") {
      return NextResponse.json({
        success: true,
        message: "Ignored non-page webhook",
      });
    }

    for (const entry of body.entry || []) {
      const facebookPageId = entry.id;

      console.log("Facebook Page ID:", facebookPageId);

      const { data: business, error: businessError } = await supabaseAdmin
        .from("businesses")
        .select("*")
        .eq("facebook_page_id", facebookPageId)
        .maybeSingle();

      if (businessError) {
        console.error("Business lookup error:", businessError);
        continue;
      }

      if (!business) {
        console.error("No business found for Facebook Page ID:", facebookPageId);
        continue;
      }

      const { data: aiSettings, error: settingsError } = await supabaseAdmin
        .from("ai_settings")
        .select("*")
        .eq("business_id", business.id)
        .maybeSingle();

      if (settingsError) {
        console.error("AI settings lookup error:", settingsError);
        continue;
      }

      if (aiSettings?.is_enabled === false) {
        console.log("AI auto reply is disabled for business:", business.id);
        continue;
      }

      const { data: products, error: productsError } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("business_id", business.id)
        .eq("is_available", true)
        .order("created_at", { ascending: true });

      if (productsError) {
        console.error("Products lookup error:", productsError);
      }

      const { data: faqs, error: faqsError } = await supabaseAdmin
        .from("faqs")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: true });

      if (faqsError) {
        console.error("FAQs lookup error:", faqsError);
      }

      for (const event of entry.messaging || []) {
        const senderId = event.sender?.id;
        const messageText = event.message?.text;
        const isEcho = event.message?.is_echo;

        if (isEcho) {
          console.log("Skipping echo message");
          continue;
        }

        if (!senderId || !messageText) {
          console.log("Skipping event without senderId or messageText");
          continue;
        }

        console.log("Real sender ID:", senderId);
        console.log("Real message:", messageText);

        const now = new Date().toISOString();

        const { data: conversation, error: conversationError } =
          await supabaseAdmin
            .from("conversations")
            .upsert(
              {
                business_id: business.id,
                customer_psid: senderId,
                status: "open",
                last_message: messageText,
                last_message_at: now,
              },
              {
                onConflict: "business_id,customer_psid",
              }
            )
            .select("*")
            .single();

        if (conversationError || !conversation) {
          console.error("Conversation save error:", conversationError);
          continue;
        }

        const { error: customerMessageError } = await supabaseAdmin
          .from("messages")
          .insert({
            business_id: business.id,
            conversation_id: conversation.id,
            sender_type: "customer",
            sender_id: senderId,
            message_text: messageText,
            raw_payload: event,
          });

        if (customerMessageError) {
          console.error("Customer message save error:", customerMessageError);
        }

        let replyText =
          aiSettings?.fallback_message ||
          "I am not sure about that yet. A team member will assist you shortly.";

        try {
          replyText = await generateAIReply({
            customerMessage: messageText,
            business,
            aiSettings,
            products: products || [],
            faqs: faqs || [],
          });
        } catch (aiError) {
          console.error("AI reply generation error:", aiError);
        }

        await sendMessengerMessage(senderId, replyText);

        const { error: botMessageError } = await supabaseAdmin
          .from("messages")
          .insert({
            business_id: business.id,
            conversation_id: conversation.id,
            sender_type: "ai",
            sender_id: "bot",
            message_text: replyText,
            raw_payload: null,
          });

        if (botMessageError) {
          console.error("Bot message save error:", botMessageError);
        }

        await supabaseAdmin
          .from("conversations")
          .update({
            last_message: replyText,
            last_message_at: new Date().toISOString(),
          })
          .eq("id", conversation.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook failed",
      },
      { status: 500 }
    );
  }
}