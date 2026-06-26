import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUSINESS_ID = Number(process.env.DEFAULT_BUSINESS_ID || "1");
const BUCKET_NAME = "knowledge-base";

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
    const { id } = await context.params;
    const documentId = parseDocumentId(id);

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "Invalid document ID." },
        { status: 400 }
      );
    }

    const { data: document, error: findError } = await supabaseAdmin
      .from("knowledge_documents")
      .select("id,file_path")
      .eq("id", documentId)
      .eq("business_id", BUSINESS_ID)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        { success: false, error: findError.message },
        { status: 500 }
      );
    }

    if (!document) {
      return NextResponse.json(
        { success: false, error: "Document not found." },
        { status: 404 }
      );
    }

    if (document.file_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([document.file_path]);

      if (storageError) {
        return NextResponse.json(
          { success: false, error: storageError.message },
          { status: 500 }
        );
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("knowledge_documents")
      .delete()
      .eq("id", documentId)
      .eq("business_id", BUSINESS_ID);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: deleteError.message },
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
      { success: false, error: "Failed to delete document." },
      { status: 500 }
    );
  }
}