import axios from "axios";
import { toast } from "react-toastify";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
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
