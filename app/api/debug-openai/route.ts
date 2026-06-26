import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model,
      input: "Reply only with: OpenAI is working",
    });

    return NextResponse.json({
      success: true,
      model,
      reply: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI debug error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown OpenAI error",
      },
      { status: 500 }
    );
  }
}