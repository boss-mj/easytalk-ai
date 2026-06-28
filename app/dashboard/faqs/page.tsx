"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type FAQ = {
  id: number;
  business_id: number;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type FAQForm = {
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
};

const emptyForm: FAQForm = {
  question: "",
  answer: "",
  category: "General",
  is_active: true,
};

const categoryOptions = [
  "General",
  "Delivery",
  "Payment",
  "Opening Hours",
  "Products",
  "Refunds",
  "Orders",
  "Policies",
];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [form, setForm] = useState<FAQForm>(emptyForm);

  const [editingFAQId, setEditingFAQId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/faqs", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load FAQs.");
      }

      setFaqs(result.faqs || []);
    } catch (error) {
      console.error("Load FAQs error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load FAQs."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateForm<K extends keyof FAQForm>(field: K, value: FAQForm[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setEditingFAQId(null);
    setForm(emptyForm);
    setStatusMessage("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditForm(faq: FAQ) {
    setEditingFAQId(faq.id);
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "General",
      is_active: faq.is_active,
    });
    setStatusMessage("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingFAQId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setStatusMessage("");
      setErrorMessage("");

      const payload = {
        question: form.question,
        answer: form.answer,
        category: form.category,
        is_active: form.is_active,
      };

      const isEditing = editingFAQId !== null;

      const response = await fetch(
        isEditing ? `/api/faqs/${editingFAQId}` : "/api/faqs",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save FAQ.");
      }

      if (isEditing) {
        setFaqs((current) =>
          current.map((faq) => (faq.id === result.faq.id ? result.faq : faq))
        );
        setStatusMessage("FAQ updated successfully.");
      } else {
        setFaqs((current) => [result.faq, ...current]);
        setStatusMessage("FAQ created successfully.");
      }

      closeForm();
    } catch (error) {
      console.error("Save FAQ error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save FAQ."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(faq: FAQ) {
    const confirmed = window.confirm(
      `Delete this FAQ?\n\n"${faq.question}"`
    );

    if (!confirmed) return;

    try {
      setStatusMessage("");
      setErrorMessage("");

      const response = await fetch(`/api/faqs/${faq.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete FAQ.");
      }

      setFaqs((current) => current.filter((item) => item.id !== faq.id));
      setStatusMessage("FAQ deleted successfully.");
    } catch (error) {
      console.error("Delete FAQ error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete FAQ."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              FAQs / Policies
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage common questions and policy answers that your Messenger AI
              uses for accurate replies.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            <Plus size={16} />
            Add FAQ
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

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFAQId ? "Edit FAQ" : "Add FAQ"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Write clear questions and answers. The AI will use active FAQs
                  when responding to customers.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border p-2 text-gray-500 transition hover:bg-gray-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <TextInput
                label="Question"
                required
                value={form.question}
                onChange={(value) => updateForm("question", value)}
                placeholder="Example: Do you deliver?"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none transition focus:ring-2 focus:ring-green-500"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <TextArea
                label="Answer"
                required
                value={form.answer}
                onChange={(value) => updateForm("answer", value)}
                placeholder="Example: Yes, we deliver within nearby areas."
                rows={6}
              />

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    updateForm("is_active", event.target.checked)
                  }
                  className="h-4 w-4 accent-green-500"
                />
                <div>
                  <p className="font-medium text-gray-800">Active</p>
                  <p className="text-sm text-gray-500">
                    If disabled, this FAQ will not be used by the AI.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : editingFAQId
                    ? "Save Changes"
                    : "Create FAQ"}
              </button>
            </div>
          </form>
        )}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                FAQ List
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing {faqs.length} FAQ{faqs.length === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-xl border p-6 text-sm text-gray-500">
              Loading FAQs...
            </div>
          ) : faqs.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium text-gray-700">No FAQs yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Add common questions so the AI can answer customers more
                accurately.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                <Plus size={16} />
                Add FAQ
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">Question</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Answer</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 text-center font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {faqs.map((faq) => (
                    <tr
                      key={faq.id}
                      className="border-b transition last:border-none hover:bg-gray-50"
                    >
                      <td className="max-w-[260px] py-5 font-medium text-gray-900">
                        {faq.question}
                      </td>

                      <td className="py-5 text-gray-600">
                        {faq.category || "General"}
                      </td>

                      <td className="max-w-[360px] py-5 text-sm text-gray-600">
                        <p className="max-h-12 overflow-hidden">
                          {faq.answer}
                        </p>
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            faq.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {faq.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(faq)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-gray-100"
                            aria-label={`Edit FAQ ${faq.id}`}
                          >
                            <Pencil size={15} className="text-gray-500" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(faq)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-red-50"
                            aria-label={`Delete FAQ ${faq.id}`}
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

          <div className="mt-5 text-sm text-gray-500">
            Active FAQs are included in the AI knowledge used for Messenger
            replies.
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none transition focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <textarea
        rows={rows}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border px-4 py-3 text-gray-700 outline-none transition focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}