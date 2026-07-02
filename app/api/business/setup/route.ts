import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/require-user";

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

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
  facebook_page_name,
  is_connected,
  created_at,
  updated_at
`;

export async function GET() {
  try {
    const { user, errorResponse } = await requireUser();

    if (errorResponse || !user) {
      return errorResponse;
    }

    const { data: business, error } = await supabaseAdmin
      .from("businesses")
      .select(BUSINESS_COLUMNS)
      .eq("owner_id", user.id)
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

    return NextResponse.json({
      success: true,
      hasBusiness: !!business,
      business,
    });
  } catch (error) {
    console.error("GET /api/business/setup error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to check business setup.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireUser();

    if (errorResponse || !user) {
      return errorResponse;
    }

    const { data: existingBusiness, error: existingError } = await supabaseAdmin
      .from("businesses")
      .select("id,name")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          success: false,
          error: existingError.message,
        },
        { status: 500 }
      );
    }

    if (existingBusiness) {
      return NextResponse.json(
        {
          success: false,
          error: "This account already has a business.",
          business: existingBusiness,
        },
        { status: 409 }
      );
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
      owner_id: user.id,
      name,
      description: cleanText(body.description, 1000),
      address: cleanText(body.address, 500),
      contact_number: cleanText(body.contact_number, 100),
      email: cleanText(body.email, 150),
      opening_hours: cleanText(body.opening_hours, 150),
      closing_hours: cleanText(body.closing_hours, 150),
      delivery_info: cleanText(body.delivery_info, 1000),
      payment_methods: cleanText(body.payment_methods, 500),
      is_connected: false,
    };

    const { data: business, error } = await supabaseAdmin
      .from("businesses")
      .insert(payload)
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

    await supabaseAdmin.from("ai_settings").insert({
      business_id: business.id,
      is_enabled: true,
      bot_name: "EasyBot",
      fallback_message:
        "I am not sure about that yet. A team member will assist you shortly.",
      enable_human_handoff: true,
      use_knowledge_base: true,
      response_delay_seconds: 0,
      typing_indicator: true,
    });

    return NextResponse.json({
      success: true,
      message: "Business setup completed.",
      business,
    });
  } catch (error) {
    console.error("POST /api/business/setup error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create business.",
      },
      { status: 500 }
    );
  }
}