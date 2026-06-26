"use client";

import { useState } from "react";
import { Bot, RefreshCw, Send, Sparkles } from "lucide-react";

type TestResult = {
  reply: string;
  debug: {
    businessName: string;
    productsUsed: number;
    faqsUsed: number;
    knowledgeMatchesFound: number;
    knowledgeMatches: {
      id: number;
      document_id: number;
      file_name: string | null;
      similarity: number;
      preview: string;
    }[];
  };
};

export default function AITesterPage() {
  const [message, setMessage] = useState(
    "What payment methods do you accept?"
  );
  const [result, setResult] = useState<TestResult | null>(null);

  const [isTesting, setIsTesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleTest() {
    try {
      setIsTesting(true);
      setErrorMessage("");
      setResult(null);

      const response = await fetch("/api/ai/test-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to test AI reply.");
      }

      setResult({
        reply: data.reply,
        debug: data.debug,
      });
    } catch (error) {
      console.error("AI tester error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to test AI reply."
      );
    } finally {
      setIsTesting(false);
    }
  }

  function resetTest() {
    setMessage("");
    setResult(null);
    setErrorMessage("");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Reply Tester</h1>
          <p className="mt-2 text-sm text-gray-500">
            Test how your AI will answer using your business profile, products,
            FAQs, and uploaded knowledge base.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Sparkles size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Message
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Type a sample customer question.
                </p>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={8}
              placeholder="Example: Do you deliver nearby?"
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting || !message.trim()}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {isTesting ? "Testing..." : "Test Reply"}
              </button>

              <button
                type="button"
                onClick={resetTest}
                className="flex items-center gap-2 rounded-lg border bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
              This tester does not send anything to Messenger. It only checks
              the AI answer internally.
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Bot size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Reply
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Preview the exact reply the AI would generate.
                </p>
              </div>
            </div>

            {!result ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
                No test result yet.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl bg-emerald-50 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                    {result.reply}
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <h3 className="font-semibold text-gray-900">Debug Info</h3>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <DebugItem
                      label="Business"
                      value={result.debug.businessName}
                    />
                    <DebugItem
                      label="Products Used"
                      value={result.debug.productsUsed.toString()}
                    />
                    <DebugItem
                      label="FAQs Used"
                      value={result.debug.faqsUsed.toString()}
                    />
                    <DebugItem
                      label="Knowledge Matches"
                      value={result.debug.knowledgeMatchesFound.toString()}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {result && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Knowledge Matches Used
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              These are the uploaded document chunks closest to the customer
              message.
            </p>

            {result.debug.knowledgeMatches.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
                No knowledge matches found.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {result.debug.knowledgeMatches.map((match) => (
                  <div key={match.id} className="rounded-xl border p-5">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {match.file_name || "Uploaded document"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Chunk ID: {match.id} · Document ID:{" "}
                          {match.document_id}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {Math.round(match.similarity * 100)}% match
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                      {match.preview}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function DebugItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}