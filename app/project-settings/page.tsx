"use client";

import {
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Info,
} from "lucide-react";

export default function ProjectSettingsPage() {
  return (
    <main className="min-h-screen bg-[#F7FAF8]">
      {/* ==========================================================
          PAGE HEADER
      =========================================================== */}
      <section className="border-b border-green-100 bg-gradient-to-b from-green-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            Project Settings
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900">
            Account Deletion
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
            Permanently delete your EasyTalk AI account and all associated
            project data. This action is irreversible, so please review the
            information below before submitting a deletion request.
          </p>
        </div>
      </section>

      {/* ==========================================================
          CONTENT
      =========================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-12 space-y-8">


        {/* WARNING CARD */}

        <div className="overflow-hidden rounded-3xl border border-red-200 bg-red-50 shadow-sm">

          <div className="flex items-start gap-5 p-8">

            <div className="rounded-2xl bg-red-100 p-3">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-red-700">
                Warning: This action cannot be undone
              </h2>

              <p className="mt-4 max-w-4xl leading-8 text-gray-700">
                Once your account has been permanently deleted, your chatbot,
                AI configuration, business profile, conversations,
                knowledge base, analytics, connected integrations, and
                other project resources cannot be recovered.
              </p>

            </div>

          </div>

        </div>

        {/* BEFORE YOU DELETE */}

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-3">

            <ShieldCheck className="h-8 w-8 text-green-600" />

            <h2 className="text-3xl font-bold text-gray-900">
              Before You Delete
            </h2>

          </div>

          <p className="mb-8 max-w-4xl leading-8 text-gray-600">
            Before requesting permanent deletion, we strongly recommend
            reviewing the following checklist to ensure you don't lose
            important information.
          </p>

          <div className="grid gap-5 md:grid-cols-2">

            {[
              "Export important Messenger conversations.",
              "Download reports and analytics.",
              "Save your AI prompts and chatbot settings.",
              "Download your uploaded knowledge base.",
              "Disconnect Messenger and other integrations.",
              "Cancel any active subscription before deletion.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50 p-5"
              >
                <ShieldCheck className="mt-1 h-5 w-5 text-green-600" />

                <p className="text-gray-700">
                  {item}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* IMPORTANT INFORMATION */}

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="rounded-xl bg-blue-100 p-3">
              <Info className="h-6 w-6 text-blue-600" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-blue-700">
                Important Information
              </h2>

              <p className="mt-4 max-w-4xl leading-8 text-gray-700">
                For security purposes, EasyTalk AI may require identity
                verification before processing an account deletion request.
                This helps protect your account from unauthorized deletion
                attempts.
              </p>

            </div>

          </div>

        </div>

                {/* ==========================================================
            DATA OVERVIEW
        =========================================================== */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* DATA THAT WILL BE DELETED */}

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl bg-red-100 p-3">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Data That Will Be Deleted
              </h2>

            </div>

            <p className="mb-8 leading-7 text-gray-600">
              Once your deletion request has been completed, the following
              information will be permanently removed from EasyTalk AI.
            </p>

            <div className="space-y-4">

              {[
                "Your EasyTalk AI account",
                "Business profile information",
                "AI chatbot configuration",
                "Messenger conversations",
                "Knowledge Base documents",
                "Products & Services",
                "Opening Hours",
                "Frequently Asked Questions",
                "Analytics & reports",
                "Connected integrations",
                "Uploaded files",
                "Project settings",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border border-red-100 bg-red-50 px-5 py-4"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />

                  <span className="text-gray-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* LEGAL RETENTION */}

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl bg-green-100 p-3">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Information We May Retain
              </h2>

            </div>

            <p className="mb-8 leading-7 text-gray-600">
              In certain situations, EasyTalk AI may retain limited
              information when required by law or necessary to protect
              our platform and users.
            </p>

            <div className="space-y-5">

              {[
                {
                  title: "Legal Compliance",
                  desc: "Records required to comply with applicable laws and regulations.",
                },
                {
                  title: "Fraud Prevention",
                  desc: "Security logs used to investigate abuse, spam, or unauthorized activity.",
                },
                {
                  title: "Financial Records",
                  desc: "Billing information retained to satisfy tax or accounting obligations.",
                },
                {
                  title: "Dispute Resolution",
                  desc: "Limited records that may be required for legal claims or investigations.",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="rounded-2xl border border-green-100 bg-green-50 p-5"
                >

                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-600">
                    {item.desc}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ==========================================================
            ACCOUNT DELETION PROCESS
        =========================================================== */}

        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">

          <h2 className="text-3xl font-bold text-gray-900">
            Account Deletion Process
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-gray-600">
            To protect your account, every deletion request follows a
            secure verification process before permanent removal.
          </p>

          <div className="mt-12 space-y-8">

            {[
              {
                step: "01",
                title: "Submit Request",
                description:
                  "Start the deletion request from your Project Settings page.",
              },
              {
                step: "02",
                title: "Identity Verification",
                description:
                  "We may ask you to verify your identity to prevent unauthorized requests.",
              },
              {
                step: "03",
                title: "Confirmation",
                description:
                  "You'll receive a final confirmation before permanent deletion begins.",
              },
              {
                step: "04",
                title: "Permanent Deletion",
                description:
                  "After verification, eligible account data will be securely deleted from our systems.",
              },
            ].map((item) => (

              <div
                key={item.step}
                className="flex gap-6"
              >

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                  {item.step}
                </div>

                <div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-3xl leading-8 text-gray-600">
                    {item.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* PROCESSING TIME */}

        <div className="rounded-3xl bg-gradient-to-r from-green-600 to-green-700 p-10 text-white shadow-lg">

          <h2 className="text-3xl font-bold">
            Processing Time
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-green-100">
            Once your identity has been verified and your request has been
            confirmed, account deletion is typically completed within
            <span className="font-semibold text-white">
              {" "}30 days
            </span>
            . Some information may be retained longer where required by
            applicable laws or for fraud prevention purposes.
          </p>

        </div>

                {/* ==========================================================
            FREQUENTLY ASKED QUESTIONS
        =========================================================== */}

        <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">

          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-gray-600">
            Below are some common questions regarding account deletion.
          </p>

          <div className="mt-10 space-y-6">

            {[
              {
                question: "Can I recover my account after deletion?",
                answer:
                  "No. Once your account has been permanently deleted, it cannot be restored.",
              },
              {
                question: "Will my chatbot stop working immediately?",
                answer:
                  "Yes. Once the deletion process is completed, your chatbot and connected services will no longer be available.",
              },
              {
                question: "Should I cancel my subscription first?",
                answer:
                  "Yes. We recommend cancelling any active subscription before requesting account deletion.",
              },
              {
                question: "Can I export my data before deleting?",
                answer:
                  "Absolutely. We strongly recommend downloading any reports, conversations, analytics, and knowledge base documents before submitting your request.",
              },
            ].map((faq) => (

              <div
                key={faq.question}
                className="rounded-2xl border border-gray-200 p-6"
              >

                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {faq.answer}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* ==========================================================
            DANGER ZONE
        =========================================================== */}

        <div className="rounded-3xl border-2 border-red-200 bg-white shadow-sm overflow-hidden">

          {/* Header */}

          <div className="border-b border-red-200 bg-red-50 px-8 py-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>

              <div>

                <h2 className="text-3xl font-bold text-red-700">
                  Danger Zone
                </h2>

                <p className="mt-2 text-gray-600">
                  The actions below are permanent and cannot be reversed.
                </p>

              </div>

            </div>

          </div>

          {/* Delete Card */}

          <div className="p-8">

            <div className="rounded-2xl border border-red-200 bg-red-50 p-8">

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h3 className="text-2xl font-bold text-gray-900">
                    Delete EasyTalk AI Account
                  </h3>

                  <p className="mt-4 max-w-3xl leading-8 text-gray-700">
                    Permanently remove your EasyTalk AI account together
                    with your chatbot configuration, conversations,
                    analytics, uploaded documents, integrations,
                    business information, and associated project data.

                    <br />
                    <br />

                    Once the deletion process has been completed,
                    this action cannot be undone.
                  </p>

                </div>

                <button
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg"
                >
                  <Trash2 className="h-5 w-5" />

                  Delete Account
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================================
            FOOTER NOTE
        =========================================================== */}

        <div className="pb-12 text-center">

          <p className="mx-auto max-w-4xl leading-8 text-gray-500">

            EasyTalk AI is committed to protecting your privacy.
            Account deletion requests are processed securely and in
            accordance with our Privacy Policy, Terms of Service,
            and applicable data protection regulations.

          </p>

        </div>

      </section>
    </main>
  );
}