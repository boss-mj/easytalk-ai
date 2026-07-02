import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAIReply } from "@/lib/ai/generate-ai-reply";
import { searchKnowledge } from "@/lib/knowledge/search-knowledge";

export const runtime = "nodejs";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "my_webhook_secret_123";

type ConversationHistoryMessage = {
  sender_type: string;
  message_text: string;
  created_at?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalizes short customer messages.
 *
 * Example:
 * "Okay!" -> "okay"
 * "  sige po  " -> "sige po"
 */
function normalizeMessage(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
}

/**
 * These are acknowledgements.
 *
 * These usually mean:
 * "Okay, I understand."
 *
 * Important:
 * Do NOT include "yes" here.
 * "yes" can mean the customer wants the AI to continue an offer.
 */
function isAcknowledgementMessage(text: string) {
  const normalized = normalizeMessage(text);

  const acknowledgements = [
    "ok",
    "okay",
    "oki",
    "okie",
    "noted",
    "noted po",
    "thanks",
    "thank you",
    "thank you po",
    "salamat",
    "salamat po",
    "alright",
    "alright po",
    "sige",
    "sige po",
    "ge",
    "ge po",
  ];

  return acknowledgements.includes(normalized);
}

/**
 * These are positive confirmations.
 *
 * Example:
 * AI: Do you want me to list the product prices?
 * Customer: yes
 *
 * The AI should continue and list the prices.
 */
function isPositiveConfirmation(text: string) {
  const normalized = normalizeMessage(text);

  const confirmations = [
    "yes",
    "yes please",
    "yes po",
    "yeah",
    "yup",
    "sure",
    "sure po",
    "go",
    "go ahead",
    "please",
    "pls",
  ];

  return confirmations.includes(normalized);
}

/**
 * Gets the latest AI message from conversation history.
 */
function getLastAIMessage(history: ConversationHistoryMessage[]) {
  return [...history]
    .reverse()
    .find((message) => message.sender_type === "ai");
}

/**
 * Detects if the previous AI reply already handed off to human/staff.
 *
 * If customer says "okay" after this, bot should stop replying.
 */
function lastAIMessageNeedsHuman(history: ConversationHistoryMessage[]) {
  const lastAiMessage = getLastAIMessage(history);

  if (!lastAiMessage?.message_text) {
    return false;
  }

  const text = normalizeMessage(lastAiMessage.message_text);

  return (
    text.includes("team member will assist") ||
    text.includes("team member can assist") ||
    text.includes("team member can also assist") ||
    text.includes("team member will help") ||
    text.includes("team member can help") ||
    text.includes("assist you shortly") ||
    text.includes("help you shortly") ||
    text.includes("human will assist") ||
    text.includes("staff will assist") ||
    text.includes("someone from our team") ||
    text.includes("our team will assist") ||
    text.includes("our team can assist")
  );
}

/**
 * Detects if the previous AI reply asked/offered something.
 *
 * If customer says "yes" after this, AI should continue.
 */
function lastAIMessageAskedOffer(history: ConversationHistoryMessage[]) {
  const lastAiMessage = getLastAIMessage(history);

  if (!lastAiMessage?.message_text) {
    return false;
  }

  const text = normalizeMessage(lastAiMessage.message_text);

  return (
    text.includes("?") ||
    text.includes("do you want") ||
    text.includes("would you like") ||
    text.includes("should i") ||
    text.includes("can i list") ||
    text.includes("can show") ||
    text.includes("i can list") ||
    text.includes("i can show") ||
    text.includes("want me to") ||
    text.includes("list the product") ||
    text.includes("list product") ||
    text.includes("show product") ||
    text.includes("show prices") ||
    text.includes("list prices")
  );
}

async function sendMessengerMessage(
  senderId: string,
  text: string,
  pageAccessToken?: string | null
) {
  const token = pageAccessToken || process.env.META_PAGE_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing Messenger Page Access Token.");
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
    console.error("Messenger Send API error:", data);
    throw new Error(data?.error?.message || "Failed to send Messenger message.");
  }

  console.log("Messenger Send API response:");
  console.log(JSON.stringify(data, null, 2));

  return data;
}

async function sendMessengerSenderAction(
  senderId: string,
  action: "typing_on" | "typing_off",
  pageAccessToken?: string | null
) {
  const token = pageAccessToken || process.env.META_PAGE_ACCESS_TOKEN;

  if (!token) {
    console.error("Missing Page Access Token for sender action.");
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
          sender_action: action,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Messenger sender action error:", data);
    }

    return data;
  } catch (error) {
    console.error("Messenger sender action request error:", error);
    return null;
  }
}

async function fetchMessengerProfile(
  senderId: string,
  pageAccessToken?: string | null
) {
  const token = pageAccessToken || process.env.META_PAGE_ACCESS_TOKEN;

  if (!token) {
    console.error("Missing Page Access Token for profile lookup.");
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

async function getConversationHistory({
  businessId,
  conversationId,
}: {
  businessId: number;
  conversationId: number;
}) {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("sender_type,message_text,created_at")
    .eq("business_id", businessId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Conversation history lookup error:", error);
    return [];
  }

  return (data || []).reverse();
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

  return new NextResponse("Forbidden", { status: 403 });
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
        message: "Ignored non-page webhook.",
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
        try {
          const senderId = event.sender?.id;
          const messageText = event.message?.text;
          const isEcho = event.message?.is_echo;

          if (isEcho) {
            console.log("Skipping echo message.");
            continue;
          }

          if (!senderId || !messageText) {
            console.log("Skipping event without senderId or messageText.");
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

          const {
            data: existingConversation,
            error: existingConversationError,
          } = await supabaseAdmin
            .from("conversations")
            .select("*")
            .eq("business_id", business.id)
            .eq("customer_psid", senderId)
            .maybeSingle();

          if (existingConversationError) {
            console.error(
              "Existing conversation lookup error:",
              existingConversationError
            );
            continue;
          }

          const shouldStayNeedsHuman =
            existingConversation?.status === "needs_human";

          const conversationPayload = {
            business_id: business.id,
            customer_psid: senderId,
            status: shouldStayNeedsHuman ? "needs_human" : "open",
            last_message: messageText,
            last_message_at: now,
            ...(customerProfile?.name
              ? { customer_name: customerProfile.name }
              : {}),
            ...(customerProfile?.profile_pic
              ? { customer_profile_pic: customerProfile.profile_pic }
              : {}),
          };

          const { data: conversation, error: conversationError } =
            existingConversation
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

          if (customerMessageError) {
            console.error("Customer message save error:", customerMessageError);
            continue;
          }

          const conversationHistory =
            aiSettings?.remember_conversation_history === false
              ? []
              : await getConversationHistory({
                  businessId: business.id,
                  conversationId: conversation.id,
                });

          console.log("Conversation history loaded:", conversationHistory.length);

          /**
           * Skip rule:
           *
           * If AI already handed off to a human and customer only says
           * "okay", "thanks", "sige", etc., stop replying.
           *
           * But if AI asked/offered something and customer says "yes",
           * do not skip. Let AI continue.
           */
          const shouldSkipAcknowledgement =
            isAcknowledgementMessage(messageText) &&
            lastAIMessageNeedsHuman(conversationHistory);

          const shouldContinueOffer =
            isPositiveConfirmation(messageText) &&
            lastAIMessageAskedOffer(conversationHistory);

          if (shouldSkipAcknowledgement && !shouldContinueOffer) {
            console.log(
              "Customer acknowledged handoff/fallback. AI reply skipped."
            );

            await supabaseAdmin
              .from("conversations")
              .update({
                status: "needs_human",
                last_message: messageText,
                last_message_at: new Date().toISOString(),
              })
              .eq("id", conversation.id)
              .eq("business_id", business.id);

            continue;
          }

          if (
            aiSettings?.enable_human_handoff !== false &&
            conversation.status === "needs_human"
          ) {
            console.log(
              "Conversation is marked as needs_human. Skipping AI auto-reply."
            );
            continue;
          }

          let knowledgeMatches: Awaited<
            ReturnType<typeof searchKnowledge>
          > = [];

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
              conversationHistory,
            });
          } catch (error) {
            console.error("AI reply generation error:", error);
          }

          const responseDelaySeconds =
            typeof aiSettings?.response_delay_seconds === "number"
              ? Math.max(0, Math.min(60, aiSettings.response_delay_seconds))
              : 0;

          if (aiSettings?.typing_indicator !== false) {
            await sendMessengerSenderAction(
              senderId,
              "typing_on",
              business.page_access_token
            );
          }

          if (responseDelaySeconds > 0) {
            console.log(
              `Waiting ${responseDelaySeconds} second(s) before reply...`
            );
            await sleep(responseDelaySeconds * 1000);
          }

          const messengerResponse = await sendMessengerMessage(
            senderId,
            replyText,
            business.page_access_token
          );

          if (aiSettings?.typing_indicator !== false) {
            await sendMessengerSenderAction(
              senderId,
              "typing_off",
              business.page_access_token
            );
          }

          const { error: botMessageError } = await supabaseAdmin
            .from("messages")
            .insert({
              business_id: business.id,
              conversation_id: conversation.id,
              sender_type: "ai",
              sender_id: "easytalk-ai",
              message_text: replyText,
              raw_payload: {
                messenger_response: messengerResponse,
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
            .eq("id", conversation.id)
            .eq("business_id", business.id);

          if (updateConversationError) {
            console.error("Conversation update error:", updateConversationError);
          }
        } catch (error) {
          console.error("Messenger event processing error:", error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed.",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook failed.",
      },
      { status: 500 }
    );
  }
}