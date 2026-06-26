import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/require-user";

export async function requireBusiness() {
  const { user, errorResponse } = await requireUser();

  if (errorResponse || !user) {
    return {
      user: null,
      business: null,
      errorResponse,
    };
  }

  const { data: business, error } = await supabaseAdmin
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      user,
      business: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      ),
    };
  }

  if (!business) {
    return {
      user,
      business: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "No business is connected to this account.",
        },
        { status: 404 }
      ),
    };
  }

  return {
    user,
    business,
    errorResponse: null,
  };
}