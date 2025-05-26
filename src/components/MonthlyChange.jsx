import { useState } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

export default function MonthlyChange({ data }) {
  const [visibleCount, setVisibleCount] = useState(3);

  const getChangeColor = (percent) => {
    const value = parseFloat(percent);
    if (value > 0) return "text-green-600 bg-green-50";
    if (value < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-100";
  };

  const getArrowIcon = (percent) => {
    const value = parseFloat(percent);
    if (value > 0)
      return <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />;
    if (value < 0)
      return <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />;
    return <MinusIcon className="h-5 w-5 text-gray-500" />;
  };

  const getInitials = (first, last) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="mb-12 px-4 sm:px-0">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        📊 Statistic 2: Monthly Expenditure Change
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleData.map((item, index) => {
          const fullName = `${item.FirstName} ${item.LastName}`;
          const initials = getInitials(item.FirstName, item.LastName);
          const changeColor = getChangeColor(item.PercentageChange);
          const icon = getArrowIcon(item.PercentageChange);

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl border border-gray-100 p-5 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {initials}
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {fullName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    User ID: {item.PersonId.slice(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Previous Month:</span>
                  <span className="font-medium text-gray-800">
                    ₹{parseFloat(item.PreviousMonthTotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Month:</span>
                  <span className="font-medium text-gray-800">
                    ₹{parseFloat(item.CurrentMonthTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Percentage Change */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-md ${changeColor}`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {icon}
                  {item.PercentageChange > 0 ? "+" : ""}
                  {item.PercentageChange}%
                </div>
                <span className="text-xs font-medium text-gray-500">
                  from last month
                </span>
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
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
