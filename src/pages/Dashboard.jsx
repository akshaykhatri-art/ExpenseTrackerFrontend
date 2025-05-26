import { useQuery } from "@tanstack/react-query";
import { getStatisticData } from "../services/master";
import Navbar from "../components/Navbar";
import TopExpenseDays from "../components/TopExpenseDays";
import MonthlyChange from "../components/MonthlyChange";
import PredictedExpenses from "../components/PredictedExpenses";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatisticData,
  });

  console.log("dashboard data", data);

  // const { Statistic1, Statistic2, Statistic3 } = data;

  console.log("dashboard Statistic1", data?.Statistic1);
  console.log("dashboard Statistic2", data?.Statistic2);
  console.log("dashboard Statistic3", data?.Statistic3);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-10 text-lg">Loading statistics...</p>
      </div>
    );
  }

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

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <TopExpenseDays data={data?.Statistic1} />
        <MonthlyChange data={data?.Statistic2} />
        <PredictedExpenses data={data?.Statistic3} />
      </div>
    </div>
  );
}
