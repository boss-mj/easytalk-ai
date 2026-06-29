"use client";

import { FormEvent, useEffect, useState } from "react";

type Connection = {
  id: number;
  name: string;
  facebook_page_id: string | null;
  facebook_page_name: string | null;
  is_connected: boolean;
  updated_at: string | null;
};

export default function ConnectPage() {
  const [connection, setConnection] = useState<Connection | null>(null);

  const [facebookPageId, setFacebookPageId] = useState("");
  const [facebookPageName, setFacebookPageName] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadConnection() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/business/connect");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load connection.");
      }

      const loadedConnection = result.connection as Connection;

      setConnection(loadedConnection);
      setFacebookPageId(loadedConnection.facebook_page_id || "");
      setFacebookPageName(loadedConnection.facebook_page_name || "");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load connection."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConnection();
  }, []);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/business/connect", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          facebook_page_id: facebookPageId,
          facebook_page_name: facebookPageName,
          page_access_token: pageAccessToken,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save connection.");
      }

      setConnection(result.connection);
      setPageAccessToken("");
      setSuccessMessage("Facebook Page connected successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save connection."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDisconnect() {
    const confirmed = window.confirm(
      "Disconnect this Facebook Page from your business?"
    );

    if (!confirmed) return;

    try {
      setIsDisconnecting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/business/connect", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to disconnect Facebook Page.");
      }

      setConnection(result.connection);
      setFacebookPageId("");
      setFacebookPageName("");
      setPageAccessToken("");
      setSuccessMessage("Facebook Page disconnected.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to disconnect Facebook Page."
      );
    } finally {
      setIsDisconnecting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black p-6 text-white">
        <p className="text-sm text-zinc-400">Loading Facebook connection...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">Messenger Setup</p>
          <h1 className="mt-2 text-3xl font-bold">Connect Facebook Page</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Save your Facebook Page details so EasyTalk AI can receive and reply
            to Messenger messages for this business.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Connection status</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Business: {connection?.name || "Unknown business"}
              </p>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                connection?.is_connected
                  ? "bg-green-950 text-green-300"
                  : "bg-zinc-900 text-zinc-300"
              }`}
            >
              {connection?.is_connected ? "Connected" : "Not connected"}
            </div>
          </div>

          {connection?.facebook_page_name ? (
            <div className="mt-4 rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
              <p>
                <span className="text-zinc-500">Page name:</span>{" "}
                {connection.facebook_page_name}
              </p>
              <p className="mt-1">
                <span className="text-zinc-500">Page ID:</span>{" "}
                {connection.facebook_page_id}
              </p>
            </div>
          ) : null}
        </div>

        {successMessage ? (
          <div className="mb-5 rounded-xl border border-green-900 bg-green-950/40 px-4 py-3 text-sm text-green-300">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Facebook Page ID <span className="text-red-400">*</span>
              </label>
              <input
                value={facebookPageId}
                onChange={(event) => setFacebookPageId(event.target.value)}
                placeholder="Example: 1082868708239791"
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-zinc-500">
                This must match the Page ID from your webhook logs.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Facebook Page Name <span className="text-red-400">*</span>
              </label>
              <input
                value={facebookPageName}
                onChange={(event) => setFacebookPageName(event.target.value)}
                placeholder="Example: Easy Talk Test Page"
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Page Access Token <span className="text-red-400">*</span>
              </label>
              <textarea
                value={pageAccessToken}
                onChange={(event) => setPageAccessToken(event.target.value)}
                placeholder="Paste your Page Access Token here"
                rows={5}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-zinc-500">
                For security, this token will not be displayed again after
                saving.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save connection"}
              </button>

              {connection?.is_connected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="rounded-xl border border-red-900 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDisconnecting ? "Disconnecting..." : "Disconnect Page"}
                </button>
              ) : null}
            </div>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-semibold">Webhook callback URL</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Use this in Meta Developer webhook settings:
          </p>
          <code className="mt-3 block rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
            https://YOUR-NGROK-DOMAIN/api/webhook
          </code>
        </div>
      </div>
    </main>
  );
}