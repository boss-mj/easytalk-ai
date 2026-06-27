"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SetupStatus = "checking" | "ready" | "saving";

export default function SetupPage() {
  const router = useRouter();

  const [status, setStatus] = useState<SetupStatus>("checking");
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [closingHours, setClosingHours] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [paymentMethods, setPaymentMethods] = useState("");

  useEffect(() => {
    async function checkSetup() {
      try {
        const response = await fetch("/api/business/setup");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to check setup.");
        }

        if (result.hasBusiness) {
          router.replace("/dashboard");
          return;
        }

        setStatus("ready");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to check setup."
        );
        setStatus("ready");
      }
    }

    checkSetup();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setStatus("saving");
      setErrorMessage("");

      const response = await fetch("/api/business/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          address,
          contact_number: contactNumber,
          email,
          opening_hours: openingHours,
          closing_hours: closingHours,
          delivery_info: deliveryInfo,
          payment_methods: paymentMethods,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create business.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create business."
      );
      setStatus("ready");
    }
  }

  if (status === "checking") {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <p className="text-sm text-zinc-400">Checking setup...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">EasyTalk AI Setup</p>
          <h1 className="mt-2 text-3xl font-bold">
            Create your business profile
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            This information helps your AI answer customers correctly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          {errorMessage ? (
            <div className="mb-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Business name <span className="text-red-400">*</span>
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Mark's Coffee Shop"
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What does your business offer?"
                rows={4}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Address</label>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Business address"
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contact number
                </label>
                <input
                  value={contactNumber}
                  onChange={(event) => setContactNumber(event.target.value)}
                  placeholder="09xxxxxxxxx"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="business@email.com"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Opening hours
                </label>
                <input
                  value={openingHours}
                  onChange={(event) => setOpeningHours(event.target.value)}
                  placeholder="Example: 8:00 AM"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Closing hours
                </label>
                <input
                  value={closingHours}
                  onChange={(event) => setClosingHours(event.target.value)}
                  placeholder="Example: 9:00 PM"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Delivery info
              </label>
              <textarea
                value={deliveryInfo}
                onChange={(event) => setDeliveryInfo(event.target.value)}
                placeholder="Example: Delivery available within nearby areas."
                rows={3}
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Payment methods
              </label>
              <input
                value={paymentMethods}
                onChange={(event) => setPaymentMethods(event.target.value)}
                placeholder="Example: Cash, GCash, Maya, Bank Transfer"
                className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={status === "saving"}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "saving" ? "Creating business..." : "Finish setup"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}