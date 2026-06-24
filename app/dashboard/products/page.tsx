"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type Product = {
  id: number;
  business_id: number;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  currency: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

type ProductForm = {
  name: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  is_available: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  currency: "PHP",
  is_available: true,
};

export default function ProductsServicesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load products.");
      }

      setProducts(result.products || []);
    } catch (error) {
      console.error("Load products error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load products."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateForm<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setEditingProductId(null);
    setForm(emptyForm);
    setStatusMessage("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProductId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price === null ? "" : String(product.price),
      currency: product.currency || "PHP",
      is_available: product.is_available,
    });
    setStatusMessage("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingProductId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setStatusMessage("");
      setErrorMessage("");

      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price === "" ? null : Number(form.price),
        currency: form.currency,
        is_available: form.is_available,
      };

      const isEditing = editingProductId !== null;

      const response = await fetch(
        isEditing ? `/api/products/${editingProductId}` : "/api/products",
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
        throw new Error(result.error || "Failed to save product.");
      }

      if (isEditing) {
        setProducts((current) =>
          current.map((product) =>
            product.id === result.product.id ? result.product : product
          )
        );
        setStatusMessage("Product updated successfully.");
      } else {
        setProducts((current) => [result.product, ...current]);
        setStatusMessage("Product created successfully.");
      }

      closeForm();
    } catch (error) {
      console.error("Save product error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save product."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setStatusMessage("");
      setErrorMessage("");

      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete product.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      setStatusMessage("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    }
  }

  function formatPrice(product: Product) {
    if (product.price === null) return "No price";

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: product.currency || "PHP",
    }).format(product.price);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Products / Services
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage products and services that your Messenger AI can recommend
              and answer questions about.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            <Plus size={16} />
            Add Product
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
                  {editingProductId ? "Edit Product" : "Add Product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add clear details. The AI uses this information when
                  customers ask about products, services, and prices.
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

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="Product / Service Name"
                required
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                placeholder="Example: Milk Tea"
              />

              <TextInput
                label="Category"
                value={form.category}
                onChange={(value) => updateForm("category", value)}
                placeholder="Example: Drinks"
              />

              <TextInput
                label="Price"
                type="number"
                value={form.price}
                onChange={(value) => updateForm("price", value)}
                placeholder="Example: 45"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Currency
                </label>

                <select
                  value={form.currency}
                  onChange={(event) =>
                    updateForm("currency", event.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3 text-gray-700 outline-none transition focus:ring-2 focus:ring-green-500"
                >
                  <option value="PHP">PHP</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  value={form.description}
                  onChange={(value) => updateForm("description", value)}
                  placeholder="Example: Classic milk tea with pearls."
                  rows={4}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 md:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(event) =>
                    updateForm("is_available", event.target.checked)
                  }
                  className="h-4 w-4 accent-green-500"
                />
                <div>
                  <p className="font-medium text-gray-800">Available</p>
                  <p className="text-sm text-gray-500">
                    If disabled, the AI should avoid recommending this item.
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
                  : editingProductId
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </form>
        )}

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Product List
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Showing {products.length} product
                {products.length === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-xl border p-6 text-sm text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium text-gray-700">No products yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Add your first product or service so the AI can answer customer
                questions accurately.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">Product Name</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Description</th>
                    <th className="pb-4 text-center font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b transition last:border-none hover:bg-gray-50"
                    >
                      <td className="py-5 font-medium text-gray-900">
                        {product.name}
                      </td>

                      <td className="py-5 text-gray-600">
                        {product.category || "Uncategorized"}
                      </td>

                      <td className="py-5 font-medium text-gray-900">
                        {formatPrice(product)}
                      </td>

                      <td className="py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.is_available
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.is_available ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="max-w-[280px] py-5 text-sm text-gray-600">
                        <p className="line-clamp-2">
                          {product.description || "No description"}
                        </p>
                      </td>

                      <td className="py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-gray-100"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={15} className="text-gray-500" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-red-50"
                            aria-label={`Delete ${product.name}`}
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
            Products marked inactive should not be recommended by the AI.
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
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border px-4 py-3 text-gray-700 outline-none transition focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}