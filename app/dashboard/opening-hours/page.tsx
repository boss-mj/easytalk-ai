"use client";

import { Clock, Plus } from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function OpeningHoursCard() {
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour % 12 || 12;
      const ampm = hour < 12 ? "AM" : "PM";

      timeOptions.push(
        `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`,
      );
    }
  }

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Opening Hours Management
      </h2>

      <div className="space-y-4">
        {days.map((day) => (
          <div
            key={day}
            className="grid grid-cols-5 items-center gap-4 text-gray-700"
          >
            {/* Day */}
            <span className="font-medium text-gray-700 text-gray-700">
              {day}
            </span>

            {/* Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>

            {/* Start Time */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Clock size={16} className="text-gray-400" />
              <select className="outline-none bg-transparent w-full">
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Clock size={16} className="text-gray-400" />
              <select className="outline-none bg-transparent w-full">
                {timeOptions.map((time) => (
                  <option key={`end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Add */}
            <button className="flex justify-center items-center w-10 h-10 border rounded-lg hover:bg-gray-50">
              <Plus size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-10">
        <button className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700">
          <Plus size={18} />
          Add Special Hours
        </button>

        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}
