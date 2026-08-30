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

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("portfolio_admin_token");
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
