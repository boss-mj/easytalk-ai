"use client";

import { FormEvent, useEffect, useState } from "react";

type BusinessProfile = {
  id?: number;
  name: string;
  description: string;
  contact_number: string;
  email: string;
  address: string;
  opening_hours: string;
  closing_hours: string;
  delivery_info: string;
  payment_methods: string;
  facebook_page_id?: string | null;
  facebook_page_name?: string | null;
  is_connected?: boolean;
  updated_at?: string;
};

const emptyBusinessProfile: BusinessProfile = {
  name: "",
  description: "",
  contact_number: "",
  email: "",
  address: "",
  opening_hours: "",
  closing_hours: "",
  delivery_info: "",
  payment_methods: "",
};

export default function BusinessProfilePage() {
  const [business, setBusiness] =
    useState<BusinessProfile>(emptyBusinessProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBusinessProfile() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/business", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load business profile.");
        }

        const loadedBusiness = result.business;

        setBusiness({
          id: loadedBusiness.id,
          name: loadedBusiness.name || "",
          description: loadedBusiness.description || "",
          contact_number: loadedBusiness.contact_number || "",
          email: loadedBusiness.email || "",
          address: loadedBusiness.address || "",
          opening_hours: loadedBusiness.opening_hours || "",
          closing_hours: loadedBusiness.closing_hours || "",
          delivery_info: loadedBusiness.delivery_info || "",
          payment_methods: loadedBusiness.payment_methods || "",
          facebook_page_id: loadedBusiness.facebook_page_id,
          facebook_page_name: loadedBusiness.facebook_page_name,
          is_connected: loadedBusiness.is_connected,
          updated_at: loadedBusiness.updated_at,
        });
      } catch (error) {
        console.error("Load business profile error:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load business profile."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBusinessProfile();
  }, []);

  function updateField(field: keyof BusinessProfile, value: string) {
    setBusiness((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setStatusMessage("");
      setErrorMessage("");

      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: business.name,
          description: business.description,
          contact_number: business.contact_number,
          email: business.email,
          address: business.address,
          opening_hours: business.opening_hours,
          closing_hours: business.closing_hours,
          delivery_info: business.delivery_info,
          payment_methods: business.payment_methods,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save business profile.");
      }

      setBusiness((current) => ({
        ...current,
        ...result.business,
        description: result.business.description || "",
        contact_number: result.business.contact_number || "",
        email: result.business.email || "",
        address: result.business.address || "",
        opening_hours: result.business.opening_hours || "",
        closing_hours: result.business.closing_hours || "",
        delivery_info: result.business.delivery_info || "",
        payment_methods: result.business.payment_methods || "",
      }));

      setStatusMessage("Business profile saved successfully.");
    } catch (error) {
      console.error("Save business profile error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save business profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-black">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          Loading business profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage the business details your Messenger AI uses when answering
              customer questions.
            </p>
          </div>

          <ConnectionBadge
            isConnected={business.is_connected}
            pageName={business.facebook_page_name}
          />
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

        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Business Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Keep this information accurate. The AI will use it for customer
                replies.
              </p>
            </div>

            <div className="space-y-5">
              <TextInput
                label="Business Name"
                required
                value={business.name}
                onChange={(value) => updateField("name", value)}
                placeholder="Example: EasyTalk AI Solutions"
              />

              <TextArea
                label="Business Description"
                value={business.description}
                onChange={(value) => updateField("description", value)}
                placeholder="Briefly describe what your business offers."
                rows={4}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <TextInput
                  label="Phone Number"
                  value={business.contact_number}
                  onChange={(value) => updateField("contact_number", value)}
                  placeholder="Example: 0912 345 6789"
                />

                <TextInput
                  label="Email Address"
                  type="email"
                  value={business.email}
                  onChange={(value) => updateField("email", value)}
                  placeholder="Example: info@business.com"
                />
              </div>

              <TextInput
                label="Business Address"
                value={business.address}
                onChange={(value) => updateField("address", value)}
                placeholder="Example: Dasmariñas, Cavite"
              />

              <TextInput
                label="Opening Hours"
                value={business.opening_hours}
                onChange={(value) => updateField("opening_hours", value)}
                placeholder="Example: Monday to Saturday, 9 AM to 8 PM"
              />

              <TextInput
                label="Closing Hours"
                value={business.closing_hours}
                onChange={(value) => updateField("closing_hours", value)}
                placeholder="Example: Closes at 8 PM daily"
              />

              <TextArea
                label="Delivery Information"
                value={business.delivery_info}
                onChange={(value) => updateField("delivery_info", value)}
                placeholder="Example: Delivery available within nearby areas."
                rows={3}
              />

              <TextArea
                label="Payment Methods"
                value={business.payment_methods}
                onChange={(value) => updateField("payment_methods", value)}
                placeholder="Example: Cash, GCash, bank transfer"
                rows={3}
              />

              <div className="flex justify-end border-t pt-5">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800">AI Usage</h3>
              <p className="mt-2 text-sm text-gray-500">
                This profile is included in the AI prompt when customers ask
                about your business, location, contact details, delivery, or
                payment methods.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800">Messenger Page</h3>

              <div className="mt-4 space-y-3 text-sm">
                <InfoRow
                  label="Page Name"
                  value={business.facebook_page_name || "Not connected"}
                />

                <InfoRow
                  label="Page ID"
                  value={business.facebook_page_id || "Not available"}
                />

                <InfoRow
                  label="Status"
                  value={business.is_connected ? "Connected" : "Not connected"}
                />
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Page access tokens are never shown here for security.
              </p>
            </div>

            {business.updated_at && (
              <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500 shadow-sm">
                Last updated: {new Date(business.updated_at).toLocaleString()}
              </div>
            )}
          </aside>
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

function ConnectionBadge({
  isConnected,
  pageName,
}: {
  isConnected?: boolean;
  pageName?: string | null;
}) {
  return (
    <div
      className={`rounded-full px-4 py-2 text-sm font-semibold ${isConnected
        ? "bg-green-100 text-green-700"
        : "bg-gray-200 text-gray-600"
        }`}
    >
      {isConnected ? `Connected: ${pageName || "Facebook Page"}` : "Not Connected"}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 break-all text-gray-700">{value}</p>
    </div>
  );
}