"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  RefreshCw,
  MessageSquareText,
  Bot,
  Headphones,
  PackageCheck,
  BadgeHelp,
} from "lucide-react";

type DashboardOverview = {
  stats: {
    totalConversations: number;
    aiResponseRate: number;
    humanHandoffs: number;
    activeProducts: number;
    activeFaqs: number;
  };
  messenger: {
    pageName: string;
    isConnected: boolean;
  };
  recentConversations: {
    id: number;
    customer_psid: string;
    customer_name: string | null;
    customer_profile_pic: string | null;
    status: "open" | "needs_human" | "closed";
    last_message: string | null;
    last_message_at: string | null;
  }[];
  chartData: {
    day: string;
    value: number;
  }[];
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/dashboard/overview", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load dashboard overview.");
      }

      setOverview(result.overview);
    } catch (error) {
      console.error("Load dashboard overview error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard overview."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-black">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-black">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage || "Dashboard data is not available."}
        </div>
      </div>
    );
  }

  const maxChartValue = Math.max(
    ...overview.chartData.map((item) => item.value),
    1
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Monitor Messenger automation, AI replies, and customer activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOverview}
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Conversations"
            value={overview.stats.totalConversations.toString()}
            description="Messenger threads"
            icon={<MessageSquareText size={30} strokeWidth={2.2} />}
            color="gray"
          />

          <StatCard
            title="AI Response Rate"
            value={`${overview.stats.aiResponseRate}%`}
            description="AI replies vs customer messages"
            icon={<Bot size={30} strokeWidth={2.2} />}
            color="gray"
          />

          <StatCard
            title="Human Handoffs"
            value={overview.stats.humanHandoffs.toString()}
            description="Needs human support"
            icon={<Headphones size={30} strokeWidth={2.2} />}
            color="gray"
          />

          <StatCard
            title="Active Products"
            value={overview.stats.activeProducts.toString()}
            description="Available products/services"
            icon={<PackageCheck size={30} strokeWidth={2.2} />}
            color="gray"
          />

          <StatCard
            title="Active FAQs"
            value={overview.stats.activeFaqs.toString()}
            description="AI knowledge entries"
            icon={<BadgeHelp size={30} strokeWidth={2.2} />}
            color="gray"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Messages Last 7 Days
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Customer and AI messages saved by your webhook.
              </p>
            </div>

            <div className="flex h-72 items-end gap-3 border-b border-l px-4 pb-4">
              {overview.chartData.map((item) => {
                const height = Math.max(
                  8,
                  Math.round((item.value / maxChartValue) * 220)
                );

                return (
                  <div
                    key={item.day}
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="text-xs font-medium text-gray-500">
                      {item.value}
                    </div>

                    <div
                      className="w-full rounded-t-lg bg-emerald-500"
                      style={{ height }}
                    />

                    <div className="text-xs text-gray-400">{item.day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Messenger Status
            </h2>

            <div className="mt-5 rounded-xl border p-5">
              {/* DAGDAG LANG ITO */}
              <div className="flex items-center gap-4">

                <Image
                  src="/images/facebook.png"
                  alt="Facebook"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain flex-shrink-0"
                />

                {/* LAHAT NG EXISTING CODE MO */}
                <div>
                  <p className="text-sm text-gray-500">Connected Page</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {overview.messenger.pageName}
                  </p>

                  <div
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${overview.messenger.isConnected
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {overview.messenger.isConnected
                      ? "Connected"
                      : "Not Connected"}
                  </div>
                </div>

              </div>
              {/* HANGGANG DITO LANG ANG DAGDAG */}

            </div>

            <p className="mt-4 text-sm text-gray-500">
              The webhook receives Messenger messages, sends AI replies, and
              stores the conversation in Supabase.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Conversations
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest Messenger conversations handled by the AI.
            </p>
          </div>

          {overview.recentConversations.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
              No conversations yet. Send a message to your Facebook Page.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Last Message</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {overview.recentConversations.map((conversation) => (
                    <tr
                      key={conversation.id}
                      className="border-b transition last:border-none hover:bg-gray-50"
                    >
                      <td className="py-5 font-medium text-gray-900">
                        {conversation.customer_name ||
                          `Customer ${conversation.customer_psid}`}
                      </td>

                      <td className="max-w-[420px] py-5 text-sm text-gray-600">
                        <p className="line-clamp-2">
                          {conversation.last_message || "No message"}
                        </p>
                      </td>

                      <td className="py-5">
                        <StatusBadge status={conversation.status} />
                      </td>

                      <td className="py-5 text-sm text-gray-500">
                        {conversation.last_message_at
                          ? new Date(
                            conversation.last_message_at
                          ).toLocaleString("en-PH", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                          : "No time"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: "green" | "cyan" | "amber" | "blue" | "violet" | "gray" | "gray-700";
}) {
  const iconStyles = {
    green: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    cyan: "bg-cyan-100 text-cyan-700 ring-cyan-200",
    amber: "bg-amber-100 text-amber-700 ring-amber-200",
    blue: "bg-blue-100 text-blue-700 ring-blue-200",
    violet: "bg-violet-100 text-violet-700 ring-violet-200",
    gray: "bg-gray-100 text-gray-700 ring-gray-200",
    "gray-700": "bg-gray-700 text-gray-300 ring-gray-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${iconStyles[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "open" | "needs_human" | "closed";
}) {
  const styles = {
    open: "bg-emerald-100 text-emerald-700",
    needs_human: "bg-orange-100 text-orange-700",
    closed: "bg-gray-200 text-gray-700",
  };

  const labels = {
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