import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://coursecraft-1-938d.onrender.com/api",
});

API.interceptors.request.use((req) => {
  let token = localStorage.getItem("token");

  if (token) {
    token = token.trim().replace(/^["']|["']$/g, '');
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;   // ✅ IMPORTANT