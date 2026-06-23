type StatsCardProps = {
  title: string;
  value: string;
  change?: string;
};

export default function StatsCard({
  title,
  value,
  change,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <p className="text-sm text-black   font-medium">
        {title}
      </p>

      <h2 className="text-4xl font-bold zext-black mt-2">
        {value}
      </h2>

      {change && (
        <p className="text-sm text-green-500 mt-2">
          {change}
        </p>
      )}
    </div>
  );
}