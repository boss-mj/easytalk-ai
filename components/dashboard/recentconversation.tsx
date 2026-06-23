const conversations = [
  {
    name: "Juan Dela Cruz",
    message: "Magkano po ang Vendo Water?",
    time: "2m ago",
  },
  {
    name: "Maria Santos",
    message: "Saan po kayo located?",
    time: "15m ago",
  },
  {
    name: "Pedro Reyes",
    message: "Pwede po ba delivery?",
    time: "35m ago",
  },
  {
    name: "Ana Cruz",
    message: "Salamat po!",
    time: "1h ago",
  },
];

export default function RecentConversation() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <h2 className="font-semibold text-lg mb-4">
        Recent Conversations
      </h2>

      <div className="space-y-4">
        {conversations.map((item, index) => (
          <div
            key={index}
            className="flex justify-between"
          >
            <div>
              <p className="font-medium">
                {item.name}
              </p>

              <p className="text-gray-500 text-sm">
                {item.message}
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}