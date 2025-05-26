import { useQuery } from "@tanstack/react-query";
import { getStatisticData } from "../services/master";
import Navbar from "../components/Navbar";
import TopExpenseDays from "../components/TopExpenseDays";
import MonthlyChange from "../components/MonthlyChange";
import PredictedExpenses from "../components/PredictedExpenses";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Loader from "../components/Loader";

const tabs = [
  { id: 1, label: "Top 3 Days", component: TopExpenseDays },
  { id: 2, label: "Monthly Change", component: MonthlyChange },
  { id: 3, label: "Predicted Expenses", component: PredictedExpenses },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatisticData,
  });

  if (isError) {
    toast.error("Failed to fetch statistics");
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10 text-lg text-red-500">
          Something went wrong
        </p>
      </div>
    );
  }

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component;
  const activeData = data
    ? activeTab === 1
      ? data.Statistic1
      : activeTab === 2
      ? data.Statistic2
      : data.Statistic3
    : null;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-6 px-4">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Animated Component Switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ActiveComponent data={activeData} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* loading component */}
      {isLoading && <Loader />}
    </div>
  );
}
