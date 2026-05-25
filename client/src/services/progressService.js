import api from './api';

// SAVE progress
export const saveTopicProgress = (data) => {
  return api.post('/api/progress', data);
};

// GET progress
export const getTopicProgress = () => {
  return api.get('/api/progress');
};