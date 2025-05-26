import { useState } from "react";
import { format } from "date-fns";

export default function TopExpenseDays({ data }) {
  const [visibleUsers, setVisibleUsers] = useState(3);

  if (!data || !Array.isArray(data)) {
    return <p>No expense data available.</p>;
  }

  const groupedByUser = data.reduce((acc, curr) => {
    const { PersonId } = curr;
    if (!acc[PersonId]) acc[PersonId] = [];
    acc[PersonId].push(curr);
    return acc;
  }, {});

  const userEntries = Object.entries(groupedByUser);

  const getInitials = (first, last) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

  const getColorClasses = (amount) => {
    const value = parseFloat(amount);
    if (value > 50000) return "bg-red-100 text-red-800";
    if (value > 25000) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="mb-10 px-4 sm:px-0">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        🗓️ Statistic 1: Top 3 Expense Days (Per User)
      </h3>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-100 border border-red-400" />
          <span className="text-gray-600">High (&gt; ₹50,000)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-100 border border-yellow-400" />
          <span className="text-gray-600">Medium (&gt; ₹25,000)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-100 border border-green-400" />
          <span className="text-gray-600">Low (≤ ₹25,000)</span>
        </div>
      </div>

      <div className="space-y-6">
        {userEntries.slice(0, visibleUsers).map(([personId, records]) => {
          const sorted = records
            .sort((a, b) => parseFloat(b.TotalSpent) - parseFloat(a.TotalSpent))
            .slice(0, 3);

          const { FirstName: firstName, LastName: lastName } = records[0];
          const fullName = `${firstName} ${lastName}`;
          const initials = getInitials(firstName, lastName);

          return (
            <div
              key={personId}
              className="bg-white border border-gray-200 shadow-md rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-0 flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {initials}
                </div>
                <h4 className="text-lg font-semibold text-gray-700 whitespace-nowrap">
                  {fullName}
                </h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-start sm:justify-end flex-grow">
                {sorted.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-full sm:w-48 text-center px-3 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm ${getColorClasses(
                      item.TotalSpent
                    )}`}
                  >
                    {format(new Date(item.Date), "dd MMM yyyy")} — ₹
                    {parseFloat(item.TotalSpent).toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleUsers < userEntries.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleUsers((prev) => prev + 3)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
