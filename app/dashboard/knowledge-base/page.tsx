"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
    FileText,
    Plus,
    RefreshCw,
    Trash2,
    UploadCloud,
    Play,
} from "lucide-react";

type KnowledgeDocument = {
    id: number;
    business_id: number;
    file_name: string;
    file_type: string | null;
    file_url: string | null;
    file_path: string | null;
    file_size_bytes: number | null;
    status: "uploaded" | "processing" | "ready" | "failed";
    error_message: string | null;
    created_at: string;
    updated_at: string;
};

export default function KnowledgeBasePage() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [processingDocumentId, setProcessingDocumentId] = useState<number | null>(
        null
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    async function handleProcess(document: KnowledgeDocument) {
        try {
            setProcessingDocumentId(document.id);
            setStatusMessage("");
            setErrorMessage("");

            const response = await fetch(
                `/api/knowledge/documents/${document.id}/process`,
                {
                    method: "POST",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to process document.");
            }

            setStatusMessage(
                `Document processed successfully. Chunks created: ${result.chunksCreated}`
            );

            await loadDocuments();
        } catch (error) {
            console.error("Process document error:", error);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to process document."
            );

            await loadDocuments();
        } finally {
            setProcessingDocumentId(null);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const response = await fetch("/api/knowledge/documents", {
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to load documents.");
            }

            setDocuments(result.documents || []);
        } catch (error) {
            console.error("Load documents error:", error);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to load documents."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setStatusMessage("");
        setErrorMessage("");
    }

    async function handleUpload() {
        if (!selectedFile) {
            setErrorMessage("Please select a file first.");
            return;
        }

        try {
            setIsUploading(true);
            setStatusMessage("");
            setErrorMessage("");

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/knowledge/documents", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to upload document.");
            }

            setDocuments((current) => [result.document, ...current]);
            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setStatusMessage("Document uploaded successfully.");
        } catch (error) {
            console.error("Upload document error:", error);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to upload document."
            );
        } finally {
            setIsUploading(false);
        }
    }

    async function handleDelete(document: KnowledgeDocument) {
        const confirmed = window.confirm(
            `Delete "${document.file_name}"? This will remove it from storage and the database.`
        );

        if (!confirmed) return;

        try {
            setStatusMessage("");
            setErrorMessage("");

            const response = await fetch(`/api/knowledge/documents/${document.id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to delete document.");
            }

            setDocuments((current) =>
                current.filter((item) => item.id !== document.id)
            );

            setStatusMessage("Document deleted successfully.");
        } catch (error) {
            console.error("Delete document error:", error);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to delete document."
            );
        }
    }

    function formatFileSize(bytes: number | null) {
        if (!bytes) return "Unknown size";

        if (bytes < 1024) return `${bytes} B`;

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function formatDate(value: string) {
        return new Date(value).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-black">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Knowledge Base
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Upload business documents such as menus, policies, price lists,
                            and guides. These will be processed for AI search in the next
                            phase.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadDocuments}
                        className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {statusMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {statusMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <section className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                            <UploadCloud size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Upload Document
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Allowed files: PDF, DOCX, TXT, CSV. Maximum file size: 10MB.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.txt,.csv"
                            onChange={handleFileChange}
                            className="w-full rounded-lg border px-4 py-3 text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700"
                        />

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading || !selectedFile}
                            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Plus size={16} />
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>

                    {selectedFile && (
                        <div className="mt-4 rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
                            Selected: <span className="font-medium">{selectedFile.name}</span>{" "}
                            ({formatFileSize(selectedFile.size)})
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Uploaded Documents
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Showing {documents.length} document
                            {documents.length === 1 ? "" : "s"}.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="rounded-xl border p-6 text-sm text-gray-500">
                            Loading documents...
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center">
                            <FileText className="mx-auto text-gray-300" size={44} />
                            <p className="mt-3 font-medium text-gray-700">
                                No documents uploaded yet
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Upload menus, policies, service guides, or price lists.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px]">
                                <thead>
                                    <tr className="border-b text-left text-sm text-gray-500">
                                        <th className="pb-4 font-medium">File Name</th>
                                        <th className="pb-4 font-medium">Type</th>
                                        <th className="pb-4 font-medium">Size</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium">Uploaded</th>
                                        <th className="pb-4 text-center font-medium">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {documents.map((document) => (
                                        <tr
                                            key={document.id}
                                            className="border-b transition last:border-none hover:bg-gray-50"
                                        >
                                            <td className="max-w-[320px] py-5 font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <FileText
                                                        size={18}
                                                        className="shrink-0 text-emerald-500"
                                                    />
                                                    <span className="break-all">{document.file_name}</span>
                                                </div>
                                            </td>

                                            <td className="py-5 text-sm text-gray-600">
                                                {document.file_type || "Unknown"}
                                            </td>

                                            <td className="py-5 text-sm text-gray-600">
                                                {formatFileSize(document.file_size_bytes)}
                                            </td>

                                            <td className="py-5">
                                                <StatusBadge status={document.status} />
                                            </td>

                                            <td className="py-5 text-sm text-gray-500">
                                                {formatDate(document.created_at)}
                                            </td>

                                            <td className="py-5">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleProcess(document)}
                                                        disabled={processingDocumentId === document.id}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        aria-label={`Process ${document.file_name}`}
                                                    >
                                                        <Play size={15} className="text-emerald-600" />
                                                    </button>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(document)} 
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-red-50"
                                                        aria-label={`Delete ${document.file_name}`}
                                                    >
                                                        <Trash2 size={15} className="text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-5 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                        Phase 1 stores uploaded files. Phase 2 will extract text, create
                        chunks, generate embeddings, and let the AI search document content.
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: "uploaded" | "processing" | "ready" | "failed";
}) {
    const styles = {
        uploaded: "bg-blue-100 text-blue-700",
        processing: "bg-yellow-100 text-yellow-700",
        ready: "bg-emerald-100 text-emerald-700",
        failed: "bg-red-100 text-red-700",
    };

    const labels = {
        uploaded: "Uploaded",
        processing: "Processing",
        ready: "Ready",
        failed: "Failed",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}