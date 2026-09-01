import axios from "axios";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

// In development Vite proxies /api and /uploads to the local API.
// In production VITE_API_URL should be the full Render API URL, including /api.
export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL || "/api");
export const UPLOADS_BASE_URL = trimTrailingSlash(import.meta.env.VITE_UPLOADS_URL || "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let the browser/Axios set the multipart boundary automatically.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export const getErrorMessage = (error: unknown, fallback = "An unexpected error occurred."): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return String(error.response.data.message);
    }
    if (error.response?.status === 400) {
      return "Invalid request. Please check your input.";
    }
    if (error.response?.status === 401) {
      return "Session expired or unauthorized. Please sign in again.";
    }
    if (error.response?.status === 403) {
      return "You do not have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The requested resource was not found.";
    }
    if (error.response?.status === 429) {
      return "Too many requests. Please slow down and try again later.";
    }
    if (error.response?.status && error.response.status >= 500) {
      return "The server encountered an error. Please try again later.";
    }
    if (error.code === "ECONNABORTED" || error.message.toLowerCase().includes("timeout")) {
      return "The request timed out. Please verify your connection.";
    }
    if (error.code === "ERR_NETWORK" || !error.response) {
      return "Network connection issue. Please check your internet connection.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("portfolio_admin_token");
    }

    // Attach standardized user message to error object for easy consumption
    if (error && typeof error === "object") {
      error.userFriendlyMessage = getErrorMessage(error);
    }

    return Promise.reject(error);
  },
);

export const resolveAssetUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const base = UPLOADS_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
