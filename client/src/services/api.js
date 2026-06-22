import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://coursecraft-lgaf.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')?.replace(/^["']|["']$/g, '').trim();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;   // ✅ IMPORTANT