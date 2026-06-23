import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = "my_webhook_secret_123";

async function sendMessengerMessage(senderId: string, text: string) {
  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;

  if (!pageAccessToken) {
    throw new Error("Missing META_PAGE_ACCESS_TOKEN in .env.local");
  }

  const response = await fetch(
    `https://graph.facebook.com/v20.0/me/messages?access_token=${pageAccessToken}`,
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
    throw new Error(`Failed to send Messenger message: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function GET(req: NextRequest) {
  console.log("🔥 GET /api/webhook was called");

  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Meta verification success");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    console.log("🔥 POST /api/webhook was called");

    const body = await req.json();

    console.log("POST body:");
    console.log(JSON.stringify(body, null, 2));

    if (body.object === "page") {
      for (const entry of body.entry || []) {
        for (const event of entry.messaging || []) {
          const senderId = event.sender?.id;
          const messageText = event.message?.text;
          const isEcho = event.message?.is_echo;

          if (isEcho) {
            console.log("Skipping echo message");
            continue;
          }

          if (!senderId || !messageText) {
            console.log("Skipping event without senderId or text");
            continue;
          }

          console.log("Real sender ID:", senderId);
          console.log("Real message:", messageText);

          await sendMessengerMessage(
            senderId,
            "Test reply: EasyTalk AI received your message."
          );
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