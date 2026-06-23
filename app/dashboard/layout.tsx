import type { ReactNode } from "react";
import Sidebar from "../components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}