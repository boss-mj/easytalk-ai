import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Clock3,
  MessageSquare,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "AI Responses",
      description: "Automatically answer customer questions with AI.",
      image: "/images/ai_respond.png",
    },
    {
      title: "Human Handoff",
      description: "Seamlessly transfer conversations to human agents.",
      image: "/images/humanhandoff.png",
    },
    {
      title: "Messenger",
      description: "Native Facebook Messenger integration.",
      image: "/images/messenger.png",
    },
    {
      title: "Analytics",
      description: "Track conversations and performance in real-time.",
      image: "/images/analytics.png",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFF]">
      {/* PREMIUM HERO BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#F7FCF8]" />

        {/* Top Right Green Glow */}
        <div className="absolute -right-32 -top-24 h-[700px] w-[700px] rounded-full bg-green-300/25 blur-[140px]" />

        {/* Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-200/20 blur-[140px]" />

        {/* Bottom Right Dark Green */}
        <div className="absolute -right-40 bottom-[-250px] h-[700px] w-[700px] rounded-full bg-emerald-700/90 blur-none" />

        {/* Bottom Right Soft Overlay */}
        <div className="absolute -right-10 bottom-0 h-[450px] w-[450px] rounded-full bg-green-500/20 blur-[100px]" />

        {/* Bottom Left Glow */}
        <div className="absolute -left-40 bottom-[-180px] h-[500px] w-[500px] rounded-full bg-lime-200/20 blur-[120px]" />

        {/* Large Soft Blob */}
        <div className="absolute left-[30%] bottom-[-250px] h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-green-300/20 to-transparent blur-[70px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white">
              <Bot size={22} />
            </div>

            <span className="text-2xl font-black text-slate-900">
              EasyTalk AI
            </span>
          </div>

          <nav className="hidden items-center gap-10 text-sm font-medium text-slate-700 lg:flex">
            <div className="group relative">
              <button>Product</button>

              <div className="absolute left-0 top-8 hidden w-[340px] rounded-3xl border bg-white p-6 shadow-2xl group-hover:block">
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold">Instagram</h4>
                    <p className="text-sm text-slate-500">
                      Automate your Instagram Marketing
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold">WhatsApp</h4>
                    <p className="text-sm text-slate-500">
                      Connect with your Customers Instantly
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold">Messenger</h4>
                    <p className="text-sm text-slate-500">
                      Facebook Messenger chatbot #1
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold">TikTok</h4>
                    <p className="text-sm text-slate-500">
                      Turn TikTok Views into Profits with Automation
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold">EasyTalk AI</h4>
                    <p className="text-sm text-slate-500">
                      A Smarter Way to Chat Automation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <button>Solutions</button>

              <div className="absolute left-0 top-8 hidden w-[380px] rounded-3xl border bg-white p-6 shadow-2xl group-hover:block">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="mb-3 font-bold">by Business Type</h4>

                    <ul className="space-y-2 text-slate-500">
                      <li>for Creators</li>
                      <li>for eCommerce</li>
                      <li>for SM Marketers</li>
                      <li>for Agencies</li>
                      <li>for Brands</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 font-bold">by Use Case</h4>

                    <ul className="space-y-2 text-slate-500">
                      <li>Collect Emails</li>
                      <li>Request to Follow</li>
                      <li>Respond to Comments</li>
                      <li>Follow to DM</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <button>Agencies</button>

              <div className="absolute left-0 top-8 hidden w-[320px] rounded-3xl border bg-white p-6 shadow-2xl group-hover:block">
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold">Hire an Agency</h4>

                    <p className="text-sm text-slate-500">
                      Get help from chat marketing experts
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold">Join the Affiliate Program</h4>

                    <p className="text-sm text-slate-500">
                      Earn up to 50% recurring commission
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/pricing">Pricing</Link>

            <Link href="/resources">Resources</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="font-medium text-slate-700">
              Log In
            </Link>

            <Link
              href="/register"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F8FCF8]">
        {/* Hero Background */}

        <div className="absolute inset-0">
          {/* Top Right Glow */}
          <div
            className="
      absolute
      right-[-250px]
      top-[-180px]
      h-[900px]
      w-[900px]
      rounded-full
      bg-green-300/30
      blur-[120px]
    "
          />

          {/* Bottom Right Dark Shape */}
          <div
            className="
      absolute
      -right-[250px]
      bottom-[-350px]
      h-[900px]
      w-[900px]
      rounded-full
      bg-emerald-900
    "
          />

          {/* Green Overlay */}
          <div
            className="
      absolute
      -right-[120px]
      bottom-[-120px]
      h-[700px]
      w-[700px]
      rounded-full
      bg-green-500/20
      blur-[120px]
    "
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow">
                AI Messenger Automation
              </span>

              <h1 className="mt-8 text-6xl font-black leading-none text-slate-900 lg:text-7xl">
                Automate
                <br />
                Customer Support
                <br />
                with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-xl leading-relaxed text-slate-500">
                Answer customer questions, automate support, capture leads, and
                manage Messenger conversations 24/7.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/demo"
                  className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700"
                >
                  Watch Demo
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-500 text-black">
                <span>✓ No credit card required</span>
                <span>✓ Easy setup</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>

<<<<<<< HEAD
            {/* CHAT */}
=======
            {/* CHAT DEMO */}
>>>>>>> 35d419064729ad00302cc3093f6473bbef34be1a
            <div className="relative">
              <div className="rounded-[40px] border border-white/50 bg-white/80 p-8 shadow-[0_20px_80px_rgba(99,102,241,0.15)] backdrop-blur-xl">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                      <Bot />
                    </div>

                    <div>
                      <h3 className="font-bold text-black">EasyTalk AI</h3>

                      <p className="text-sm text-green-500">● Online</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="ml-auto max-w-[250px] rounded-2xl bg-slate-100 px-5 py-4 text-black">
                    Magkano po delivery fee?
                  </div>

                  <div className="max-w-[260px] rounded-2xl bg-slate-100 px-5 py-4 text-black">
                    Delivery fee starts at ₱50 depending on your location.
                  </div>

                  <div className="ml-auto max-w-[250px] rounded-2xl bg-slate-100 px-5 py-4 text-black">
                    May available stock pa?
                  </div>

                  <div className="max-w-[260px] rounded-2xl bg-slate-100 px-5 py-4 text-black">
                    Yes! We currently have available inventory.
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 px-5 py-4 text-black">
<<<<<<< HEAD
                  Type a message....
=======
                  Type a message...
>>>>>>> 35d419064729ad00302cc3093f6473bbef34be1a
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/90 shadow-[0_20px_80px_rgba(99,102,241,0.12)] backdrop-blur-xl">
            <div className="grid md:grid-cols-4">
              {[
                {
                  value: "24/7",
                  label: "Customer Support",
                  image: "/images/clock.png",
                },
                {
                  value: "98%",
                  label: "Response Accuracy",
                  image: "/images/responseaccuracy.png",
                },
                {
                  value: "1000+",
                  label: "Conversations",
                  image: "/images/chat.png",
                },
                {
                  value: "24hrs",
                  label: "Automated Replies",
                  image: "/images/automatedreplies.png",
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center justify-center py-12 text-center ${
                    index !== 3 ? "border-r border-slate-100" : ""
                  }`}
                >
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="text-6xl font-black text-slate-900">
                    {item.value}
                  </h3>

                  <p className="mt-3 text-xl text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="rounded-full bg-indigo-100 px-5 py-2 text-sm font-bold text-indigo-600">
              FEATURES
            </span>

            <h2 className="mt-8 text-6xl font-black text-slate-900">
              Everything You Need
            </h2>

            <p className="mt-5 text-xl text-slate-500">
              Manage your AI customer support from one dashboard.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* AI */}
            <div className="rounded-[36px] border border-white bg-white p-10 shadow-[0_15px_60px_rgba(99,102,241,0.08)]">
              <div className="mb-8 flex h-30 w-50 items-center justify-center">
                <Image
                  src="/images/ai_respond.png"
                  alt="AI Responses"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <h3 className="text-4xl font-black text-slate-900">
                AI Responses
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-500">
                Automatically answer customer questions with AI.
              </p>
            </div>

            {/* HUMAN */}
            <div className="rounded-[36px] border border-white bg-white p-10 shadow-[0_15px_60px_rgba(16,185,129,0.08)]">
              <div className="mb-8 flex h-30 w-50 items-center justify-center">
                <Image
                  src="/images/humanhandoff.png"
                  alt="Human Handoff"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <h3 className="text-4xl font-black text-slate-900">
                Human Handoff
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-500">
                Seamlessly transfer conversations to human agents.
              </p>
            </div>

            {/* MESSENGER */}
            <div className="rounded-[36px] border border-white bg-white p-10 shadow-[0_15px_60px_rgba(59,130,246,0.08)]">
              <div className="mb-8 flex h-30 w-50 items-center justify-center">
                <Image
                  src="/images/messenger.png"
                  alt="Messenger"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <h3 className="text-4xl font-black text-slate-900">Messenger</h3>

              <p className="mt-6 text-lg leading-8 text-slate-500">
                Native Facebook Messenger integration.
              </p>
            </div>

            {/* ANALYTICS */}
            <div className="rounded-[36px] border border-white bg-white p-10 shadow-[0_15px_60px_rgba(236,72,153,0.08)]">
              <div className="mb-8 flex h-30 w-50 items-center justify-center">
                <Image
                  src="/images/analytics.png"
                  alt="Analytics"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <h3 className="text-4xl font-black text-slate-900">Analytics</h3>

              <p className="mt-6 text-lg leading-8 text-slate-500">
                Track conversations and performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[40px] border border-white bg-white shadow-[0_20px_80px_rgba(99,102,241,0.15)]">
            <div className="grid lg:grid-cols-[380px_1fr]">
              {/* LEFT */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-violet-50 p-12">
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
                  DASHBOARD
                </span>

                <h2 className="mt-6 text-5xl font-black text-slate-900">
                  Manage Everything
                  <br />
                  From One Dashboard
                </h2>

                <p className="mt-6 text-lg leading-relaxed text-slate-500">
                  View conversations, manage FAQs, monitor analytics, and
                  configure AI settings.
                </p>

                <Link
                  href="/login"
                  className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-bold text-white"
                >
                  View Dashboard
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* RIGHT */}
              <div className="p-10">
                {/* TOP CARDS */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-100 p-5">
                    <p className="text-sm text-slate-500">
                      Total Conversations
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-black">
                      1,254
                    </h3>

                    <span className="text-green-500">+12%</span>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-5">
                    <p className="text-sm text-slate-500">AI Responses</p>

                    <h3 className="mt-2 text-3xl font-black text-black">98%</h3>

                    <span className="text-green-500">+8%</span>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-5">
                    <p className="text-sm text-slate-500">Human Handoff</p>

                    <h3 className="mt-2 text-3xl font-black text-black">124</h3>

                    <span className="text-green-500">+5%</span>
                  </div>

                  <div className="rounded-2xl border border-slate-100 p-5">
                    <p className="text-sm text-slate-500">Active Users</p>

                    <h3 className="mt-2 text-3xl font-black text-black">532</h3>

                    <span className="text-green-500">+13%</span>
                  </div>
                </div>

                {/* CHART */}
                <div className="mt-6 rounded-3xl border border-slate-100 p-8">
                  <h3 className="mb-8 text-xl font-bold">
                    Conversation Overview
                  </h3>

                  <div className="flex h-64 items-end gap-4">
                    <div className="h-20 w-full rounded-t-xl bg-blue-200"></div>
                    <div className="h-32 w-full rounded-t-xl bg-blue-300"></div>
                    <div className="h-24 w-full rounded-t-xl bg-blue-200"></div>
                    <div className="h-44 w-full rounded-t-xl bg-blue-400"></div>
                    <div className="h-36 w-full rounded-t-xl bg-blue-300"></div>
                    <div className="h-56 w-full rounded-t-xl bg-blue-500"></div>
                    <div className="h-40 w-full rounded-t-xl bg-blue-400"></div>
                  </div>

                  <div className="mt-4 flex justify-between text-sm text-slate-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
              HOW IT WORKS
            </span>

            <h2 className="mt-6 text-5xl font-black text-slate-900">
              How EasyTalk AI Works
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {[
              {
                title: "Connect Facebook Page",
                desc: "Connect your Facebook Page in a few clicks.",
                image: "/images/facebook.png",
              },
              {
                title: "Upload FAQs",
                desc: "Upload FAQs and business information.",
                image: "/images/faq.png",
              },
              {
                title: "Train AI",
                desc: "AI learns from your content and FAQs.",
                image: "/images/ai_brain.png",
              },
              {
                title: "Customer Chats",
                desc: "Customers send messages anytime.",
                image: "/images/chat.png",
              },
              {
                title: "AI Responds",
                desc: "AI automatically answers inquiries.",
                image: "/images/ai_respond.png",
              },
              {
                title: "Human Handoff",
                desc: "Transfer complex issues to agents.",
                image: "/images/humanhandoff.png",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-[28px] border border-white bg-white p-6 text-center shadow-lg"
              >
                <div className="mb-6 flex justify-center">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>

                <h3 className="font-bold text-slate-900">{step.title}</h3>

                <p className="mt-3 text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-12 text-white">
            <div className="grid items-center gap-10 lg:grid-cols-3">
              {/* ROBOT */}
              <div className="flex justify-center">
                <Image
                  src="/images/robot.png"
                  alt="Robot"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              {/* TEXT */}
              <div className="lg:col-span-2">
                <h2 className="text-5xl font-black">
                  Ready to Automate
                  <br />
                  Your Customer Support?
                </h2>

                <p className="mt-6 text-xl text-blue-100">
                  Join thousands of businesses using EasyTalk AI to provide
                  instant customer support 24/7.
                </p>

                <Link
                  href="/register"
                  className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-blue-600"
                >
                  Get Started Now
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-[#0F172A] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            {/* BRAND */}
            <div>
              <h3 className="text-3xl font-black">EasyTalk AI</h3>

              <p className="mt-4 text-slate-400">
                AI-powered Messenger automation platform for modern businesses.
              </p>
            </div>

            {/* PRODUCT */}
            <div>
              <h4 className="mb-6 text-lg font-bold">Product</h4>

              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link href="#features">Features</Link>
                </li>

                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>

                <li>
                  <Link href="#how">How It Works</Link>
                </li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h4 className="mb-6 text-lg font-bold">Resources</h4>

              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link href="/documentation">Documentation</Link>
                </li>

                <li>
                  <Link href="/help-center">Help Center</Link>
                </li>

                <li>
                  <Link href="/blog">Blog</Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="mb-6 text-lg font-bold">Company</h4>

              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link href="/about">About Us</Link>
                </li>

                <li>
                  <Link href="/contact">Contact</Link>
                </li>

                <li>
                  <Link
                    href="/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>{" "}
                </li>

                <li>
                  <Link
                    href="/legal/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>{" "}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-slate-800 pt-8 text-center text-slate-500">
            © 2026 EasyTalk AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
