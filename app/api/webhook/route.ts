import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAIReply } from "@/lib/ai/generate-ai-reply";
import { searchKnowledge } from "@/lib/knowledge/search-knowledge";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "my_webhook_secret_123";

async function sendMessengerMessage(
  senderId: string,
  text: string,
  pageAccessToken?: string | null
) {
  const token = process.env.META_PAGE_ACCESS_TOKEN || pageAccessToken;

  if (!token) {
    console.error("Missing Page Access Token");
    return null;
  }

  try {
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
  } catch (error) {
    console.error("Messenger Send API error:", error);
    return null;
  }
}

async function fetchMessengerProfile(
  senderId: string,
  pageAccessToken?: string | null
) {
  const token = process.env.META_PAGE_ACCESS_TOKEN || pageAccessToken;

  if (!token) {
    console.error("Missing Page Access Token for profile lookup");
    return null;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${senderId}?fields=first_name,last_name,profile_pic&access_token=${token}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch Messenger profile:", data);
      return null;
    }

    const fullName = [data.first_name, data.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      name: fullName || null,
      profile_pic: data.profile_pic || null,
    };
  } catch (error) {
    console.error("Messenger profile lookup error:", error);
    return null;
  }
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
        .eq("is_active", true)
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

        const customerProfile = await fetchMessengerProfile(
          senderId,
          business.page_access_token
        );

        console.log("Customer profile:", customerProfile);

        const now = new Date().toISOString();

        const { data: existingConversation, error: existingConversationError } =
          await supabaseAdmin
            .from("conversations")
            .select("*")
            .eq("business_id", business.id)
            .eq("customer_psid", senderId)
            .maybeSingle();

        if (existingConversationError) {
          console.error("Existing conversation lookup error:", existingConversationError);
          continue;
        }

        const shouldStayNeedsHuman = existingConversation?.status === "needs_human";

        const conversationPayload = {
          business_id: business.id,
          customer_psid: senderId,
          status: shouldStayNeedsHuman ? "needs_human" : "open",
          last_message: messageText,
          last_message_at: now,
          ...(customerProfile?.name ? { customer_name: customerProfile.name } : {}),
          ...(customerProfile?.profile_pic
            ? { customer_profile_pic: customerProfile.profile_pic }
            : {}),
        };

        const { data: conversation, error: conversationError } = existingConversation
          ? await supabaseAdmin
            .from("conversations")
            .update(conversationPayload)
            .eq("id", existingConversation.id)
            .eq("business_id", business.id)
            .select("*")
            .single()
          : await supabaseAdmin
            .from("conversations")
            .insert(conversationPayload)
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

        if (conversation.status === "needs_human") {
          console.log(
            "Conversation is marked as needs_human. Skipping AI auto-reply."
          );
          continue;
        }

        let knowledgeMatches: Awaited<ReturnType<typeof searchKnowledge>> = [];

        try {
          knowledgeMatches =
            aiSettings?.use_knowledge_base === false
              ? []
              : await searchKnowledge({
                businessId: business.id,
                query: messageText,
                limit: 5,
              });

          console.log("Knowledge matches found:", knowledgeMatches.length);
        } catch (error) {
          console.error("Knowledge search error:", error);
        }

        let replyText =
          aiSettings?.fallback_message ||
          "I'm not sure about that yet. A team member will assist you shortly.";

        try {
          replyText = await generateAIReply({
            customerMessage: messageText,
            business,
            aiSettings,
            products: products || [],
            faqs: faqs || [],
            knowledgeMatches,
          });
        } catch (error) {
          console.error("AI reply generation error:", error);
        }

        await sendMessengerMessage(
          senderId,
          replyText,
          business.page_access_token
        );

        const { error: botMessageError } = await supabaseAdmin
          .from("messages")
          .insert({
            business_id: business.id,
            conversation_id: conversation.id,
            sender_type: "ai",
            sender_id: "easytalk-ai",
            message_text: replyText,
            raw_payload: {
              knowledge_matches_found: knowledgeMatches.length,
              knowledge_matches: knowledgeMatches.map((match) => ({
                id: match.id,
                document_id: match.document_id,
                file_name: match.file_name,
                similarity: match.similarity,
              })),
            },
          });

        if (botMessageError) {
          console.error("Bot message save error:", botMessageError);
        }

        const { error: updateConversationError } = await supabaseAdmin
          .from("conversations")
          .update({
            last_message: replyText,
            last_message_at: new Date().toISOString(),
          })
          .eq("id", conversation.id);

        if (updateConversationError) {
          console.error("Conversation update error:", updateConversationError);
        }
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