"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TermsOfServicePage() {
  const links = ["Terms of Service", "Privacy Policy"];
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight text-black">
            Terms of Service
          </h1>

          <p className="mt-2 text-gray-500">Last Updated: June 2026</p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside>
            <div className="sticky top-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-2">
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
            <div className="rounded-[32px] border border-gray-200 bg-white p-12 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              {/* Top */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-600">
                  Effective Date: June 2026
                </p>

                <button className="text-sm uppercase tracking-widest text-violet-600 hover:underline">
                  Previous Version
                </button>
              </div>

              <div className="mb-10 border-t border-gray-300" />

              {/* Title */}
              <h2 className="mb-10 text-6xl font-black tracking-tight text-black">
                EasyTalk AI Terms of Service
              </h2>

              {/* Content */}
              <div className="max-w-4xl space-y-12 text-lg leading-9 text-gray-700">
                <section>
                  <p className="italic text-gray-500">
                    EasyTalk AI – Messenger Customer Support Automation Platform
                    <br />
                    Operated by The Palag Group INC.
                    <br />
                    Last Updated: June 2026
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    1. Acceptance of Terms
                  </h3>

                  <p>
                    Welcome to EasyTalk AI, a Messenger Customer Support
                    Automation Platform operated by The Palag Group INC.
                  </p>

                  <p className="mt-4">
                    By accessing, using, or interacting with our website,
                    dashboard, Facebook Messenger chatbot, and related services,
                    you agree to comply with and be bound by these Terms and
                    Conditions.
                  </p>

                  <p className="mt-4">
                    If you do not agree with any provision of these Terms, you
                    should discontinue use of the service immediately.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    2. About the Service
                  </h3>

                  <p>
                    EasyTalk AI is an AI-powered customer support automation
                    platform designed to assist businesses in managing customer
                    inquiries through Facebook Messenger.
                  </p>

                  <ul className="mt-5 list-disc space-y-2 pl-6">
                    <li>Automated customer support</li>
                    <li>Product and service information</li>
                    <li>Frequently Asked Questions (FAQ) assistance</li>
                    <li>Business information and contact details</li>
                    <li>Messenger conversation management</li>
                    <li>AI-generated responses</li>
                    <li>Customer inquiry routing to human representatives</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    3. AI-Generated Responses
                  </h3>

                  <p>
                    EasyTalk AI utilizes Artificial Intelligence (AI)
                    technologies to generate automated responses.
                  </p>

                  <ul className="mt-5 list-disc space-y-2 pl-6">
                    <li>AI-generated responses may contain inaccuracies.</li>
                    <li>Responses may be incomplete or outdated.</li>
                    <li>
                      AI responses should not be considered official business
                      commitments.
                    </li>
                    <li>
                      Important business decisions should be confirmed directly
                      with company representatives.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    4. Customer Support Escalation
                  </h3>

                  <p>
                    In certain situations, the chatbot may direct users to
                    contact company representatives through official
                    communication channels.
                  </p>

                  <ul className="mt-5 list-disc space-y-2 pl-6">
                    <li>Human assistance is required.</li>
                    <li>
                      Technical concerns cannot be resolved automatically.
                    </li>
                    <li>Product consultation is needed.</li>
                    <li>The AI system cannot confidently answer an inquiry.</li>
                  </ul>

                  <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="font-semibold">The Palag Group INC.</p>

                    <p>Contact Number: +63 954 194 6225</p>

                    <p>Email Address: vendoproph@gmail.com</p>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    5. User Responsibilities
                  </h3>

                  <p>By using the service, you agree to:</p>

                  <ul className="mt-4 list-disc space-y-2 pl-6">
                    <li>Provide truthful and accurate information.</li>
                    <li>Use the platform only for lawful purposes.</li>
                    <li>Respect applicable laws and regulations.</li>
                    <li>
                      Refrain from abusing, disrupting, or interfering with
                      platform operations.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    6. Service Availability
                  </h3>

                  <p>
                    We strive to maintain continuous availability of the
                    platform; however, we do not guarantee uninterrupted access.
                  </p>

                  <ul className="mt-4 list-disc space-y-2 pl-6">
                    <li>System maintenance</li>
                    <li>Software updates</li>
                    <li>Infrastructure upgrades</li>
                    <li>Technical issues</li>
                    <li>Internet disruptions</li>
                    <li>Third-party service outages</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    7. Third-Party Services
                  </h3>

                  <ul className="list-disc space-y-2 pl-6">
                    <li>Facebook Messenger</li>
                    <li>Meta Platforms Services</li>
                    <li>Cloud Hosting Providers</li>
                    <li>Database Services</li>
                    <li>Artificial Intelligence Providers</li>
                    <li>Analytics Providers</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    8. Intellectual Property Rights
                  </h3>

                  <p>
                    All rights, title, and interest in the platform, including
                    software, source code, branding, logos, documentation, and
                    AI configurations remain the exclusive property of The Palag
                    Group INC.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    9. Limitation of Liability
                  </h3>

                  <p>
                    To the maximum extent permitted by law, The Palag Group INC.
                    shall not be liable for direct, indirect, incidental, or
                    consequential damages arising from the use of the platform.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    10. Disclaimer of Warranties
                  </h3>

                  <p>
                    The platform is provided on an "AS IS" and "AS AVAILABLE"
                    basis.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">11. Privacy</h3>

                  <p>
                    Your use of EasyTalk AI is also governed by our Privacy
                    Policy.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    12. Modifications to the Service
                  </h3>

                  <p>
                    We reserve the right to modify platform features, suspend
                    services, and improve AI performance without prior notice.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    13. Changes to These Terms
                  </h3>

                  <p>We may update these Terms and Conditions at any time.</p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">14. Governing Law</h3>

                  <p>
                    These Terms and Conditions shall be governed by the laws of
                    the Republic of the Philippines.
                  </p>
                </section>

                <section>
                  <h3 className="mb-4 text-3xl font-bold">
                    15. Contact Information
                  </h3>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="font-semibold">The Palag Group INC.</p>

                    <p>
                      Address: Blk 89 Lot 1 Brgy. Santa Lucia, Dasmariñas City,
                      Cavite, Philippines
                    </p>

                    <p>Contact Number: +63 954 194 6225</p>

                    <p>Email Address: vendoproph@gmail.com</p>
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
