"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [verifyToken, setVerifyToken] = useState("my_webhook_secret_123");
  const [challenge, setChallenge] = useState("hello123");
  const [getResult, setGetResult] = useState("");
  const [postResult, setPostResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState("/api/webhook");

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhook`);
  }, []);

  async function testGetWebhook() {
    alert("GET button clicked");
    console.log("GET button clicked");

    setLoading(true);
    setGetResult("");

    try {
      const url = `/api/webhook?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(
        verifyToken
      )}&hub.challenge=${encodeURIComponent(challenge)}`;

      const response = await fetch(url);
      const text = await response.text();

      setGetResult(
        JSON.stringify(
          {
            status: response.status,
            ok: response.ok,
            response: text,
            testedUrl: url,
          },
          null,
          2
        )
      );
    } catch (error) {
      setGetResult(String(error));
    } finally {
      setLoading(false);
    }
  }

  async function testPostWebhook() {
    alert("POST button clicked");
    console.log("POST button clicked");

    setLoading(true);
    setPostResult("");

    const dummyPayload = {
      object: "page",
      entry: [
        {
          id: "PAGE_TEST_ID",
          time: Date.now(),
          messaging: [
            {
              sender: {
                id: "CUSTOMER_TEST_ID",
              },
              recipient: {
                id: "PAGE_TEST_ID",
              },
              timestamp: Date.now(),
              message: {
                mid: "mid.test123",
                text: "Hello dummy message",
              },
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dummyPayload),
      });

      const text = await response.text();

      setPostResult(
        JSON.stringify(
          {
            status: response.status,
            ok: response.ok,
            response: text,
            sentPayload: dummyPayload,
          },
          null,
          2
        )
      );
    } catch (error) {
      setPostResult(String(error));
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">EasyTalk AI Webhook Debugger</h1>
          <p className="mt-2 text-slate-400">
            Use this page to test your Messenger webhook locally.
          </p>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Current Webhook URL</h2>
          <p className="mt-2 break-all rounded bg-slate-950 p-3 text-sm text-green-400">
            {webhookUrl}
          </p>

          <p className="mt-3 text-sm text-slate-400">
            For Meta callback URL, use your ngrok version:
          </p>

          <p className="mt-2 break-all rounded bg-slate-950 p-3 text-sm text-yellow-400">
            https://rephrase-poach-recoup.ngrok-free.dev/api/webhook
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">1. Test GET Webhook Verification</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-400">Verify Token</label>
              <input
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-3 text-slate-100"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Challenge</label>
              <input
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-3 text-slate-100"
              />
            </div>
          </div>

          <button
            onClick={testGetWebhook}
            disabled={loading}
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Test GET /api/webhook
          </button>

          {getResult && (
            <pre className="mt-4 overflow-auto rounded bg-black p-4 text-sm text-green-400">
              {getResult}
            </pre>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">2. Test POST Dummy Message</h2>

          <p className="mt-2 text-sm text-slate-400">
            This sends a fake Messenger payload to your webhook. It does not send
            a real Facebook message.
          </p>

          <button
            onClick={testPostWebhook}
            disabled={loading}
            className="mt-4 rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            Test POST /api/webhook
          </button>

          {postResult && (
            <pre className="mt-4 overflow-auto rounded bg-black p-4 text-sm text-green-400">
              {postResult}
            </pre>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Expected Results</h2>

          <div className="mt-3 space-y-3 text-sm text-slate-300">
            <p>
              <strong>GET success:</strong> status 200 and response should be{" "}
              <span className="text-green-400">hello123</span>
            </p>

            <p>
              <strong>POST success:</strong> status 200 and response should show{" "}
              <span className="text-green-400">success true</span>
            </p>

            <p>
              <strong>Real Messenger message:</strong> check ngrok inspector for{" "}
              <span className="text-yellow-400">POST /api/webhook</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}