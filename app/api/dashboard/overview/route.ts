import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

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
    const today = startOfDay(new Date());

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const [
      conversationsCountResult,
      aiRepliesCountResult,
      humanHandoffCountResult,
      customerMessagesCountResult,
      productsCountResult,
      faqsCountResult,
      businessResult,
      recentConversationsResult,
      messagesChartResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("business_id", BUSINESS_ID),

      supabaseAdmin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("business_id", BUSINESS_ID)
        .eq("sender_type", "ai"),

      supabaseAdmin
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("business_id", BUSINESS_ID)
        .eq("status", "needs_human"),

      supabaseAdmin
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("business_id", BUSINESS_ID)
        .eq("sender_type", "customer"),

      supabaseAdmin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("business_id", BUSINESS_ID)
        .eq("is_available", true),

      supabaseAdmin
        .from("faqs")
        .select("id", { count: "exact", head: true })
        .eq("business_id", BUSINESS_ID)
        .eq("is_active", true),

      supabaseAdmin
        .from("businesses")
        .select("facebook_page_name,is_connected")
        .eq("id", BUSINESS_ID)
        .maybeSingle(),

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
        .eq("business_id", BUSINESS_ID)
        .order("last_message_at", { ascending: false, nullsFirst: false })
        .limit(5),

      supabaseAdmin
        .from("messages")
        .select("id,created_at,sender_type")
        .eq("business_id", BUSINESS_ID)
        .gte("created_at", sevenDaysAgo.toISOString()),
    ]);

    const errors = [
      conversationsCountResult.error,
      aiRepliesCountResult.error,
      humanHandoffCountResult.error,
      customerMessagesCountResult.error,
      productsCountResult.error,
      faqsCountResult.error,
      businessResult.error,
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

    const aiResponseRate =
      totalCustomerMessages > 0
        ? Math.round((totalAiReplies / totalCustomerMessages) * 100)
        : 0;

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
        messenger: {
          pageName: businessResult.data?.facebook_page_name || "Facebook Page",
          isConnected: businessResult.data?.is_connected || false,
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