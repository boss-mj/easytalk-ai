import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function SidebarMessenger() {
  return (
    <Link
      href="/messenger"
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5">
        <MessageCircle size={16} />
      </div>

      <span className="text-sm font-medium">
        Messenger
      </span>
    </Link>
  );
}