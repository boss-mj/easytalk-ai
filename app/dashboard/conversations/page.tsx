"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Archive,
  Bell,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Inbox,
  Loader2,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Sparkles,
  User,
  UserRoundCheck,
  UserPlus,
  X,
} from "lucide-react";

type ConversationStatus = "open" | "needs_human" | "closed";
type StatusFilter = "all" | ConversationStatus;

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

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Needs Human", value: "needs_human" },
  { label: "Closed", value: "closed" },
];

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [manualReply, setManualReply] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isSendingManualReply, setIsSendingManualReply] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [visibleConversationCount, setVisibleConversationCount] = useState(8);
  const [openMenu, setOpenMenu] = useState<
    "more" | "notifications" | "profile" | "assign" | null
  >(null);

  const [toastMessage, setToastMessage] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const [notesByConversation, setNotesByConversation] = useState<
    Record<number, string>
  >({});

  const [assigneesByConversation, setAssigneesByConversation] = useState<
    Record<number, string>
  >({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const stats = useMemo(() => {
    const total = conversations.length;
    const open = conversations.filter(
      (conversation) => conversation.status === "open"
    ).length;
    const needsHuman = conversations.filter(
      (conversation) => conversation.status === "needs_human"
    ).length;
    const closed = conversations.filter(
      (conversation) => conversation.status === "closed"
    ).length;

    return { total, open, needsHuman, closed };
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const label = getCustomerLabel(conversation).toLowerCase();
      const lastMessage = conversation.last_message?.toLowerCase() || "";
      const psid = conversation.customer_psid.toLowerCase();

      const matchesSearch =
        !keyword ||
        label.includes(keyword) ||
        lastMessage.includes(keyword) ||
        psid.includes(keyword);

      const matchesStatus =
        statusFilter === "all" || conversation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, statusFilter]);

  const visibleConversations = useMemo(() => {
    return filteredConversations.slice(0, visibleConversationCount);
  }, [filteredConversations, visibleConversationCount]);

  const hasMoreConversations =
    visibleConversationCount < filteredConversations.length;

  function showToast(message: string) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied.`);
    } catch {
      showToast(`Failed to copy ${label}.`);
    }
  }

  function handleLoadMoreConversations() {
    setVisibleConversationCount((current) => current + 8);
  }

  function openAddNoteModal() {
    if (!selectedConversation) return;

    setNoteText(notesByConversation[selectedConversation.id] || "");
    setIsNoteModalOpen(true);
  }

  function saveConversationNote() {
    if (!selectedConversation) return;

    setNotesByConversation((current) => ({
      ...current,
      [selectedConversation.id]: noteText.trim(),
    }));

    setIsNoteModalOpen(false);
    showToast("Note saved.");
  }

  function assignConversation(assignee: string) {
    if (!selectedConversation) return;

    setAssigneesByConversation((current) => ({
      ...current,
      [selectedConversation.id]: assignee,
    }));

    setOpenMenu(null);
    showToast(`Conversation assigned to ${assignee}.`);
  }

  function handleViewProfile() {
    if (!selectedConversation) return;

    if (selectedConversation.customer_profile_pic) {
      window.open(
        selectedConversation.customer_profile_pic,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    copyText(selectedConversation.customer_psid, "Customer ID");
  }

  function handleAttachFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    showToast(`${file.name} selected. Attachment API can be added later.`);
    event.target.value = "";
  }

  function insertEmoji() {
    const emoji = "😊";
    const textarea = replyTextareaRef.current;

    if (!textarea) {
      setManualReply((current) => `${current}${emoji}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setManualReply((current) => {
      return current.slice(0, start) + emoji + current.slice(end);
    });

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + emoji.length;
      textarea.selectionEnd = start + emoji.length;
    }, 0);
  }

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
        },
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
            : conversation,
        ),
      );

      setManualReply("");
    } catch (error) {
      console.error("Send manual reply error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send manual reply.",
      );
    } finally {
      setIsSendingManualReply(false);
    }
  }

  function getCustomerLabel(conversation: Conversation) {
    const name = conversation.customer_name
      ?.replace(/^Customer\s+/i, "")
      .trim();

    return name || conversation.customer_psid || "Unknown";
  }

  function getInitials(conversation: Conversation | null) {
    if (!conversation) return "?";

    const label = getCustomerLabel(conversation);

    if (/^\d+$/.test(label)) {
      return "U";
    }

    return label
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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

      if (loadedConversations.length === 0) {
        setSelectedConversation(null);
        setMessages([]);
        return;
      }

      const updatedSelected = selectedConversation
        ? loadedConversations.find(
          (conversation) => conversation.id === selectedConversation.id
        )
        : null;

      const conversationToSelect = updatedSelected || loadedConversations[0];

      setSelectedConversation(conversationToSelect);
      await loadMessages(conversationToSelect.id);
    } catch (error) {
      console.error("Load conversations error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load conversations.",
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
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load messages.");
      }

      setMessages(result.messages || []);
    } catch (error) {
      console.error("Load messages error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load messages.",
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
        },
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
            : conversation,
        ),
      );
    } catch (error) {
      console.error("Update status error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update status.",
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

  function formatTime(value: string | null) {
    if (!value) return "No time";

    return new Date(value).toLocaleString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="h-screen overflow-hidden bg-[#F6F9F8] p-4 text-[#102A2D]">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4 overflow-hidden">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF7EF] text-[#0F766E] shadow-sm">
              <MessageCircle size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#102A2D]">
                Conversations
              </h1>
              <p className="mt-1 text-sm text-[#647A7B]">
                View real Messenger conversations, customer messages, and AI
                replies saved from your webhook.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-[420px]">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#647A7B]"
                size={18}
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search conversations..."
                className="h-12 w-full rounded-xl border border-[#DDE7E4] bg-white pl-11 pr-16 text-sm text-[#102A2D] shadow-sm outline-none transition placeholder:text-[#8AA0A1] focus:border-[#0F766E] focus:ring-4 focus:ring-[#EAF7EF]"
              />
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-[#DDE7E4] bg-[#F6F9F8] px-2 py-1 text-xs text-[#647A7B] sm:block">
                ⌘ K
              </span>
            </div>

            <button
              type="button"
              onClick={loadConversations}
              disabled={isLoadingConversations}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#0F766E]/30 bg-white px-5 text-sm font-semibold text-[#0F766E] shadow-sm transition hover:bg-[#EAF7EF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingConversations ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <RefreshCw size={17} />
              )}
              Refresh
            </button>

            <button
              type="button"
              className="relative hidden h-12 w-12 items-center justify-center rounded-xl border border-[#DDE7E4] bg-white text-[#647A7B] shadow-sm transition hover:bg-[#F6F9F8] md:flex"
            >
              <Bell size={19} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <div className="hidden items-center gap-3 rounded-xl border border-[#DDE7E4] bg-white px-3 py-2 shadow-sm xl:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-sm font-bold text-white">
                M
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-[#102A2D]">
                  Mark John
                </p>
                <p className="text-xs text-[#647A7B]">Admin</p>
              </div>
              <ChevronDown size={16} className="text-[#647A7B]" />
            </div>
          </div>
        </header>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <section className="grid shrink-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Conversations"
            value={stats.total.toString()}
            description="All Messenger threads"
            icon={<MessageCircle size={22} />}
            tone="green"
          />

          <StatCard
            title="Open Conversations"
            value={stats.open.toString()}
            description="Currently active"
            icon={<Inbox size={22} />}
            tone="blue"
          />

          <StatCard
            title="Needs Human"
            value={stats.needsHuman.toString()}
            description="Requires manual reply"
            icon={<AlertCircle size={22} />}
            tone="orange"
          />

          <StatCard
            title="Closed Conversations"
            value={stats.closed.toString()}
            description="Resolved threads"
            icon={<Archive size={22} />}
            tone="gray"
          />
        </section>

        <main className="grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[390px_minmax(0,1fr)_300px]">
          <section className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-sm">
            <div className="border-b border-[#DDE7E4] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[#102A2D]">
                    Conversation List
                  </h2>
                  <p className="mt-1 text-sm text-[#647A7B]">
                    {filteredConversations.length} shown from{" "}
                    {conversations.length}
                  </p>
                </div>

                <div className="rounded-full bg-[#EAF7EF] px-3 py-1 text-xs font-semibold text-[#0F766E]">
                  Live
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${statusFilter === filter.value
                      ? "bg-[#0F766E] text-white shadow-sm"
                      : "border border-[#DDE7E4] bg-[#F8FBFA] text-[#647A7B] hover:bg-[#EAF7EF] hover:text-[#0F766E]"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl bg-[#F3F8F6]"
                    />
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare
                    className="mx-auto text-[#A7BCBD]"
                    size={42}
                  />
                  <p className="mt-3 font-semibold text-[#102A2D]">
                    No conversations found
                  </p>
                  <p className="mt-1 text-sm text-[#647A7B]">
                    Try changing your search or filter.
                  </p>
                </div>
              ) : (
                visibleConversations.map((conversation) => {
                  const isSelected =
                    selectedConversation?.id === conversation.id;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => selectConversation(conversation)}
                      className={`w-full border-b border-[#DDE7E4] p-4 text-left transition last:border-none ${isSelected
                        ? "bg-[#EAF7EF]"
                        : "bg-white hover:bg-[#F6F9F8]"
                        }`}
                    >
                      <div className="flex gap-3">
                        <Avatar
                          label={getInitials(conversation)}
                          imageUrl={conversation.customer_profile_pic}
                          active={isSelected}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#102A2D]">
                                {getCustomerLabel(conversation)}
                              </p>
                              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#647A7B]">
                                {conversation.last_message || "No message yet"}
                              </p>
                            </div>

                            <StatusBadge status={conversation.status} />
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-xs text-[#8AA0A1]">
                              {formatTime(conversation.last_message_at)}
                            </span>

                            {conversation.status === "needs_human" && (
                              <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-bold text-orange-700">
                                Action
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="border-t border-[#DDE7E4] p-4">
              <button
                type="button"
                onClick={handleLoadMoreConversations}
                disabled={!hasMoreConversations}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDE7E4] bg-white px-4 py-3 text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasMoreConversations ? "Load more conversations" : "All conversations loaded"}
                <ChevronDown size={16} />
              </button>
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-sm">
            {!selectedConversation ? (
              <div className="flex min-h-[720px] items-center justify-center p-8 text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF7EF] text-[#0F766E]">
                    <MessageSquare size={34} />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-[#102A2D]">
                    Select a conversation
                  </h2>
                  <p className="mt-2 text-sm text-[#647A7B]">
                    Customer messages and AI replies will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <div className="border-b border-[#DDE7E4] p-4">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-3">
                      <Avatar
                        label={getInitials(selectedConversation)}
                        imageUrl={selectedConversation.customer_profile_pic}
                        active
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-[#102A2D]">
                            {getCustomerLabel(selectedConversation)}
                          </h2>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            <MessageCircle size={12} />
                            Messenger
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#647A7B]">
                          Last updated:{" "}
                          {formatDate(selectedConversation.last_message_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusActionButton
                        active={selectedConversation.status === "open"}
                        disabled={isUpdatingStatus}
                        onClick={() => updateConversationStatus("open")}
                        label="Open"
                        variant="open"
                      />

                      <StatusActionButton
                        active={
                          selectedConversation.status === "needs_human"
                        }
                        disabled={isUpdatingStatus}
                        onClick={() =>
                          updateConversationStatus("needs_human")
                        }
                        label="Needs Human"
                        variant="needs_human"
                      />

                      <StatusActionButton
                        active={selectedConversation.status === "closed"}
                        disabled={isUpdatingStatus}
                        onClick={() => updateConversationStatus("closed")}
                        label="Closed"
                        variant="closed"
                      />

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === "more" ? null : "more")}
                          className="flex items-center gap-2 rounded-xl border border-[#DDE7E4] bg-white px-3 py-2 text-xs font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8]"
                        >
                          More
                          <MoreHorizontal size={16} />
                        </button>

                        {openMenu === "more" && selectedConversation && (
                          <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-[#DDE7E4] bg-white p-2 shadow-xl">
                            <button
                              type="button"
                              onClick={() => {
                                loadMessages(selectedConversation.id);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                            >
                              <RefreshCw size={16} />
                              Refresh Messages
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                copyText(selectedConversation.customer_psid, "Customer ID");
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                            >
                              <Copy size={16} />
                              Copy Customer ID
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                updateConversationStatus("needs_human");
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                            >
                              <AlertCircle size={16} />
                              Mark Needs Human
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                updateConversationStatus("closed");
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <X size={16} />
                              Close Conversation
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#FBFDFC] p-4 scroll-smooth">
                  <div className="mx-auto max-w-4xl space-y-5">
                    <div className="flex justify-center">
                      <span className="rounded-full bg-[#EEF3F2] px-3 py-1 text-xs font-medium text-[#647A7B]">
                        Jul 1, 2026
                      </span>
                    </div>

                    {isLoadingMessages ? (
                      <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#DDE7E4] bg-white p-8 text-sm text-[#647A7B]">
                        <Loader2 className="animate-spin" size={18} />
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#DDE7E4] bg-white p-8 text-center text-sm text-[#647A7B]">
                        No messages found for this conversation.
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <MessageBubble key={message.id} message={message} />
                        ))}

                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#DDE7E4] bg-white p-4">
                  <div className="rounded-2xl border border-[#DDE7E4] bg-white p-3 shadow-sm focus-within:border-[#0F766E] focus-within:ring-4 focus-within:ring-[#EAF7EF]">
                    <textarea
                      ref={replyTextareaRef}
                      value={manualReply}
                      onChange={(event) => setManualReply(event.target.value)}
                      rows={1}
                      placeholder="Type a manual human reply..."
                      className="min-h-[56px] w-full resize-none border-0 bg-transparent px-1 text-sm text-[#102A2D] outline-none placeholder:text-[#8AA0A1]"
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleAttachFile}
                    />

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                        >
                          <Paperclip size={18} />
                        </button>
                        <button
                          onClick={insertEmoji}
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                        >
                          <Smile size={18} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={sendManualReply}
                        disabled={
                          isSendingManualReply || !manualReply.trim()
                        }
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSendingManualReply ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Send size={16} />
                        )}
                        {isSendingManualReply ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#8AA0A1]">
                    This sends a real Messenger message from your Facebook Page.
                  </p>
                </div>
              </div>
            )}
          </section>

          <aside className="overflow-hidden rounded-2xl border border-[#DDE7E4] bg-white shadow-sm">
            {!selectedConversation ? (
              <div className="flex min-h-[720px] items-center justify-center p-8 text-center">
                <div>
                  <User className="mx-auto text-[#A7BCBD]" size={36} />
                  <p className="mt-3 text-sm font-medium text-[#647A7B]">
                    Customer details will show here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between border-b border-[#DDE7E4] p-4">
                  <h2 className="font-bold text-[#102A2D]">
                    Customer Details
                  </h2>
                  <ChevronDown size={18} className="text-[#647A7B]" />
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#BDF4D5] text-2xl font-bold text-[#0F766E]">
                      {getInitials(selectedConversation)}
                    </div>

                    <h3 className="mt-3 font-bold text-[#102A2D]">
                      {getCustomerLabel(selectedConversation)}
                    </h3>

                    <p className="mt-1 text-sm text-[#647A7B]">
                      Facebook User
                    </p>

                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#DDE7E4] bg-white px-4 py-2 text-sm font-semibold text-[#102A2D] transition hover:bg-[#F6F9F8]"
                    >
                      View Profile
                      <ExternalLink size={15} />
                    </button>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-[#DDE7E4] bg-[#FBFDFC] p-4">
                    <DetailsRow
                      icon={<Clock3 size={16} />}
                      label="First seen"
                      value={formatDate(selectedConversation.created_at)}
                    />

                    <DetailsRow
                      icon={<Clock3 size={16} />}
                      label="Last activity"
                      value={formatDate(selectedConversation.last_message_at)}
                    />

                    <DetailsRow
                      icon={<MessageSquare size={16} />}
                      label="Messages"
                      value={messages.length.toString()}
                    />

                    <DetailsRow
                      icon={<ShieldCheck size={16} />}
                      label="User ID"
                      value={selectedConversation.customer_psid}
                    />
                  </div>

                  <div>
                    <h3 className="mb-3 font-bold text-[#102A2D]">
                      Conversation Info
                    </h3>

                    <div className="space-y-3">
                      <InfoPill
                        label="Status"
                        value={
                          <StatusBadge status={selectedConversation.status} />
                        }
                      />

                      <InfoPill
                        label="Priority"
                        value={
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Normal
                          </span>
                        }
                      />

                      <InfoPill
                        label="Assigned to"
                        value={
                          <span className="text-sm font-semibold text-[#102A2D]">
                            {assigneesByConversation[selectedConversation.id] || "AI Assistant"}
                          </span>
                        }
                      />

                      <InfoPill
                        label="Labels"
                        value={
                          <button
                            type="button"
                            className="rounded-lg border border-[#DDE7E4] px-3 py-1 text-xs font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8]"
                          >
                            + Add label
                          </button>
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-bold text-[#102A2D]">
                      Quick Actions
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={openAddNoteModal}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#DDE7E4] bg-white px-3 py-3 text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                      >
                        <Sparkles size={16} />
                        Add Note
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === "assign" ? null : "assign")}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDE7E4] bg-white px-3 py-3 text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                        >
                          <UserPlus size={16} />
                          Assign
                        </button>

                        {openMenu === "assign" && (
                          <div className="absolute right-0 z-30 mt-2 w-48 rounded-2xl border border-[#DDE7E4] bg-white p-2 shadow-xl">
                            <button
                              type="button"
                              onClick={() => assignConversation("AI Assistant")}
                              className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                            >
                              AI Assistant
                            </button>

                            <button
                              type="button"
                              onClick={() => assignConversation("Mark John")}
                              className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                            >
                              Mark John
                            </button>

                            <button
                              type="button"
                              onClick={() => assignConversation("Unassigned")}
                              className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8] hover:text-[#0F766E]"
                            >
                              Unassigned
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => updateConversationStatus("closed")}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 size={16} />
                      Close Conversation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </main>

        {isNoteModalOpen && selectedConversation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#102A2D]">
                    Add Conversation Note
                  </h2>
                  <p className="mt-1 text-sm text-[#647A7B]">
                    Note for {getCustomerLabel(selectedConversation)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#647A7B] transition hover:bg-[#F6F9F8]"
                >
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                rows={6}
                placeholder="Example: Customer asked about delivery and payment..."
                className="mt-4 w-full resize-none rounded-xl border border-[#DDE7E4] bg-white px-4 py-3 text-sm text-[#102A2D] outline-none transition focus:border-[#0F766E] focus:ring-4 focus:ring-[#EAF7EF]"
              />

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="rounded-xl border border-[#DDE7E4] bg-white px-4 py-2 text-sm font-semibold text-[#647A7B] transition hover:bg-[#F6F9F8]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveConversationNote}
                  className="rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#115E59]"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  tone,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone: "green" | "blue" | "orange" | "gray";
}) {
  const styles = {
    green: "bg-[#EAF7EF] text-[#0F766E]",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-2xl border border-[#DDE7E4] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles[tone]}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-[#647A7B]">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[#102A2D]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#8AA0A1]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Avatar({
  label,
  imageUrl,
  active,
}: {
  label: string;
  imageUrl: string | null;
  active?: boolean;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={label}
        className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 ${active ? "ring-[#0F766E]/30" : "ring-transparent"
          }`}
      />
    );
  }

  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${active
        ? "bg-[#BDF4D5] text-[#0F766E]"
        : "bg-[#EEF3F2] text-[#647A7B]"
        }`}
    >
      {label}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isCustomer = message.sender_type === "customer";
  const isAI = message.sender_type === "ai";
  const isSystem = message.sender_type === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-[#EEF3F2] px-3 py-1 text-xs text-[#647A7B]">
          {message.message_text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isCustomer ? "justify-start" : "justify-end"}`}>
      {isCustomer && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF3F2] text-[#647A7B]">
          <User size={17} />
        </div>
      )}

      {!isCustomer && (
        <div className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-white sm:flex">
          {isAI ? <Bot size={17} /> : <UserRoundCheck size={17} />}
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${isCustomer
          ? "rounded-bl-sm border border-[#DDE7E4] bg-[#F8FBFA] text-[#102A2D]"
          : "rounded-br-sm bg-gradient-to-br from-[#0F766E] to-[#115E59] text-white"
          }`}
      >
        <div className="mb-2 flex items-center gap-2 text-xs opacity-80">
          {isCustomer ? <User size={14} /> : <Bot size={14} />}
          <span>{isCustomer ? "Customer" : isAI ? "AI Assistant" : "Human"}</span>
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isCustomer
            ? "rounded-bl-sm border border-[#DDE7E4] bg-[#F8FBFA] text-[#102A2D]"
            : "rounded-br-sm bg-gradient-to-br from-[#0F766E] to-[#115E59] text-white"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.message_text}
        </p>

        <p className="mt-1.5 text-[11px] opacity-70">
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
    open: "bg-[#DDF8EA] text-[#0F766E]",
    needs_human: "bg-orange-100 text-orange-700",
    closed: "bg-slate-100 text-slate-600",
  };

  const labels: Record<ConversationStatus, string> = {
    open: "Open",
    needs_human: "Needs Human",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function StatusActionButton({
  label,
  variant,
  active,
  disabled,
  onClick,
}: {
  label: string;
  variant: ConversationStatus;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const styles: Record<ConversationStatus, string> = {
    open: active
      ? "border-[#0F766E] bg-[#EAF7EF] text-[#0F766E]"
      : "border-[#0F766E]/30 bg-white text-[#0F766E] hover:bg-[#EAF7EF]",
    needs_human: active
      ? "border-orange-500 bg-orange-50 text-orange-700"
      : "border-orange-300 bg-white text-orange-600 hover:bg-orange-50",
    closed: active
      ? "border-slate-400 bg-slate-100 text-slate-700"
      : "border-[#DDE7E4] bg-white text-[#647A7B] hover:bg-[#F6F9F8]",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {label}
    </button>
  );
}

function DetailsRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#647A7B]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#8AA0A1]">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-[#102A2D]">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoPill({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FBFA] px-3 py-3">
      <span className="text-sm text-[#647A7B]">{label}</span>
      {value}
    </div>
  );
}