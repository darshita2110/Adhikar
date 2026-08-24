import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15_000,
});

// ---------------------------------------------------------------------------
// Request interceptor — attach auth token when available
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adhikar_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Will be handled by auth store in a later step
      localStorage.removeItem("adhikar_token");
    }
    return Promise.reject(error);
  }
);

export default api;
