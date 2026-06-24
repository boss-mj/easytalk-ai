import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");
const BUCKET_NAME = "knowledge-base";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

const DOCUMENT_COLUMNS = `
  id,
  business_id,
  file_name,
  file_type,
  file_url,
  file_path,
  file_size_bytes,
  status,
  error_message,
  created_at,
  updated_at
`;

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

function validateFile(file: File) {
  if (!file.name) {
    return "File name is required.";
  }

  if (file.size <= 0) {
    return "Uploaded file is empty.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File is too large. Maximum allowed size is 10MB.";
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload PDF, DOCX, TXT, or CSV.";
  }

  return null;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("knowledge_documents")
      .select(DOCUMENT_COLUMNS)
      .eq("business_id", BUSINESS_ID)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documents: data || [],
    });
  } catch (error) {
    console.error("GET /api/knowledge/documents error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load knowledge documents." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    const validationError = validateFile(file);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const safeFileName = sanitizeFileName(file.name);
    const filePath = `${BUSINESS_ID}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("knowledge_documents")
      .insert({
        business_id: BUSINESS_ID,
        file_name: file.name,
        file_type: file.type,
        file_path: filePath,
        file_size_bytes: file.size,
        file_url: null,
        status: "uploaded",
      })
      .select(DOCUMENT_COLUMNS)
      .single();

    if (error) {
      await supabaseAdmin.storage.from(BUCKET_NAME).remove([filePath]);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully.",
      document: data,
    });
  } catch (error) {
    console.error("POST /api/knowledge/documents error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to upload document." },
      { status: 500 }
    );
  }
}