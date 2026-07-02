import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

const BUSINESS_COLUMNS = `
  id,
  owner_id,
  name,
  description,
  address,
  contact_number,
  email,
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

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

/**
 * GET /api/business
 *
 * Loads the logged-in user's business profile.
 */
export async function GET() {
  try {
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * Re-query with selected safe columns only.
     *
     * We do not return page_access_token to the frontend.
     */
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select(BUSINESS_COLUMNS)
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
          error: "Business not found.",
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
        error: "Failed to load business.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/business
 *
 * Updates the logged-in user's business profile.
 */
export async function PUT(req: Request) {
  try {
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    const name = cleanText(body.name, 120);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Business name is required.",
        },
        { status: 400 }
      );
    }

    const payload = {
      name,
      description: cleanText(body.description, 1000),
      address: cleanText(body.address, 500),
      contact_number: cleanText(body.contact_number, 100),
      email: cleanText(body.email, 150),
      opening_hours: cleanText(body.opening_hours, 150),
      closing_hours: cleanText(body.closing_hours, 150),
      delivery_info: cleanText(body.delivery_info, 1000),
      payment_methods: cleanText(body.payment_methods, 500),
      updated_at: new Date().toISOString(),
    };

    /**
     * Update only the business owned by the logged-in user.
     *
     * businesses table uses:
     * .eq("id", business.id)
     * .eq("owner_id", business.owner_id)
     */
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .update(payload)
      .eq("id", business.id)
      .eq("owner_id", business.owner_id)
      .select(BUSINESS_COLUMNS)
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
      message: "Business updated successfully.",
      business: data,
    });
  } catch (error) {
    console.error("PUT /api/business error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update business.",
      },
      { status: 500 }
    );
  }
}