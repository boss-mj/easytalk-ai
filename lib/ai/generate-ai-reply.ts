import { getOpenAIClient } from "@/lib/openai/client";
import type { KnowledgeMatch } from "@/lib/knowledge/search-knowledge";

type GenerateAIReplyParams = {
  customerMessage: string;
  business: any;
  aiSettings: any;
  products: any[];
  faqs: any[];
  knowledgeMatches?: KnowledgeMatch[];
};

export async function generateAIReply({
  customerMessage,
  business,
  aiSettings,
  products,
  faqs,
  knowledgeMatches = [],
}: GenerateAIReplyParams) {
  const openai = getOpenAIClient();
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const productText =
    products.length > 0
      ? products
          .map(
            (product) =>
              `- ${product.name}: ${
                product.description || "No description"
              } | Price: ${product.price || "N/A"} ${
                product.currency || "PHP"
              } | Available: ${product.is_available ? "Yes" : "No"}`
          )
          .join("\n")
      : "No products added yet.";

  const faqText =
    faqs.length > 0
      ? faqs
          .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
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

  const systemPrompt =
    aiSettings?.system_prompt ||
    `You are ${aiSettings?.bot_name || "EasyTalk AI"}, a customer support assistant.`;

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: "system",
        content: `
${systemPrompt}

Rules:
- Reply in a ${aiSettings?.tone || "friendly"} tone.
- Keep the reply ${aiSettings?.max_reply_length || "short"}.
- Use the business profile, products, FAQs, and uploaded document matches provided.
- Prioritize uploaded document matches when they directly answer the customer.
- Do not invent prices, products, schedules, or policies.
- If the answer is not in the provided data, say: "${aiSettings?.fallback_message}"
        `,
      },
      {
        role: "user",
        content: `
Business Information:
Name: ${business?.name}
Description: ${business?.description}
Address: ${business?.address}
Contact Number: ${business?.contact_number}
Opening Hours: ${business?.opening_hours}
Closing Hours: ${business?.closing_hours}
Delivery Info: ${business?.delivery_info}
Payment Methods: ${business?.payment_methods}

Products / Services:
${productText}

FAQs:
${faqText}

Uploaded Document Matches:
${knowledgeText}

Customer Message:
${customerMessage}
        `,
      },
    ],
  });

  return (
    response.output_text?.trim() ||
    aiSettings?.fallback_message ||
    "I'm not sure about that yet. A team member will assist you shortly."
  );
}