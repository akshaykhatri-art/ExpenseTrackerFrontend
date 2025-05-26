import api from "./api";

export const getAllExpenses = () => api.get("/expense").then((res) => res.data);
export const getFilteredExpenses = (filters) =>
  api.get("/expense/filter", { params: filters }).then((res) => res.data);
export const getExpenseById = (id) =>
  api.get(`/expense/${id}`).then((res) => res.data);
export const addExpense = (data) =>
  api.post("/expense", data).then((res) => res.data);
export const updateExpense = (data) =>
  api.put("/expense", data).then((res) => res.data);
export const deleteExpense = (id) =>
  api.delete(`/expense/${id}`).then((res) => res.data);
