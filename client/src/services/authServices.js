import api from './api';

export const loginUser = async (data) => {
  const response = await api.post('/api/auths/login', data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post('/api/auths/register', data);
  return response.data;
};