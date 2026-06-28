import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

export const runtime = "nodejs";

const BUCKET_NAME = "knowledge-base";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Allowed document types for MVP.
 *
 * PDF and DOCX need processing later.
 * TXT and CSV are easier to test.
 */
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

/**
 * Safe document columns returned to the frontend.
 *
 * knowledge_documents is a child table of businesses.
 * Each document belongs to one business through business_id.
 */
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

/**
 * Makes file names safer for storage paths.
 *
 * Example:
 * "My Price List 2026.pdf"
 * becomes something like:
 * "My-Price-List-2026.pdf"
 */
function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

/**
 * Validates uploaded file before saving to Supabase Storage.
 */
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
     * knowledge_documents is a child table.
     *
     * So we use:
     * .eq("business_id", business.id)
     *
     * This ensures the logged-in user only sees documents
     * for their own business.
     */
    const { data, error } = await supabaseAdmin
      .from("knowledge_documents")
      .select(DOCUMENT_COLUMNS)
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
      documents: data || [],
    });
  } catch (error) {
    console.error("GET /api/knowledge/documents error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load knowledge documents.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    /**
     * Protect upload route.
     *
     * The uploaded file will be stored under the logged-in user's business,
     * not DEFAULT_BUSINESS_ID.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded.",
        },
        { status: 400 }
      );
    }

    const validationError = validateFile(file);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        { status: 400 }
      );
    }

    const safeFileName = sanitizeFileName(file.name);

    /**
     * Storage path is grouped by business ID.
     *
     * OLD:
     * `${BUSINESS_ID}/...`
     *
     * NEW:
     * `${business.id}/...`
     *
     * This keeps each business' uploaded files separated.
     */
    const filePath = `${business.id}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    /**
     * Upload the file into the private Supabase Storage bucket.
     */
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    /**
     * Save the document record under this user's business.
     *
     * knowledge_documents uses business_id because it is a child table.
     */
    const { data, error } = await supabaseAdmin
      .from("knowledge_documents")
      .insert({
        business_id: business.id,
        file_name: file.name,
        file_type: file.type,
        file_path: filePath,
        file_size_bytes: file.size,
        file_url: null,
        status: "uploaded",
      })
      .select(DOCUMENT_COLUMNS)
      .single();

    /**
     * If database insert fails, remove the uploaded storage file
     * so we do not leave orphaned files.
     */
    if (error) {
      await supabaseAdmin.storage.from(BUCKET_NAME).remove([filePath]);

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
      message: "Document uploaded successfully.",
      document: data,
    });
  } catch (error) {
    console.error("POST /api/knowledge/documents error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload document.",
      },
      { status: 500 }
    );
  }
}