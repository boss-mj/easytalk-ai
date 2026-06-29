import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

const CONNECT_COLUMNS = `
  id,
  owner_id,
  name,
  facebook_page_id,
  facebook_page_name,
  is_connected,
  updated_at
`;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

/**
 * GET /api/business/connect
 *
 * Loads the current business Facebook connection status.
 * We do NOT return page_access_token for security.
 */
export async function GET() {
  try {
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select(CONNECT_COLUMNS)
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
      connection: data,
    });
  } catch (error) {
    console.error("GET /api/business/connect error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load Facebook connection.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/business/connect
 *
 * Saves Facebook Page connection data for the logged-in user's business.
 */
export async function PUT(req: Request) {
  try {
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    const facebookPageId = cleanText(body.facebook_page_id, 100);
    const facebookPageName = cleanText(body.facebook_page_name, 150);
    const pageAccessToken = cleanText(body.page_access_token, 3000);

    if (!facebookPageId) {
      return NextResponse.json(
        {
          success: false,
          error: "Facebook Page ID is required.",
        },
        { status: 400 }
      );
    }

    if (!facebookPageName) {
      return NextResponse.json(
        {
          success: false,
          error: "Facebook Page name is required.",
        },
        { status: 400 }
      );
    }

    if (!pageAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Page Access Token is required.",
        },
        { status: 400 }
      );
    }

    /**
     * Save connection data only to the logged-in user's business.
     *
     * page_access_token is stored in database,
     * but it is never returned to the frontend.
     */
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .update({
        facebook_page_id: facebookPageId,
        facebook_page_name: facebookPageName,
        page_access_token: pageAccessToken,
        is_connected: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", business.id)
      .eq("owner_id", business.owner_id)
      .select(CONNECT_COLUMNS)
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
      message: "Facebook Page connected successfully.",
      connection: data,
    });
  } catch (error) {
    console.error("PUT /api/business/connect error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save Facebook connection.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/business/connect
 *
 * Disconnects Facebook Page from the current business.
 */
export async function DELETE() {
  try {
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const { data, error } = await supabaseAdmin
      .from("businesses")
      .update({
        facebook_page_id: null,
        facebook_page_name: null,
        page_access_token: null,
        is_connected: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", business.id)
      .eq("owner_id", business.owner_id)
      .select(CONNECT_COLUMNS)
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
      message: "Facebook Page disconnected.",
      connection: data,
    });
  } catch (error) {
    console.error("DELETE /api/business/connect error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to disconnect Facebook Page.",
      },
      { status: 500 }
    );
  }
}