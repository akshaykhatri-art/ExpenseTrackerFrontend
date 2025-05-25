import api from "./api";

export const getAllCategories = () =>
  api.get("/category").then((res) => res.data);
export const getCategoryById = (id) =>
  api.get(`/category/${id}`).then((res) => res.data);
export const addCategory = (data) =>
  api.post("/category", data).then((res) => res.data);
export const updateCategory = (data) =>
  api.put("/category", data).then((res) => res.data);
export const deleteCategory = (id) =>
  api.delete(`/category/${id}`).then((res) => res.data);
