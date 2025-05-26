import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, deleteCategory } from "../services/category";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import ConfirmModal from "../components/ConfirmModal";

export default function CategoryList() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  useEffect(() => {
    if (isError && error?.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (isError) {
      toast.error("Failed to fetch categories");
    }
  }, [isError, error]);

  const { mutate: deleteCat } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      toast.success(data?.message || "Category deleted!");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Delete category error:", error);
      const response = error?.response?.data;

      if (Array.isArray(response?.errors)) {
        response.errors.forEach((err) => toast.error(err));
      } else if (typeof response?.error === "string") {
        toast.error(response.error);
      } else {
        toast.error("Problem is deleting category");
      }
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  // Pagination logic
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-700">Categories</h2>
          <Link
            to="/category/add"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            + Add Category
          </Link>
        </div>

        {/* Category Table */}
        <p className="text-sm text-gray-500 italic mb-3">
          * Only categories created by you can be edited or deleted.
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 w-[25%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Name
                    </th>
                    <th className="px-6 py-3 w-[25%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Created By
                    </th>
                    <th className="px-6 py-3 w-[25%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Last Updated On
                    </th>
                    <th className="px-6 py-3 w-[25%] text-left text-xs font-medium text-gray-700 uppercase border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleData?.map((category) => (
                    <tr key={category.CategoryId}>
                      <td className="px-6 py-4 w-[25%] h-[60px] whitespace-nowrap text-sm text-gray-800">
                        {category.CategoryName}
                      </td>
                      <td className="px-6 py-4 w-[25%] h-[60px] whitespace-nowrap text-sm text-gray-800">
                        {category.CreatedByName}
                      </td>
                      <td className="px-6 py-4 w-[25%] h-[60px] whitespace-nowrap text-sm text-gray-800">
                        {dayjs(category.LastUpdatedOn).format(
                          "DD MMM YYYY, hh:mm A"
                        )}
                      </td>
                      <td className="px-6 py-4 w-[25%] h-[60px] whitespace-nowrap text-sm">
                        {category.IsOwnCategory === 1 && (
                          <div className="flex gap-2">
                            <Link
                              to={`/category/edit/${category.CategoryId}`}
                              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-xs"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => {
                                setCategoryToDelete(category);
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
          deleteCat(categoryToDelete.CategoryId);
          setShowModal(false);
        }}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.CategoryName}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </>
  );
}
