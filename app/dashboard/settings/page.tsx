"use client";

import { useEffect, useState } from "react";
import { Bot, RefreshCw, Save, Settings, ShieldCheck } from "lucide-react";

type AutomationSettings = {
  id: number;
  business_id: number;
  is_enabled: boolean;
  bot_name: string;
  fallback_message: string;
  enable_human_handoff: boolean;
  use_knowledge_base: boolean;
  response_delay_seconds: number;
  typing_indicator: boolean;
  updated_at: string;
};

const defaultSettings: AutomationSettings = {
  id: 0,
  business_id: 1,
  is_enabled: true,
  bot_name: "EasyBot",
  fallback_message:
    "I am not sure about that yet. A team member will assist you shortly.",
  enable_human_handoff: true,
  use_knowledge_base: true,
  response_delay_seconds: 0,
  typing_indicator: true,
  updated_at: "",
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<AutomationSettings>(defaultSettings);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setStatusMessage("");

      const response = await fetch("/api/settings/automation", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load settings.");
      }

      setSettings({
        ...defaultSettings,
        ...result.settings,
      });
    } catch (error) {
      console.error("Load settings error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load settings."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setIsSaving(true);
      setErrorMessage("");
      setStatusMessage("");

      const response = await fetch("/api/settings/automation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings.");
      }

      setSettings({
        ...defaultSettings,
        ...result.settings,
      });

      setStatusMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Save settings error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save settings."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function updateSetting<K extends keyof AutomationSettings>(
    key: K,
    value: AutomationSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-black">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage global automation behavior for your Messenger AI assistant.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {statusMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Bot size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Automation Controls
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                These settings affect all Messenger conversations for this
                business.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleRow
              title="AI Auto Reply"
              description="When enabled, the AI can automatically answer customer messages."
              checked={settings.is_enabled}
              onChange={(value) => updateSetting("is_enabled", value)}
            />

            <ToggleRow
              title="Human Handoff"
              description="Allow conversations to be marked as Needs Human so AI stops replying."
              checked={settings.enable_human_handoff}
              onChange={(value) =>
                updateSetting("enable_human_handoff", value)
              }
            />

            <ToggleRow
              title="Knowledge Base Search"
              description="Allow AI to use uploaded documents when answering."
              checked={settings.use_knowledge_base}
              onChange={(value) => updateSetting("use_knowledge_base", value)}
            />

            <ToggleRow
              title="Typing Indicator"
              description="Reserved for future Messenger typing indicator behavior."
              checked={settings.typing_indicator}
              onChange={(value) => updateSetting("typing_indicator", value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Settings size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Reply Defaults
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure basic default behavior for AI and manual support.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Bot Name
              </span>
              <input
                value={settings.bot_name || ""}
                onChange={(event) =>
                  updateSetting("bot_name", event.target.value)
                }
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="EasyBot"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Response Delay Seconds
              </span>
              <input
                type="number"
                min={0}
                max={60}
                value={settings.response_delay_seconds || 0}
                onChange={(event) =>
                  updateSetting(
                    "response_delay_seconds",
                    Number(event.target.value)
                  )
                }
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-1 text-xs text-gray-400">
                For MVP this is saved only. We can connect the actual delay to
                Messenger later.
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Fallback Message
              </span>
              <textarea
                value={settings.fallback_message || ""}
                onChange={(event) =>
                  updateSetting("fallback_message", event.target.value)
                }
                rows={4}
                className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="I am not sure about that yet..."
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  MVP Status
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  This settings page is global for one business. Multi-business
                  settings will come after authentication.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleRow({
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
    <div className="flex items-center justify-between gap-5 rounded-xl border p-5">
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-gray-300"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}