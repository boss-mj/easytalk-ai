import statscard from "@/components/dashboard/statscard";
import messengercard from "@/components/dashboard/messengercard";
import conversationchart from "@/components/dashboard/conversationchart";
import recentconversation from "@/components/dashboard/recentconversation";
import topfaq from "@/components/dashboard/topfaq";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Dashboard Content */}
      <div className="relative z-10 p-6">
        <h1 className="text-3xl font-bold text-white">
          Dashboard Overview
        </h1>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-black">
          <statscard title="Total Conversations" value="1,248" change="+15%" />

          <statscard title="AI Response Rate" value="95%" change="+12%" />

          <statscard title="Human Handoffs" value="24" change="-8%" />

          <statscard title="Total Customers" value="573" change="+30" />
        </div>

        {/* Chart + Messenger */}
        <div className="grid grid-cols-3 gap-6 mb-6 text-black">
          <div className="col-span-2">
            <conversationchart />
          </div>

          <messengercard />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6 text-black">
          <recentconversation />
          <topfaq />
        </div>
      </div>
    </div>
  );
}