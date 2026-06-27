import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function GET() {
  try {
    /**
     * Protect this API route.
     *
     * requireBusiness() checks:
     * 1. Is the user logged in?
     * 2. Does the logged-in user own a business?
     *
     * This replaces:
     * const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * Use the logged-in user's business id.
     *
     * Child tables use:
     * .eq("business_id", businessId)
     *
     * businesses table itself uses:
     * .eq("id", businessId)
     */
    const businessId = business.id;

    const today = startOfDay(new Date());

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    /**
     * Load all dashboard data in parallel.
     *
     * Every child table query is filtered by business_id
     * so users only see their own business data.
     */
    const [
      conversationsCountResult,
      aiRepliesCountResult,
      humanHandoffCountResult,
      customerMessagesCountResult,
      productsCountResult,
      faqsCountResult,
      recentConversationsResult,
      messagesChartResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId),

      supabaseAdmin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("sender_type", "ai"),

      supabaseAdmin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("status", "needs_human"),

      supabaseAdmin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("sender_type", "customer"),

      supabaseAdmin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("is_available", true),

      supabaseAdmin
        .from("faqs")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("is_active", true),

      supabaseAdmin
        .from("conversations")
        .select(
          `
          id,
          customer_psid,
          customer_name,
          customer_profile_pic,
          status,
          last_message,
          last_message_at
        `
        )
        .eq("business_id", businessId)
        .order("last_message_at", {
          ascending: false,
          nullsFirst: false,
        })
        .limit(5),

      supabaseAdmin
        .from("messages")
        .select("id,created_at,sender_type")
        .eq("business_id", businessId)
        .gte("created_at", sevenDaysAgo.toISOString()),
    ]);

    const errors = [
      conversationsCountResult.error,
      aiRepliesCountResult.error,
      humanHandoffCountResult.error,
      customerMessagesCountResult.error,
      productsCountResult.error,
      faqsCountResult.error,
      recentConversationsResult.error,
      messagesChartResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: errors[0]?.message || "Failed to load dashboard overview.",
        },
        { status: 500 }
      );
    }

    const totalConversations = conversationsCountResult.count || 0;
    const totalAiReplies = aiRepliesCountResult.count || 0;
    const totalCustomerMessages = customerMessagesCountResult.count || 0;

    /**
     * AI response rate:
     *
     * customer messages = all customer incoming messages
     * ai replies = all AI outgoing replies
     */
    const aiResponseRate =
      totalCustomerMessages > 0
        ? Math.round((totalAiReplies / totalCustomerMessages) * 100)
        : 0;

    /**
     * Prepare 7-day chart.
     *
     * First, create 7 empty days.
     * Then fill them with actual message counts.
     */
    const chartMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const day = new Date(sevenDaysAgo);
      day.setDate(sevenDaysAgo.getDate() + i);
      chartMap.set(formatDayLabel(day), 0);
    }

    for (const message of messagesChartResult.data || []) {
      const label = formatDayLabel(new Date(message.created_at));
      chartMap.set(label, (chartMap.get(label) || 0) + 1);
    }

    const chartData = Array.from(chartMap.entries()).map(([day, value]) => ({
      day,
      value,
    }));

    return NextResponse.json({
      success: true,
      overview: {
        stats: {
          totalConversations,
          aiResponseRate,
          humanHandoffs: humanHandoffCountResult.count || 0,
          activeProducts: productsCountResult.count || 0,
          activeFaqs: faqsCountResult.count || 0,
        },

        /**
         * No need to query businesses table again.
         * requireBusiness() already gave us the business row.
         */
        messenger: {
          pageName: business.facebook_page_name || "Facebook Page",
          isConnected: business.is_connected || false,
        },

        recentConversations: recentConversationsResult.data || [],
        chartData,
      },
    });
  } catch (error) {
    console.error("GET /api/dashboard/overview error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard overview.",
      },
      { status: 500 }
    );
  }
}