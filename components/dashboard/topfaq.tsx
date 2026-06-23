const faq = [
  {
    question: "What are your business hours?",
    count: 128,
  },
  {
    question: "Do you offer delivery?",
    count: 96,
  },
  {
    question: "How can I pay?",
    count: 74,
  },
  {
    question: "What is your return policy?",
    count: 45,
  },
];

export default function TopFAQ() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <h2 className="font-semibold text-lg mb-4">
        Top FAQ Questions
      </h2>

      <div className="space-y-4">
        {faq.map((item, index) => (
          <div
            key={index}
            className="flex justify-between"
          >
            <span>{item.question}</span>

            <span className="font-semibold text-gray-500">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}