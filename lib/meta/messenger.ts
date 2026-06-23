type SendMessengerMessageParams = {
  recipientId: string;
  message: string;
  pageAccessToken?: string;
};

export async function sendMessengerMessage({
  recipientId,
  message,
  pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN,
}: SendMessengerMessageParams) {
  if (!pageAccessToken) {
    throw new Error("Missing META_PAGE_ACCESS_TOKEN");
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
          id: recipientId,
        },
        message: {
          text: message,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Messenger send error:", error);
    throw new Error("Failed to send Messenger message");
  }

  return response.json();
}