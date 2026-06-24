import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { chunkText } from "@/lib/knowledge/chunk-text";
import { createEmbedding, toPgVector } from "@/lib/ai/create-embedding";

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

async function updateDocumentStatus(
    documentId: number,
    status: "uploaded" | "processing" | "ready" | "failed",
    errorMessage: string | null = null
) {
    await supabaseAdmin
        .from("knowledge_documents")
        .update({
            status,
            error_message: errorMessage,
        })
        .eq("id", documentId)
        .eq("business_id", BUSINESS_ID);
}

export async function POST(
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

        const { data: document, error: documentError } = await supabaseAdmin
            .from("knowledge_documents")
            .select("id,business_id,file_name,file_type,file_path,status")
            .eq("id", documentId)
            .eq("business_id", BUSINESS_ID)
            .maybeSingle();

        if (documentError) {
            return NextResponse.json(
                { success: false, error: documentError.message },
                { status: 500 }
            );
        }

        if (!document) {
            return NextResponse.json(
                { success: false, error: "Document not found." },
                { status: 404 }
            );
        }

        if (!document.file_path) {
            return NextResponse.json(
                { success: false, error: "Document file path is missing." },
                { status: 400 }
            );
        }

        await updateDocumentStatus(documentId, "processing", null);

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


        if (chunks.length === 0) {
            throw new Error("No valid chunks were created from this document.");
        }

        // Remove old chunks before re-processing.
        const { error: deleteChunksError } = await supabaseAdmin
            .from("knowledge_chunks")
            .delete()
            .eq("business_id", BUSINESS_ID)
            .eq("document_id", documentId);

        if (deleteChunksError) {
            throw new Error(deleteChunksError.message);
        }

        const rows = [];

        for (const chunk of chunks) {
            const embedding = await createEmbedding(chunk.content);

            rows.push({
                business_id: BUSINESS_ID,
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

        await updateDocumentStatus(documentId, "ready", null);

        return NextResponse.json({
            success: true,
            message: "Document processed successfully.",
            chunksCreated: rows.length,
        });
    } catch (error) {
        console.error("POST /api/knowledge/documents/[id]/process error:", error);

        const { id } = await context.params;
        const documentId = parseDocumentId(id);

        if (documentId) {
            await updateDocumentStatus(
                documentId,
                "failed",
                error instanceof Error ? error.message : "Failed to process document."
            );
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