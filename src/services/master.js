import api from "./api";

export const getDropdownData = () =>
  api.get("/master/dropdown").then((res) => res.data);
export const getStatisticData = () =>
  api.get("/master/statistics").then((res) => res.data);
