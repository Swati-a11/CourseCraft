// src/services/dashboardService.js

import axios from 'axios';

// Create axios instance pointing to backend server
const API = axios.create({
  baseURL: 'http://localhost:5000/api/dashboard',
});

// Attach token from localStorage before every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// Fetch dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await API.get('/stats');
    return response.data;
  } catch (error) {
    console.error(
      'Dashboard API Error:',
      error.response?.data || error.message
    );
    throw error;
  }
};