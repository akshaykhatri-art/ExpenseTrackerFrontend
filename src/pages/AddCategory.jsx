import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "../services/category";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

export default function AddCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [categoryName, setCategoryName] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) => addCategory({ categoryName: data }),
    onSuccess: (data) => {
      toast.success(data?.message || "Category added successfully!");
      queryClient.invalidateQueries(["categories"]);
      navigate("/category");
    },
    onError: (error) => {
      console.error("Add category error:", error);
      const response = error?.response?.data;

      if (Array.isArray(response?.errors)) {
        response.errors.forEach((err) => toast.error(err));
      } else if (typeof response?.error === "string") {
        toast.error(response.error);
      } else {
        toast.error("Problem is adding category");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    mutate(categoryName);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 pb-2">
          Add Category
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter category name"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Category"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/category"
            className="inline-block text-blue-600 hover:underline text-sm"
          >
            ← Back to Listing
          </Link>
        </div>
      </div>
    </>
  );
}
