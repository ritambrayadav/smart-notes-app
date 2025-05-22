import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "@/utils/logout";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    toast.error(message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
