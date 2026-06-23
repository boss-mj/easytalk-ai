import StatsCard from "@/app/components/dashboard/statscard";
import MessengerCard from "@/app/components/dashboard/messengercard";
import ConversationChart from "@/app/components/dashboard/conversationchart";
import RecentConversation from "@/app/components/dashboard/recentconversation";
import TopFaq from "@/app/components/dashboard/topfaq";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="relative z-10 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-slate-400">
            Monitor Messenger conversations, AI replies, and customer activity.
          </p>
        </div>

        {/* Stats */}
        <section className="grid gap-4 text-black sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Conversations" value="1,248" change="+15%" />
          <StatsCard title="AI Response Rate" value="95%" change="+12%" />
          <StatsCard title="Human Handoffs" value="24" change="-8%" />
          <StatsCard title="Total Customers" value="573" change="+30" />
        </section>

        {/* Chart + Messenger */}
        <section className="grid gap-6 text-black lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ConversationChart />
          </div>

          <MessengerCard />
        </section>

        {/* Bottom Section */}
        <section className="grid gap-6 text-black lg:grid-cols-2">
          <RecentConversation />
          <TopFaq />
        </section>
      </div>
    </main>
  );
}