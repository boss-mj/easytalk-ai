export default function BusinessProfileCard() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Business Profile
      </h2>

      <div className="border rounded-xl p-6">
        <h3 className="font-semibold mb-5 text-gray-700">
          Business Information
        </h3>

        <div className="space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              defaultValue="EasyTalk AI Solutions"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description
            </label>
            <textarea
              rows={4}
              defaultValue="We provide AI chatbot automation to help businesses connect with their customers 24/7."
              className="w-full border rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              defaultValue="0912 345 6789"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="info@easytalk.ai"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address
            </label>
            <input
              type="text"
              defaultValue="123 AI Street, Tech City, Philippines"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            />
          </div>

          {/* Save Button */}
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}