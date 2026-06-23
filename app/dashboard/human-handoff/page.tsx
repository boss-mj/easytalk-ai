import HumanHandOffCard from "@/app/components/dashboard/humanhandoffcard";
export default function HumanHandOffPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Human Handoff
        </h1>

        <p className="text-gray-500 mt-2">
          Manage conversations that require a human agent.
        </p>
      </div>

      <HumanHandOffCard />
    </div>
  );
}