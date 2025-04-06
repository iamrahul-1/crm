import axios from "axios";
import { toast } from "react-toastify";

// Configure axios defaults
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "https://brookstone-backend.vercel.app/api";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true;

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request failed to send");
    return Promise.reject(error);
  }
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      toast.error("Network error. Please check your connection.");
    } else if (response.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    } else if (response.status === 403) {
      toast.error("Access denied. Please contact support.");
    } else {
      toast.error(
        response.data?.message || "An error occurred. Please try again."
      );
    }
    return Promise.reject(error);
  }
);

export default axios;
