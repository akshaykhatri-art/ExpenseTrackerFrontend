import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { addExpense } from "../services/expense";
import { getDropdownData } from "../services/master";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

export default function AddExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const { data: dropdownData = [], isLoading: dropdownLoading } = useQuery({
    queryKey: ["dropdownData"],
    queryFn: getDropdownData,
    staleTime: Infinity,
  });

  const categoryOptions = dropdownData
    .filter((item) => item.DropdownType === "Categories")
    .map((item) => ({ label: item.Label, value: item.Value }));

  const { mutate, isLoading } = useMutation({
    mutationFn: addExpense,
    onSuccess: (data) => {
      toast.success(data?.message || "Expense added successfully!");
      queryClient.invalidateQueries(["expenses"]);
      navigate("/expense");
    },
    onError: (error) => {
      const response = error?.response?.data;
      if (Array.isArray(response?.errors)) {
        response.errors.forEach((err) => toast.error(err));
      } else {
        toast.error(response?.error || "Failed to add expense");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryId || !date || !amount.trim() || !description) {
      toast.error("All fields are required");
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    mutate({
      categoryId: categoryId,
      date: date,
      amount: parseFloat(amount).toFixed(2),
      description: description,
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 pb-2">
          Add Expense
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find((opt) => opt.value === categoryId)}
              onChange={(selected) => setCategoryId(selected?.value)}
              placeholder="Select category"
              isDisabled={dropdownLoading}
              isSearchable
            />
          </div>

          {/* Date Picker */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter amount"
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Optional description"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Expense"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/expense"
            className="inline-block text-blue-600 hover:underline text-sm"
          >
            ← Back to Listing
          </Link>
        </div>
      </div>
    </>
  );
}
