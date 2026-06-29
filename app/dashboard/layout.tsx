import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "../components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * Not logged in.
   */
  if (!user) {
    redirect("/login");
  }

  /**
   * Check if this logged-in user already owns a business.
   */
  const { data: business, error } = await supabaseAdmin
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Dashboard business check error:", error);
  }

  /**
   * Logged in, but no business yet.
   *
   * Send them to setup page.
   */
  if (!business) {
    redirect("/setup");
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}