import api from './api';

// Attach token automatically (already handled in api.js if you added it there)
// Keeping it safe here too in case you didn’t
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// ===============================
// FETCH DASHBOARD STATS
// ===============================
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error(
      'Dashboard API Error:',
      error.response?.data || error.message
    );
    throw error;
  }
};