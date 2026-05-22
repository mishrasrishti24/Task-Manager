import axios from "axios";

// Build the base URL from environment variable.
// VITE_API_URL must include the /api path suffix, e.g.:
//   https://your-backend.up.railway.app/api
//
// In development, this comes from client/.env
// In production (Railway/Vercel/Netlify), set VITE_API_URL as a build-time env var.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Log the resolved API base URL in development for easier debugging
if (import.meta.env.DEV) {
    console.log("[api.js] Using API baseURL:", baseURL);
}

const api = axios.create({
    baseURL,
    timeout: 15000, // 15s timeout prevents hanging requests in production
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log connection errors in development
        if (import.meta.env.DEV) {
            if (error.code === "ERR_NETWORK") {
                console.error("[api.js] Network error — is the backend running?");
            }
            console.error("[api.js] Request failed:", error.config?.url, error.message);
        }

        // Auto-logout on 401 (expired/invalid token)
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Only redirect if not already on login/register
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;