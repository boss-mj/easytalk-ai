import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

const CONVERSATION_COLUMNS = `
  id,
  business_id,
  customer_psid,
  customer_name,
  customer_profile_pic,
  status,
  last_message,
  last_message_at,
  created_at,
  updated_at
`;

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("conversations")
            .select(CONVERSATION_COLUMNS)
            .eq("business_id", BUSINESS_ID)
            .order("last_message_at", { ascending: false, nullsFirst: false });

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            conversations: data || [],
        });
    } catch (error) {
        console.error("GET /api/conversations error:", error);

        return NextResponse.json(
            { success: false, error: "Failed to load conversations." },
            { status: 500 }
        );
    }
}