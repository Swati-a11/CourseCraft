import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://coursecraft-lgaf.onrender.com/api",
});

API.interceptors.request.use((req) => {
  if (req.method?.toLowerCase() === 'get') req.timeout = 15000;
  const token = localStorage.getItem('token')?.replace(/^["']|["']$/g, '').trim();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && error.config?.headers?.Authorization) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;   // IMPORTANT
