import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateFAQ } from "@/lib/validators/faq";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Columns returned to the frontend.
 *
 * faqs is a child table of businesses.
 * Each FAQ belongs to one business through business_id.
 */
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

/**
 * Converts the dynamic route id into a valid number.
 *
 * Example:
 * /api/faqs/5
 * id = "5"
 * faqId = 5
 */
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
     * Get FAQ ID from the URL.
     *
     * Example:
     * /api/faqs/5
     */
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

    /**
     * Validate and clean FAQ input before updating.
     */
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

    /**
     * Update only the FAQ that belongs to this logged-in user's business.
     *
     * faqs is a child table, so we use:
     * .eq("business_id", business.id)
     *
     * This prevents one user from updating another business' FAQ.
     */
    const { data, error } = await supabaseAdmin
      .from("faqs")
      .update(validation.data)
      .eq("id", faqId)
      .eq("business_id", business.id)
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
    /**
     * Protect this API route.
     *
     * Only the logged-in business owner can delete their own FAQ.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * Get FAQ ID from the URL.
     */
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

    /**
     * Delete only the FAQ that belongs to this logged-in user's business.
     *
     * OLD:
     * .eq("business_id", BUSINESS_ID)
     *
     * NEW:
     * .eq("business_id", business.id)
     */
    const { error } = await supabaseAdmin
      .from("faqs")
      .delete()
      .eq("id", faqId)
      .eq("business_id", business.id);

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