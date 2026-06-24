import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateFAQ } from "@/lib/validators/faq";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

const FAQ_COLUMNS = `
  id,
  business_id,
  question,
  answer,
  category,
  is_active,
  created_at,
  updated_at
`;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("faqs")
      .select(FAQ_COLUMNS)
      .eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      faqs: data || [],
    });
  } catch (error) {
    console.error("GET /api/faqs error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load FAQs.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = validateFAQ(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("faqs")
      .insert({
        business_id: BUSINESS_ID,
        ...validation.data,
      })
      .select(FAQ_COLUMNS)
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ created successfully.",
      faq: data,
    });
  } catch (error) {
    console.error("POST /api/faqs error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create FAQ.",
      },
      { status: 500 }
    );
  }
}