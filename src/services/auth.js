import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const loginUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data;
};
