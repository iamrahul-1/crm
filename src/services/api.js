import axios from "axios";
import { toast } from "sonner";
import getEnvConfig from "../config/env";

const { apiUrl } = getEnvConfig();

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// Request Interceptor
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (!response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Don't show session expired for login endpoint
    const isLoginRequest = response.config.url.includes("/auth/login");

    switch (response.status) {
      case 401:
        if (!isLoginRequest) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          // Add delay before redirect
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
          window.location.href = "/login";
        }
        break;
      case 403:
        toast.error("You don't have permission to perform this action");
        break;
      case 404:
        toast.error("Resource not found");
        break;
      case 500:
        toast.error("Server error. Please try again later");
        break;
      default:
        toast.error(response.data?.message || "Something went wrong");
    }

    return Promise.reject(error);
  }
);

// Retry failed requests configuration
api.defaults.raxConfig = {
  retry: 3,
  retryDelay: 3000,
  statusCodesToRetry: [[408, 429, 500, 502, 503, 504]],
};

export default api;
