import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { chunkText } from "@/lib/knowledge/chunk-text";
import { createEmbedding, toPgVector } from "@/lib/ai/create-embedding";
import { requireBusiness } from "@/lib/auth/require-business";

export const runtime = "nodejs";

const BUCKET_NAME = "knowledge-base";

function parseDocumentId(id: string) {
  const documentId = Number(id);

  if (!Number.isInteger(documentId) || documentId <= 0) {
    return null;
  }

  return documentId;
}

async function extractTextFromBuffer({
  buffer,
  fileName,
  fileType,
}: {
  buffer: Buffer;
  fileName: string;
  fileType: string | null;
}) {
  const lowerFileName = fileName.toLowerCase();
  const normalizedFileType = fileType || "";

  if (
    normalizedFileType === "application/pdf" ||
    lowerFileName.endsWith(".pdf")
  ) {
    const pdfParseModule: any = await import("pdf-parse");
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const result = await pdfParse(buffer);

    return result.text || "";
  }

  if (
    normalizedFileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerFileName.endsWith(".docx")
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });

    return result.value || "";
  }

  if (
    normalizedFileType === "text/plain" ||
    normalizedFileType === "text/csv" ||
    lowerFileName.endsWith(".txt") ||
    lowerFileName.endsWith(".csv")
  ) {
    return buffer.toString("utf8");
  }

  throw new Error("Unsupported document type.");
}

async function updateDocumentStatus({
  documentId,
  businessId,
  status,
  errorMessage = null,
}: {
  documentId: number;
  businessId: number;
  status: "uploaded" | "processing" | "ready" | "failed";
  errorMessage?: string | null;
}) {
  await supabaseAdmin
    .from("knowledge_documents")
    .update({
      status,
      error_message: errorMessage,
    })
    .eq("id", documentId)
    .eq("business_id", businessId);
}

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  /**
   * These are only for the catch block.
   * They start as null, then become number after validation.
   */
  let safeBusinessId: number | null = null;
  let safeDocumentId: number | null = null;

  try {
    /**
     * Protect this route and get the logged-in user's business.
     */
    const { business, errorResponse } = await requireBusiness();

    if (errorResponse) {
      return errorResponse;
    }

    const businessId = Number(business.id);
    safeBusinessId = businessId;

    const { id } = await context.params;
    const parsedDocumentId = parseDocumentId(id);

    if (!parsedDocumentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid document ID.",
        },
        { status: 400 }
      );
    }

    /**
     * This fixes the TypeScript error.
     *
     * parsedDocumentId can be number | null.
     * But after the validation above, documentId is guaranteed number.
     */
    const documentId: number = parsedDocumentId;
    safeDocumentId = documentId;

    const { data: document, error: documentError } = await supabaseAdmin
      .from("knowledge_documents")
      .select("id,business_id,file_name,file_type,file_path,status")
      .eq("id", documentId)
      .eq("business_id", businessId)
      .maybeSingle();

    if (documentError) {
      return NextResponse.json(
        {
          success: false,
          error: documentError.message,
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

    if (!document.file_path) {
      return NextResponse.json(
        {
          success: false,
          error: "Document file path is missing.",
        },
        { status: 400 }
      );
    }

    await updateDocumentStatus({
      documentId,
      businessId,
      status: "processing",
      errorMessage: null,
    });

    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(document.file_path);

    if (downloadError || !fileBlob) {
      throw new Error(downloadError?.message || "Failed to download document.");
    }

    const buffer = Buffer.from(await fileBlob.arrayBuffer());

    const extractedText = await extractTextFromBuffer({
      buffer,
      fileName: document.file_name,
      fileType: document.file_type,
    });

    const cleanedText = extractedText.trim();

    console.log("Extracted text length:", cleanedText.length);
    console.log("Extracted text preview:", cleanedText.slice(0, 300));

    if (!cleanedText || cleanedText.length < 5) {
      throw new Error(
        "No useful text could be extracted from this document. Please upload a file with readable text."
      );
    }

    const chunks = chunkText(cleanedText);

    console.log("Chunks created:", chunks.length);

    if (chunks.length === 0) {
      throw new Error(
        `No valid chunks were created. Extracted text length: ${cleanedText.length}`
      );
    }

    /**
     * Remove old chunks before re-processing.
     */
    const { error: deleteChunksError } = await supabaseAdmin
      .from("knowledge_chunks")
      .delete()
      .eq("business_id", businessId)
      .eq("document_id", documentId);

    if (deleteChunksError) {
      throw new Error(deleteChunksError.message);
    }

    const rows: {
      business_id: number;
      document_id: number;
      content: string;
      embedding: string;
      chunk_index: number;
      token_estimate: number;
    }[] = [];

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk.content);

      rows.push({
        business_id: businessId,
        document_id: documentId,
        content: chunk.content,
        embedding: toPgVector(embedding),
        chunk_index: chunk.chunkIndex,
        token_estimate: chunk.tokenEstimate,
      });
    }

    const { error: insertChunksError } = await supabaseAdmin
      .from("knowledge_chunks")
      .insert(rows);

    if (insertChunksError) {
      throw new Error(insertChunksError.message);
    }

    await updateDocumentStatus({
      documentId,
      businessId,
      status: "ready",
      errorMessage: null,
    });

    return NextResponse.json({
      success: true,
      message: "Document processed successfully.",
      chunksCreated: rows.length,
    });
  } catch (error) {
    console.error("POST /api/knowledge/documents/[id]/process error:", error);

    /**
     * Fix for:
     * Type 'number | null' is not assignable to type 'number'
     *
     * We create new constants only after checking both values are numbers.
     */
    if (safeDocumentId !== null && safeBusinessId !== null) {
      const documentId: number = safeDocumentId;
      const businessId: number = safeBusinessId;

      await updateDocumentStatus({
        documentId,
        businessId,
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Failed to process document.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process document.",
      },
      { status: 500 }
    );
  }
}