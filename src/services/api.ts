import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Direct URL to your backend
  // or use environment variable
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Request:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Error:", error);
    return Promise.reject(error);
  }
);

export default api;
