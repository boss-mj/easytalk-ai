"use client";

import { useState } from "react";

export default function MessengerCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
        <h2 className="font-semibold text-lg mb-4">
          Messenger Connection
        </h2>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>

          <span className="text-green-600 font-medium">
            Connected
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-gray-400 text-sm">
              Page Name
            </p>

            <p className="font-medium">
              EasyTalk AI Official
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Connected Since
            </p>

            <p className="font-medium">
              May 15, 2026 10:30 AM
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="w-full mt-8 border rounded-lg py-2 hover:bg-gray-50"
        >
          View Details
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[850px] max-w-[95vw] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                Messenger Connection
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-4xl font-bold">
                    f
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Facebook Page
                    </p>

                    <h3 className="text-xl font-bold text-black">
                      EasyTalk AI Official
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Connected
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-gray-500">
                      Connected Since
                    </p>

                    <p className="font-semibold">
                      May 15, 2026 10:30 AM
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Page ID
                    </p>

                    <p className="font-semibold">
                      123456789012345
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button className="flex-1 border border-blue-500 text-blue-500 rounded-lg py-2 hover:bg-blue-50">
                    View in Facebook
                  </button>

                  <button className="flex-1 bg-red-100 text-red-500 rounded-lg py-2 hover:bg-red-200">
                    Disconnect
                  </button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="border rounded-xl p-6">
                <h3 className="text-xl font-bold text-black mb-6">
                  Connection Insights
                </h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-500">
                      Last Sync
                    </p>

                    <p className="font-semibold">
                      June 20, 2026 10:00 AM
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Subscribed Users
                    </p>

                    <p className="font-semibold">
                      2,340
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Messages Synced
                    </p>

                    <p className="font-semibold">
                      15,678
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      Connection Quality
                    </p>

                    <p className="font-semibold text-green-600">
                      Excellent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}