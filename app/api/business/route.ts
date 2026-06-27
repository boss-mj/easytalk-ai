import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateBusinessProfile } from "@/lib/validators/business";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Safe columns only.
 *
 * Important:
 * Do NOT expose page_access_token to the frontend.
 * That token should only be used on the server/webhook side.
 */
const BUSINESS_SAFE_COLUMNS = `
  id,
  owner_id,
  name,
  description,
  contact_number,
  email,
  address,
  opening_hours,
  closing_hours,
  delivery_info,
  payment_methods,
  facebook_page_id,
  facebook_page_name,
  is_connected,
  created_at,
  updated_at
`;

export async function GET() {
  try {
    /**
     * requireBusiness() does two things:
     *
     * 1. Checks if the user is logged in.
     * 2. Finds the business owned by that logged-in user.
     *
     * This replaces:
     * const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * The businesses table uses "id", not "business_id".
     *
     * Why?
     * Because this is the actual business row.
     *
     * Child tables like products, faqs, messages, conversations use:
     * .eq("business_id", business.id)
     */
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select(BUSINESS_SAFE_COLUMNS)
      .eq("id", business.id)
      .eq("owner_id", business.owner_id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Business profile was not found for this account.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      business: data,
    });
  } catch (error) {
    console.error("GET /api/business error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load business profile.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    /**
     * Get the business owned by the currently logged-in user.
     *
     * This makes sure one user cannot update another user's business.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    /**
     * Validate and clean the business profile fields before saving.
     */
    const validation = validateBusinessProfile(body);

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
     * businesses table:
     * - use .eq("id", business.id)
     * - use .eq("owner_id", business.owner_id)
     *
     * Do NOT use .eq("business_id", business.id) here because
     * the businesses table does not have a business_id column.
     */
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .update(validation.data)
      .eq("id", business.id)
      .eq("owner_id", business.owner_id)
      .select(BUSINESS_SAFE_COLUMNS)
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
      message: "Business profile updated successfully.",
      business: data,
    });
  } catch (error) {
    console.error("PUT /api/business error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update business profile.",
      },
      { status: 500 }
    );
  }
}