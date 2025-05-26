import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { getFilteredExpenses, deleteExpense } from "../services/expense";
import { getDropdownData } from "../services/master";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";

export default function ExpenseList() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [dateTypeOptions, setDateTypeOptions] = useState([
    { label: "All", value: "All" },
    { label: "Custom", value: "Custom" },
  ]);
  const [selectedUser, setSelectedUser] = useState({
    label: "All",
    value: "All",
  });
  const [selectedCategory, setSelectedCategory] = useState({
    label: "All",
    value: "All",
  });
  const [dateType, setDateType] = useState({
    label: "All",
    value: "All",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [myExpenseOnly, setMyExpenseOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: dropdownData = [], isLoading: dropdownLoading } = useQuery({
    queryKey: ["dropdownData"],
    queryFn: getDropdownData,
    staleTime: Infinity,
  });

  const userOptions = dropdownData
    .filter((item) => item.DropdownType === "Users")
    .map((item) => ({ label: item.Label, value: item.Value }));

  const categoryOptions = dropdownData
    .filter((item) => item.DropdownType === "Categories")
    .map((item) => ({ label: item.Label, value: item.Value }));

  const finalUserOptions = [{ label: "All", value: "All" }, ...userOptions];
  const finalCategoryOptions = [
    { label: "All", value: "All" },
    ...categoryOptions,
  ];

  const filters = {
    userId: selectedUser?.value || null,
    categoryId: selectedCategory?.value || null,
    startDate: dateType?.value === "Custom" ? startDate : null,
    endDate: dateType?.value === "Custom" ? endDate : null,
  };

  const { data: expenseData = [], isLoading: expenseLoading } = useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => getFilteredExpenses(filters),
    enabled: !dropdownLoading,
    keepPreviousData: true,
  });

  const { mutate: deleteExp } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: (data) => {
      toast.success(data?.message || "Expense deleted!");
      queryClient.invalidateQueries(["expenses"]);
    },
    onError: (error) => {
      console.error("Delete expense error:", error);
      const response = error?.response?.data;

      if (Array.isArray(response?.errors)) {
        response.errors.forEach((err) => toast.error(err));
      } else if (typeof response?.error === "string") {
        toast.error(response.error);
      } else {
        toast.error("Problem in deleting expense");
      }
    },
  });

  const totalItems = expenseData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visibleData = expenseData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleMyExpenseToggle = () => {
    const newValue = !myExpenseOnly;
    setMyExpenseOnly(newValue);

    if (newValue) {
      const userId = localStorage.getItem("userId");
      const matchingUser = finalUserOptions.find(
        (user) => user.value === userId
      );
      if (matchingUser) {
        setSelectedUser(matchingUser);
      }
    } else {
      setSelectedUser({ label: "All", value: "All" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-700">Expenses</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-sm text-gray-700">My Expense</span>
              <button
                onClick={handleMyExpenseToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  myExpenseOnly ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    myExpenseOnly ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
          <Link
            to="/expense/add"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            + Add Expense
          </Link>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <Select
              options={finalUserOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Select User"
              isSearchable
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              options={finalCategoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select Category"
              isSearchable
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Type
            </label>
            <Select
              options={dateTypeOptions}
              value={dateType}
              onChange={setDateType}
              placeholder="Select Date Type"
            />
          </div>
          {dateType?.value === "Custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>
            </>
          )}
        </div>

        {/* Expense Table */}
        <p className="text-sm text-gray-500 italic mb-3">
          * Only expenses created by you can be edited or deleted.
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 w-[15%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Category Name
                    </th>
                    <th className="px-6 py-3 w-[10%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Amount
                    </th>
                    <th className="px-6 py-3 w-[15%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Date
                    </th>
                    <th className="px-6 py-3 w-[25%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Description
                    </th>
                    <th className="px-6 py-3 w-[15%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Person Name
                    </th>
                    <th className="px-6 py-3 w-[20%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleData?.map((expense) => (
                    <tr key={expense.ExpenseId}>
                      <td className="px-6 py-4 w-[15%] h-[57px] whitespace-nowrap text-sm align-top text-gray-800">
                        {expense.CategoryName}
                      </td>
                      <td className="px-6 py-4 w-[10%] h-[57px] whitespace-nowrap text-sm align-top text-gray-800">
                        {expense.Amount}
                      </td>
                      <td className="px-6 py-4 w-[15%] h-[57px] whitespace-nowrap text-sm align-top text-gray-800">
                        {dayjs(expense.Date).format("DD MMM YYYY")}
                      </td>
                      <td className="px-6 py-4 w-[25%] h-[57px] text-sm align-top text-gray-800">
                        {expense.Description.length > 60
                          ? `${expense.Description.slice(0, 60)}...`
                          : expense.Description}
                      </td>
                      <td className="px-6 py-4 w-[15%] h-[57px] whitespace-nowrap text-sm align-top text-gray-800">
                        {expense.PersonName}
                      </td>
                      <td className="px-6 py-4 w-[20%] h-[57px] whitespace-nowrap text-sm">
                        {expense.IsOwnExpense === 1 && (
                          <div className="flex gap-2">
                            <Link
                              to={`/expense/edit/${expense.ExpenseId}`}
                              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-xs"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => {
                                setExpenseToDelete(expense);
                                setShowModal(true);
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="my-5 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          deleteExp(expenseToDelete.ExpenseId);
          setShowModal(false);
        }}
        title="Delete Category"
        message={`Are you sure you want to delete the expense of amount "${expenseToDelete?.Amount}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </>
  );
}
