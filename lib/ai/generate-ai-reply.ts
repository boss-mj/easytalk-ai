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
          .map((faq) => `Q: ${faq.question}\nA: ${faq.answer || "No answer provided."}`)
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
- If the answer is not in the provided data, say: "${fallbackMessage}"
- If the customer needs a human, politely say a team member will assist them shortly.
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

  return response.output_text?.trim() || fallbackMessage;
}