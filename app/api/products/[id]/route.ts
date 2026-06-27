import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateProduct } from "@/lib/validators/product";
import { requireBusiness } from "@/lib/auth/require-business";

/**
 * Columns returned to the frontend.
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

/**
 * Converts the dynamic route id into a valid number.
 *
 * Example:
 * /api/products/5
 * id = "5"
 * productId = 5
 */
function parseProductId(id: string) {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  return productId;
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
     * Get product ID from the URL.
     *
     * Example:
     * /api/products/5
     */
    const { id } = await context.params;
    const productId = parseProductId(id);

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    /**
     * Validate and clean product input before updating.
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
     * Update only the product that belongs to this logged-in user's business.
     *
     * products is a child table, so we use:
     * .eq("business_id", business.id)
     *
     * This prevents one user from updating another business' product.
     */
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(validation.data)
      .eq("id", productId)
      .eq("business_id", business.id)
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
      message: "Product updated successfully.",
      product: data,
    });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product.",
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
     * Only the logged-in business owner can delete their own product.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    /**
     * Get product ID from the URL.
     */
    const { id } = await context.params;
    const productId = parseProductId(id);

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    /**
     * Delete only the product that belongs to this logged-in user's business.
     *
     * OLD:
     * .eq("business_id", BUSINESS_ID)
     *
     * NEW:
     * .eq("business_id", business.id)
     */
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId)
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
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}