export default function MessengerDetailsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Messenger Connection Details
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-500">Page Name</p>
            <p className="font-semibold">
              EasyTalk AI Official
            </p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="text-green-600 font-semibold">
              Connected
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Connected Since
            </p>
            <p>May 15, 2026 10:30 AM</p>
          </div>

          <div>
            <p className="text-gray-500">
              Facebook Page ID
            </p>
            <p>123456789</p>
          </div>

          <div>
            <p className="text-gray-500">
              Messages Handled
            </p>
            <p>1,248</p>
          </div>
        </div>
      </div>
    </div>
  );
}