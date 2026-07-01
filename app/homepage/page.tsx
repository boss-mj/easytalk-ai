import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Paperclip,
  PieChart,
  Play,
  PlugZap,
  Rocket,
  Send,
  Settings,
  Smile,
  Star,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

const stats = [
  {
    icon: MessageCircle,
    value: "0",
    title: "Conversations Automated",
    description: "Save time and boost efficiency",
  },
  { 
    icon: Users,
    value: "0",
    title: "Happy Businesses",
    description: "Trusted by businesses worldwide",
  },
  {
    icon: TrendingUp,
    value: "0",
    title: "Satisfaction Rate",
    description: "AI-powered customer satisfaction",
  },
  {
    icon: Clock3,
    value: "24/7",
    title: "Always On Support",
    description: "Never miss a customer",
  },
];

const features = [
  {
    icon: Bot,
    title: "AI Auto Reply",
    description:
      "Instant, smart, and accurate responses to customer inquiries.",
  },
  {
    icon: BookOpen,
    title: "FAQ & Knowledge Base",
    description:
      "Train your AI with FAQs and business info to give better answers.",
  },
  {
    icon: Target,
    title: "Lead Generation",
    description:
      "Capture leads, collect customer details, and grow your customer base.",
  },
  {
    icon: PieChart,
    title: "Analytics & Insights",
    description:
      "Track conversations, measure performance, and make data-driven decisions.",
  },
  {
    icon: CheckCircle2,
    title: "24/7 Availability",
    description:
      "Your AI assistant is always on, ready to help customers anytime.",
  },
  {
    icon: PlugZap,
    title: "Easy Integrations",
    description:
      "Seamlessly connect with Messenger, CRM, and other tools.",
  },
];

const steps = [
  {
    icon: MessageCircle,
    title: "1. Connect Your Page",
    description: "Connect your Facebook Page in just a few clicks.",
  },
  {
    icon: Bot,
    title: "2. Train Your AI",
    description: "Add your FAQs, products, and business information.",
  },
  {
    icon: TrendingUp,
    title: "3. Automate & Grow",
    description: "Let AI handle conversations while you focus on business.",
  },
];

const testimonials = [
  {
    name: "Maria D.",
    role: "Online Store Owner",
    text: "EasyTalk AI has helped us automate 80% of our customer inquiries!",
  },
  {
    name: "John R.",
    role: "Restaurant Owner",
    text: "Our response time improved and customers are happier than ever.",
  },
  {
    name: "Anna L.",
    role: "E-commerce Manager",
    text: "The best AI assistant for Messenger. Highly recommended!",
  },
];

const productServices = [
  {
    name: "Facebook",
    description: "Automate Facebook Page messages.",
    badge: "F",
  },
  {
    name: "WhatsApp",
    description: "Support customers through WhatsApp.",
    badge: "W",
  },
  {
    name: "Instagram",
    description: "Manage Instagram inquiries with AI.",
    badge: "I",
  },
  {
    name: "Telegram",
    description: "Automate Telegram conversations.",
    badge: "T",
  },
  {
    name: "TikTok",
    description: "Handle TikTok customer messages.",
    badge: "T",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6fff8] text-slate-950">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(34,197,94,0.20),transparent_34%),radial-gradient(circle_at_0%_32%,rgba(187,247,208,0.38),transparent_25%),linear-gradient(180deg,#fbfffc_0%,#f6fff8_42%,#ffffff_100%)]" />
        <div className="absolute -right-48 top-72 h-[560px] w-[760px] rounded-[50%] bg-gradient-to-br from-[#059669] via-[#22c55e] to-[#bbf7d0] opacity-80 blur-[1px]" />
        <div className="absolute right-32 top-64 h-72 w-72 rounded-full bg-white/35" />
        <div className="absolute left-6 top-28 grid grid-cols-4 gap-3 opacity-30">
          {Array.from({ length: 20 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-green-400" />
          ))}
        </div>
        <div className="absolute right-12 top-24 grid grid-cols-4 gap-3 opacity-30">
          {Array.from({ length: 20 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-green-400" />
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <header className="mx-auto flex w-[92%] max-w-7xl items-center justify-between rounded-[28px] border border-white/80 bg-white/85 px-7 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl mt-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#16a34a] text-white shadow-[0_12px_28px_rgba(22,163,74,0.35)]">
            <Bot className="h-7 w-7" />
          </div>

          <span className="text-2xl font-black tracking-tight">
            EasyTalk <span className="text-green-600">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-bold text-slate-700 lg:flex">
          <div className="relative group/product">
  <button
    type="button"
    className="flex items-center gap-1 transition hover:text-green-600"
  >
    Product
    <ChevronDown className="h-4 w-4 transition group-hover/product:rotate-180" />
  </button>

  <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[340px] -translate-x-1/2 rounded-3xl border border-green-100 bg-white p-3 opacity-0 shadow-[0_24px_70px_rgba(15,23,42,0.16)] transition-all duration-200 group-hover/product:visible group-hover/product:translate-y-0 group-hover/product:opacity-100">
    <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-green-100 bg-white" />

    <div className="relative">
      <p className="px-3 pb-2 pt-1 text-xs font-black uppercase tracking-[0.18em] text-green-600">
        Our Services
      </p>

      <div className="space-y-1">
        {productServices.map((service) => (
          <Link
            key={service.name}
            href="#features"
            className="flex items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-green-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#059669] to-[#22c55e] text-sm font-black text-white shadow-[0_10px_22px_rgba(22,163,74,0.25)]">
              {service.badge}
            </span>

            <span>
              <span className="block text-sm font-black text-slate-900">
                {service.name}
              </span>
              <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">
                {service.description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  </div>
</div>
          <Link href="#" className="flex items-center gap-1 hover:text-green-600">
            Solutions <ChevronDown className="h-4 w-4" />
          </Link>
          <Link href="#" className="hover:text-green-600">
            Agencies
          </Link>
          <Link href="#" className="hover:text-green-600">
            Pricing
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-green-600">
            Resources <ChevronDown className="h-4 w-4" />
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-black text-slate-800 hover:text-green-600 sm:block"
          >
            Log In
          </Link>

          <Link
            href="/create-account"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#059669] to-[#22c55e] px-6 py-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(22,163,74,0.35)] transition hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-14 pt-16 lg:grid-cols-2 lg:pb-10 lg:pt-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-black text-green-700 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_0_6px_rgba(34,197,94,0.14)]" />
            AI-Powered Customer Support
          </div>

          <h1 className="max-w-2xl text-[52px] font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-[68px] lg:text-[76px]">
            Automate
            <br />
            Customer Support
            <br />
            with <span className="text-green-600">AI</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Answer customer questions, automate support, capture leads, and
            manage Messenger conversations 24/7.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/create-account"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#059669] to-[#22c55e] px-8 text-base font-black text-white shadow-[0_16px_34px_rgba(22,163,74,0.35)] transition hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="#demo"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 text-base font-black text-green-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-green-50"
            >
              Watch Demo
              <Play className="h-4 w-4 fill-green-600 text-green-600" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Easy setup
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* CHAT PREVIEW */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-green-300/30 blur-2xl" />

          <div className="relative w-full max-w-[530px] overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#059669] to-[#22c55e] text-white">
                  <Bot className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black">EasyTalk AI</h3>
                  <p className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Online
                  </p>
                </div>
              </div>

              <MoreVertical className="h-6 w-6 text-slate-500" />
            </div>

            <div className="space-y-6 px-6 py-7">
              <div className="flex justify-end">
                <div className="rounded-2xl bg-green-100 px-5 py-3 text-sm font-semibold">
                  Magkano po delivery fee?
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[270px] rounded-2xl bg-slate-100 px-5 py-4 text-sm font-semibold leading-6">
                  Delivery fee starts at ₱50 depending on your location.
                </div>
              </div>

              <div className="flex justify-end">
                <div className="rounded-2xl bg-green-100 px-5 py-3 text-sm font-semibold">
                  May available stock pa?
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[270px] rounded-2xl bg-slate-100 px-5 py-4 text-sm font-semibold leading-6">
                  Yes! We currently have available inventory.
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-5">
              <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                />
                <Smile className="h-5 w-5 text-slate-500" />
                <Paperclip className="h-5 w-5 text-slate-500" />
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] text-white shadow-lg">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#059669] to-[#22c55e] text-white">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="text-3xl font-black">{item.value}</h3>
              <p className="mt-2 text-sm font-black">{item.title}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-600">
            Features
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Everything you need to automate support
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            Powerful features designed to help your business grow
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD OVERVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid overflow-hidden rounded-[32px] border border-green-100 bg-gradient-to-br from-green-50 to-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] lg:grid-cols-[0.75fr_1.5fr]">
          <div className="p-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-600">
              Dashboard Overview
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-tight">
              Manage everything in one place
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              Monitor conversations, track performance, and manage your
              business with our intuitive dashboard.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#22c55e] px-6 text-sm font-black text-white shadow-lg"
            >
              Explore Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-6">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
              <div className="grid min-h-[330px] grid-cols-[180px_1fr]">
                <aside className="border-r border-slate-100 bg-slate-50 p-5">
                  <div className="mb-6 flex items-center gap-2 text-sm font-black">
                    <Bot className="h-5 w-5 text-green-600" />
                    EasyTalk AI
                  </div>

                  {[
                    ["Dashboard", LayoutDashboard],
                    ["Inbox", MessageSquare],
                    ["Humanhandoff", UserRound],
                    ["AI Setting", Megaphone],
                    ["FAQ/Policies", BarChart3],
                    ["Opening Hours", HelpCircle],
                    ["Setting", Settings],
                  ].map(([label, Icon], index) => {
                    const MenuIcon = Icon as typeof LayoutDashboard;

                    return (
                      <div
                        key={label as string}
                        className={`mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold ${
                          index === 0
                            ? "bg-green-600 text-white"
                            : "text-slate-600"
                        }`}
                      >
                        <MenuIcon className="h-4 w-4" />
                        {label as string}
                      </div>
                    );
                  })}
                </aside>

                <div className="p-5">
                  <div className="grid gap-4 sm:grid-cols-4">
                    {[
                      ["Total Conversations", "0", "0%"],
                      ["Active Leads", "0", "0%"],
                      ["Response Rate", "0%", "0%"],
                      ["Avg. Response Time", "0", "0%"],
                    ].map(([label, value, growth]) => (
                      <div key={label} className="rounded-2xl border border-slate-100 p-4">
                        <p className="text-xs font-bold text-slate-500">
                          {label}
                        </p>
                        <p className="mt-2 text-xl font-black">{value}</p>
                        <p className="mt-1 text-xs font-black text-green-600">
                          {growth}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_220px]">
                    <div className="rounded-2xl border border-slate-100 p-5">
                      <p className="mb-5 text-sm font-black">
                        Conversations Over Time
                      </p>
                      <div className="flex h-32 items-end gap-3">
                        {[35, 55, 45, 62, 50, 78, 60, 92].map((height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-xl bg-gradient-to-t from-green-600 to-green-200"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-5">
                      <p className="mb-5 text-sm font-black">Top Sources</p>
                      <div className="mx-auto h-28 w-28 rounded-full border-[18px] border-green-600 border-r-yellow-400 border-b-blue-500" />
                      <div className="mt-5 space-y-2 text-xs font-bold text-slate-600">
                        <p>Messenger 0%</p>
                        <p>Instagram 0%</p>
                        <p>Website 0%</p>
                        <p>Others 0%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-600">
            How It Works
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Get started in 3 simple steps
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 p-3">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] text-white shadow-lg">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>

                <h3 className="mt-5 font-black">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      
      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 rounded-[32px] bg-gradient-to-r from-[#052e1b] via-[#047857] to-[#22c55e] p-10 text-white shadow-[0_25px_70px_rgba(22,163,74,0.32)] lg:flex-row">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Rocket className="h-10 w-10" />
            </div>

            <div>
              <h2 className="text-3xl font-black">
                Ready to automate your customer support?
              </h2>
              <p className="mt-2 text-green-50">
                Join thousands of businesses using EasyTalk AI to grow and
                delight customers.
              </p>
            </div>
          </div>

          <Link
            href="/create-account"
            className="inline-flex h-14 items-center gap-3 rounded-2xl bg-white px-8 text-base font-black text-green-700 shadow-xl"
          >
            Get Started for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

    {/* FOOTER */}
<footer className="mt-10 bg-[#052e1b] text-white">
  <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
    <div className="md:col-span-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
          <Bot className="h-6 w-6" />
        </div>

        <span className="text-xl font-black">
          EasyTalk <span className="text-green-400">AI</span>
        </span>
      </div>

      <p className="mt-4 max-w-sm text-sm leading-7 text-green-50/80">
        AI-powered Messenger automation that helps businesses engage, support,
        and grow 24/7.
      </p>
    </div>

    <div>
      <h3 className="font-black">Legal</h3>

      <div className="mt-4 space-y-3 text-sm text-green-50/80">
        <Link
          href="/legal/privacy-policy"
          className="block transition hover:text-white"
        >
          Privacy Policy
        </Link>

        <Link
          href="/legal/terms-of-service"
          className="block transition hover:text-white"
        >
          Terms of Service
        </Link>
      </div>
    </div>

    <div>
      <h3 className="font-black">Newsletter</h3>

      <p className="mt-4 text-sm leading-6 text-green-50/80">
        Get updates and tips on how to grow your business with AI.
      </p>

      <div className="mt-4 flex overflow-hidden rounded-xl border border-white/20">
        <input
          type="email"
          placeholder="Enter your email"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-green-50/50"
        />

        <button className="bg-green-500 px-4 text-sm font-black">
          Subscribe
        </button>
      </div>
    </div>
  </div>

  <div className="border-t border-white/10 py-5">
    <div className="mx-auto max-w-7xl px-6 text-center text-sm text-green-50/60">
      © 2026 EasyTalk AI. All rights reserved.
    </div>
  </div>
</footer>
</main>
  );
}