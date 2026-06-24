import { NextRequest, NextResponse } from "next/server";
import { generateAIReply } from "@/lib/openai/generate-ai-reply";
import { sendMessengerMessage } from "@/lib/meta/messenger";

export function verifyMessengerWebhook(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function handleMessengerWebhook(body: any) {
  if (body.object !== "page") {
    return;
  }

  for (const entry of body.entry || []) {
    for (const messagingEvent of entry.messaging || []) {
      const senderId = messagingEvent.sender?.id;
      const messageText = messagingEvent.message?.text;

      if (!senderId || !messageText) {
        continue;
      }

      console.log("Received Messenger message:", {
        senderId,
        messageText,
      });

      const businessData = `
Business name: Sample Burger Shop
Products:
- Burger: ₱99
- Cheeseburger: ₱129
Opening hours: Monday to Saturday, 9 AM to 8 PM
Delivery: Available within nearby areas
      `;

      const aiReply = await generateAIReply({
        customerMessage: messageText,
        businessData,
      });

      await sendMessengerMessage({
        recipientId: senderId,
        message: aiReply,
      });
    }
  }
}