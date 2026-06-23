type StatsCardProps = {
  title: string;
  value: string;
  change?: string;
};

export default function StatsCard({ title, value, change }: StatsCardProps) {
  const isNegative = change?.startsWith("-");

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>

      <h2 className="mt-2 text-4xl font-bold text-black">{value}</h2>

      {change && (
        <p
          className={`mt-2 text-sm font-medium ${
            isNegative ? "text-red-500" : "text-green-500"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}