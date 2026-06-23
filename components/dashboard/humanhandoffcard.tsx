"use client";

import { useState } from "react";

export default function HumanHandOffCard() {
  const [activeTab, setActiveTab] = useState("Pending");

  const handoffs = [
    {
      id: 1,
      customer: "Juan Dela Cruz",
      issue: "Complaint",
      assignedTo: "Janine",
      time: "2m ago",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Maria Santos",
      issue: "Refund Request",
      assignedTo: "Mark",
      time: "15m ago",
      status: "In Progress",
    },
    {
      id: 3,
      customer: "Pedro Reyes",
      issue: "Order Problem",
      assignedTo: "Janine",
      time: "35m ago",
      status: "Pending",
    },
    {
      id: 4,
      customer: "Ana Cruz",
      issue: "Account Concern",
      assignedTo: "Mark",
      time: "1h ago",
      status: "Resolved",
    },
  ];

  const filtered = handoffs.filter(
    (item) => item.status === activeTab
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6 text-black">
        Human Handoff
      </h2>

      {/* Tabs */}
      <div className="flex gap-8 border-b mb-5">
        {["Pending", "In Progress", "Resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-500"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 py-3 text-sm font-medium text-black border-b">
        <span>Customer</span>
        <span>Issue</span>
        <span>Assigned To</span>
        <span>Time</span>
        <span>Status</span>
      </div>

      {/* Rows */}
      {filtered.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-5 py-4 items-center border-b text-sm text-gray-700"
        >
          <span>{item.customer}</span>
          <span>{item.issue}</span>
          <span>{item.assignedTo}</span>
          <span>{item.time}</span>

          <span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === "Pending"
                  ? "bg-orange-100 text-orange-600"
                  : item.status === "In Progress"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {item.status}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}