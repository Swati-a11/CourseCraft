import api from './api';

export const generateStudyPlan = async (formData) => {
  const { data } = await api.post('/api/study-plan/generate', formData);
  return data;
};