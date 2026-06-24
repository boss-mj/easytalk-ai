import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateProduct } from "@/lib/validators/product";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

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

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(validation.data)
      .eq("id", productId)
      .eq("business_id", BUSINESS_ID)
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

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId)
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