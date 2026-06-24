import { getOpenAIClient } from "@/lib/openai/client";

type GenerateAIReplyParams = {
  customerMessage: string;
  business: any;
  aiSettings: any;
  products: any[];
  faqs: any[];
};

export async function generateAIReply({
  customerMessage,
  business,
  aiSettings,
  products,
  faqs,
}: GenerateAIReplyParams) {
  const openai = getOpenAIClient();

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

  const productText =
    products.length > 0
      ? products
          .map(
            (product) =>
              `- ${product.name}: ${product.description || "No description"} | Price: ${product.price || "N/A"} ${product.currency || "PHP"} | Available: ${product.is_available ? "Yes" : "No"}`
          )
          .join("\n")
      : "No products added yet.";

  const faqText =
    faqs.length > 0
      ? faqs
          .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
          .join("\n\n")
      : "No FAQs added yet.";

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
- Use only the business data, products, and FAQs provided.
- Do not invent prices, products, schedules, or policies.
- If you do not know the answer, say: "${aiSettings?.fallback_message}"
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
Delivery Info: ${business?.delivery_info}
Payment Methods: ${business?.payment_methods}

Products / Services:
${productText}

FAQs:
${faqText}

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