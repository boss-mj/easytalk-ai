import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateFAQ } from "@/lib/validators/faq";
import { requireBusiness } from "@/lib/auth/require-business";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Columns returned to the frontend.
 *
 * faqs is a child table of businesses, so every FAQ row
 * belongs to one business through business_id.
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

export async function GET() {
  const { errorResponse } = await requireUser();

  if (errorResponse) {
    return errorResponse;
  }

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
     * faqs is a child table.
     *
     * So we use:
     * .eq("business_id", business.id)
     *
     * This makes sure the logged-in user only sees FAQs
     * for their own business.
     */
    const { data, error } = await supabaseAdmin
      .from("faqs")
      .select(FAQ_COLUMNS)
      .eq("business_id", business.id)
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
  const { errorResponse } = await requireUser();

  if (errorResponse) {
    return errorResponse;
  }

  try {
    /**
     * Same protection for creating FAQs.
     *
     * The FAQ will be created under the logged-in user's business,
     * not DEFAULT_BUSINESS_ID.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    /**
     * Validate the FAQ before inserting it.
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
     * Insert the FAQ under this user's business.
     *
     * OLD:
     * business_id: BUSINESS_ID
     *
     * NEW:
     * business_id: business.id
     */
    const { data, error } = await supabaseAdmin
      .from("faqs")
      .insert({
        business_id: business.id,
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