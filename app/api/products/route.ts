import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateProduct } from "@/lib/validators/product";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Safe product columns.
 *
 * products is a child table of businesses.
 * Each product belongs to one business through business_id.
 */
const PRODUCT_COLUMNS = `
  id,
  business_id,
  name,
  description,
  category,
  price,
  currency,
  is_available,
  created_at,
  updated_at
`;

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
     * products is a child table.
     *
     * So we use:
     * .eq("business_id", business.id)
     *
     * This makes sure the logged-in user only sees products
     * for their own business.
     */
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(PRODUCT_COLUMNS)
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
      products: data || [],
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load products.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    /**
     * Same protection for creating products.
     *
     * The product will be created under the logged-in user's business,
     * not DEFAULT_BUSINESS_ID.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();

    /**
     * Validate and clean product input before inserting.
     */
    const validation = validateProduct(body);

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
     * Insert the product under this user's business.
     *
     * OLD:
     * business_id: BUSINESS_ID
     *
     * NEW:
     * business_id: business.id
     */
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        business_id: business.id,
        ...validation.data,
      })
      .select(PRODUCT_COLUMNS)
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
      message: "Product created successfully.",
      product: data,
    });
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}