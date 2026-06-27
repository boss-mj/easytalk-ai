import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireBusiness } from "@/lib/auth/require-business";

export const runtime = "nodejs";

const BUCKET_NAME = "knowledge-base";

/**
 * Converts the dynamic route id into a valid number.
 *
 * Example:
 * /api/knowledge/documents/5
 * id = "5"
 * documentId = 5
 */
function parseDocumentId(id: string) {
  const documentId = Number(id);

  if (!Number.isInteger(documentId) || documentId <= 0) {
    return null;
  }

  return documentId;
}

export async function DELETE(
  _req: Request,
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
     * Get document ID from URL.
     *
     * Example:
     * /api/knowledge/documents/5
     */
    const { id } = await context.params;
    const documentId = parseDocumentId(id);

    if (!documentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid document ID.",
        },
        { status: 400 }
      );
    }

    /**
     * Find the document first.
     *
     * knowledge_documents is a child table, so we filter by:
     * .eq("business_id", business.id)
     *
     * This prevents one user from deleting another business' document.
     */
    const { data: document, error: findError } = await supabaseAdmin
      .from("knowledge_documents")
      .select("id,file_path")
      .eq("id", documentId)
      .eq("business_id", business.id)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        {
          success: false,
          error: findError.message,
        },
        { status: 500 }
      );
    }

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: "Document not found.",
        },
        { status: 404 }
      );
    }

    /**
     * If the document has a file in Supabase Storage,
     * remove that storage file first.
     */
    if (document.file_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([document.file_path]);

      if (storageError) {
        return NextResponse.json(
          {
            success: false,
            error: storageError.message,
          },
          { status: 500 }
        );
      }
    }

    /**
     * Delete the document database row.
     *
     * We still filter by business_id for safety.
     */
    const { error: deleteError } = await supabaseAdmin
      .from("knowledge_documents")
      .delete()
      .eq("id", documentId)
      .eq("business_id", business.id);

    if (deleteError) {
      return NextResponse.json(
        {
          success: false,
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/knowledge/documents/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete document.",
      },
      { status: 500 }
    );
  }
}