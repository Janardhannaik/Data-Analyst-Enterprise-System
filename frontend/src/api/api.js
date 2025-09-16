import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // JWT/auth
});

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error logging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API call error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;
