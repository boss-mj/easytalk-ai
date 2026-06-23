"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "May 20", value: 220 },
  { day: "May 24", value: 450 },
  { day: "May 27", value: 350 },
  { day: "Jun 1", value: 600 },
  { day: "Jun 5", value: 480 },
  { day: "Jun 10", value: 620 },
  { day: "Jun 15", value: 450 },
  { day: "Jun 20", value: 730 },
];

export default function ConversationChart() {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">
          Conversations Over Time
        </h2>

        <select className="border rounded px-3 py-1 text-sm">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}