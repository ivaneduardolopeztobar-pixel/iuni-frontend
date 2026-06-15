import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL + "/api"
    : "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicRoutes = ["/auth/login", "/auth/register", "/reset/", "/auth/verify"];
      const isPublic = publicRoutes.some(r => error.config?.url?.includes(r));
      if (!isPublic && !isRedirecting) {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/" && currentPath !== "/register") {
          isRedirecting = true;
          localStorage.clear();
          setTimeout(() => {
            isRedirecting = false;
            window.location.href = "/login";
          }, 100);
        }
      }
    }
    if (!error.response) {
      error.message = "Sin conexion al servidor. Verifica tu internet.";
    }
    return Promise.reject(error);
  }
);

export default api;
