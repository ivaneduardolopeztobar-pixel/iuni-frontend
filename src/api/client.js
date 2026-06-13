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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicRoutes = ["/auth/login", "/auth/register", "/reset/"];
      const isPublic = publicRoutes.some(r => error.config?.url?.includes(r));
      if (!isPublic) {
        localStorage.clear();
        // Usar location solo si no estamos ya en login
        if (!window.location.pathname.includes("/login")) {
          window.location.replace("/login");
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
