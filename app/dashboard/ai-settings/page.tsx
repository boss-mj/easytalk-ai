"use client";

import { useState } from "react";

export default function AISettingsPage() {
  const [confidence, setConfidence] = useState(60);
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8 text-black">AI Settings</h1>

        {/* Tabs */}
        <div className="border rounded-xl overflow-hidden mb-8">
          <div className="flex bg-white">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === "general"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-700"
              }`}
            >
              General
            </button>

            <button
              onClick={() => setActiveTab("prompt")}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === "prompt"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-700"
              }`}
            >
              System Prompt
            </button>

            <button
              onClick={() => setActiveTab("advanced")}
              className={`px-6 py-4 font-medium border-b-2 transition ${
                activeTab === "advanced"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {activeTab === "prompt" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                System Prompt
              </label>

              <textarea
                rows={20}
                className="w-full border rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                defaultValue={`You are EasyTalk AI, a customer support assistant for this business.

Your responsibilities:

- Answer customer inquiries professionally.
- Use information from Business Profile.
- Use Products & Services data when answering.
- Use FAQ / Policies knowledge before generating responses.
- Respect Opening Hours settings.
- Be friendly, concise, and helpful.
- Ask follow-up questions when information is missing.

Conversation Rules:

1. Always greet customers politely.
2. Provide accurate information only.
3. Do not make up prices, products, policies, or schedules.
4. If information is unavailable, offer to connect the customer to a human agent.
5. If a customer requests a refund, complaint handling, order issue, or account-related concern, create a human handoff.

Human Handoff Conditions:

- Customer requests a human agent.
- Customer is angry or frustrated.
- Refund requests.
- Payment disputes.
- Order issues.
- Low confidence response.

Business Knowledge Sources:

- Business Profile
- Products & Services
- FAQ / Policies
- Opening Hours

Response Style:

- Friendly
- Professional
- Short and clear
- Messenger-friendly`}
              />
            </div>

            <div className="flex justify-end">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium">
                Save Prompt
              </button>
            </div>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                AI Model
              </label>

              <select className="w-full border rounded-lg px-4 py-3 text-gray-700">
                <option>GPT-5</option>
                <option>GPT-4.1</option>
                <option>Gemini 2.5</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Confidence Threshold
                </label>

                <input
                  type="number"
                  defaultValue="85"
                  className="w-full border rounded-lg px-4 py-3 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Response Delay (Seconds)
                </label>

                <input
                  type="number"
                  defaultValue="2"
                  className="w-full border rounded-lg px-4 py-3 text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <label className="flex items-center justify-between border rounded-lg p-4">
                <span className="text-gray-700">Enable Human Handoff</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between border rounded-lg p-4">
                <span className="text-gray-700">
                  Remember Conversation History
                </span>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between border rounded-lg p-4">
                <span className="text-gray-700">Auto Reply</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between border rounded-lg p-4">
                <span className="text-gray-700">Typing Indicator</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Knowledge Sources
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  <span className="text-gray-700">Business Profile</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  <span className="text-gray-700">Products & Services</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  <span className="text-gray-700">FAQ / Policies</span>
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  <span className="text-gray-700">Opening Hours</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Fallback Message
              </label>

              <textarea
                rows={4}
                className="w-full border rounded-lg px-4 py-3 text-gray-700"
                defaultValue="I'm not completely sure about that. Let me connect you with one of our support agents."
              />
            </div>

            <div className="flex justify-end">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium">
                Save Advanced Settings
              </button>
            </div>
          </div>
        )}

        {/* Bot Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Bot Name
          </label>

          <input
            type="text"
            defaultValue="EasyBot"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />
        </div>

        {/* Welcome Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Welcome Message
          </label>

          <textarea
            rows={5}
            defaultValue={`Hello! 👋
            How can I help you today?`}
            className="w-full border rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          />
        </div>

        {/* Response Tone */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Response Tone
          </label>

          <select className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
            <option>Friendly</option>
            <option>Professional</option>
            <option>Formal</option>
            <option>Casual</option>
          </select>
        </div>

        {/* Confidence Threshold */}
        <div className="mb-10">
          <div className="flex justify-between mb-2">
            <label className="font-medium text-gray-700">
              Confidence Threshold
            </label>

            <span className="font-semibold">{confidence}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full accent-green-500"
          />

          <p className="text-sm text-gray-500 mt-2">
            If the confidence level is below this threshold, the chatbot will
            offer human assistance.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
