"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  ShieldQuestion,
  Clock,
  Building2,
  Package,
  Settings,
  LogOut,
  Users,
  MessageCircle,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#031321] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          EasyTalk <span className="text-green-400">AI</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
            active={pathname === "/"}
          />
        </Link>

        <SectionTitle title="CONVERSATIONS" />

        <Link href="/inbox">
          <SidebarItem
            icon={<MessageSquare size={18} />}
            text="Inbox"
            active={pathname === "/inbox"}
          />
        </Link>

        <Link href="/human-handoff">
          <SidebarItem
            icon={<Users size={18} />}
            text="Human Handoff"
            active={pathname === "/human-handoff"}
          />
        </Link>

        <SectionTitle title="AI MANAGEMENT" />

        <Link href="/ai-settings">
          <SidebarItem
            icon={<Bot size={18} />}
            text="AI Settings"
            active={pathname === "/ai-settings"}
          />
        </Link>

        <Link href="/faq-policies">
          <SidebarItem
            icon={<ShieldQuestion size={18} />}
            text="FAQ / Policies"
            active={pathname === "/faq-policies"}
          />
        </Link>

        <Link href="/opening-hours">
          <SidebarItem
            icon={<Clock size={18} />}
            text="Opening Hours"
            active={pathname === "/opening-hours"}
          />
        </Link>

        <SectionTitle title="BUSINESS" />

        <Link href="/business-profile">
          <SidebarItem
            icon={<Building2 size={18} />}
            text="Business Profile"
            active={pathname === "/business-profile"}
          />
        </Link>

        <Link href="/products-services">
          <SidebarItem
            icon={<Package size={18} />}
            text="Products / Services"
            active={pathname === "/products-services"}
          />
        </Link>

        <SectionTitle title="INTEGRATIONS" />

        <Link href="/messenger">
          <SidebarItem
            icon={<MessageCircle size={18} />}
            text="Messenger"
            active={pathname === "/messenger"}
          />
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link href="/settings">
          <SidebarItem
            icon={<Settings size={18} />}
            text="Settings"
            active={pathname === "/settings"}
          />
        </Link>

        <Link href="/logout">
          <SidebarItem
            icon={<LogOut size={18} />}
            text="Logout"
            active={pathname === "/logout"}
          />
        </Link>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
        active
          ? "bg-green-500 text-white shadow-lg"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <p className="text-xs text-slate-500 font-semibold pt-6 pb-2 px-4">
      {title}
    </p>
  );
}