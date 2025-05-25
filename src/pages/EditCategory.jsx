import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById, updateCategory } from "../services/category";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

export default function EditCategory() {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });

  useEffect(() => {
    if (data) setCategoryName(data.CategoryName);
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ categoryId, categoryName }) =>
      updateCategory({ categoryId, categoryName }),
    onSuccess: (data) => {
      toast.success(data?.message || "Category update successfully!");
      queryClient.cancelQueries(["category", id]);
      queryClient.removeQueries(["category", id]);
      queryClient.invalidateQueries(["categories"]);
      navigate("/category");
    },
    onError: (error) => {
      console.error("Update category error:", error);
      const response = error?.response?.data;

      if (Array.isArray(response?.errors)) {
        response.errors.forEach((err) => toast.error(err));
      } else if (typeof response?.error === "string") {
        toast.error(response.error);
      } else {
        toast.error("Problem is updating category");
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    mutate({ categoryId: id, categoryName });
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 pb-2">
          Edit Category
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
            disabled={isPending}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Category"}
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
