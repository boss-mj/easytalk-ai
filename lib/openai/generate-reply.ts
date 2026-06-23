import { openai } from "./client";

type GenerateAIReplyParams = {
  customerMessage: string;
  businessData?: string;
};

export async function generateAIReply({
  customerMessage,
  businessData = "Business information is not available yet.",
}: GenerateAIReplyParams) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are a helpful Messenger assistant for a business.

Rules:
- Answer only based on the business information provided.
- Keep the reply short and friendly.
- If the answer is not available, say: "I'm not sure about that yet. A team member will assist you shortly."

Business information:
${businessData}

Customer message:
${customerMessage}
    `,
  });

  return response.output_text;
}