import { getOpenAIClient } from "@/lib/openai/client";
import type { KnowledgeMatch } from "@/lib/knowledge/search-knowledge";

type ConversationHistoryMessage = {
  sender_type: "customer" | "ai" | "human" | "system" | string;
  message_text: string;
  created_at?: string;
};

type GenerateAIReplyParams = {
  customerMessage: string;
  business: any;
  aiSettings: any;
  products: any[];
  faqs: any[];
  knowledgeMatches?: KnowledgeMatch[];
  conversationHistory?: ConversationHistoryMessage[];
};

function formatConversationHistory(history: ConversationHistoryMessage[]) {
  if (!history || history.length === 0) {
    return "No previous conversation history.";
  }

  return history
    .map((message) => {
      const speaker =
        message.sender_type === "customer"
          ? "Customer"
          : message.sender_type === "ai"
            ? "AI Assistant"
            : message.sender_type === "human"
              ? "Human Staff"
              : "System";

      return `${speaker}: ${message.message_text}`;
    })
    .join("\n");
}

/**
 * Prevents this bug:
 *
 * "We do not sell manok.
 * A team member will assist you shortly."
 *
 * If the AI already gave a useful answer, we remove the extra fallback sentence.
 */
function removeUnnecessaryFallback(reply: string, fallbackMessage: string) {
  const cleanedReply = reply.trim();
  const cleanedFallback = fallbackMessage.trim();

  if (!cleanedReply) return cleanedFallback;

  /**
   * If the whole reply is only the fallback, keep it.
   */
  if (cleanedReply.toLowerCase() === cleanedFallback.toLowerCase()) {
    return cleanedReply;
  }

  /**
   * If fallback was appended after a useful answer, remove it.
   */
  const fallbackIndex = cleanedReply
    .toLowerCase()
    .indexOf(cleanedFallback.toLowerCase());

  if (fallbackIndex > 0) {
    return cleanedReply.slice(0, fallbackIndex).trim();
  }

  /**
   * Also remove common fallback-style endings.
   */
  return cleanedReply
    .replace(/i am not sure about that yet\.?/gi, "")
    .replace(/i'm not sure about that yet\.?/gi, "")
    .replace(/a team member will assist you shortly\.?/gi, "")
    .replace(/a team member can assist you shortly\.?/gi, "")
    .replace(/a team member can also assist you shortly\.?/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function generateAIReply({
  customerMessage,
  business,
  aiSettings,
  products,
  faqs,
  knowledgeMatches = [],
  conversationHistory = [],
}: GenerateAIReplyParams) {
  const openai = getOpenAIClient();
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const fallbackMessage =
    aiSettings?.fallback_message ||
    "I'm not sure about that yet. A team member will assist you shortly.";

  const productText =
    products.length > 0
      ? products
          .map((product) => {
            const price =
              product.price !== null && product.price !== undefined
                ? `${product.price} ${product.currency || "PHP"}`
                : "N/A";

            return `- ${product.name}: ${
              product.description || "No description"
            } | Price: ${price} | Available: ${
              product.is_available ? "Yes" : "No"
            }`;
          })
          .join("\n")
      : "No products added yet.";

  const faqText =
    faqs.length > 0
      ? faqs
          .map(
            (faq) =>
              `Q: ${faq.question}\nA: ${faq.answer || "No answer provided."}`
          )
          .join("\n\n")
      : "No FAQs added yet.";

  const knowledgeText =
    knowledgeMatches.length > 0
      ? knowledgeMatches
          .map(
            (match, index) =>
              `Document Match ${index + 1}
File: ${match.file_name || "Uploaded document"}
Similarity: ${Math.round(match.similarity * 100)}%
Content:
${match.content}`
          )
          .join("\n\n---\n\n")
      : "No matching uploaded document content found.";

  const historyText = formatConversationHistory(conversationHistory);

  const systemPrompt =
    aiSettings?.system_prompt ||
    `You are ${
      aiSettings?.bot_name || "EasyTalk AI"
    }, a customer support assistant.`;

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: "system",
        content: `
${systemPrompt}

You are replying inside an ongoing Messenger conversation.

Conversation behavior rules:
- Use the conversation history to understand the latest customer message.
- Short replies like "yes", "yes please", "okay", "sige", "sure", "that one", "how much", "continue", or "please" must be understood from the previous messages.
- If your previous message offered something, such as listing products, showing prices, explaining delivery, or giving more details, and the customer replies with "yes", "yes please", "okay", "sige", or similar, continue with the offered action.
- Example: If you asked "Do you want me to list the product prices?" and the customer says "yes", list the product prices.
- Only treat "okay", "thanks", "sige", or similar as conversation-ending when your previous message already said that a team member will assist.
- Do not ask "What do you mean by yes?" if the previous conversation makes the meaning clear.

Business answer rules:
- Reply in a ${aiSettings?.tone || "friendly"} tone.
- Keep the reply ${aiSettings?.max_reply_length || "short"}.
- Use only the business profile, products, FAQs, uploaded document matches, and conversation history.
- Prioritize uploaded document matches when they directly answer the customer.
- Do not invent prices, products, schedules, delivery rules, payment methods, or policies.

Very important fallback rule:
- Use this fallback only when you cannot answer the customer at all: "${fallbackMessage}"
- Do NOT add the fallback after a useful answer.
- If the customer asks for a product that is not listed, answer directly that the business does not currently sell or list that product.
- Example: If the customer asks "may manok kayo?" and there is no manok in the product list, say that the business currently does not have manok listed.
- Do NOT also say "I am not sure about that yet" after saying the product is not available.
- Do NOT end every reply with "a team member will assist you shortly."
        `,
      },
      {
        role: "user",
        content: `
Business Information:
Name: ${business?.name || "Not specified"}
Description: ${business?.description || "Not specified"}
Address: ${business?.address || "Not specified"}
Contact Number: ${business?.contact_number || "Not specified"}
Email: ${business?.email || "Not specified"}
Opening Hours: ${business?.opening_hours || "Not specified"}
Closing Hours: ${business?.closing_hours || "Not specified"}
Delivery Info: ${business?.delivery_info || "Not specified"}
Payment Methods: ${business?.payment_methods || "Not specified"}

Products / Services:
${productText}

FAQs:
${faqText}

Uploaded Document Matches:
${knowledgeText}

Conversation History:
${historyText}

Latest Customer Message:
${customerMessage}

Reply to the latest customer message using the conversation history and business data.
        `,
      },
    ],
  });

  const rawReply = response.output_text?.trim() || fallbackMessage;

  return removeUnnecessaryFallback(rawReply, fallbackMessage);
}