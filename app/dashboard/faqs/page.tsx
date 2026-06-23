"use client";

import { Pencil, Trash2, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What are your business hours?",
    answer:
      "We are open from 8:00 AM to 6:00 PM, Monday to Sunday.",
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Yes, we offer delivery within selected areas. Please message us for more details.",
  },
  {
    question: "How can I pay?",
    answer:
      "We accept cash, GCash, bank transfer, and credit/debit cards.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return your item within 7 days if it is damaged or defective.",
  },
];

export default function FAQManagementCard() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          FAQ / Policies Management
        </h2>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 hover:shadow-sm transition"
          >
            <div className="flex justify-between gap-4">
              {/* Content */}
              <div className="flex gap-3">
                <HelpCircle
                  size={18}
                  className="text-gray-400 mt-1"
                />

                <div>
                  <h3 className="font-medium text-gray-900">
                    {faq.question}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="text-gray-500 hover:text-blue-600">
                  <Pencil size={18} />
                </button>

                <button className="text-red-400 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-sm text-gray-500">
        Showing 1 to {faqs.length} of {faqs.length} FAQs
      </div>
    </div>
  );
}