import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL;
const baseURL = rawBaseUrl
  ? `${rawBaseUrl.replace(/\/+$/, '')}/`
  : '/api/';

// Create Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (typeof parsed === 'string') {
          token = parsed;
        } else if (parsed?.token) {
          token = parsed.token;
        }
      } catch {
        // Token is already plain text.
      }

      const sanitizedToken = String(token).replace(/^"|"$/g, '').trim();
      if (sanitizedToken) {
        config.headers.Authorization = `Bearer ${sanitizedToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;