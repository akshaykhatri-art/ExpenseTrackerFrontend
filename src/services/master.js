import api from "./api";

export const getDropdownData = () =>
  api.get("/master/dropdown").then((res) => res.data);
