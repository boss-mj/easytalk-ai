import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Business setup API is working",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      ok: true,
      message: "Business setup received",
      data: body,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }
}