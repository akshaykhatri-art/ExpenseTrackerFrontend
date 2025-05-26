import { useState } from "react";

export default function PredictedExpenses({ data }) {
  const [visibleCount, setVisibleCount] = useState(3);

  if (!data || !Array.isArray(data)) {
    return <p>No expense data available.</p>;
  }

  const getInitials = (first, last) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="mb-12 px-4 sm:px-0">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        📈 Statistic 3: Predicted Next Month’s Expenditure
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleData.map((item, index) => {
          const fullName = `${item.FirstName} ${item.LastName}`;
          const initials = getInitials(item.FirstName, item.LastName);
          const predicted = parseFloat(
            item.PredictedNextMonthExpense
          ).toLocaleString();

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl border border-gray-100 p-5 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg">
                  {initials}
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {fullName}
                  </h4>
                </div>
              </div>

              {/* Predicted Value */}
              <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md text-center font-medium text-lg shadow-sm">
                ₹{predicted}
                <div className="text-xs text-yellow-700 font-normal mt-1">
                  Predicted expense next month
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleCount < data.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
