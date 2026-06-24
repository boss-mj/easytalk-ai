import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { validateBusinessProfile } from "@/lib/validators/business";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");

/**
 * Safe columns only.
 * Do not expose page_access_token to the frontend.
 */
const BUSINESS_SAFE_COLUMNS = `
  id,
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
        const { data, error } = await supabaseAdmin
            .from("businesses")
            .select(BUSINESS_SAFE_COLUMNS)
            .eq("id", BUSINESS_ID)
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
                    error: `Business with id ${BUSINESS_ID} was not found.`,
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
        const body = await req.json();

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

        const { data, error } = await supabaseAdmin
            .from("businesses")
            .update(validation.data)
            .eq("id", BUSINESS_ID)
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