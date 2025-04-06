import axios from "axios";
import { toast } from "react-toastify";
import getEnvConfig from "../config/env";

const { apiUrl } = getEnvConfig();

console.log('API URL configured:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 15000,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details
    console.log('Making request to:', config.url);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    console.log('Request data:', config.data);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    toast.error("Request failed to send");
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    const { response } = error;
    
    if (!response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Log error details
    console.error('Error status:', response.status);
    console.error('Error data:', response.data);
    console.error('Error headers:', response.headers);

    switch (response.status) {
      case 401:
        toast.error("Invalid email or password");
        localStorage.removeItem("token");
        window.location.href = "/login";
        break;
      case 403:
        toast.error("Access denied. Only admin can perform this action");
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

export default api;
