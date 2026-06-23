"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  ShieldQuestion,
  Building2,
  Package,
  MessageCircle,
  Settings,
  Bot
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-64 shrink-0 bg-[#031321] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          EasyTalk <span className="text-green-400">AI</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem
          href="/dashboard"
          icon={<LayoutDashboard size={18} />}
          text="Dashboard"
          active={isActive("/dashboard")}
        />

        <SectionTitle title="CONVERSATIONS" />

        <SidebarItem
          href="/dashboard/conversations"
          icon={<MessageSquare size={18} />}
          text="Conversations"
          active={isActive("/dashboard/conversations")}
        />

        <SectionTitle title="AI MANAGEMENT" />

        <SidebarItem
          href="/dashboard/ai-settings"
          icon={<Bot size={18} />}
          text="AI Settings"
          active={isActive("/dashboard/ai-settings")}
        />

        <SidebarItem
          href="/dashboard/faqs"
          icon={<ShieldQuestion size={18} />}
          text="FAQs / Policies"
          active={isActive("/dashboard/faqs")}
        />

        <SectionTitle title="BUSINESS" />

        <SidebarItem
          href="/dashboard/business"
          icon={<Building2 size={18} />}
          text="Business Profile"
          active={isActive("/dashboard/business")}
        />

        <SidebarItem
          href="/dashboard/products"
          icon={<Package size={18} />}
          text="Products / Services"
          active={isActive("/dashboard/products")}
        />

        <SectionTitle title="INTEGRATIONS" />

        <SidebarItem
          href="/debug"
          icon={<MessageCircle size={18} />}
          text="Webhook Debugger"
          active={isActive("/debug")}
        />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <SidebarItem
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          text="Settings"
          active={isActive("/dashboard/settings")}
        />
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  icon,
  text,
  active = false,
}: {
  href: string;
  icon: ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${active
          ? "bg-green-500 text-white shadow-lg"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="text-xs text-slate-500 font-semibold pt-6 pb-2 px-4">
      {title}
    </p>
  );
}