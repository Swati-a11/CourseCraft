import api from './api';

export const generateStudyPlan = async (formData) => {
  const { data } = await api.post('/study-plan/generate', formData);
  return data;
};