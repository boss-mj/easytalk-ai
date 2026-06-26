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

function parseFAQId(id: string) {
  const faqId = Number(id);

  if (!Number.isInteger(faqId) || faqId <= 0) {
    return null;
  }

  return faqId;
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const faqId = parseFAQId(id);

    if (!faqId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid FAQ ID.",
        },
        { status: 400 }
      );
    }

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
      .update(validation.data)
      .eq("id", faqId)
      .eq("business_id", BUSINESS_ID)
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
      message: "FAQ updated successfully.",
      faq: data,
    });
  } catch (error) {
    console.error("PUT /api/faqs/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update FAQ.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const faqId = parseFAQId(id);

    if (!faqId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid FAQ ID.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("faqs")
      .delete()
      .eq("id", faqId)
      .eq("business_id", BUSINESS_ID);

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
      message: "FAQ deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/faqs/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete FAQ.",
      },
      { status: 500 }
    );
  }
}