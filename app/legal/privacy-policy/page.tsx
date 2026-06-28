"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PrivacyPolicyPage() {
  const links = ["Terms of Service", "Privacy Policy"];
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight text-black">
            Privacy Policy
          </h1>

          <p className="mt-2 text-gray-500">Last Updated: May 24, 2025</p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside>
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-5">
                {links.map((item) => {
                  const hrefMap: Record<string, string> = {
                    "Terms of Service": "/legal/terms-of-service",
                    "Privacy Policy": "/legal/privacy-policy",
                  };

                  const isActive = pathname === hrefMap[item];

                  return (
                    <Link
                      key={item}
                      href={hrefMap[item]}
                      className={`block rounded-xl px-4 py-3 transition-all ${
                        isActive
                          ? "border-l-2 border-violet-600 bg-violet-50 text-violet-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Content */}
          <main>
            <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
              {/* Top */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-600">
                  Effective Date: May 24, 2025
                </p>

                <button className="text-sm uppercase tracking-widest text-violet-600 hover:underline">
                  Previous Version
                </button>
              </div>

              <div className="mb-10 border-t border-gray-300" />

              {/* Title */}
              <h2 className="mb-8 text-6xl font-black tracking-tight text-black">
                EasyTalk AI Privacy Policy
              </h2>

              {/* Content */}
              <div className="max-w-4xl space-y-10 text-lg leading-9 text-gray-700">
                <section>
                  <p>
                    Welcome to EasyTalk AI, a Messenger Customer Support
                    Automation Platform operated by The Palag Group INC.
                  </p>

                  <p className="mt-6">
                    We respect your privacy and are committed to protecting your
                    personal information. This Privacy Policy explains how we
                    collect, use, process, store, and safeguard information when
                    you interact with our Facebook Messenger chatbot, website,
                    dashboard, and related services.
                  </p>

                  <p className="mt-6">
                    By accessing or using our services, you acknowledge that you
                    have read and understood this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">1. Introduction</h3>

                  <p>
                    EasyTalk AI is an AI-powered customer support platform
                    designed to help businesses automate customer inquiries
                    through Facebook Messenger.
                  </p>

                  <ul className="mt-5 space-y-2">
                    <li>• Automated customer support</li>
                    <li>• AI-generated responses</li>
                    <li>• Product information assistance</li>
                    <li>• FAQ automation</li>
                    <li>• Messenger conversation management</li>
                    <li>• Business inquiry routing</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    2. Information We Collect
                  </h3>

                  <h4 className="mb-3 mt-6 text-xl font-semibold">
                    Messenger Information
                  </h4>

                  <ul className="space-y-2">
                    <li>• Messenger User ID</li>
                    <li>• Public Profile Name</li>
                    <li>• Message Content</li>
                    <li>• Conversation History</li>
                    <li>• Date and Time of Messages</li>
                  </ul>

                  <h4 className="mb-3 mt-8 text-xl font-semibold">
                    Business Inquiry Information
                  </h4>

                  <ul className="space-y-2">
                    <li>• Product inquiries</li>
                    <li>• Service inquiries</li>
                    <li>• Support requests</li>
                    <li>• Business consultation requests</li>
                    <li>• Customer feedback</li>
                  </ul>

                  <h4 className="mb-3 mt-8 text-xl font-semibold">
                    Technical Information
                  </h4>

                  <ul className="space-y-2">
                    <li>• IP Address</li>
                    <li>• Browser Type</li>
                    <li>• Device Information</li>
                    <li>• Operating System</li>
                    <li>• Usage Statistics</li>
                    <li>• System Logs</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    3. How We Use Your Information
                  </h3>

                  <ul className="space-y-3">
                    <li>• Respond to customer inquiries</li>
                    <li>• Provide customer support services</li>
                    <li>• Generate AI-assisted responses</li>
                    <li>• Improve chatbot accuracy and performance</li>
                    <li>• Maintain conversation records</li>
                    <li>• Monitor platform security</li>
                    <li>• Analyze system performance</li>
                    <li>• Enhance user experience</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    4. AI-Powered Response Processing
                  </h3>

                  <p>
                    EasyTalk AI utilizes Artificial Intelligence technologies to
                    generate responses to customer inquiries.
                  </p>

                  <p className="mt-4">
                    Messages may be processed by AI models, relevant business
                    information and FAQs may be referenced, and AI-generated
                    responses are returned through Facebook Messenger.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    5. Data Storage and Security
                  </h3>

                  <p>
                    We implement reasonable administrative, organizational, and
                    technical measures to protect collected information from
                    unauthorized access, disclosure, alteration, misuse, loss,
                    or destruction.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    6. Contact Information
                  </h3>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="font-semibold">The Palag Group INC.</p>

                    <p>
                      Blk 89 Lot 1 Brgy. Santa Lucia, Dasmariñas City, Cavite,
                      Philippines
                    </p>

                    <p className="mt-2">+63 954 194 6225</p>

                    <p>vendoproph@gmail.com</p>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
