"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageSquare, RefreshCw, User, Send } from "lucide-react";

type ConversationStatus = "open" | "needs_human" | "closed";

type Conversation = {
  id: number;
  business_id: number;
  customer_psid: string;
  customer_name: string | null;
  customer_profile_pic: string | null;
  status: ConversationStatus;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: number;
  business_id: number;
  conversation_id: number;
  sender_type: "customer" | "ai" | "human" | "system";
  sender_id: string | null;
  message_text: string;
  created_at: string;
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [manualReply, setManualReply] = useState("");
  const [isSendingManualReply, setIsSendingManualReply] = useState(false);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  async function sendManualReply() {
    if (!selectedConversation || !manualReply.trim()) return;

    try {
      setIsSendingManualReply(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/conversations/${selectedConversation.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: manualReply,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send manual reply.");
      }

      setMessages((current) => [...current, result.message]);

      setSelectedConversation(result.conversation);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === result.conversation.id
            ? result.conversation
            : conversation
        )
      );

      setManualReply("");
    } catch (error) {
      console.error("Send manual reply error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send manual reply."
      );
    } finally {
      setIsSendingManualReply(false);
    }
  }

  function getCustomerLabel(conversation: Conversation) {
    return conversation.customer_name || `Customer ${conversation.customer_psid}`;
  }


  async function loadConversations() {
    try {
      setIsLoadingConversations(true);
      setErrorMessage("");

      const response = await fetch("/api/conversations", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load conversations.");
      }

      const loadedConversations: Conversation[] = result.conversations || [];

      setConversations(loadedConversations);

      if (!selectedConversation && loadedConversations.length > 0) {
        setSelectedConversation(loadedConversations[0]);
        await loadMessages(loadedConversations[0].id);
      }
    } catch (error) {
      console.error("Load conversations error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load conversations."
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }

  async function loadMessages(conversationId: number) {
    try {
      setIsLoadingMessages(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load messages.");
      }

      setMessages(result.messages || []);
    } catch (error) {
      console.error("Load messages error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load messages."
      );
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function selectConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  }

  async function updateConversationStatus(status: ConversationStatus) {
    if (!selectedConversation) return;

    try {
      setIsUpdatingStatus(true);
      setErrorMessage("");

      const response = await fetch(
        `/api/conversations/${selectedConversation.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status.");
      }

      const updatedConversation = result.conversation as Conversation;

      setSelectedConversation(updatedConversation);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation
        )
      );
    } catch (error) {
      console.error("Update status error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update status."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function formatDate(value: string | null) {
    if (!value) return "No time";

    return new Date(value).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Conversations
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View real Messenger conversations, customer messages, and AI
              replies saved from your webhook.
            </p>
          </div>

          <button
            type="button"
            onClick={loadConversations}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid min-h-[650px] gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="font-semibold text-gray-900">Conversation List</h2>
              <p className="mt-1 text-sm text-gray-500">
                {conversations.length} conversation
                {conversations.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="max-h-[580px] overflow-y-auto">
              {isLoadingConversations ? (
                <div className="p-5 text-sm text-gray-500">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="mx-auto text-gray-300" size={40} />
                  <p className="mt-3 font-medium text-gray-700">
                    No conversations yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Send a message to your Facebook Page to create one.
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const isSelected =
                    selectedConversation?.id === conversation.id;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => selectConversation(conversation)}
                      className={`w-full border-b p-5 text-left transition last:border-none ${isSelected
                        ? "bg-emerald-50"
                        : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            Customer {getCustomerLabel(conversation)}
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {conversation.last_message || "No message yet"}
                          </p>
                        </div>

                        <StatusBadge status={conversation.status} />
                      </div>

                      <p className="mt-3 text-xs text-gray-400">
                        {formatDate(conversation.last_message_at)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-2xl border bg-white shadow-sm">
            {!selectedConversation ? (
              <div className="flex min-h-[650px] items-center justify-center p-8 text-center">
                <div>
                  <MessageSquare className="mx-auto text-gray-300" size={48} />
                  <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    Select a conversation
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Customer messages and AI replies will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-170px)] flex-col">
                <div className="border-b p-5">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Customer {getCustomerLabel(selectedConversation)}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Last updated:{" "}
                        {formatDate(selectedConversation.last_message_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => updateConversationStatus("open")}
                        className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                      >
                        Open
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => updateConversationStatus("needs_human")}
                        className="rounded-lg border px-3 py-2 text-xs font-medium text-orange-700 transition hover:bg-orange-50 disabled:opacity-50"
                      >
                        Needs Human
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => updateConversationStatus("closed")}
                        className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                      >
                        Closed
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <StatusBadge status={selectedConversation.status} />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-5 scroll-smooth">
                  <div className="space-y-4">                  {isLoadingMessages ? (
                    <div className="text-sm text-gray-500">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-gray-500">
                      No messages found for this conversation.
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                        />
                      ))}

                      <div ref={messagesEndRef} />
                    </>
                  )}
                  </div>
                </div>

                <div className="border-t bg-white p-5">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <textarea
                      value={manualReply}
                      onChange={(event) => setManualReply(event.target.value)}
                      rows={2}
                      placeholder="Type a manual human reply..."
                      className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={sendManualReply}
                      disabled={isSendingManualReply || !manualReply.trim()}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={16} />
                      {isSendingManualReply ? "Sending..." : "Send"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    This sends a real Messenger message from your Facebook Page.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isCustomer = message.sender_type === "customer";
  const isAI = message.sender_type === "ai";

  return (
    <div className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isCustomer
          ? "rounded-bl-sm bg-white text-gray-800"
          : "rounded-br-sm bg-emerald-500 text-white"
          }`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs opacity-80">
          {isCustomer ? <User size={14} /> : <Bot size={14} />}
          <span>
            {isCustomer ? "Customer" : isAI ? "AI Assistant" : "Human"}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.message_text}
        </p>

        <p className="mt-2 text-[11px] opacity-70">
          {new Date(message.created_at).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ConversationStatus }) {
  const styles: Record<ConversationStatus, string> = {
    open: "bg-emerald-100 text-emerald-700",
    needs_human: "bg-orange-100 text-orange-700",
    closed: "bg-gray-200 text-gray-700",
  };

  const labels: Record<ConversationStatus, string> = {
    open: "Open",
    needs_human: "Needs Human",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}