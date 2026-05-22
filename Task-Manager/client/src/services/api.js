import axios from "axios";

const api = axios.create({
    // Hardcode your production API path directly as the fallback
    baseURL: import.meta.env.VITE_API_URL || "https://task-manager-production-a581.up.railway.app/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;