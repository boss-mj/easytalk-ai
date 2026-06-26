import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateProduct } from "@/lib/validators/product";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

/**
 * Safe product columns.
 * These are okay to expose to the dashboard UI.
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
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(PRODUCT_COLUMNS)
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
      .insert({
        business_id: BUSINESS_ID,
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