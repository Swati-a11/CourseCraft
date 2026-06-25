import api from './api';

export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

export const subscribeNotifications = async (email) => {
  const { data } = await api.post('/notifications/subscribe', { email });
  return data;
};

