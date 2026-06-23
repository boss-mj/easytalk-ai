"use client";

import { useEffect, useState } from "react";

type ActiveTab = "general" | "prompt" | "automation" | "test";

const defaultSystemPrompt = `You are EasyTalk AI, a customer support assistant for this business.

Your responsibilities:
- Answer customer inquiries professionally.
- Use information from the Business Profile.
- Use Products & Services data when answering.
- Use FAQ / Policies before generating responses.
- Respect Opening Hours settings.
- Be friendly, concise, and helpful.
- Ask follow-up questions when information is missing.

Conversation Rules:
1. Always greet customers politely.
2. Provide accurate information only.
3. Do not make up prices, products, policies, or schedules.
4. If information is unavailable, use the fallback message.
5. If the customer asks for a human, refund, complaint, payment issue, or order problem, trigger human handoff.

Response Style:
- Friendly
- Professional
- Short and clear
- Messenger-friendly`;

export default function AISettingsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    isEnabled: true,
    botName: "EasyBot",
    welcomeMessage: "Hello! 👋 How can I help you today?",
    tone: "friendly",
    fallbackMessage:
      "I'm not completely sure about that. Let me connect you with one of our support agents.",
    handoffMessage:
      "I will forward this to a human team member who can assist you better.",
    maxReplyLength: "short",
    confidenceThreshold: 85,
    responseDelaySeconds: 2,
    enableHumanHandoff: true,
    rememberConversationHistory: true,
    typingIndicator: true,
    useBusinessProfile: true,
    useProducts: true,
    useFaqs: true,
    useOpeningHours: true,
    systemPrompt: defaultSystemPrompt,
  });

useEffect(() => {
  async function loadSettings() {
    try {
      const response = await fetch("/api/ai-settings", {
        cache: "no-store",
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(text || "API returned non-JSON response");
      }

      console.log("AI settings API result:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to load AI settings");
      }

      if (result.settings) {
        setSettings((prev) => ({
          ...prev,
          ...result.settings,
          systemPrompt: result.settings.systemPrompt || prev.systemPrompt,
        }));
      }
    } catch (error) {
      console.error("Load AI settings error:", error);
      alert("Failed to load AI settings. Check terminal and /api/ai-settings.");
    } finally {
      setIsLoading(false);
    }
  }

  loadSettings();
}, []);
  const [testMessage, setTestMessage] = useState("");
  const [testReply, setTestReply] = useState("");

  function updateSetting<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
  async function handleSave() {
    try {
      setIsSaving(true);

      const response = await fetch("/api/ai-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save AI settings");
      }

      alert("AI Settings saved to Supabase.");
    } catch (error) {
      console.error("Save AI settings error:", error);
      alert("Failed to save AI settings.");
    } finally {
      setIsSaving(false);
    }
  }
  function handleTestReply() {
    if (!testMessage.trim()) {
      alert("Please enter a test customer message.");
      return;
    }

    setTestReply(
      `Sample AI reply: Thanks for your message! Based on the current business information, I would help answer: "${testMessage}"`
    );
  }
  if (isLoading) {
  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      Loading AI settings...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">AI Settings</h1>
            <p className="mt-2 text-sm text-gray-500">
              Configure how your AI auto-reply behaves in Messenger.
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${settings.isEnabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {settings.isEnabled ? "Auto Reply ON" : "Auto Reply OFF"}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-hidden rounded-xl border">
          <div className="flex bg-white">
            <TabButton
              label="General"
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            />

            <TabButton
              label="System Prompt"
              active={activeTab === "prompt"}
              onClick={() => setActiveTab("prompt")}
            />

            <TabButton
              label="Automation"
              active={activeTab === "automation"}
              onClick={() => setActiveTab("automation")}
            />

            <TabButton
              label="Test Reply"
              active={activeTab === "test"}
              onClick={() => setActiveTab("test")}
            />
          </div>
        </div>

        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <ToggleBox
              title="Enable AI Auto Reply"
              description="When enabled, the bot will automatically reply to Messenger messages."
              checked={settings.isEnabled}
              onChange={(value) => updateSetting("isEnabled", value)}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Bot Name
              </label>
              <input
                type="text"
                value={settings.botName}
                onChange={(e) => updateSetting("botName", e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Welcome Message
              </label>
              <textarea
                rows={4}
                value={settings.welcomeMessage}
                onChange={(e) =>
                  updateSetting("welcomeMessage", e.target.value)
                }
                className="w-full resize-none rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Response Tone
              </label>
              <select
                value={settings.tone}
                onChange={(e) => updateSetting("tone", e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Reply Length
              </label>
              <select
                value={settings.maxReplyLength}
                onChange={(e) =>
                  updateSetting("maxReplyLength", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* System Prompt Tab */}
        {activeTab === "prompt" && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                System Prompt
              </label>

              <textarea
                rows={20}
                value={settings.systemPrompt}
                onChange={(e) => updateSetting("systemPrompt", e.target.value)}
                className="w-full resize-none rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === "automation" && (
          <div className="space-y-6">
            <div className="rounded-xl border p-5">
              <div className="mb-2 flex justify-between">
                <label className="font-medium text-gray-700">
                  Confidence Threshold
                </label>
                <span className="font-semibold text-green-700">
                  {settings.confidenceThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={settings.confidenceThreshold}
                onChange={(e) =>
                  updateSetting("confidenceThreshold", Number(e.target.value))
                }
                className="w-full accent-green-500"
              />

              <p className="mt-2 text-sm text-gray-500">
                If the AI confidence is below this level, the bot should offer
                human assistance.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Response Delay in Seconds
              </label>

              <input
                type="number"
                min="0"
                max="60"
                value={settings.responseDelaySeconds}
                onChange={(e) =>
                  updateSetting("responseDelaySeconds", Number(e.target.value))
                }
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ToggleBox
                title="Enable Human Handoff"
                description="Offer human support when AI cannot answer."
                checked={settings.enableHumanHandoff}
                onChange={(value) =>
                  updateSetting("enableHumanHandoff", value)
                }
              />

              <ToggleBox
                title="Remember Conversation History"
                description="Use previous messages in the conversation."
                checked={settings.rememberConversationHistory}
                onChange={(value) =>
                  updateSetting("rememberConversationHistory", value)
                }
              />

              <ToggleBox
                title="Typing Indicator"
                description="Show typing behavior before replying."
                checked={settings.typingIndicator}
                onChange={(value) => updateSetting("typingIndicator", value)}
              />
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="mb-4 font-semibold text-gray-800">
                Knowledge Sources
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <CheckboxRow
                  label="Business Profile"
                  checked={settings.useBusinessProfile}
                  onChange={(value) =>
                    updateSetting("useBusinessProfile", value)
                  }
                />

                <CheckboxRow
                  label="Products & Services"
                  checked={settings.useProducts}
                  onChange={(value) => updateSetting("useProducts", value)}
                />

                <CheckboxRow
                  label="FAQ / Policies"
                  checked={settings.useFaqs}
                  onChange={(value) => updateSetting("useFaqs", value)}
                />

                <CheckboxRow
                  label="Opening Hours"
                  checked={settings.useOpeningHours}
                  onChange={(value) => updateSetting("useOpeningHours", value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Fallback Message
              </label>

              <textarea
                rows={4}
                value={settings.fallbackMessage}
                onChange={(e) =>
                  updateSetting("fallbackMessage", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Human Handoff Message
              </label>

              <textarea
                rows={4}
                value={settings.handoffMessage}
                onChange={(e) => updateSetting("handoffMessage", e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* Test Reply Tab */}
        {activeTab === "test" && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Test Customer Message
              </label>

              <textarea
                rows={5}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Example: Do you deliver? What time are you open?"
                className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="button"
              onClick={handleTestReply}
              className="rounded-lg bg-green-500 px-8 py-3 font-medium text-white transition hover:bg-green-600"
            >
              Generate Test Reply
            </button>

            {testReply && (
              <div className="rounded-xl border bg-gray-50 p-5">
                <p className="mb-2 text-sm font-semibold text-gray-600">
                  Preview Reply
                </p>
                <p className="text-gray-800">{testReply}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-6 py-4 font-medium transition ${active
        ? "border-green-700 text-green-700"
        : "border-transparent text-gray-700 hover:text-green-700"
        }`}
    >
      {label}
    </button>
  );
}

function ToggleBox({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-5">
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-green-500"
      />
    </label>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-green-500"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg bg-green-500 px-8 py-3 font-medium text-white transition hover:bg-green-600"
      >
        Save Settings
      </button>
    </div>
  );
}