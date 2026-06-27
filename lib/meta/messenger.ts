type SendMessengerMessageParams = {
  recipientId: string;
  message: string;
  pageAccessToken?: string | null;
};

export async function sendMessengerMessage({
  recipientId,
  message,
  pageAccessToken,
}: SendMessengerMessageParams) {
  /**
   * Use the business-specific Page Access Token first.
   * If missing, fallback to .env.local for local testing.
   */
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
          id: recipientId,
        },
        message: {
          text: message,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Messenger Send API error:", data);

    throw new Error(
      data?.error?.message || "Failed to send Messenger message."
    );
  }

  console.log("Messenger Send API response:", data);

  return data;
}